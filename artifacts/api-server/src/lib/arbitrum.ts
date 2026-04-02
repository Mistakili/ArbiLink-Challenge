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
  {
    symbol: "DAI",
    name: "Dai Stablecoin",
    address: "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
    decimals: 18,
    logoUrl: "https://assets.coingecko.com/coins/images/9956/small/Badge_Dai.png",
    coingeckoId: "dai",
  },
  {
    symbol: "PENDLE",
    name: "Pendle",
    address: "0x0c880f6761F1af8d9Aa9C466984b80DAb9a8c9e8",
    decimals: 18,
    logoUrl: "https://assets.coingecko.com/coins/images/15069/small/Pendle_Logo_Normal-03.png",
    coingeckoId: "pendle",
  },
  {
    symbol: "RDNT",
    name: "Radiant Capital",
    address: "0x3082CC23568eA640225c2467653dB90e9250AaA0",
    decimals: 18,
    logoUrl: "https://assets.coingecko.com/coins/images/26536/small/Radiant-Logo-200x200.png",
    coingeckoId: "radiant-capital",
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

export async function fetchWalletPortfolio(address: string, network: "mainnet" | "sepolia" = "mainnet") {
  if (!isAddress(address)) throw new Error("Invalid Ethereum address");

  const client = getPublicClient(network);
  const isMainnet = network === "mainnet";
  const explorer = isMainnet ? ARBITRUM_EXPLORER : ARBITRUM_SEPOLIA_EXPLORER;
  const addr = address as Address;

  const coingeckoIds = ["ethereum", ...ARBITRUM_TOKENS.map((t) => t.coingeckoId)].join(",");
  let prices: Record<string, { usd: number; usd_24h_change?: number }> = {};
  try {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${coingeckoIds}&vs_currencies=usd&include_24hr_change=true`,
      { signal: AbortSignal.timeout(8000) }
    );
    if (res.ok) prices = (await res.json()) as typeof prices;
  } catch { /* use empty prices */ }

  const ethBalance = await client.getBalance({ address: addr });
  const ethFormatted = parseFloat(formatEther(ethBalance));
  const ethPrice = prices["ethereum"]?.usd ?? 0;
  const ethUsd = ethFormatted * ethPrice;

  const holdings: Array<{
    symbol: string;
    name: string;
    address: string;
    logoUrl: string;
    balance: string;
    balanceFormatted: number;
    priceUsd: number;
    valueUsd: number;
    change24h: number | null;
    type: "native" | "erc20";
  }> = [];

  if (ethFormatted > 0 || true) {
    holdings.push({
      symbol: "ETH",
      name: "Ethereum",
      address: "native",
      logoUrl: "https://assets.coingecko.com/coins/images/279/small/ethereum.png",
      balance: ethBalance.toString(),
      balanceFormatted: ethFormatted,
      priceUsd: ethPrice,
      valueUsd: ethUsd,
      change24h: prices["ethereum"]?.usd_24h_change ?? null,
      type: "native",
    });
  }

  if (isMainnet) {
    const tokenBalances = await Promise.allSettled(
      ARBITRUM_TOKENS.map(async (token) => {
        const raw = await client.readContract({
          address: token.address,
          abi: erc20Abi,
          functionName: "balanceOf",
          args: [addr],
        });
        const formatted = parseFloat(formatUnits(raw, token.decimals));
        const price = prices[token.coingeckoId]?.usd ?? 0;
        const valueUsd = formatted * price;
        return { token, raw, formatted, price, valueUsd };
      })
    );

    for (const result of tokenBalances) {
      if (result.status === "fulfilled" && result.value.formatted > 0) {
        const { token, raw, formatted, price, valueUsd } = result.value;
        holdings.push({
          symbol: token.symbol,
          name: token.name,
          address: token.address,
          logoUrl: token.logoUrl,
          balance: raw.toString(),
          balanceFormatted: formatted,
          priceUsd: price,
          valueUsd,
          change24h: prices[token.coingeckoId]?.usd_24h_change ?? null,
          type: "erc20",
        });
      }
    }
  }

  holdings.sort((a, b) => b.valueUsd - a.valueUsd);

  const totalUsd = holdings.reduce((sum, h) => sum + h.valueUsd, 0);
  const nonZeroHoldings = holdings.filter((h) => h.balanceFormatted > 0);

  return {
    address,
    network: isMainnet ? "Arbitrum One" : "Arbitrum Sepolia",
    explorerUrl: `${explorer}/address/${address}`,
    totalValueUsd: totalUsd > 0 ? `$${totalUsd.toFixed(2)}` : "Unknown (no price data)",
    totalValueRaw: totalUsd,
    holdingsCount: nonZeroHoldings.length,
    holdings: nonZeroHoldings.map((h) => ({
      symbol: h.symbol,
      name: h.name,
      address: h.address,
      logoUrl: h.logoUrl,
      balance: h.balanceFormatted < 0.000001 ? h.balance : h.balanceFormatted.toFixed(6),
      priceUsd: h.priceUsd > 0 ? `$${h.priceUsd.toFixed(4)}` : "N/A",
      valueUsd: h.valueUsd > 0 ? `$${h.valueUsd.toFixed(2)}` : "< $0.01",
      change24h: h.change24h !== null ? `${h.change24h.toFixed(2)}%` : "N/A",
      portfolioPercent: totalUsd > 0 ? `${((h.valueUsd / totalUsd) * 100).toFixed(1)}%` : "N/A",
    })),
    fetchedAt: new Date().toISOString(),
  };
}

// ─── GMX V2 simulation constants ───────────────────────────────────────────

const GMX_OPEN_FEE_BPS = 5;          // 0.05% of position size
const GMX_MAINTENANCE_MARGIN_BPS = 100; // 1% maintenance margin (triggers liquidation)
const GMX_HOURLY_BORROW_RATE = 0.00005; // ~0.005%/hr estimate (varies with pool utilization)

const GMX_MARKETS: Record<string, { maxLeverage: number; coingeckoId: string }> = {
  ETH:  { maxLeverage: 100, coingeckoId: "ethereum" },
  WETH: { maxLeverage: 100, coingeckoId: "ethereum" },
  BTC:  { maxLeverage: 100, coingeckoId: "bitcoin"  },
  WBTC: { maxLeverage: 100, coingeckoId: "bitcoin"  },
  ARB:  { maxLeverage:  50, coingeckoId: "arbitrum" },
  LINK: { maxLeverage:  50, coingeckoId: "chainlink" },
};

// ─── Uniswap constants ──────────────────────────────────────────────────────

const UNISWAP_SWAP_ROUTER = "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45";

const STABLE_SYMBOLS = new Set(["USDC", "USDT", "DAI"]);

// Rough on-chain liquidity depth estimates (USD) per token for price-impact math
const LIQUIDITY_DEPTH: Record<string, number> = {
  ETH:   5_000_000, WETH:  5_000_000,
  USDC: 10_000_000, USDT: 10_000_000, DAI: 5_000_000,
  ARB:   2_000_000, WBTC:  3_000_000,
  GMX:     500_000, LINK:    500_000, PENDLE: 200_000, RDNT: 200_000,
};

// ─── simulate_gmx_open ──────────────────────────────────────────────────────

export async function simulateGmxOpen({
  indexToken,
  collateralUsd,
  leverage,
  direction,
}: {
  indexToken: string;
  collateralUsd: number;
  leverage: number;
  direction: "long" | "short";
}) {
  const sym = indexToken.toUpperCase().replace("WRAPPED ETHER", "ETH").replace("WRAPPED BITCOIN", "BTC");
  const market = GMX_MARKETS[sym];

  if (!market) {
    throw new Error(
      `Unsupported index token "${indexToken}". Supported: ${Object.keys(GMX_MARKETS).join(", ")}`
    );
  }
  if (typeof collateralUsd !== "number" || collateralUsd < 10) {
    throw new Error("Minimum collateral is $10 USD");
  }
  if (collateralUsd > 10_000_000) {
    throw new Error("Collateral exceeds maximum of $10M for simulation");
  }
  if (typeof leverage !== "number" || leverage < 1.1 || leverage > market.maxLeverage) {
    throw new Error(`Leverage must be between 1.1x and ${market.maxLeverage}x for ${sym}`);
  }
  const dir = direction?.toLowerCase();
  if (dir !== "long" && dir !== "short") {
    throw new Error('direction must be "long" or "short"');
  }

  // Fetch live price
  let entryPrice = 0;
  try {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${market.coingeckoId}&vs_currencies=usd`,
      { signal: AbortSignal.timeout(7000) }
    );
    if (res.ok) {
      const data = (await res.json()) as Record<string, { usd: number }>;
      entryPrice = data[market.coingeckoId]?.usd ?? 0;
    }
  } catch { /* price stays 0 */ }

  if (entryPrice <= 0) {
    throw new Error(`Unable to fetch live ${sym} price — try again in a moment`);
  }

  const positionSize  = collateralUsd * leverage;
  const openFee       = positionSize * (GMX_OPEN_FEE_BPS / 10_000);
  const maintenanceUsd = positionSize * (GMX_MAINTENANCE_MARGIN_BPS / 10_000);
  const netCollateral = collateralUsd - openFee;
  const collateralRatio = Math.max(0, (netCollateral - maintenanceUsd) / positionSize);

  const liqPrice =
    dir === "long"
      ? entryPrice * (1 - collateralRatio)
      : entryPrice * (1 + collateralRatio);

  const pctToLiq =
    dir === "long"
      ? ((entryPrice - liqPrice) / entryPrice) * 100
      : ((liqPrice - entryPrice) / entryPrice) * 100;

  const pnlScenarios = [-20, -10, -5, +5, +10, +20].map((pct) => {
    const newPrice    = entryPrice * (1 + pct / 100);
    const priceRatio  = dir === "long" ? (newPrice - entryPrice) / entryPrice : (entryPrice - newPrice) / entryPrice;
    const pnlUsd      = positionSize * priceRatio;
    const roiPct      = (pnlUsd / collateralUsd) * 100;
    const isLiquidated =
      dir === "long" ? newPrice <= liqPrice : newPrice >= liqPrice;
    return {
      priceChange: `${pct > 0 ? "+" : ""}${pct}%`,
      price:       `$${newPrice.toLocaleString("en-US", { maximumFractionDigits: 2 })}`,
      pnl:         isLiquidated ? "LIQUIDATED" : `${pnlUsd >= 0 ? "+" : ""}$${pnlUsd.toFixed(2)}`,
      roi:         isLiquidated ? "−100%" : `${roiPct >= 0 ? "+" : ""}${roiPct.toFixed(1)}%`,
      liquidated:  isLiquidated,
    };
  });

  const risks: string[] = [];
  if (leverage > 50) risks.push(`⚠️ EXTREME RISK: ${leverage}x leverage — ${(100 / leverage).toFixed(1)}% adverse move = liquidation`);
  else if (leverage > 20) risks.push(`⚠️ HIGH RISK: ${leverage}x leverage — amplified losses on adverse moves`);
  if (pctToLiq < 5)  risks.push(`🚨 CRITICAL: only ${pctToLiq.toFixed(1)}% price move until liquidation`);
  if (pctToLiq < 10) risks.push(`⚡ Liquidation distance is tight — monitor position closely`);

  return {
    simulation: true,
    disclaimer: "SIMULATION ONLY — no transaction submitted. Figures use live CoinGecko prices and GMX V2 fee schedule.",
    market:          `${sym}/USD`,
    direction:       dir.toUpperCase(),
    entryPrice:      `$${entryPrice.toLocaleString("en-US", { maximumFractionDigits: 2 })}`,
    collateralInput: `$${collateralUsd.toFixed(2)} USDC`,
    leverage:        `${leverage}x`,
    positionSize:    `$${positionSize.toLocaleString("en-US", { maximumFractionDigits: 2 })}`,
    openingFee:      `$${openFee.toFixed(4)} (0.05% of size)`,
    netCollateral:   `$${netCollateral.toFixed(2)}`,
    liquidationPrice:`$${liqPrice.toLocaleString("en-US", { maximumFractionDigits: 2 })}`,
    distanceToLiq:   `${pctToLiq.toFixed(2)}% price move`,
    estimatedHourlyBorrowFee: `$${(positionSize * GMX_HOURLY_BORROW_RATE).toFixed(4)}/hr`,
    pnlScenarios,
    riskWarnings: risks,
    nextSteps: {
      step1: `Approve USDC on GMX V2 PositionRouter (${Math.ceil(collateralUsd)} USDC)`,
      step2: `Call PositionRouter.createIncreasePosition() with the parameters above`,
      step3: "Your agent or wallet must sign and broadcast the transaction",
      gmxApp: `https://app.gmx.io/#/trade/?market=${sym}&direction=${dir}`,
    },
    fetchedAt: new Date().toISOString(),
  };
}

