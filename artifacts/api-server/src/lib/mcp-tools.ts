export const MCP_TOOLS = [
  {
    name: "get_network_status",
    description:
      "Get current Arbitrum network status including block number, gas price, chain ID, and RPC endpoint. Use this to check if the Arbitrum network is online and get the latest block.",
    inputSchema: {
      type: "object",
      properties: {
        network: {
          type: "string",
          enum: ["mainnet", "sepolia"],
          description: "Which Arbitrum network to query (default: mainnet)",
        },
      },
      required: [],
    },
  },
  {
    name: "get_wallet_balance",
    description:
      "Get the ETH balance and ERC-20 token balances for any Ethereum address on Arbitrum. Returns formatted balances with USD values where available.",
    inputSchema: {
      type: "object",
      properties: {
        address: {
          type: "string",
          description: "Ethereum address starting with 0x (e.g. 0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045)",
        },
        network: {
          type: "string",
          enum: ["mainnet", "sepolia"],
          description: "Which Arbitrum network to query (default: mainnet)",
        },
      },
      required: ["address"],
    },
  },
  {
    name: "get_transaction",
    description:
      "Get detailed information about any transaction on Arbitrum by its hash. Returns sender, receiver, value, gas used, status (success/failed/pending), and timestamp.",
    inputSchema: {
      type: "object",
      properties: {
        hash: {
          type: "string",
          description: "Transaction hash starting with 0x",
        },
        network: {
          type: "string",
          enum: ["mainnet", "sepolia"],
          description: "Which Arbitrum network to query (default: mainnet)",
        },
      },
      required: ["hash"],
    },
  },
  {
    name: "get_top_tokens",
    description:
      "Get the top tokens on Arbitrum One with live prices, 24h price changes, and trading volume from CoinGecko. Includes ARB, USDC, USDT, WETH, GMX, LINK, WBTC.",
    inputSchema: {
      type: "object",
      properties: {},
      required: [],
    },
  },
  {
    name: "get_protocols",
    description:
      "Get a curated list of major DeFi protocols deployed on Arbitrum including DEXes, lending protocols, perpetuals, and yield optimizers. Includes Uniswap, GMX, Camelot, Aave, Radiant, Pendle, and more.",
    inputSchema: {
      type: "object",
      properties: {},
      required: [],
    },
  },
  {
    name: "get_agent_status",
    description:
      "Check if an AI agent wallet address is registered on the official Arbitrum agent identity registry. Returns registration status and registry details.",
    inputSchema: {
      type: "object",
      properties: {
        address: {
          type: "string",
          description: "Agent wallet address starting with 0x",
        },
        network: {
          type: "string",
          enum: ["mainnet", "sepolia"],
          description: "Which registry to check (default: mainnet)",
        },
      },
      required: ["address"],
    },
  },
  {
    name: "get_overview_stats",
    description:
      "Get high-level Arbitrum network statistics and ArbiLink usage metrics. Returns block number, gas price, number of registered agents, supported protocols count, and available tools.",
    inputSchema: {
      type: "object",
      properties: {},
      required: [],
    },
  },
  {
    name: "simulate_gmx_open",
    description:
      "Simulate opening a GMX V2 perpetual position on Arbitrum — BEFORE any real transaction. Given an index token (ETH, BTC, ARB, LINK), collateral in USD, leverage multiplier, and direction (long/short), returns: live entry price, position size, opening fee, liquidation price, distance to liquidation, PnL scenarios for ±5/10/20% price moves, hourly borrow fee estimate, and risk warnings. Use this when someone asks 'simulate a 10x ETH long', 'what happens if I open a 5x BTC short with $500', or 'show me the risk of a leveraged trade on GMX'.",
    inputSchema: {
      type: "object",
      properties: {
        indexToken: {
          type: "string",
          description: "Token to trade (e.g. ETH, BTC, WETH, WBTC, ARB, LINK)",
        },
        collateralUsd: {
          type: "number",
          description: "Collateral amount in USD (minimum $10)",
        },
        leverage: {
          type: "number",
          description: "Leverage multiplier (e.g. 10 for 10x). Max 100x for ETH/BTC, 50x for ARB/LINK",
        },
        direction: {
          type: "string",
          enum: ["long", "short"],
          description: "Trade direction: 'long' (profit when price rises) or 'short' (profit when price falls)",
        },
      },
      required: ["indexToken", "collateralUsd", "leverage", "direction"],
    },
  },
  {
    name: "prepare_uniswap_swap",
    description:
      "Prepare and quote a Uniswap V3 token swap on Arbitrum — BEFORE any real transaction. Returns: live exchange rate, estimated output amount, minimum amount out (after slippage), price impact, pool fee tier, gas estimate, and the exact contract call parameters needed to execute via Uniswap V3 SwapRouter02. Use this when someone asks 'how do I swap 1 ETH for USDC on Uniswap?', 'quote a swap of 500 USDC to ARB', or 'prepare a Uniswap trade'.",
    inputSchema: {
      type: "object",
      properties: {
        tokenIn: {
          type: "string",
          description: "Input token symbol (e.g. ETH, USDC, ARB, WBTC, LINK)",
        },
        tokenOut: {
          type: "string",
          description: "Output token symbol (e.g. USDC, ETH, ARB, DAI)",
        },
        amountIn: {
          type: "number",
          description: "Amount of tokenIn to swap (in token units, e.g. 1.5 for 1.5 ETH)",
        },
        slippageTolerance: {
          type: "number",
          description: "Maximum acceptable slippage percentage (default 0.5, range 0.01–50)",
        },
      },
      required: ["tokenIn", "tokenOut", "amountIn"],
    },
  },
  {
    name: "get_gmx_position_health",
    description:
      "Check the health of open GMX V2 perpetual positions for any wallet address on Arbitrum. Returns open positions with: direction, size, collateral, leverage, entry price, current price, estimated liquidation price, unrealized PnL, and health status (HEALTHY / AT RISK / CRITICAL). Also returns current live market prices. Use this when someone asks 'check GMX positions for 0x...', 'is this address at risk of liquidation on GMX?', or 'show me the perp positions for this wallet'.",
    inputSchema: {
      type: "object",
      properties: {
        address: {
          type: "string",
          description: "Ethereum wallet address to check GMX positions for (starting with 0x)",
        },
      },
      required: ["address"],
    },
  },
  {
    name: "get_wallet_portfolio",
    description:
      "Get the complete Arbitrum portfolio for any wallet address. Returns total USD value, all ETH and ERC-20 token holdings (ARB, WETH, USDC, USDT, WBTC, GMX, LINK, DAI, PENDLE, RDNT) with live prices, 24h change, and each holding's percentage of the total portfolio. Use this when someone asks 'what's in this wallet?', 'show me the portfolio of 0x...', or 'how much crypto does this address hold?'",
    inputSchema: {
      type: "object",
      properties: {
        address: {
          type: "string",
          description: "Ethereum wallet address starting with 0x",
        },
        network: {
          type: "string",
          enum: ["mainnet", "sepolia"],
          description: "Which Arbitrum network to query (default: mainnet)",
        },
      },
      required: ["address"],
    },
  },
  {
    name: "get_aave_positions",
    description:
      "Get live Aave V3 lending and borrowing positions for any wallet on Arbitrum One. Returns: health factor with status (HEALTHY / AT RISK / CRITICAL / LIQUIDATABLE), total collateral in USD, total debt in USD, net position, available to borrow, loan-to-value ratio, and liquidation threshold. Use this when someone asks 'check the Aave health factor for 0x...', 'is this wallet at risk of liquidation on Aave?', 'how much has this address borrowed on Aave?', or 'show Aave positions for this wallet'.",
    inputSchema: {
      type: "object",
      properties: {
        address: {
          type: "string",
          description: "Ethereum wallet address to check Aave V3 positions for (starting with 0x)",
        },
      },
      required: ["address"],
    },
  },
  {
    name: "get_uniswap_lp_positions",
    description:
      "Get Uniswap V3 liquidity provider (LP) positions for any wallet on Arbitrum One. Returns all NFT LP positions including: token pair, fee tier, in-range status (✅ IN RANGE / ⛔ OUT OF RANGE), accumulated uncollected fees for each token, tick range, and a direct link to manage the position on the Uniswap app. Use this when someone asks 'show me Uniswap LP positions for 0x...', 'is this LP position in range?', 'how much in uncollected fees does this wallet have?', or 'check liquidity positions for this address'.",
    inputSchema: {
      type: "object",
      properties: {
        address: {
          type: "string",
          description: "Ethereum wallet address to check Uniswap V3 LP positions for (starting with 0x)",
        },
      },
      required: ["address"],
    },
  },
];
