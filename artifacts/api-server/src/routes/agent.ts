import { Router, type IRouter } from "express";
import {
  RegisterAgentBody,
  RegisterAgentResponse,
  GetAgentStatusParams,
  GetAgentStatusResponse,
} from "@workspace/api-zod";
import {
  getPublicClient,
  AGENT_REGISTRY_MAINNET,
  AGENT_REGISTRY_SEPOLIA,
  ARBITRUM_EXPLORER,
  ARBITRUM_SEPOLIA_EXPLORER,
  agentRegistryAbi,
} from "../lib/arbitrum.js";
import {
  createWalletClient,
  http,
  isAddress,
  type Address,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { arbitrum, arbitrumSepolia } from "viem/chains";
import {
  ARBITRUM_ONE_RPC,
  ARBITRUM_SEPOLIA_RPC,
} from "../lib/arbitrum.js";

const router: IRouter = Router();

router.post("/agent/register", async (req, res) => {
  const body = RegisterAgentBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: "invalid_request", message: body.error.message });
    return;
  }

  const { name, description, privateKey, network, metadataUri } = body.data;
  const isMainnet = network === "mainnet";
  const registryAddress = isMainnet ? AGENT_REGISTRY_MAINNET : AGENT_REGISTRY_SEPOLIA;
  const explorerBase = isMainnet ? ARBITRUM_EXPLORER : ARBITRUM_SEPOLIA_EXPLORER;

  try {
    const account = privateKeyToAccount(
      (privateKey.startsWith("0x") ? privateKey : `0x${privateKey}`) as `0x${string}`
    );

    const walletClient = createWalletClient({
      account,
      chain: isMainnet ? arbitrum : arbitrumSepolia,
      transport: http(isMainnet ? ARBITRUM_ONE_RPC : ARBITRUM_SEPOLIA_RPC),
    });

    const metadata = JSON.stringify({
      name,
      description,
      version: "1.0.0",
      endpoint: process.env["REPLIT_DOMAINS"]?.split(",")[0]
        ? `https://${process.env["REPLIT_DOMAINS"].split(",")[0]}/api/mcp`
        : undefined,
      capabilities: ["arbitrum-balance", "arbitrum-tx", "arbitrum-tokens", "arbitrum-protocols"],
      framework: "ArbiLink MCP Server",
      createdAt: new Date().toISOString(),
    });

    const metaUri = metadataUri ?? `data:application/json;base64,${Buffer.from(metadata).toString("base64")}`;

    const hash = await walletClient.writeContract({
      address: registryAddress as Address,
      abi: agentRegistryAbi,
      functionName: "registerAgent",
      args: [name, metaUri],
    });

    const data = {
      success: true,
      transactionHash: hash,
      agentAddress: account.address,
      registryAddress,
      network: isMainnet ? "Arbitrum One" : "Arbitrum Sepolia",
      explorerUrl: `${explorerBase}/tx/${hash}`,
      message: `Agent "${name}" successfully registered on ${isMainnet ? "Arbitrum One" : "Arbitrum Sepolia"}`,
    };

    res.json(RegisterAgentResponse.parse(data));
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Registration failed";
    req.log.error({ err }, "Agent registration failed");
    res.status(400).json({ error: "registration_failed", message });
  }
});

router.get("/agent/status/:address", async (req, res) => {
  const params = GetAgentStatusParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: "invalid_address", message: "Invalid address" });
    return;
  }

  const { address } = params.data;
  if (!isAddress(address)) {
    res.status(400).json({ error: "invalid_address", message: "Not a valid Ethereum address" });
    return;
  }

  const registryAddress = AGENT_REGISTRY_MAINNET;
  const explorerBase = ARBITRUM_EXPLORER;

  try {
    const client = getPublicClient("mainnet");
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

    const data = {
      address,
      isRegistered,
      registryAddress,
      network: "Arbitrum One",
      registrationBlock: null,
      explorerUrl: `${explorerBase}/address/${address}`,
    };

    res.json(GetAgentStatusResponse.parse(data));
  } catch (err) {
    req.log.error({ err }, "Failed to check agent status");
    res.status(500).json({ error: "rpc_error", message: "Failed to check agent status" });
  }
});

export default router;