// ─── prepare_uniswap_swap ──────────────────────────────────────────────────

export async function prepareUniswapSwap({
  tokenIn,
  tokenOut,
  amountIn,
  slippageTolerance = 0.5,
}: {
  tokenIn: string;
  tokenOut: string;
  amountIn: number;
  slippageTolerance?: number;
}) {
  if (typeof amountIn !== "number" || amountIn <= 0) throw new Error("amountIn must be a positive number");
  if (amountIn > 1_000_000_000) throw new Error("amountIn is unreasonably large");
  if (typeof slippageTolerance !== "number" || slippageTolerance < 0.01 || slippageTolerance > 50) {
    throw new Error("slippageTolerance must be between 0.01% and 50%");
  }

  const symIn  = tokenIn?.toUpperCase();
  const symOut = tokenOut?.toUpperCase();
  if (!symIn)  throw new Error("tokenIn is required");
  if (!symOut) throw new Error("tokenOut is required");
  if (symIn === symOut) throw new Error("tokenIn and tokenOut must be different");

  const ETH_ENTRY = {
    symbol: "ETH", address: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1" as Address,
    decimals: 18, coingeckoId: "ethereum", name: "Ethereum",
  };

  const resolveToken = (sym: string) =>
    sym === "ETH" ? ETH_ENTRY : ARBITRUM_TOKENS.find((t) => t.symbol === sym);

  const inToken  = resolveToken(symIn);
  const outToken = resolveToken(symOut);

  if (!inToken)  throw new Error(`Unknown token "${symIn}". Supported: ETH, ${ARBITRUM_TOKENS.map((t) => t.symbol).join(", ")}`);
  if (!outToken) throw new Error(`Unknown token "${symOut}". Supported: ETH, ${ARBITRUM_TOKENS.map((t) => t.symbol).join(", ")}`);

  // Fetch prices
  const cgIds = [...new Set([inToken.coingeckoId, outToken.coingeckoId])].join(",");
  let prices: Record<string, { usd: number; usd_24h_change?: number }> = {};
  try {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${cgIds}&vs_currencies=usd&include_24hr_change=true`,
      { signal: AbortSignal.timeout(7000) }
    );
    if (res.ok) prices = (await res.json()) as typeof prices;
  } catch { /* keep empty */ }

  const priceIn  = prices[inToken.coingeckoId]?.usd ?? 0;
  const priceOut = prices[outToken.coingeckoId]?.usd ?? 0;

  if (priceIn === 0)  throw new Error(`Unable to fetch live price for ${symIn} — try again in a moment`);
  if (priceOut === 0) throw new Error(`Unable to fetch live price for ${symOut} — try again in a moment`);

  const inputValueUsd = amountIn * priceIn;
  const isStablePair  = STABLE_SYMBOLS.has(symIn) && STABLE_SYMBOLS.has(symOut);
  const poolFeeDecimal = isStablePair ? 0.0001 : 0.003;  // 0.01% or 0.3%
  const poolFeeBps     = isStablePair ? 100    : 3000;

  const grossOutput = inputValueUsd / priceOut;
  const afterFee    = grossOutput * (1 - poolFeeDecimal);

  const depth       = LIQUIDITY_DEPTH[symIn] ?? 100_000;
  const priceImpact = Math.min((inputValueUsd / depth) * 100, 50); // cap at 50%
  const afterImpact = afterFee * (1 - priceImpact / 100);
  const minOut      = afterImpact * (1 - slippageTolerance / 100);

  const amountInRaw  = BigInt(Math.round(amountIn  * 10 ** inToken.decimals));
  const minOutRaw    = BigInt(Math.round(minOut     * 10 ** outToken.decimals));

  const warnings: string[] = [];
  if (priceImpact > 5)  warnings.push(`⚠️ HIGH PRICE IMPACT (${priceImpact.toFixed(2)}%) — consider splitting into smaller trades`);
  if (priceImpact > 15) warnings.push(`🚨 VERY HIGH IMPACT — this trade size will significantly move the price`);
  if (inputValueUsd < 1) warnings.push("⚠️ Very small trade — gas cost (~$0.001) may exceed swap value");

  return {
    simulation: true,
    disclaimer: "QUOTE ONLY — no transaction submitted. Figures are price-based estimates using live CoinGecko data.",
    swap: {
      tokenIn:  { symbol: symIn,  address: inToken.address,  decimals: inToken.decimals  },
      tokenOut: { symbol: symOut, address: outToken.address, decimals: outToken.decimals },
      amountIn:                `${amountIn} ${symIn}`,
      amountInValueUsd:        `$${inputValueUsd.toFixed(4)}`,
      estimatedAmountOut:      `${afterImpact.toFixed(6)} ${symOut}`,
      estimatedAmountOutUsd:   `$${(afterImpact * priceOut).toFixed(4)}`,
      minimumAmountOut:        `${minOut.toFixed(6)} ${symOut}`,
      exchangeRate:            `1 ${symIn} = ${(priceIn / priceOut).toFixed(6)} ${symOut}`,
    },
    fees: {
      poolFee:             `${poolFeeDecimal * 100}% (${poolFeeBps} bps, ${isStablePair ? "stable pool" : "standard pool"})`,
      estimatedPriceImpact:`${priceImpact < 0.01 ? "<0.01" : priceImpact.toFixed(3)}%`,
      estimatedGas:        "~130,000 gas (~$0.001 on Arbitrum)",
    },
    execution: {
      router:   UNISWAP_SWAP_ROUTER,
      method:   "exactInputSingle",
      params: {
        tokenIn:           inToken.address,
        tokenOut:          outToken.address,
        fee:               poolFeeBps,
        recipient:         "<YOUR_WALLET_ADDRESS>",
        amountIn:          amountInRaw.toString(),
        amountOutMinimum:  minOutRaw.toString(),
        sqrtPriceLimitX96: "0",
      },
      requiresApproval: symIn !== "ETH",
      approvalTarget:   UNISWAP_SWAP_ROUTER,
      approvalAmount:   amountInRaw.toString(),
      uniswapApp: `https://app.uniswap.org/#/swap?inputCurrency=${inToken.address}&outputCurrency=${outToken.address}&exactAmount=${amountIn}&exactField=input&chain=arbitrum`,
    },
    priceWarnings: warnings,
    fetchedAt: new Date().toISOString(),
  };
}

