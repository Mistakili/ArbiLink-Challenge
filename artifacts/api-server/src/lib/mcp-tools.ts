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
];
