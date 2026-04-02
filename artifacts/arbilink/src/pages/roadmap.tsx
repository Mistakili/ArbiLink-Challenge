import { CheckCircle2, Circle, Clock, Rocket, Zap, Lock, Globe, BarChart3, Bot, Layers } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type Status = "shipped" | "building" | "planned" | "future";

interface RoadmapItem {
  title: string;
  description: string;
  status: Status;
  tag?: string;
}

interface Phase {
  version: string;
  label: string;
  status: Status;
  icon: React.ElementType;
  items: RoadmapItem[];
}

const PHASES: Phase[] = [
  {
    version: "v1.0",
    label: "Shipped",
    status: "shipped",
    icon: CheckCircle2,
    items: [
      {
        title: "Native MCP JSON-RPC 2.0",
        description: "Full implementation of the Anthropic MCP protocol spec (2024-11-05). Any MCP client connects with a single URL.",
        status: "shipped",
        tag: "core",
      },
      {
        title: "Wallet Portfolio Tool",
        description: "Complete portfolio breakdown for any address — total USD value, 10 tokens tracked, live prices, 24h change, and % allocation per holding.",
        status: "shipped",
        tag: "flagship",
      },
      {
        title: "On-Chain Agent Registry",
        description: "Deployed AgentRegistry.sol on Arbitrum Sepolia. AI agents can register a verifiable on-chain identity with name and metadata.",
        status: "shipped",
        tag: "unique",
      },
      {
        title: "OpenAI Function-Calling Compat",
        description: "Same tools exposed in OpenAI schema format — works with LangChain, AutoGen, GPT, and every OpenAI-compatible agent framework.",
        status: "shipped",
      },
      {
        title: "Live Block Explorer",
        description: "Search any Arbitrum address or transaction hash. Address lookup triggers a full portfolio load. Tx lookup shows complete receipt data.",
        status: "shipped",
      },
      {
        title: "8 MCP Tools",
        description: "Network status, wallet balance, portfolio, transactions, token prices, DeFi protocols, agent identity, overview stats.",
        status: "shipped",
      },
      {
        title: "Real-Time Dashboard",
        description: "Live block ticker, gas price, tool activity log, token price feed, and system health — all updating in real time.",
        status: "shipped",
      },
    ],
  },
  {
    version: "v1.1",
    label: "Building",
    status: "building",
    icon: Clock,
    items: [
      {
        title: "API Key Auth & Rate Limiting",
        description: "Free tier (100 calls/day), Developer ($29/mo), Builder ($149/mo). Stripe integration. Keys issued instantly on signup.",
        status: "building",
        tag: "revenue",
      },
      {
        title: "Aave V3 Position Checker",
        description: "Query health factor, collateral, debt, and liquidation risk for any address on Aave V3 Arbitrum. Ask Claude if a position is at risk.",
        status: "building",
        tag: "defi",
      },
      {
        title: "GMX Perpetual Positions",
        description: "Fetch open perp positions, PnL, leverage, and liquidation price for any GMX trader on Arbitrum.",
        status: "building",
        tag: "defi",
      },
      {
        title: "Uniswap V3 LP Positions",
        description: "Show liquidity positions, uncollected fees, price range, and in/out-of-range status for any Uniswap V3 LP.",
        status: "building",
        tag: "defi",
      },
    ],
  },
  {
    version: "v2.0",
    label: "Planned",
    status: "planned",
    icon: Rocket,
    items: [
      {
        title: "Multi-Chain Support",
        description: "Expand beyond Arbitrum to Base, Optimism, Polygon, and Ethereum mainnet. One MCP server, every major chain.",
        status: "planned",
        tag: "growth",
      },
      {
        title: "Wallet Watch Mode",
        description: "Agents can subscribe to wallet activity. Get notified inside Claude when a tracked address moves funds or changes positions.",
        status: "planned",
      },
      {
        title: "WebSocket RPC Subscriptions",
        description: "Replace polling with real-time push from Arbitrum nodes. Sub-second latency for block and event data.",
        status: "planned",
      },
      {
        title: "DeFi Aggregate Portfolio",
        description: "One tool that shows all DeFi positions — Aave, GMX, Uniswap LP, Pendle — alongside spot holdings in a single call.",
        status: "planned",
        tag: "flagship",
      },
      {
        title: "Chainlink Price Oracles",
        description: "Augment CoinGecko prices with on-chain Chainlink oracle data for higher accuracy and decentralized sourcing.",
        status: "planned",
      },
    ],
  },
  {
    version: "v3.0",
    label: "Future",
    status: "future",
    icon: Layers,
    items: [
      {
        title: "Transaction Submission",
        description: "Write capability — agents can submit signed transactions with user confirmation flows. Full MCP security sandbox.",
        status: "future",
        tag: "write",
      },
      {
        title: "Agent-to-Agent Protocol",
        description: "Agents discover and delegate to other registered agents through the on-chain registry. Composable autonomous operations.",
        status: "future",
        tag: "primitives",
      },
      {
        title: "Protocol Partnerships",
        description: "Deep tool integrations co-built with Uniswap, Aave, GMX — with revenue share on agent activity routed through their protocols.",
        status: "future",
        tag: "revenue",
      },
      {
        title: "White-Label SDK",
        description: "Other L2s and protocols embed ArbiLink's MCP infrastructure as their own AI gateway. License or revenue-share model.",
        status: "future",
      },
    ],
  },
];