// GMX V2 market address → token symbol (Arbitrum mainnet)
const GMX_MARKET_TOKENS: Record<string, string> = {
  "0x70d95587d40A2caf56bd97485aB3Eec10Bee6336": "ETH",
  "0x7f1fa204bb700853D36994DA19F830b6Ad18455C": "ETH",
  "0x47c031236e19d024b42f8AE6780E44A573170703": "BTC",
  "0x47E14b6f2e8A6e68aec6dCF46Da452dbf2b2ef56": "BTC",
  "0xC25cEf6061Cf5dE5eb761b50E4743c1F5D7E5407": "ARB",
  "0x0CCB4fAa6f1F1B0f5487E3c9ec307F4E71d0EC4a": "ARB",
  "0xD9535bB5f58A1a75032416F2dFe7880C30575a41": "LINK",
};

// ─── get_gmx_position_health ──────────────────────────────────────────────

export async function fetchGmxPositionHealth(address: string) {
  if (!isAddress(address)) throw new Error("Invalid Ethereum address");

  const addrLower = address.toLowerCase();

  // Fetch current prices for context
  let currentPrices: Record<string, number> = {};
  try {
    const res = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=ethereum,bitcoin,arbitrum,chainlink&vs_currencies=usd",
      { signal: AbortSignal.timeout(7000) }
    );
    if (res.ok) {
      const data = (await res.json()) as Record<string, { usd: number }>;
      currentPrices = {
        ETH:  data.ethereum?.usd  ?? 0,
        BTC:  data.bitcoin?.usd   ?? 0,
        ARB:  data.arbitrum?.usd  ?? 0,
        LINK: data.chainlink?.usd ?? 0,
      };
    }
  } catch { /* prices stay empty */ }

  // Fetch positions from GMX API — returns global list, filter by account client-side
  let allPositions: unknown[] = [];
  let dataSource = "gmx-api";

  try {
    const res = await fetch(
      `https://arbitrum-api.gmxinfra.io/positions?account=${address}`,
      { signal: AbortSignal.timeout(10000), headers: { Accept: "application/json" } }
    );
    if (res.ok) {
      const data = (await res.json()) as unknown;
      const arr = Array.isArray(data) ? data : ((data as { positions?: unknown[] }).positions ?? []);
      // Filter to only this address (API may return all positions)
      allPositions = arr.filter((p: unknown) => {
        const pos = p as Record<string, unknown>;
        return (pos["account"] as string)?.toLowerCase() === addrLower;
      });
    } else {
      dataSource = "unavailable";
    }
  } catch {
    dataSource = "unavailable";
  }

  const priceDisplay = Object.entries(currentPrices)
    .filter(([, v]) => v > 0)
    .map(([sym, price]) => ({ symbol: sym, price: `$${price.toLocaleString()}` }));

  if (allPositions.length === 0) {
    return {
      address,
      network: "Arbitrum One",
      openPositions: 0,
      positions: [],
      currentPrices: priceDisplay,
      note:
        dataSource === "unavailable"
          ? "GMX position data temporarily unavailable. Check https://app.gmx.io/#/accounts/" + address
          : `No open GMX V2 positions found for ${address}. The wallet may have no active perpetual trades.`,
      gmxApp: `https://app.gmx.io/#/accounts/${address}`,
      arbiscan: `https://arbiscan.io/address/${address}`,
      fetchedAt: new Date().toISOString(),
    };
  }

  // Normalize positions using actual GMX V2 API schema
  const positions = allPositions.map((p: unknown) => {
    const pos = p as Record<string, unknown>;
    const isLong = Boolean(pos["isLong"]);

    // sizeInUsd and pnl are in 1e30 precision (GMX V2 standard)
    const sizeRaw = BigInt(String(pos["sizeInUsd"] ?? "0"));
    const pnlRaw  = BigInt(String(pos["pnl"] ?? "0"));
    const PRECISION = BigInt("1000000000000000000000000000000"); // 1e30
    const sizeUsd = Number(sizeRaw) / 1e30;
    const pnlUsd  = Number(pnlRaw) / 1e30;

    const marketAddr = ((pos["marketAddress"] as string) ?? "").toLowerCase();
    const indexSym = Object.entries(GMX_MARKET_TOKENS).find(
      ([k]) => k.toLowerCase() === marketAddr
    )?.[1] ?? "UNKNOWN";

    const livePrice = currentPrices[indexSym] ?? 0;

    // Approximate collateral from pnl + size (GMX doesn't expose collateral directly in list view)
    const approxCollateral = sizeUsd > 0 ? sizeUsd / 10 : 0; // rough 10x default estimate
    const maintenanceUsd = sizeUsd * (GMX_MAINTENANCE_MARGIN_BPS / 10_000);
    const collatForHealth = approxCollateral - maintenanceUsd;

    // Estimate liq price directionally
    const liqEstimate = sizeUsd > 0 && livePrice > 0
      ? isLong
        ? livePrice * (1 - collatForHealth / sizeUsd)
        : livePrice * (1 + collatForHealth / sizeUsd)
      : null;

    const healthStatus =
      liqEstimate && livePrice > 0
        ? isLong
          ? livePrice < liqEstimate * 1.05 ? "🚨 CRITICAL"
          : livePrice < liqEstimate * 1.15  ? "⚠️ AT RISK"
          : "✅ HEALTHY"
        : livePrice > liqEstimate * 0.95    ? "🚨 CRITICAL"
          : livePrice > liqEstimate * 0.85  ? "⚠️ AT RISK"
          : "✅ HEALTHY"
        : "ACTIVE";

    return {
      market:           indexSym !== "UNKNOWN" ? `${indexSym}/USD` : `${marketAddr.slice(0, 8)}…/USD`,
      direction:        isLong ? "LONG" : "SHORT",
      sizeUsd:          sizeUsd  > 0 ? `$${sizeUsd.toLocaleString("en-US", { maximumFractionDigits: 2 })}` : "N/A",
      unrealizedPnl:    `${pnlUsd >= 0 ? "+" : ""}$${pnlUsd.toFixed(2)}`,
      currentPrice:     livePrice > 0 ? `$${livePrice.toLocaleString()}` : "N/A",
      liquidationEst:   liqEstimate ? `~$${liqEstimate.toLocaleString("en-US", { maximumFractionDigits: 2 })} (est.)` : "N/A",
      healthStatus,
      positionKey:      pos["key"] as string,
      collateralToken:  pos["collateralToken"] as string,
    };
  });

  return {
    address,
    network: "Arbitrum One",
    openPositions: positions.length,
    positions,
    currentPrices: priceDisplay,
    note: "Liquidation prices are estimates based on ~10x leverage assumption. Use the GMX app for exact figures.",
    gmxApp:    `https://app.gmx.io/#/accounts/${address}`,
    arbiscan:  `https://arbiscan.io/address/${address}`,
    fetchedAt: new Date().toISOString(),
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

// ─── Aave V3 ──────────────────────────────────────────────────────────────────

const AAVE_V3_POOL = "0x794a61358D6845594F94dc1DB02A252b5b4814aD" as const;

const AAVE_POOL_ABI = [
  {
    name: "getUserAccountData",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "user", type: "address" }],
    outputs: [
      { name: "totalCollateralBase", type: "uint256" },
      { name: "totalDebtBase", type: "uint256" },
      { name: "availableBorrowsBase", type: "uint256" },
      { name: "currentLiquidationThreshold", type: "uint256" },
      { name: "ltv", type: "uint256" },
      { name: "healthFactor", type: "uint256" },
    ],
  },
] as const;

