import {
  createPublicClient,
  http,
  formatEther,
  formatUnits,
  isAddress,
  type PublicClient,
  type Address,
} from "viem";
import { arbitrum, arbitrumSepolia } from "viem/chains";

export const ARBITRUM_ONE_RPC = "https://arb1.arbitrum.io/rpc";
export const ARBITRUM_SEPOLIA_RPC = "https://sepolia-rollup.arbitrum.io/rpc";

export const ARBITRUM_EXPLORER = "https://arbiscan.io";
export const ARBITRUM_SEPOLIA_EXPLORER = "https://sepolia.arbiscan.io";

export const agentRegistryAbi = [
  {
    name: "registerAgent",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "name", type: "string" },
      { name: "metadataUri", type: "string" },
    ],
    outputs: [],
  },
  {
    name: "updateAgent",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "name", type: "string" },
      { name: "metadataUri", type: "string" },
    ],
    outputs: [],
  },
  {
    name: "isRegistered",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "agent", type: "address" }],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    name: "getAgent",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "agent", type: "address" }],
    outputs: [
      { name: "name", type: "string" },
      { name: "metadataUri", type: "string" },
      { name: "registeredAt", type: "uint256" },
    ],
  },
  {
    name: "getAgentCount",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
] as const;


const erc20Abi = [
  {
    name: "balanceOf",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "decimals",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint8" }],
  },
  {
    name: "symbol",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "string" }],
  },
] as const;

export const ARBITRUM_TOKENS: Array<{
  symbol: string;
  name: string;
  address: Address;
  decimals: number;
  logoUrl: string;
  coingeckoId: string;
}> = [
  {
    symbol: "ARB",
    name: "Arbitrum",
    address: "0x912CE59144191C1204E64559FE8253a0e49E6548",
    decimals: 18,
    logoUrl: "https://assets.coingecko.com/coins/images/16547/small/photo_2023-03-29_21.47.00.jpeg",
    coingeckoId: "arbitrum",
  },
  {
    symbol: "USDC",
    name: "USD Coin",
    address: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
    decimals: 6,
    logoUrl: "https://assets.coingecko.com/coins/images/6319/small/usdc.png",
    coingeckoId: "usd-coin",
  },
  {
    symbol: "USDT",
    name: "Tether USD",
    address: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
    decimals: 6,
    logoUrl: "https://assets.coingecko.com/coins/images/325/small/Tether.png",
    coingeckoId: "tether",
  },
  {
    symbol: "WETH",
    name: "Wrapped Ether",
    address: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
    decimals: 18,
    logoUrl: "https://assets.coingecko.com/coins/images/2518/small/weth.png",
    coingeckoId: "weth",
  },
  {
    symbol: "GMX",
    name: "GMX",
    address: "0xfc5A1A6EB076a2C7aD06eD22C90d7E710E35ad0a",
    decimals: 18,
    logoUrl: "https://assets.coingecko.com/coins/images/18323/small/arbit.png",
    coingeckoId: "gmx",
  },
  {
    symbol: "LINK",
    name: "Chainlink",
    address: "0xf97f4df75117a78c1A5a0DBb814Af92458539FB4",
    decimals: 18,
    logoUrl: "https://assets.coingecko.com/coins/images/877/small/chainlink-new-logo.png",
    coingeckoId: "chainlink",
  },
  {
    symbol: "WBTC",
    name: "Wrapped Bitcoin",
    address: "0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f",
    decimals: 8,
    logoUrl: "https://assets.coingecko.com/coins/images/7598/small/wrapped_bitcoin_wbtc.png",
    coingeckoId: "wrapped-bitcoin",
  },
];

