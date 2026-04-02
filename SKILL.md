---
name: arbilink
description: ArbiLink MCP Server — Connect any AI assistant (Claude, GPT, Cursor, Windsurf) to the Arbitrum blockchain. Query live wallet balances, token prices, transactions, and DeFi protocols. Register AI agent identities on-chain. Works with any MCP-compatible host or OpenAI-compatible agent framework via HTTP.
---

# ArbiLink — Arbitrum MCP Server

ArbiLink is an HTTP server that gives AI agents native access to the Arbitrum blockchain ecosystem through two protocols:

1. **Model Context Protocol (MCP)** — drop-in tools for Claude Desktop, Cursor, Windsurf, and any MCP host
2. **OpenAI function-calling format** — compatible with GPT, LangChain, AutoGen, and every OpenAI-compatible framework

## Live Deployment

- **Dashboard**: https://arbi-link-challenge.replit.app
- **Native MCP endpoint**: https://arbi-link-challenge.replit.app/mcp *(JSON-RPC 2.0, protocol version 2024-11-05)*
- **OpenAI-compat tools list**: https://arbi-link-challenge.replit.app/api/mcp/tools

## Quick Start — Claude Desktop

Add this to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "arbilink": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "https://arbi-link-challenge.replit.app/mcp"]
    }
  }
}
```

Then restart Claude Desktop. You can immediately ask:

> *"What's the current gas price on Arbitrum?"*
> *"Check the ETH balance of vitalik.eth"*
> *"What are the top DeFi protocols on Arbitrum?"*

## Quick Start — OpenAI / LangChain

```javascript
const { tools } = await fetch("https://arbi-link-challenge.replit.app/api/mcp/tools").then(r => r.json());

const result = await fetch("https://arbi-link-challenge.replit.app/api/mcp/execute", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    tool: "get_wallet_balance",
    arguments: { address: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045" }
  })
}).then(r => r.json());
```

---

## Tools Reference

### `get_network_status`
Get live Arbitrum network status: current block number, gas price in Gwei, chain ID, and RPC endpoint.

**Parameters**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `network` | `"mainnet" \| "sepolia"` | No | Network to query (default: `mainnet`) |

**Example**
```json
{ "tool": "get_network_status" }
```

---

### `get_wallet_balance`
Get the ETH balance and major ERC-20 token balances for any Ethereum address on Arbitrum.

**Parameters**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `address` | `string` | Yes | Ethereum address (0x...) |
| `network` | `"mainnet" \| "sepolia"` | No | Network to query (default: `mainnet`) |

**Example**
```json
{
  "tool": "get_wallet_balance",
  "arguments": { "address": "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045" }
}
```

---

### `get_transaction`
Get full details of any transaction on Arbitrum: sender, receiver, value, gas used, status (success/failed/pending), block number, and timestamp.

**Parameters**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `hash` | `string` | Yes | Transaction hash (0x...) |
| `network` | `"mainnet" \| "sepolia"` | No | Network to query (default: `mainnet`) |

**Example**
```json
{
  "tool": "get_transaction",
  "arguments": { "hash": "0xabc123..." }
}
```

---

### `get_top_tokens`
Get live prices, 24h price changes, and market data for the top tokens on Arbitrum One. Includes ARB, USDC, USDT, WETH, GMX, LINK, and WBTC. Powered by CoinGecko.

**Parameters** — none

**Example**
```json
{ "tool": "get_top_tokens" }
```

---

### `get_protocols`
Get a curated list of major DeFi protocols deployed on Arbitrum: DEXes, lending markets, perpetuals, and yield optimizers. Includes Uniswap V3, GMX, Camelot, Aave, Radiant, Pendle, Curve, and Balancer.

**Parameters** — none

**Example**
```json
{ "tool": "get_protocols" }
```

---

### `get_agent_status`
Check if an AI agent wallet address is registered on the ArbiLink on-chain agent identity registry on Arbitrum Sepolia.

**Parameters**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `address` | `string` | Yes | Agent wallet address (0x...) |
| `network` | `"mainnet" \| "sepolia"` | No | Which registry to check (default: `mainnet`) |

**Example**
```json
{
  "tool": "get_agent_status",
  "arguments": { "address": "0x6Cf7c56B0835C23Bae4F239B9a2DAD8e24AC40dD" }
}
```

---

### `get_overview_stats`
Get high-level Arbitrum network statistics and ArbiLink server metrics: block number, gas price, registered agent count, supported protocol count, and available tool count.

**Parameters** — none

**Example**
```json
{ "tool": "get_overview_stats" }
```

---

## On-Chain Agent Registry

ArbiLink includes a deployable `AgentRegistry` smart contract on Arbitrum Sepolia. This lets AI agents register a verifiable on-chain identity with a name, description, and metadata URI.

**Deployed registry**: `0x8fb1a3fe1e380b5578918888140a16fa699c85b0` (Arbitrum Sepolia)

Register via the `/api/agent/register` endpoint or through the Agent page in the dashboard:

```bash
curl -X POST https://arbi-link-challenge.replit.app/api/agent/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My AI Agent",
    "description": "An agent that monitors Arbitrum DeFi positions",
    "privateKey": "0x...",
    "network": "sepolia"
  }'
```

---

## API Reference

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/mcp/tools` | GET | List all tools in OpenAI/MCP format |
| `/api/mcp/execute` | POST | Execute a tool by name with arguments |
| `/api/arbitrum/network` | GET | Live network status |
| `/api/arbitrum/balance/:address` | GET | Wallet balance |
| `/api/arbitrum/tx/:hash` | GET | Transaction details |
| `/api/arbitrum/tokens` | GET | Top token prices |
| `/api/arbitrum/protocols` | GET | DeFi protocol list |
| `/api/agent/register` | POST | Register agent on-chain |
| `/api/agent/status/:address` | GET | Check agent registration |
| `/api/stats/overview` | GET | Dashboard statistics |
| `/api/stats/activity` | GET | Real-time activity log |

---

## Stack

| Layer | Technology |
|-------|-----------|
| Blockchain | Arbitrum One + Arbitrum Sepolia |
| On-chain reads | viem 2.x |
| Smart contracts | Solidity 0.8.20 (compiled via solc) |
| Backend | Node.js + Express + TypeScript |
| Price data | CoinGecko API |
| Frontend | React + Vite + Tailwind CSS |

---

## Local Development

```bash
git clone https://github.com/YOUR_USERNAME/arbilink
cd arbilink
pnpm install
pnpm --filter @workspace/api-server run dev   # API on :8080
pnpm --filter @workspace/arbilink run dev      # Frontend on :5173
```

No API keys required. All blockchain data comes from public Arbitrum RPCs.

---

## Hackathon Submission

Built for the **Arbitrum x AI Hackathon** as a demonstration of AI-native blockchain infrastructure.

- **On-chain registration tx**: See Arbitrum Sepolia registry `0x8fb1a3fe1e380b5578918888140a16fa699c85b0`
- **Agent address**: `0x6Cf7c56B0835C23Bae4F239B9a2DAD8e24AC40dD`
- **Network**: Arbitrum Sepolia