export async function fetchAavePositions(address: string) {
  if (!isAddress(address)) throw new Error("Invalid Ethereum address");

  const client = getPublicClient("mainnet");

  let accountData: readonly [bigint, bigint, bigint, bigint, bigint, bigint];
  try {
    accountData = await client.readContract({
      address: AAVE_V3_POOL as Address,
      abi: AAVE_POOL_ABI,
      functionName: "getUserAccountData",
      args: [address as Address],
    });
  } catch (e) {
    throw new Error("Failed to read Aave V3 Pool: " + String(e));
  }

  const [totalCollateralBase, totalDebtBase, availableBorrowsBase, currentLiquidationThreshold, ltv, healthFactor] = accountData;

  const totalCollateralUsd = Number(totalCollateralBase) / 1e8;
  const totalDebtUsd       = Number(totalDebtBase)       / 1e8;
  const availableBorrows   = Number(availableBorrowsBase) / 1e8;
  const liqThresholdPct    = Number(currentLiquidationThreshold) / 100;
  const ltvPct             = Number(ltv) / 100;
  const hf                 = Number(healthFactor) / 1e18;

  if (totalCollateralUsd === 0 && totalDebtUsd === 0) {
    return {
      address,
      network: "Arbitrum One — Aave V3",
      hasPositions: false,
      note: `No active Aave V3 positions for ${address}.`,
      aaveApp: `https://app.aave.com/?marketName=proto_arbitrum_v3`,
      fetchedAt: new Date().toISOString(),
    };
  }

  const healthStatus =
    totalDebtUsd === 0             ? "✅ NO DEBT"        :
    hf < 1.0                       ? "🚨 LIQUIDATABLE"   :
    hf < 1.05                      ? "🚨 CRITICAL"       :
    hf < 1.15                      ? "⚠️ AT RISK"        :
    hf < 1.5                       ? "⚡ MONITOR"        :
                                     "✅ HEALTHY";

  const fmt = (v: number) => `$${v.toLocaleString("en-US", { maximumFractionDigits: 2 })}`;

  return {
    address,
    network: "Arbitrum One — Aave V3",
    hasPositions: true,
    summary: {
      healthFactor:            totalDebtUsd > 0 ? hf.toFixed(4) : "∞",
      healthStatus,
      totalCollateral:         fmt(totalCollateralUsd),
      totalDebt:               fmt(totalDebtUsd),
      netPosition:             fmt(totalCollateralUsd - totalDebtUsd),
      availableToBorrow:       fmt(availableBorrows),
      loanToValue:             `${ltvPct.toFixed(1)}%`,
      liquidationThreshold:    `${liqThresholdPct.toFixed(1)}%`,
    },
    note: totalDebtUsd > 0
      ? hf < 1.15
        ? "⚠️ Health factor is low — consider adding collateral or repaying debt."
        : "Health factor looks safe. Monitor if markets move significantly."
      : "Supply-only position — no liquidation risk.",
    aaveApp:  `https://app.aave.com/?marketName=proto_arbitrum_v3`,
    arbiscan: `https://arbiscan.io/address/${address}`,
    fetchedAt: new Date().toISOString(),
  };
}