export const ARBITRUM_PROTOCOLS = [
  {
    name: "Uniswap V3",
    category: "DEX",
    description: "The leading decentralized exchange protocol with concentrated liquidity pools on Arbitrum.",
    website: "https://app.uniswap.org",
    tvl: "$1.2B",
    logoUrl: "https://assets.coingecko.com/coins/images/12504/small/uniswap-uni.png",
    contractAddress: "0x1F98431c8aD98523631AE4a59f267346ea31F984",
    isActive: true,
  },
  {
    name: "GMX",
    category: "Perpetuals / Spot",
    description: "Decentralized spot and perpetual exchange with up to 100x leverage on Arbitrum.",
    website: "https://app.gmx.io",
    tvl: "$420M",
    logoUrl: "https://assets.coingecko.com/coins/images/18323/small/arbit.png",
    contractAddress: "0xfc5A1A6EB076a2C7aD06eD22C90d7E710E35ad0a",
    isActive: true,
  },
  {
    name: "Camelot",
    category: "DEX",
    description: "Native Arbitrum ecosystem DEX with innovative AMM design and launchpad capabilities.",
    website: "https://app.camelot.exchange",
    tvl: "$150M",
    logoUrl: null,
    contractAddress: "0x6EcCab422D763aC031210895C81787E87B43A652",
    isActive: true,
  },
  {
    name: "Aave V3",
    category: "Lending",
    description: "Open source and non-custodial liquidity protocol for earning interest and borrowing assets.",
    website: "https://app.aave.com",
    tvl: "$800M",
    logoUrl: "https://assets.coingecko.com/coins/images/12645/small/AAVE.png",
    contractAddress: "0x794a61358D6845594F94dc1DB02A252b5b4814aD",
    isActive: true,
  },
  {
    name: "Radiant Capital",
    category: "Lending",
    description: "Omnichain money market built on LayerZero, native to Arbitrum.",
    website: "https://radiant.capital",
    tvl: "$200M",
    logoUrl: null,
    contractAddress: "0xbF7E49483881C76487b0989CD7d9A8239B20CA41",
    isActive: true,
  },
  {
    name: "Pendle Finance",
    category: "Yield",
    description: "Yield trading protocol enabling yield tokenization and trading strategies.",
    website: "https://app.pendle.finance",
    tvl: "$180M",
    logoUrl: null,
    contractAddress: null,
    isActive: true,
  },
  {
    name: "Gains Network",
    category: "Perpetuals",
    description: "Decentralized leveraged trading platform (gTrade) with synthetic assets.",
    website: "https://gainsnetwork.io",
    tvl: "$95M",
    logoUrl: null,
    contractAddress: null,
    isActive: true,
  },
  {
    name: "Fhenix",
    category: "Privacy / L3",
    description: "FHE-powered confidential computing layer on Arbitrum for encrypted smart contracts.",
    website: "https://www.fhenix.io",
    tvl: null,
    logoUrl: null,
    contractAddress: null,
    isActive: true,
  },
];

export function getPublicClient(network: "mainnet" | "sepolia" = "mainnet"): PublicClient {
  return createPublicClient({
    chain: network === "mainnet" ? arbitrum : arbitrumSepolia,
    transport: http(network === "mainnet" ? ARBITRUM_ONE_RPC : ARBITRUM_SEPOLIA_RPC),
  }) as PublicClient;
}

export async function fetchNetworkStatus(network: "mainnet" | "sepolia" = "mainnet") {
  const client = getPublicClient(network);
  const chain = network === "mainnet" ? arbitrum : arbitrumSepolia;
  const isMainnet = network === "mainnet";
  const explorer = isMainnet ? ARBITRUM_EXPLORER : ARBITRUM_SEPOLIA_EXPLORER;
  const rpcUrl = isMainnet ? ARBITRUM_ONE_RPC : ARBITRUM_SEPOLIA_RPC;

  const [blockNumber, gasPrice] = await Promise.all([
    client.getBlockNumber(),
    client.getGasPrice(),
  ]);

  const gasPriceGwei = formatUnits(gasPrice, 9);

  return {
    chainId: chain.id,
    network: isMainnet ? "Arbitrum One" : "Arbitrum Sepolia",
    blockNumber: Number(blockNumber),
    gasPrice: gasPrice.toString(),
    gasPriceGwei: Number(gasPriceGwei).toFixed(4),
    isMainnet,
    rpcUrl,
    explorerUrl: explorer,
    status: "online",
  };
}