const STATUS_CONFIG: Record<Status, { label: string; color: string; dot: string }> = {
  shipped: { label: "Shipped", color: "text-green-400 border-green-500/40", dot: "bg-green-400" },
  building: { label: "Building", color: "text-yellow-400 border-yellow-500/40", dot: "bg-yellow-400" },
  planned: { label: "Planned", color: "text-blue-400 border-blue-500/40", dot: "bg-blue-400" },
  future: { label: "Future", color: "text-muted-foreground border-border/50", dot: "bg-muted-foreground" },
};

const TAG_COLORS: Record<string, string> = {
  core: "border-primary/40 text-primary",
  flagship: "border-cyan-500/40 text-cyan-400",
  unique: "border-violet-500/40 text-violet-400",
  revenue: "border-green-500/40 text-green-400",
  defi: "border-orange-500/40 text-orange-400",
  growth: "border-blue-500/40 text-blue-400",
  write: "border-red-500/40 text-red-400",
  primitives: "border-pink-500/40 text-pink-400",
};

export default function Roadmap() {
  return (
    <div className="container max-w-screen-xl px-4 sm:px-8 py-12 space-y-16 animate-in fade-in duration-500">

      <div className="max-w-2xl space-y-3">
        <p className="text-xs font-mono text-primary uppercase tracking-widest">Roadmap</p>
        <h1 className="text-4xl font-bold tracking-tight">Where ArbiLink is going</h1>
        <p className="text-muted-foreground leading-relaxed">
          We're building the default AI gateway for every chain. What's shipped is working today.
          What's building ships next. Everything else is the moat.
        </p>
      </div>

      <div className="space-y-16">
        {PHASES.map((phase) => {
          const PhaseIcon = phase.icon;
          const sc = STATUS_CONFIG[phase.status];

          return (
            <div key={phase.version} className="space-y-6">
              <div className="flex items-center gap-4">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border ${
                  phase.status === "shipped" ? "bg-green-500/10 border-green-500/30" :
                  phase.status === "building" ? "bg-yellow-500/10 border-yellow-500/30" :
                  phase.status === "planned" ? "bg-blue-500/10 border-blue-500/30" :
                  "bg-muted/20 border-border/40"
                }`}>
                  <PhaseIcon className={`h-5 w-5 ${
                    phase.status === "shipped" ? "text-green-400" :
                    phase.status === "building" ? "text-yellow-400" :
                    phase.status === "planned" ? "text-blue-400" :
                    "text-muted-foreground"
                  }`} />
                </div>
                <div className="flex items-baseline gap-3">
                  <span className="text-xl font-bold font-mono">{phase.version}</span>
                  <Badge variant="outline" className={`text-xs font-mono ${sc.color}`}>
                    <span className={`mr-1.5 h-1.5 w-1.5 rounded-full inline-block ${sc.dot} ${phase.status === "building" ? "animate-pulse" : ""}`} />
                    {sc.label}
                  </Badge>
                  <span className="text-muted-foreground text-sm">{phase.label}</span>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 pl-14">
                {phase.items.map((item) => (
                  <div
                    key={item.title}
                    className={`p-4 rounded-lg border transition-colors space-y-2 ${
                      item.status === "shipped"
                        ? "bg-green-950/10 border-green-500/20 hover:border-green-500/40"
                        : item.status === "building"
                        ? "bg-yellow-950/10 border-yellow-500/20 hover:border-yellow-500/40"
                        : item.status === "planned"
                        ? "bg-card/30 border-border/50 hover:border-border"
                        : "bg-card/10 border-border/30 hover:border-border/50 opacity-70"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        {item.status === "shipped" ? (
                          <CheckCircle2 className="h-4 w-4 text-green-400 shrink-0" />
                        ) : item.status === "building" ? (
                          <Clock className="h-4 w-4 text-yellow-400 shrink-0 animate-pulse" />
                        ) : item.status === "planned" ? (
                          <Circle className="h-4 w-4 text-blue-400/50 shrink-0" />
                        ) : (
                          <Circle className="h-4 w-4 text-muted-foreground/30 shrink-0" />
                        )}
                        <span className="font-semibold text-sm leading-tight">{item.title}</span>
                      </div>
                      {item.tag && (
                        <Badge variant="outline" className={`text-[9px] font-mono shrink-0 ${TAG_COLORS[item.tag] ?? "border-border/50 text-muted-foreground"}`}>
                          {item.tag}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed pl-6">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="border-t border-border/50 pt-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <p className="font-semibold">Want a tool built sooner?</p>
          <p className="text-sm text-muted-foreground">
            Protocol teams can sponsor specific integrations. Agent teams can request priority access to v1.1 tools.
          </p>
        </div>
        <a
          href="mailto:hello@arbilink.dev"
          className="inline-flex items-center gap-2 rounded-md border border-border/60 bg-background/50 px-5 py-2.5 text-sm font-medium hover:bg-accent/50 transition-colors shrink-0"
        >
          Get in touch
        </a>
      </div>
    </div>
  );
}