// ─── Uniswap V3 LP ────────────────────────────────────────────────────────────

const NONFUNGIBLE_POSITION_MANAGER = "0xC36442b4a4522E871399CD717aBDD847Ab11FE88" as const;
const UNISWAP_V3_FACTORY           = "0x1F98431c8aD98523631AE4a59f267346ea31F984" as const;

const POSITION_MANAGER_ABI = [
  { name: "balanceOf", type: "function", stateMutability: "view",
    inputs: [{ name: "owner", type: "address" }],
    outputs: [{ type: "uint256" }] },
  { name: "tokenOfOwnerByIndex", type: "function", stateMutability: "view",
    inputs: [{ name: "owner", type: "address" }, { name: "index", type: "uint256" }],
    outputs: [{ type: "uint256" }] },
  { name: "positions", type: "function", stateMutability: "view",
    inputs: [{ name: "tokenId", type: "uint256" }],
    outputs: [
      { name: "nonce",                       type: "uint96"   },
      { name: "operator",                    type: "address"  },
      { name: "token0",                      type: "address"  },
      { name: "token1",                      type: "address"  },
      { name: "fee",                         type: "uint24"   },
      { name: "tickLower",                   type: "int24"    },
      { name: "tickUpper",                   type: "int24"    },
      { name: "liquidity",                   type: "uint128"  },
      { name: "feeGrowthInside0LastX128",    type: "uint256"  },
      { name: "feeGrowthInside1LastX128",    type: "uint256"  },
      { name: "tokensOwed0",                 type: "uint128"  },
      { name: "tokensOwed1",                 type: "uint128"  },
    ] },
] as const;