export async function fetchWalletBalance(address: string, network: "mainnet" | "sepolia" = "mainnet") {
  if (!isAddress(address)) {
    throw new Error("Invalid Ethereum address");
  }

  const client = getPublicClient(network);
  const isMainnet = network === "mainnet";
  const explorer = isMainnet ? ARBITRUM_EXPLORER : ARBITRUM_SEPOLIA_EXPLORER;
  const addr = address as Address;

  const ethBalance = await client.getBalance({ address: addr });
  const ethFormatted = parseFloat(formatEther(ethBalance)).toFixed(6);

  let ethUsdValue: string | null = null;
  let ethPrice = 0;
  try {
    const priceRes = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd",
      { signal: AbortSignal.timeout(5000) }
    );
    if (priceRes.ok) {
      const priceData = await priceRes.json() as { ethereum?: { usd?: number } };
      ethPrice = priceData?.ethereum?.usd ?? 0;
      if (ethPrice > 0) {
        ethUsdValue = (parseFloat(ethFormatted) * ethPrice).toFixed(2);
      }
    }
  } catch {
    ethUsdValue = null;
  }

  const tokens = [];
  if (isMainnet) {
    const tokenResults = await Promise.allSettled(
      ARBITRUM_TOKENS.map(async (token) => {
        const balance = await client.readContract({
          address: token.address,
          abi: erc20Abi,
          functionName: "balanceOf",
          args: [addr],
        });
        const formatted = parseFloat(formatUnits(balance, token.decimals));
        if (formatted === 0) return null;
        return {
          symbol: token.symbol,
          name: token.name,
          address: token.address,
          balance: balance.toString(),
          decimals: token.decimals,
          usdValue: null as string | null,
        };
      })
    );

    for (const result of tokenResults) {
      if (result.status === "fulfilled" && result.value !== null) {
        tokens.push(result.value);
      }
    }
  }

  return {
    address,
    ethBalance: ethBalance.toString(),
    ethBalanceFormatted: ethFormatted,
    usdValue: ethUsdValue,
    tokens,
    network: isMainnet ? "Arbitrum One" : "Arbitrum Sepolia",
    explorerUrl: `${explorer}/address/${address}`,
  };
}

export async function fetchTransaction(hash: string, network: "mainnet" | "sepolia" = "mainnet") {
  const client = getPublicClient(network);
  const isMainnet = network === "mainnet";
  const explorer = isMainnet ? ARBITRUM_EXPLORER : ARBITRUM_SEPOLIA_EXPLORER;

  const tx = await client.getTransaction({ hash: hash as `0x${string}` });
  if (!tx) return null;

  let receipt = null;
  let timestamp = null;
  try {
    receipt = await client.getTransactionReceipt({ hash: hash as `0x${string}` });
    if (tx.blockNumber) {
      const block = await client.getBlock({ blockNumber: tx.blockNumber });
      timestamp = Number(block.timestamp);
    }
  } catch {
    // receipt might not be available yet
  }

  return {
    hash: tx.hash,
    blockNumber: tx.blockNumber ? Number(tx.blockNumber) : null,
    from: tx.from,
    to: tx.to ?? null,
    value: tx.value.toString(),
    valueFormatted: parseFloat(formatEther(tx.value)).toFixed(8),
    gasPrice: tx.gasPrice?.toString() ?? "0",
    gasUsed: receipt?.gasUsed?.toString() ?? null,
    status: receipt ? (receipt.status === "success" ? "success" : "failed") : "pending",
    timestamp,
    explorerUrl: `${explorer}/tx/${hash}`,
    network: isMainnet ? "Arbitrum One" : "Arbitrum Sepolia",
  };
}

export async function fetchTopTokens() {
  let prices: Record<string, { usd: number; usd_24h_change: number; usd_24h_vol: number }> = {};
  try {
    const ids = ARBITRUM_TOKENS.map((t) => t.coingeckoId).join(",");
    const res = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true`,
      { signal: AbortSignal.timeout(8000) }
    );
    if (res.ok) {
      prices = (await res.json()) as typeof prices;
    }
  } catch {
    // fallback: use placeholder prices
    prices = {};
  }

  const tokens = ARBITRUM_TOKENS.map((token) => {
    const priceData = prices[token.coingeckoId];
    return {
      symbol: token.symbol,
      name: token.name,
      address: token.address,
      price: priceData ? `$${priceData.usd.toFixed(4)}` : "N/A",
      priceChange24h: priceData ? `${priceData.usd_24h_change?.toFixed(2) ?? "0"}%` : "N/A",
      volume24h: priceData?.usd_24h_vol ? `$${(priceData.usd_24h_vol / 1e6).toFixed(1)}M` : null,
      decimals: token.decimals,
      logoUrl: token.logoUrl,
    };
  });

  return {
    tokens,
    network: "Arbitrum One",
    updatedAt: new Date().toISOString(),
  };
}
