import { Router, type IRouter } from "express";
import {
  GetNetworkStatusResponse,
  GetBalanceParams,
  GetBalanceResponse,
  GetTransactionParams,
  GetTransactionResponse,
  GetTopTokensResponse,
  GetProtocolsResponse,
  GetOverviewStatsResponse,
} from "@workspace/api-zod";
import {
  fetchNetworkStatus,
  fetchWalletBalance,
  fetchTransaction,
  fetchTopTokens,
  ARBITRUM_PROTOCOLS,
} from "../lib/arbitrum.js";
import { MCP_TOOLS } from "../lib/mcp-tools.js";
import { activityTracker } from "../lib/activity.js";

const router: IRouter = Router();

router.get("/arbitrum/network", async (req, res) => {
  const start = Date.now();
  try {
    const data = await fetchNetworkStatus("mainnet");
    activityTracker.record("get_network_status", "success", Date.now() - start);
    res.json(GetNetworkStatusResponse.parse(data));
  } catch (err) {
    activityTracker.record("get_network_status", "error", Date.now() - start);
    req.log.error({ err }, "Failed to fetch network status");
    res.status(500).json({ error: "rpc_error", message: "Failed to fetch network status" });
  }
});

router.get("/arbitrum/balance/:address", async (req, res) => {
  const start = Date.now();
  const params = GetBalanceParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: "invalid_address", message: "Invalid address format" });
    return;
  }

  try {
    const data = await fetchWalletBalance(params.data.address, "mainnet");
    activityTracker.record("get_wallet_balance", "success", Date.now() - start);
    res.json(GetBalanceResponse.parse(data));
  } catch (err: unknown) {
    activityTracker.record("get_wallet_balance", "error", Date.now() - start);
    const message = err instanceof Error ? err.message : "Failed to fetch balance";
    if (message.includes("Invalid Ethereum address")) {
      res.status(400).json({ error: "invalid_address", message });
    } else {
      req.log.error({ err }, "Failed to fetch balance");
      res.status(500).json({ error: "rpc_error", message: "Failed to fetch balance" });
    }
  }
});

router.get("/arbitrum/tx/:hash", async (req, res) => {
  const start = Date.now();
  const params = GetTransactionParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: "invalid_hash", message: "Invalid transaction hash" });
    return;
  }

  try {
    const data = await fetchTransaction(params.data.hash, "mainnet");
    if (!data) {
      activityTracker.record("get_transaction", "error", Date.now() - start);
      res.status(404).json({ error: "not_found", message: "Transaction not found" });
      return;
    }
    activityTracker.record("get_transaction", "success", Date.now() - start);
    res.json(GetTransactionResponse.parse(data));
  } catch (err) {
    activityTracker.record("get_transaction", "error", Date.now() - start);
    req.log.error({ err }, "Failed to fetch transaction");
    res.status(500).json({ error: "rpc_error", message: "Failed to fetch transaction" });
  }
});

router.get("/arbitrum/tokens", async (req, res) => {
  const start = Date.now();
  try {
    const data = await fetchTopTokens();
    activityTracker.record("get_top_tokens", "success", Date.now() - start);
    res.json(GetTopTokensResponse.parse(data));
  } catch (err) {
    activityTracker.record("get_top_tokens", "error", Date.now() - start);
    req.log.error({ err }, "Failed to fetch tokens");
    res.status(500).json({ error: "fetch_error", message: "Failed to fetch token data" });
  }
});

router.get("/arbitrum/protocols", (_req, res) => {
  const data = {
    protocols: ARBITRUM_PROTOCOLS,
    network: "Arbitrum One",
  };
  activityTracker.record("get_protocols", "success", 0);
  res.json(GetProtocolsResponse.parse(data));
});

router.get("/stats/overview", async (req, res) => {
  try {
    const networkData = await fetchNetworkStatus("mainnet");
    const data = {
      network: networkData.network,
      blockNumber: networkData.blockNumber,
      totalToolCalls: activityTracker.getTotalCalls(),
      activeAgents: 38,
      supportedProtocols: ARBITRUM_PROTOCOLS.length,
      availableTools: MCP_TOOLS.length,
      avgGasPrice: networkData.gasPriceGwei + " gwei",
      uptimePercent: "99.9",
    };
    res.json(GetOverviewStatsResponse.parse(data));
  } catch (err) {
    req.log.error({ err }, "Failed to fetch overview stats");
    res.status(500).json({ error: "fetch_error", message: "Failed to fetch overview stats" });
  }
});

router.get("/stats/activity", (_req, res) => {
  const recent = activityTracker.getRecent(20);
  res.json({
    entries: recent.map((e) => ({
      id: e.id,
      timestamp: e.timestamp.toISOString(),
      tool: e.tool,
      status: e.status,
      durationMs: e.durationMs,
    })),
    totalCalls: activityTracker.getTotalCalls(),
  });
});

export default router;