const FACTORY_ABI_LP = [
  { name: "getPool", type: "function", stateMutability: "view",
    inputs: [{ name: "tokenA", type: "address" }, { name: "tokenB", type: "address" }, { name: "fee", type: "uint24" }],
    outputs: [{ type: "address" }] },
] as const;

const POOL_SLOT0_ABI_LP = [
  { name: "slot0", type: "function", stateMutability: "view", inputs: [],
    outputs: [
      { name: "sqrtPriceX96",               type: "uint160" },
      { name: "tick",                        type: "int24"   },
      { name: "observationIndex",            type: "uint16"  },
      { name: "observationCardinality",      type: "uint16"  },
      { name: "observationCardinalityNext",  type: "uint16"  },
      { name: "feeProtocol",                 type: "uint8"   },
      { name: "unlocked",                    type: "bool"    },
    ] },
] as const;

const KNOWN_TOKENS: Record<string, { symbol: string; decimals: number }> = {
  "0x82af49447d8a07e3bd95bd0d56f35241523fbab1": { symbol: "WETH",   decimals: 18 },
  "0xff970a61a04b1ca14834a43f5de4533ebddb5cc8": { symbol: "USDC.e", decimals: 6  },
  "0xaf88d065e77c8cc2239327c5edb3a432268e5831": { symbol: "USDC",   decimals: 6  },
  "0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9": { symbol: "USDT",   decimals: 6  },
  "0x2f2a2543b76a4166549f7aab2e75bef0aefc5b0f": { symbol: "WBTC",   decimals: 8  },
  "0x912ce59144191c1204e64559fe8253a0e49e6548": { symbol: "ARB",    decimals: 18 },
  "0xfc5a1a6eb076a2c7ad06ed22c90d7e710e35ad0a": { symbol: "GMX",    decimals: 18 },
  "0xf97f4df75117a78c1a5a0dbb814af92458539fb4": { symbol: "LINK",   decimals: 18 },
  "0xda10009cbd5d07dd0cecc66161fc93d7c9000da1": { symbol: "DAI",    decimals: 18 },
  "0x0c4681e6c0235179ec3d4f4fc4df3d14fdd96017": { symbol: "RDNT",   decimals: 18 },
  "0x0d2425d39af5c4b8285ed0ad26fb8acf762d6e60": { symbol: "PENDLE", decimals: 18 },
};

