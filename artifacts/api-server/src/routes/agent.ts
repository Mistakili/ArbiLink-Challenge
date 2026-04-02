import { Router, type IRouter } from "express";
import {
  RegisterAgentBody,
  RegisterAgentResponse,
  GetAgentStatusParams,
  GetAgentStatusResponse,
} from "@workspace/api-zod";
import {
  getPublicClient,
  ARBITRUM_EXPLORER,
  ARBITRUM_SEPOLIA_EXPLORER,
  agentRegistryAbi,
} from "../lib/arbitrum.js";
import {
  deployRegistryIfNeeded,
  getDeployedRegistryAddress,
} from "../lib/registry-deploy.js";
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
  const explorerBase = isMainnet ? ARBITRUM_EXPLORER : ARBITRUM_SEPOLIA_EXPLORER;

  if (isMainnet) {
    res.status(400).json({
      error: "mainnet_not_supported",
      message: "Mainnet registration is not yet available. Please use Arbitrum Sepolia.",
    });
    return;
  }

  try {
    const account = privateKeyToAccount(
      (privateKey.startsWith("0x") ? privateKey : `0x${privateKey}`) as `0x${string}`
    );

    const walletClient = createWalletClient({
      account,
      chain: arbitrumSepolia,
      transport: http(ARBITRUM_SEPOLIA_RPC),
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

    let registryAddress: Address;
    let deployTx: string | undefined;

    const existing = getDeployedRegistryAddress("sepolia");
    if (!existing) {
      req.log.info("No registry deployed yet — deploying ArbiLink Agent Registry to Sepolia");
      registryAddress = await deployRegistryIfNeeded(walletClient, "sepolia");
      deployTx = undefined;
      req.log.info({ registryAddress }, "Registry deployed");
    } else {
      registryAddress = existing as Address;
    }

    const publicClient = getPublicClient("sepolia");

    let alreadyRegistered = false;
    try {
      alreadyRegistered = await publicClient.readContract({
        address: registryAddress,
        abi: agentRegistryAbi,
        functionName: "isRegistered",
        args: [account.address],
      });
    } catch {
      alreadyRegistered = false;
    }

    const functionName = alreadyRegistered ? "updateAgent" : "registerAgent";

    const hash = await walletClient.writeContract({
      address: registryAddress,
      abi: agentRegistryAbi,
      functionName,
      args: [name, metaUri],
    });

    const data = {
      success: true,
      transactionHash: hash,
      agentAddress: account.address,
      registryAddress,
      network: "Arbitrum Sepolia",
      explorerUrl: `${explorerBase}/tx/${hash}`,
      message: alreadyRegistered
        ? `Agent "${name}" updated on Arbitrum Sepolia (registry: ${registryAddress})`
        : `Agent "${name}" registered on Arbitrum Sepolia (registry: ${registryAddress})`,
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

  const registryAddress = getDeployedRegistryAddress("sepolia");
  const explorerBase = ARBITRUM_SEPOLIA_EXPLORER;

  if (!registryAddress) {
    res.json(GetAgentStatusResponse.parse({
      address,
      isRegistered: false,
      registryAddress: null,
      network: "Arbitrum Sepolia",
      registrationBlock: null,
      explorerUrl: `${explorerBase}/address/${address}`,
    }));
    return;
  }

  try {
    const client = getPublicClient("sepolia");
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
      network: "Arbitrum Sepolia",
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
