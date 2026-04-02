# ArbiLink — Arbitrum MCP Server

## Overview

ArbiLink is the world's first MCP (Model Context Protocol) server for Arbitrum. It enables any AI assistant (Claude, GPT, Cursor) to directly interact with the Arbitrum blockchain through a clean HTTP API and MCP protocol.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM (provisioned, schema empty by default)
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **Blockchain**: viem (Arbitrum One + Sepolia)
- **Frontend**: React + Vite + TailwindCSS + shadcn/ui

## What It Does

ArbiLink exposes Arbitrum capabilities as MCP tools:

1. `get_network_status` — Block number, gas price, chain info
2. `get_wallet_balance` — ETH + ERC-20 balances for any address
3. `get_transaction` — Transaction details by hash
4. `get_top_tokens` — ARB, USDC, WETH, GMX, LINK prices from CoinGecko
5. `get_protocols` — Major DeFi protocols on Arbitrum (Uniswap, GMX, Camelot, Aave, Radiant, Pendle, etc.)
6. `get_agent_status` — Check if an address is registered on the Arbitrum identity registry
7. `get_overview_stats` — High-level metrics

Plus agent registration on the Arbitrum identity registry (Sepolia: `0x8004A818BFB912233c491871b3d84c89A494BD9e`, Mainnet: `0x8004A169FB4a3325136EB29fA0ceB6D2e539a432`).

## Key API Endpoints

- `GET /api/healthz` — Health check
- `GET /api/arbitrum/network` — Arbitrum One network status
- `GET /api/arbitrum/balance/:address` — Wallet balance
- `GET /api/arbitrum/tx/:hash` — Transaction info
- `GET /api/arbitrum/tokens` — Top tokens + prices
- `GET /api/arbitrum/protocols` — Ecosystem protocols
- `POST /api/agent/register` — Register agent on-chain
- `GET /api/agent/status/:address` — Check registration
- `GET /api/mcp/tools` — List all MCP tools (OpenAI-compatible format)
- `POST /api/mcp/execute` — Execute any MCP tool
- `GET /api/stats/overview` — Dashboard stats

## MCP Integration (Claude Desktop)

Add to `claude_desktop_config.json`:
```json
{
  "mcpServers": {
    "arbilink": {
      "command": "npx",
      "args": ["-y", "@arbilink/mcp-client", "https://<your-domain>/api"]
    }
  }
}
```

Or call the REST API directly from any OpenAI-compatible agent framework.

## Structure

```text
artifacts-monorepo/
├── artifacts/
│   ├── api-server/         # Express API server (Arbitrum backend)
│   │   └── src/
│   │       ├── lib/
│   │       │   ├── arbitrum.ts     # viem-based Arbitrum service
│   │       │   └── mcp-tools.ts    # MCP tool definitions
│   │       └── routes/
│   │           ├── arbitrum.ts     # Blockchain routes
│   │           ├── agent.ts        # Agent registration
│   │           └── mcp.ts          # MCP execute/list
│   └── arbilink/           # React dashboard frontend
├── lib/
│   ├── api-spec/           # OpenAPI spec
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas
│   └── db/                 # Drizzle ORM (unused currently)
```

## Public RPCs

- Arbitrum One: `https://arb1.arbitrum.io/rpc`
- Arbitrum Sepolia: `https://sepolia-rollup.arbitrum.io/rpc`

## Agent Registry Addresses

- Arbitrum One: `0x8004A169FB4a3325136EB29fA0ceB6D2e539a432`
- Arbitrum Sepolia: `0x8004A818BFB912233c491871b3d84c89A494BD9e`

## TypeScript & Composite Projects

Every package extends `tsconfig.base.json` which sets `composite: true`. The root `tsconfig.json` lists all packages as project references.

- `pnpm run typecheck` — full typecheck
- `pnpm run build` — full build

## Key Commands

- `pnpm --filter @workspace/api-server run dev` — run the API server
- `pnpm --filter @workspace/arbilink run dev` — run the frontend
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API client from spec