function resolveToken(addr: string) {
  return KNOWN_TOKENS[addr.toLowerCase()] ?? { symbol: addr.slice(0, 6) + "…", decimals: 18 };
}

export async function fetchUniswapLpPositions(address: string) {
  if (!isAddress(address)) throw new Error("Invalid Ethereum address");

  const client = getPublicClient("mainnet");
  const addr = address as Address;

  let balance: bigint;
  try {
    balance = await client.readContract({
      address: NONFUNGIBLE_POSITION_MANAGER as Address,
      abi: POSITION_MANAGER_ABI,
      functionName: "balanceOf",
      args: [addr],
    });
  } catch {
    throw new Error("Failed to connect to Uniswap V3 Position Manager");
  }

  if (balance === 0n) {
    return {
      address,
      network: "Arbitrum One — Uniswap V3",
      openPositions: 0,
      totalPositions: 0,
      positions: [],
      note: `No Uniswap V3 LP positions found for ${address}.`,
      uniswapApp: `https://app.uniswap.org/positions?chain=arbitrum`,
      fetchedAt: new Date().toISOString(),
    };
  }

  const MAX = 12;
  const count = Math.min(Number(balance), MAX);

  // Fetch all token IDs in parallel
  const tokenIds = (await Promise.all(
    Array.from({ length: count }, (_, i) =>
      client.readContract({
        address: NONFUNGIBLE_POSITION_MANAGER as Address,
        abi: POSITION_MANAGER_ABI,
        functionName: "tokenOfOwnerByIndex",
        args: [addr, BigInt(i)],
      }).catch(() => null)
    )
  )).filter((id): id is bigint => id !== null);

  // Fetch all position data in parallel
  type RawPos = readonly [bigint, string, string, string, number, number, number, bigint, bigint, bigint, bigint, bigint];
  const rawPositions = (await Promise.all(
    tokenIds.map(tokenId =>
      client.readContract({
        address: NONFUNGIBLE_POSITION_MANAGER as Address,
        abi: POSITION_MANAGER_ABI,
        functionName: "positions",
        args: [tokenId],
      }).then(pos => ({ tokenId, pos: pos as RawPos })).catch(() => null)
    )
  )).filter(Boolean) as { tokenId: bigint; pos: RawPos }[];

  // Get unique pool keys and fetch pool addresses in parallel
  const uniqueKeys = [...new Set(rawPositions.map(({ pos }) => `${pos[2]}|${pos[3]}|${pos[4]}`))];
  const poolAddressMap = new Map<string, Address>();
  await Promise.all(
    uniqueKeys.map(async (key) => {
      const [t0, t1, fee] = key.split("|") as [string, string, string];
      const pool = await client.readContract({
        address: UNISWAP_V3_FACTORY as Address,
        abi: FACTORY_ABI_LP,
        functionName: "getPool",
        args: [t0 as Address, t1 as Address, Number(fee) as 100 | 500 | 3000 | 10000],
      }).catch(() => null);
      if (pool && pool !== "0x0000000000000000000000000000000000000000") {
        poolAddressMap.set(key, pool as Address);
      }
    })
  );

  // Fetch current ticks for all pools in parallel
  const currentTickMap = new Map<string, number>();
  await Promise.all(
    [...poolAddressMap.entries()].map(async ([key, poolAddr]) => {
      const slot0 = await client.readContract({
        address: poolAddr,
        abi: POOL_SLOT0_ABI_LP,
        functionName: "slot0",
      }).catch(() => null);
      if (slot0) currentTickMap.set(key, slot0[1]);
    })
  );

  // Build result objects
  const positions = rawPositions.map(({ tokenId, pos }) => {
    const [, , token0Addr, token1Addr, fee, tickLower, tickUpper, liquidity, , , tokensOwed0, tokensOwed1] = pos;
    const t0 = resolveToken(token0Addr);
    const t1 = resolveToken(token1Addr);
    const poolKey = `${token0Addr}|${token1Addr}|${fee}`;
    const tick = currentTickMap.get(poolKey);
    const inRange = tick !== undefined
      ? tick >= tickLower && tick <= tickUpper
      : null;

    const fee0 = Number(tokensOwed0) / 10 ** t0.decimals;
    const fee1 = Number(tokensOwed1) / 10 ** t1.decimals;

    return {
      tokenId:         tokenId.toString(),
      pair:            `${t0.symbol}/${t1.symbol}`,
      feeTier:         `${fee / 10000}%`,
      status:          liquidity > 0n
                         ? inRange === null  ? "ACTIVE (range unknown)"
                         : inRange           ? "✅ IN RANGE"
                                             : "⛔ OUT OF RANGE"
                         : "CLOSED (no liquidity)",
      tickRange:       `${tickLower} → ${tickUpper}`,
      uncollectedFees: {
        [t0.symbol]: fee0.toFixed(6),
        [t1.symbol]: fee1.toFixed(6),
      },
      positionUrl:     `https://app.uniswap.org/positions/v3/arbitrum/${tokenId}`,
    };
  });

  const inRangeCount = positions.filter(p => p.status.includes("IN RANGE")).length;

  return {
    address,
    network: "Arbitrum One — Uniswap V3",
    openPositions: positions.filter(p => !p.status.startsWith("CLOSED")).length,
    inRangePositions: inRangeCount,
    totalNfts: Number(balance),
    positions,
    note: Number(balance) > MAX ? `Showing first ${MAX} of ${balance} positions.` : undefined,
    uniswapApp:  `https://app.uniswap.org/positions?chain=arbitrum`,
    arbiscan:    `https://arbiscan.io/address/${address}`,
    fetchedAt:   new Date().toISOString(),
  };
}
