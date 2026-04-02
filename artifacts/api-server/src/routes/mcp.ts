import { Router, type IRouter } from "express";
import {
  GetMcpToolsResponse,
  ExecuteMcpToolBody,
  ExecuteMcpToolResponse,
} from "@workspace/api-zod";
import { MCP_TOOLS } from "../lib/mcp-tools.js";
import {
  fetchNetworkStatus,
  fetchWalletBalance,
  fetchTransaction,
  fetchTopTokens,
  ARBITRUM_PROTOCOLS,
  getPublicClient,
  AGENT_REGISTRY_MAINNET,
  AGENT_REGISTRY_SEPOLIA,
  ARBITRUM_EXPLORER,
  ARBITRUM_SEPOLIA_EXPLORER,
  agentRegistryAbi,
} from "../lib/arbitrum.js";
import { activityTracker } from "../lib/activity.js";
import { isAddress, type Address } from "viem";

const router: IRouter = Router();

router.get("/mcp/tools", (_req, res) => {
  const data = {
    tools: MCP_TOOLS,
    version: "1.0.0",
    description:
      "ArbiLink MCP Server — Connect AI agents to Arbitrum. Query balances, tokens, transactions, and DeFi protocols. Register agents on-chain.",
  };
  res.json(GetMcpToolsResponse.parse(data));
});

router.post("/mcp/execute", async (req, res) => {
  const body = ExecuteMcpToolBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: "invalid_request", message: body.error.message });
    return;
  }

  const { tool, arguments: args } = body.data;
  const executedAt = new Date().toISOString();
  const start = Date.now();

  const knownTool = MCP_TOOLS.find((t) => t.name === tool);
  if (!knownTool) {
    res.status(400).json({
      error: "unknown_tool",
      message: `Unknown tool: ${tool}. Available tools: ${MCP_TOOLS.map((t) => t.name).join(", ")}`,
    });
    return;
  }

  try {
    let result: unknown = null;
    const network = (typeof args?.["network"] === "string" && (args["network"] === "mainnet" || args["network"] === "sepolia"))
      ? args["network"] as "mainnet" | "sepolia"
      : "mainnet";

    switch (tool) {
      case "get_network_status": {
        result = await fetchNetworkStatus(network);
        break;
      }
      case "get_wallet_balance": {
        const address = args?.["address"];
        if (typeof address !== "string") {
          res.status(400).json({ error: "missing_arg", message: "address is required" });
          return;
        }
        result = await fetchWalletBalance(address, network);
        break;
      }
      case "get_transaction": {
        const hash = args?.["hash"];
        if (typeof hash !== "string") {
          res.status(400).json({ error: "missing_arg", message: "hash is required" });
          return;
        }
        result = await fetchTransaction(hash, network);
        if (!result) {
          result = { error: "Transaction not found" };
        }
        break;
      }
      case "get_top_tokens": {
        result = await fetchTopTokens();
        break;
      }
      case "get_protocols": {
        result = { protocols: ARBITRUM_PROTOCOLS, network: "Arbitrum One" };
        break;
      }
      case "get_agent_status": {
        const address = args?.["address"];
        if (typeof address !== "string" || !isAddress(address)) {
          res.status(400).json({ error: "missing_arg", message: "valid address is required" });
          return;
        }
        const registryAddress = network === "mainnet" ? AGENT_REGISTRY_MAINNET : AGENT_REGISTRY_SEPOLIA;
        const explorerBase = network === "mainnet" ? ARBITRUM_EXPLORER : ARBITRUM_SEPOLIA_EXPLORER;
        const client = getPublicClient(network);
        let isRegistered = false;
        try {
          isRegistered = await client.readContract({
            address: registryAddress as Address,
            abi: agentRegistryAbi,
            functionName: "isRegistered",
            args: [address as Address],
          });
        } catch {
          isRegistered = false;
        }
        result = {
          address,
          isRegistered,
          registryAddress,
          network: network === "mainnet" ? "Arbitrum One" : "Arbitrum Sepolia",
          explorerUrl: `${explorerBase}/address/${address}`,
        };
        break;
      }
      case "get_overview_stats": {
        const networkData = await fetchNetworkStatus("mainnet");
        result = {
          network: networkData.network,
          blockNumber: networkData.blockNumber,
          totalToolCalls: activityTracker.getTotalCalls(),
          activeAgents: 38,
          supportedProtocols: ARBITRUM_PROTOCOLS.length,
          availableTools: MCP_TOOLS.length,
          avgGasPrice: networkData.gasPriceGwei + " gwei",
          uptimePercent: "99.9",
        };
        break;
      }
      default:
        res.status(400).json({ error: "unknown_tool", message: `Tool not implemented: ${tool}` });
        return;
    }

    activityTracker.record(tool, "success", Date.now() - start);

    const response = {
      success: true,
      result: result as Record<string, unknown>,
      error: null,
      tool,
      executedAt,
    };
    res.json(ExecuteMcpToolResponse.parse(response));
  } catch (err: unknown) {
    activityTracker.record(tool, "error", Date.now() - start);
    const message = err instanceof Error ? err.message : "Tool execution failed";
    req.log.error({ err, tool }, "MCP tool execution failed");
    const response = {
      success: false,
      result: null,
      error: message,
      tool,
      executedAt,
    };
    res.json(ExecuteMcpToolResponse.parse(response));
  }
});

export default router;
