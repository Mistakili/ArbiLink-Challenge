import { Router, type IRouter, type Request, type Response } from "express";
import { MCP_TOOLS } from "../lib/mcp-tools.js";
import {
  fetchNetworkStatus,
  fetchWalletBalance,
  fetchTransaction,
  fetchTopTokens,
  ARBITRUM_PROTOCOLS,
  getPublicClient,
  ARBITRUM_SEPOLIA_EXPLORER,
  agentRegistryAbi,
} from "../lib/arbitrum.js";
import { getDeployedRegistryAddress } from "../lib/registry-deploy.js";
import { activityTracker } from "../lib/activity.js";
import { isAddress, type Address } from "viem";

const router: IRouter = Router();

const SERVER_INFO = {
  name: "ArbiLink",
  version: "1.0.0",
};

const PROTOCOL_VERSION = "2024-11-05";

function jsonrpcSuccess(id: string | number | null, result: unknown) {
  return { jsonrpc: "2.0", id, result };
}

function jsonrpcError(id: string | number | null, code: number, message: string) {
  return { jsonrpc: "2.0", id, error: { code, message } };
}

function textContent(text: string, isError = false) {
  return {
    content: [{ type: "text", text: typeof text === "string" ? text : JSON.stringify(text, null, 2) }],
    isError,
  };
}

async function executeTool(name: string, args: Record<string, unknown>): Promise<{ content: { type: string; text: string }[]; isError: boolean }> {
  const start = Date.now();
  const network =
    typeof args["network"] === "string" && (args["network"] === "mainnet" || args["network"] === "sepolia")
      ? (args["network"] as "mainnet" | "sepolia")
      : "mainnet";

  try {
    let result: unknown;

    switch (name) {
      case "get_network_status": {
        result = await fetchNetworkStatus(network);
        break;
      }
      case "get_wallet_balance": {
        const address = args["address"];
        if (typeof address !== "string") {
          return textContent("Error: address parameter is required", true);
        }
        result = await fetchWalletBalance(address, network);
        break;
      }
      case "get_transaction": {
        const hash = args["hash"];
        if (typeof hash !== "string") {
          return textContent("Error: hash parameter is required", true);
        }
        result = await fetchTransaction(hash, network);
        if (!result) result = { error: "Transaction not found" };
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
        const address = args["address"];
        if (typeof address !== "string" || !isAddress(address)) {
          return textContent("Error: valid Ethereum address is required", true);
        }
        const registryAddress = getDeployedRegistryAddress("sepolia");
        const client = getPublicClient("sepolia");
        let isRegistered = false;
        if (registryAddress) {
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
        }
        result = {
          address,
          isRegistered,
          registryAddress: registryAddress ?? null,
          network: "Arbitrum Sepolia",
          explorerUrl: `${ARBITRUM_SEPOLIA_EXPLORER}/address/${address}`,
        };
        break;
      }
      case "get_overview_stats": {
        const networkData = await fetchNetworkStatus("mainnet");
        result = {
          network: networkData.network,
          blockNumber: networkData.blockNumber,
          totalToolCalls: activityTracker.getTotalCalls(),
          supportedProtocols: ARBITRUM_PROTOCOLS.length,
          availableTools: MCP_TOOLS.length,
          avgGasPrice: networkData.gasPriceGwei + " gwei",
          uptimePercent: "99.9",
        };
        break;
      }
      default:
        return textContent(`Error: Unknown tool "${name}"`, true);
    }

    activityTracker.record(name, "success", Date.now() - start);
    return textContent(JSON.stringify(result, null, 2));
  } catch (err) {
    activityTracker.record(name, "error", Date.now() - start);
    const msg = err instanceof Error ? err.message : "Tool execution failed";
    return textContent(`Error: ${msg}`, true);
  }
}

async function handleJsonRpc(body: unknown, res: Response) {
  if (Array.isArray(body)) {
    const results = await Promise.all(body.map((msg) => handleSingleMessage(msg)));
    res.json(results.filter(Boolean));
    return;
  }
  const result = await handleSingleMessage(body);
  if (result) {
    res.json(result);
  } else {
    res.status(204).end();
  }
}

async function handleSingleMessage(msg: unknown): Promise<unknown> {
  if (typeof msg !== "object" || msg === null) {
    return jsonrpcError(null, -32600, "Invalid Request");
  }

  const { id, method, params } = msg as { id?: string | number; method?: string; params?: unknown };

  if (typeof method !== "string") {
    return jsonrpcError(id ?? null, -32600, "Invalid Request: method required");
  }

  const isNotification = id === undefined;

  switch (method) {
    case "initialize": {
      return jsonrpcSuccess(id ?? null, {
        protocolVersion: PROTOCOL_VERSION,
        capabilities: {
          tools: { listChanged: false },
        },
        serverInfo: SERVER_INFO,
      });
    }

    case "notifications/initialized":
    case "notifications/cancelled":
      return null;

    case "ping":
      return jsonrpcSuccess(id ?? null, {});

    case "tools/list": {
      return jsonrpcSuccess(id ?? null, {
        tools: MCP_TOOLS.map((t) => ({
          name: t.name,
          description: t.description,
          inputSchema: t.inputSchema,
        })),
      });
    }

    case "tools/call": {
      const p = params as { name?: string; arguments?: Record<string, unknown> };
      const toolName = p?.name;
      const toolArgs = p?.arguments ?? {};

      if (typeof toolName !== "string") {
        return jsonrpcError(id ?? null, -32602, "Invalid params: tool name required");
      }

      const known = MCP_TOOLS.find((t) => t.name === toolName);
      if (!known) {
        return jsonrpcSuccess(id ?? null, textContent(`Unknown tool: "${toolName}". Available: ${MCP_TOOLS.map((t) => t.name).join(", ")}`, true));
      }

      const toolResult = await executeTool(toolName, toolArgs);
      return jsonrpcSuccess(id ?? null, toolResult);
    }

    case "resources/list":
      return jsonrpcSuccess(id ?? null, { resources: [] });

    case "prompts/list":
      return jsonrpcSuccess(id ?? null, { prompts: [] });

    default:
      if (isNotification) return null;
      return jsonrpcError(id ?? null, -32601, `Method not found: ${method}`);
  }
}

router.post("/", async (req: Request, res: Response) => {
  res.setHeader("Content-Type", "application/json");
  await handleJsonRpc(req.body, res);
});

router.get("/", (req: Request, res: Response) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.flushHeaders();

  const heartbeat = setInterval(() => {
    res.write(": heartbeat\n\n");
  }, 15000);

  req.on("close", () => {
    clearInterval(heartbeat);
  });
});

router.options("/", (_req: Request, res: Response) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, Mcp-Session-Id");
  res.status(204).end();
});

export default router;
