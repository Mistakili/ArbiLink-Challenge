# ArbiLink — Arbitrum MCP Server for AI Agents

[![Live](https://img.shields.io/badge/Live-arbi--link--challenge.replit.app-blue)](https://arbi-link-challenge.replit.app)
[![MCP Protocol](https://img.shields.io/badge/MCP-2024--11--05-green)](https://modelcontextprotocol.io)
[![Network](https://img.shields.io/badge/Network-Arbitrum%20One-orange)](https://arbitrum.io)
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

**ArbiLink** is a native [Model Context Protocol (MCP)](https://modelcontextprotocol.io) server that connects AI agents directly to the Arbitrum blockchain. Claude, Cursor, Windsurf, and any MCP-compatible agent can read live on-chain data and prepare DeFi transactions without writing a single line of blockchain code.

> **"Your AI agent is blockchain-blind. ArbiLink gives it eyes."**

---

## Live Endpoints

| Interface | URL | Protocol |
|---|---|---|
| Native MCP | `https://arbi-link-challenge.replit.app/mcp` | JSON-RPC 2.0 (MCP 2024-11-05) |
| REST API | `https://arbi-link-challenge.replit.app/api/mcp` | HTTP |
| Dashboard | `https://arbi-link-challenge.replit.app` | Web |

---

## Quick Start — Claude Desktop

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "arbilink": {
      "command": "npx",
      "args": [
        "mcp-remote",
        "https://arbi-link-challenge.replit.app/mcp"
      ]
    }
  }
}
```

Then ask Claude:
- *"What's in vitalik.eth's Arbitrum wallet?"*
- *"Simulate a 10x ETH long with $500 collateral on GMX"*
- *"Prepare a swap of 1 ETH to USDC on Uniswap V3"*
- *"What's the current gas price on Arbitrum?"*

---

## Quick Start — Cursor / Windsurf

Add to your MCP settings:

```json
{
  "mcpServers": {
    "arbilink": {
      "url": "https://arbi-link-challenge.replit.app/mcp"
    }
  }
}
```

---

## 11 Live Tools

### Read Tools (8) — Live on-chain data

| Tool | Description |
|---|---|
| `get_eth_balance` | ETH balance for any Arbitrum address |
| `get_token_balance` | ERC-20 balance (ARB, USDC, USDT, GMX, LINK, WBTC, and more) |
| `get_wallet_portfolio` | Full portfolio with USD values and 24h change |
| `get_transaction` | Decode any transaction by hash |
| `get_gas_price` | Live gas price on Arbitrum One |
| `get_block` | Block data by number or `latest` |
| `get_contract_abi` | Fetch and decode ABI from Arbiscan |
| `get_defi_rates` | Live Aave V3 lending and borrowing rates |

### Execution Tools (3) — Simulate and prepare before signing

| Tool | Description |
|---|---|
| `simulate_gmx_open` | Full GMX V2 perpetual simulation — entry price, liquidation distance, PnL table at ±5/10/20%, hourly borrow fee |
| `prepare_uniswap_swap` | Uniswap V3 swap quote + complete `exactInputSingle` calldata ready to submit to `SwapRouter02` |
| `get_gmx_position_health` | Live open GMX V2 positions for any wallet — size, unrealized PnL, health status (HEALTHY / AT RISK / CRITICAL) |

---

## Example Tool Calls

### Simulate a GMX position

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "simulate_gmx_open",
    "arguments": {
      "indexToken": "ETH",
      "collateralUsd": 500,
      "leverage": 10,
      "direction": "long"
    }
  }
}
```

**Response includes:** live ETH price, position size, liquidation price (with % distance), PnL at 6 price scenarios, hourly borrow fee, and exact next steps to open the position on GMX V2.

### Prepare a Uniswap swap

```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "tools/call",
  "params": {
    "name": "prepare_uniswap_swap",
    "arguments": {
      "tokenIn": "ETH",
      "tokenOut": "USDC",
      "amountIn": 1.5
    }
  }
}
```

**Response includes:** live quote, estimated output, slippage-protected minimum, pool fee tier, price impact, gas estimate, and complete `exactInputSingle` calldata for `SwapRouter02`.

### Check wallet portfolio

```json
{
  "jsonrpc": "2.0",
  "id": 3,
  "method": "tools/call",
  "params": {
    "name": "get_wallet_portfolio",
    "arguments": {
      "address": "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"
    }
  }
}
```

---

## REST API

All tools are also available via HTTP POST:

```bash
curl -X POST https://arbi-link-challenge.replit.app/api/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "get_eth_balance",
    "arguments": { "address": "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045" }
  }'
```

---

## On-Chain Agent Registry

ArbiLink ships with an **AgentRegistry smart contract** deployed on Arbitrum Sepolia — a verifiable on-chain identity primitive for AI agents.

- **Contract:** `0x8fb1a3fe1e380b5578918888140a16fa699c85b0` (Arbitrum Sepolia)
- Agents register their endpoint, capabilities, and metadata on-chain
- Any client can verify an agent's identity and capabilities trustlessly
- Inspectable via the [Agent page](https://arbi-link-challenge.replit.app/agent)

---

## Supported Tokens

ETH, WETH, ARB, USDC, USDT, WBTC, GMX, LINK, DAI, PENDLE, RDNT

## Supported DeFi Protocols

- **GMX V2** — perpetual simulation, position health
- **Uniswap V3** — swap preparation with calldata
- **Aave V3** — live lending/borrowing rates

---

## Architecture

```
AI Agent (Claude / Cursor / Windsurf)
         │
         ▼ MCP JSON-RPC 2.0
┌─────────────────────┐
│   ArbiLink Server   │
│   (Node.js/Express) │
├─────────────────────┤
│  11 MCP Tools       │
│  REST API bridge    │
│  AgentRegistry RPC  │
└─────────────────────┘
         │
         ▼
┌─────────────────────┐
│   Arbitrum One      │
│   (live RPC)        │
│   CoinGecko prices  │
│   GMX V2 API        │
│   Arbiscan ABI      │
└─────────────────────┘
```

---

## Roadmap

- **v1.0 (Live)** — 8 read tools + 3 execution tools, AgentRegistry contract, dual MCP/REST interfaces
- **v1.1 (Building)** — API key auth + rate limiting, Aave V3 positions, Uniswap LP positions
- **v2.0 (Planned)** — Multi-agent coordination, webhook subscriptions for on-chain events
- **v3.0 (Future)** — Transaction signing via connected wallet, multi-chain expansion

---

## License

MIT
