import { Link } from "wouter";
import { useGetNetworkStatus } from "@workspace/api-client-react";
import {
  ArrowRight,
  Blocks,
  Wallet,
  Hash,
  Coins,
  LayoutGrid,
  Bot,
  BarChart3,
  PieChart,
  CheckCircle2,
  Copy,
  Check,
  ExternalLink,
  Flame,
  ArrowLeftRight,
  Activity,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TOOLS = [
  {
    icon: PieChart,
    name: "get_wallet_portfolio",
    label: "Wallet Portfolio",
    description: "Complete portfolio breakdown for any address — total USD value, all token holdings with live prices, 24h change, and % allocation. Ask Claude what's in any wallet.",
    color: "text-cyan-400",
    highlight: true,
  },
  {
    icon: Blocks,
    name: "get_network_status",
    label: "Network Status",
    description: "Live block number, gas price, chain ID, and RPC health for Arbitrum One or Sepolia.",
    color: "text-primary",
    highlight: false,
  },
  {
    icon: Wallet,
    name: "get_wallet_balance",
    label: "Wallet Balance",
    description: "Quick ETH balance lookup for any address on Arbitrum mainnet or testnet.",
    color: "text-blue-400",
    highlight: false,
  },
  {
    icon: Hash,
    name: "get_transaction",
    label: "Transaction Lookup",
    description: "Inspect any tx hash — status, value, gas used, block confirmation.",
    color: "text-violet-400",
    highlight: false,
  },
  {
    icon: Coins,
    name: "get_top_tokens",
    label: "Token Prices",
    description: "Live prices for ARB, WETH, USDC, USDT, and more from CoinGecko.",
    color: "text-yellow-400",
    highlight: false,
  },
  {
    icon: LayoutGrid,
    name: "get_protocols",
    label: "DeFi Protocols",
    description: "Discover the full Arbitrum DeFi ecosystem — Uniswap, Aave, GMX, and 20+ more.",
    color: "text-green-400",
    highlight: false,
  },
  {
    icon: Bot,
    name: "get_agent_status",
    label: "Agent Identity",
    description: "Check if an address is registered in the on-chain ArbiLink agent registry.",
    color: "text-orange-400",
    highlight: false,
  },
  {
    icon: BarChart3,
    name: "get_overview_stats",
    label: "Overview Stats",
    description: "Aggregate metrics: total tool calls, active agents, supported protocols.",
    color: "text-pink-400",
    highlight: false,
  },
  {
    icon: Flame,
    name: "simulate_gmx_open",
    label: "GMX Position Simulator",
    description: "Simulate a GMX V2 perpetual before touching real funds — entry price, liquidation price, PnL scenarios for ±5/10/20%, hourly borrow fee, and full risk breakdown. Supports ETH, BTC, ARB, LINK with up to 100x leverage.",
    color: "text-red-400",
    highlight: true,
    highlightColor: "red",
  },
  {
    icon: ArrowLeftRight,
    name: "prepare_uniswap_swap",
    label: "Uniswap Swap Prep",
    description: "Quote and prepare any Uniswap V3 token swap on Arbitrum — exchange rate, price impact, minimum output, and ready-to-sign calldata for SwapRouter02. No transaction sent until you approve.",
    color: "text-blue-400",
    highlight: true,
    highlightColor: "blue",
  },
  {
    icon: Activity,
    name: "get_gmx_position_health",
    label: "GMX Position Health",
    description: "Live health check for any wallet's open GMX V2 perp positions — leverage, size, collateral, liquidation price, unrealized PnL, and a HEALTHY / AT RISK / CRITICAL status flag.",
    color: "text-orange-400",
    highlight: false,
  },
  {
    icon: Activity,
    name: "get_aave_positions",
    label: "Aave V3 Positions",
    description: "Full Aave V3 lending and borrowing snapshot for any wallet — health factor, total collateral, total debt, net position, available to borrow, LTV, and liquidation threshold. Instant liquidation risk assessment.",
    color: "text-purple-400",
    highlight: false,
  },
  {
    icon: ArrowLeftRight,
    name: "get_uniswap_lp_positions",
    label: "Uniswap V3 LP Positions",
    description: "All Uniswap V3 NFT LP positions for any wallet — pair, fee tier, in-range / out-of-range status, uncollected fees per token, and a direct link to manage each position on the Uniswap app.",
    color: "text-pink-400",
    highlight: false,
  },
];

const STEPS = [
  {
    number: "01",
    title: "Paste one config",
    description: "Add ArbiLink to your Claude Desktop, Cursor, or Windsurf config. One URL. Restart your client.",
  },
  {
    number: "02",
    title: "Ask in plain English",
    description: "\"Simulate a 10x ETH long on GMX.\" \"Prepare a swap of 1 ETH to USDC.\" \"What's in this wallet?\" No special syntax.",
  },
  {
    number: "03",
    title: "See the chain. Act on it.",
    description: "ArbiLink returns live data, full risk breakdowns, and ready-to-sign calldata — all inside your AI conversation.",
  },
];

const MCP_CONFIG = `{
  "mcpServers": {
    "arbilink": {
      "command": "npx",
      "args": [
        "-y",
        "mcp-remote",
        "https://arbi-link-challenge.replit.app/mcp"
      ]
    }
  }
}`;

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  function handleCopy() {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }
  return (
    <button
      onClick={handleCopy}
      className="absolute top-3 right-3 p-1.5 rounded bg-white/5 hover:bg-white/10 transition-colors text-muted-foreground hover:text-foreground"
    >
      {copied ? <Check className="h-3.5 w-3.5 text-green-400" /> : <Copy className="h-3.5 w-3.5" />}
    </button>
  );
}

export default function Landing() {
  const { data: network } = useGetNetworkStatus({ query: { refetchInterval: 5000 } });

  return (
    <div className="min-h-screen">

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden min-h-[88vh] flex flex-col items-center justify-center border-b border-border/50">

        {/* Hero background image */}
        <div className="absolute inset-0">
          <img
            src="/hero-agent.png"
            alt="AI agent blockchain visualization"
            className="w-full h-full object-cover object-center opacity-40"
          />
          {/* Gradient overlays to fade into site background */}
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-transparent to-background" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-background/80" />
        </div>

        {/* Subtle grid on top */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(40,160,240,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(40,160,240,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />

        <div className="relative container max-w-screen-xl px-4 sm:px-8 py-24 flex flex-col items-center text-center gap-6">
          <Badge variant="outline" className="font-mono text-xs border-primary/40 text-primary gap-1.5 px-3 py-1">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
            </span>
            MCP protocol 2024-11-05 · JSON-RPC 2.0 · Live on Arbitrum
          </Badge>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight leading-tight max-w-4xl">
            Your AI agent is{" "}
            <span className="text-muted-foreground/60 line-through decoration-destructive decoration-2">
              blockchain&#8209;blind
            </span>
            .<br />
            <span className="text-primary">ArbiLink</span> gives it eyes <span className="text-muted-foreground/80">&amp;</span> hands.
          </h1>

          <p className="text-muted-foreground text-lg sm:text-xl max-w-xl leading-relaxed">
            A native MCP server that connects Claude, Cursor, and any AI agent
            to live Arbitrum — read chain data, simulate GMX positions,
            and prepare DeFi transactions before anything is signed.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors shadow-[0_0_20px_rgba(40,160,240,0.3)]"
            >
              Open Dashboard <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/tools"
              className="inline-flex items-center gap-2 rounded-md border border-border/60 bg-background/50 px-6 py-3 text-sm font-medium hover:bg-accent/50 transition-colors backdrop-blur"
            >
              Try the Playground
            </Link>
          </div>

          {network && (
            <div className="flex items-center gap-6 pt-2 text-xs font-mono text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500" />
                </span>
                Block #{network.blockNumber?.toLocaleString()}
              </span>
              <span>Gas: {network.gasPriceGwei} Gwei</span>
              <span>{network.network}</span>
            </div>
          )}
        </div>
      </section>

      {/* ── QUICKSTART ───────────────────────────────────────── */}
      <section className="container max-w-screen-xl px-4 sm:px-8 py-24">
        <div className="grid lg:grid-cols-2 gap-16 items-start">

          {/* Left: text + code */}
          <div className="space-y-7">
            <div className="space-y-2">
              <p className="text-xs font-mono text-primary uppercase tracking-widest">Quick Start</p>
              <h2 className="text-3xl font-bold tracking-tight">Connect in 60 seconds</h2>
              <p className="text-muted-foreground leading-relaxed">
                Paste this into your{" "}
                <code className="text-xs bg-muted px-1 py-0.5 rounded">claude_desktop_config.json</code>{" "}
                and restart Claude Desktop. All 13 tools are instantly available to your agent.
              </p>
            </div>

            <div className="relative rounded-lg border border-border/50 bg-[#03060a] overflow-hidden">
              <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-border/30 bg-white/[0.02]">
                <div className="h-2.5 w-2.5 rounded-full bg-red-500/60" />
                <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/60" />
                <div className="h-2.5 w-2.5 rounded-full bg-green-500/60" />
                <span className="ml-2 text-[10px] font-mono text-muted-foreground">claude_desktop_config.json</span>
              </div>
              <CopyButton text={MCP_CONFIG} />
              <pre className="p-4 text-xs font-mono overflow-x-auto leading-relaxed">
                <span className="text-muted-foreground">{"{"}</span>{"\n"}
                {"  "}<span className="text-blue-300">"mcpServers"</span><span className="text-muted-foreground">: {"{"}</span>{"\n"}
                {"    "}<span className="text-blue-300">"arbilink"</span><span className="text-muted-foreground">: {"{"}</span>{"\n"}
                {"      "}<span className="text-blue-300">"command"</span><span className="text-muted-foreground">:</span> <span className="text-green-300">"npx"</span><span className="text-muted-foreground">,</span>{"\n"}
                {"      "}<span className="text-blue-300">"args"</span><span className="text-muted-foreground">: [</span>{"\n"}
                {"        "}<span className="text-green-300">"-y"</span><span className="text-muted-foreground">,</span>{"\n"}
                {"        "}<span className="text-green-300">"mcp-remote"</span><span className="text-muted-foreground">,</span>{"\n"}
                {"        "}<span className="text-primary">"https://arbi-link-challenge.replit.app/mcp"</span>{"\n"}
                {"      "}<span className="text-muted-foreground">]</span>{"\n"}
                {"    "}<span className="text-muted-foreground">{"}"}</span>{"\n"}
                {"  "}<span className="text-muted-foreground">{"}"}</span>{"\n"}
                <span className="text-muted-foreground">{"}"}</span>
              </pre>
            </div>

            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              {[
                "Works with Claude Desktop, Cursor, Windsurf, and any MCP host",
                "Also compatible with OpenAI function-calling via REST API",
                "Implements MCP protocol 2024-11-05 natively — no bridge required",
              ].map((point) => (
                <div key={point} className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: steps + eye image */}
          <div className="space-y-5">
            {STEPS.map((step) => (
              <div
                key={step.number}
                className="flex gap-4 p-5 rounded-lg border border-border/50 bg-card/30 hover:bg-card/50 transition-colors"
              >
                <div className="text-2xl font-bold font-mono text-primary/30 shrink-0 w-8 leading-none pt-0.5">
                  {step.number}
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold text-sm">{step.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}

            {/* Eye image */}
            <div className="relative mt-6 rounded-xl overflow-hidden border border-primary/20 shadow-[0_0_40px_rgba(40,160,240,0.12)]">
              <img
                src="/agent-eye.png"
                alt="AI agent with live blockchain vision and DeFi execution"
                className="w-full aspect-square object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <p className="text-xs font-mono text-primary/80">
                  // agent sees the chain. agent acts on it. you see the results.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TOOLS ────────────────────────────────────────────── */}
      <section className="border-t border-border/50 bg-muted/10">
        <div className="container max-w-screen-xl px-4 sm:px-8 py-24 space-y-12">
          <div className="space-y-2 text-center">
            <p className="text-xs font-mono text-primary uppercase tracking-widest">Tools</p>
            <h2 className="text-3xl font-bold tracking-tight">13 live tools — read and <span className="text-primary">execute</span></h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              10 read tools for live blockchain data + 3 execution tools that let agents
              simulate and prepare real DeFi transactions before anything is signed.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {TOOLS.map((tool) => {
              const Icon = tool.icon;
              const hc = (tool as any).highlightColor as string | undefined;
              if (tool.highlight) {
                const styles = {
                  cyan: { card: "bg-cyan-950/30 border-cyan-500/30 hover:border-cyan-400/50 hover:bg-cyan-950/50 shadow-[0_0_30px_rgba(34,211,238,0.07)]", badge: "border-cyan-500/40 text-cyan-400", prompt: "text-cyan-400/70" },
                  red:  { card: "bg-red-950/30 border-red-500/30 hover:border-red-400/50 hover:bg-red-950/50 shadow-[0_0_30px_rgba(239,68,68,0.07)]", badge: "border-red-500/40 text-red-400", prompt: "text-red-400/70" },
                  blue: { card: "bg-blue-950/30 border-blue-500/30 hover:border-blue-400/50 hover:bg-blue-950/50 shadow-[0_0_30px_rgba(59,130,246,0.07)]", badge: "border-blue-500/40 text-blue-400", prompt: "text-blue-400/70" },
                }[hc ?? "cyan"] ?? { card: "bg-cyan-950/30 border-cyan-500/30", badge: "border-cyan-500/40 text-cyan-400", prompt: "text-cyan-400/70" };

                const examplePrompts: Record<string, string> = {
                  get_wallet_portfolio: '"What\'s in vitalik\'s Arbitrum wallet?" → works instantly',
                  simulate_gmx_open:   '"Simulate a 10x ETH long with $500 collateral on GMX"',
                  prepare_uniswap_swap:'"Prepare a swap of 1 ETH to USDC on Uniswap V3"',
                };

                return (
                  <Card key={tool.name} className={`sm:col-span-2 transition-all ${styles.card}`}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2 text-sm">
                          <Icon className={`h-4 w-4 ${tool.color}`} />
                          {tool.label}
                        </CardTitle>
                        <Badge variant="outline" className={`text-[9px] font-mono px-1.5 ${styles.badge}`}>
                          {hc === "cyan" ? "NEW" : "EXEC"}
                        </Badge>
                      </div>
                      <code className="text-[10px] font-mono text-muted-foreground">{tool.name}</code>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs text-muted-foreground leading-relaxed">{tool.description}</p>
                      {examplePrompts[tool.name] && (
                        <p className={`mt-3 text-[10px] font-mono ${styles.prompt}`}>
                          {examplePrompts[tool.name]}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                );
              }
              return (
                <Card
                  key={tool.name}
                  className="bg-card/40 border-border/50 hover:border-border hover:bg-card/70 transition-all"
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-sm">
                      <Icon className={`h-4 w-4 ${tool.color}`} />
                      {tool.label}
                    </CardTitle>
                    <code className="text-[10px] font-mono text-muted-foreground">{tool.name}</code>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground leading-relaxed">{tool.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="flex justify-center">
            <Link
              href="/tools"
              className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 font-medium transition-colors"
            >
              Try the interactive playground <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-t border-border/50">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(40,160,240,0.06),transparent_70%)]" />
        <div className="relative container max-w-screen-xl px-4 sm:px-8 py-20 flex flex-col sm:flex-row items-center justify-between gap-8">
          <div className="space-y-2 text-center sm:text-left">
            <h2 className="text-2xl font-bold tracking-tight">
              Give your agent eyes <span className="text-muted-foreground/60">&amp;</span> hands on Arbitrum.
            </h2>
            <p className="text-muted-foreground">
              13 live tools. Free to start. No API key required.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors shadow-[0_0_20px_rgba(40,160,240,0.3)]"
            >
              Open Dashboard <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/agent"
              className="inline-flex items-center gap-2 rounded-md border border-border/60 bg-background/50 px-6 py-3 text-sm font-medium hover:bg-accent/50 transition-colors"
            >
              Register Your Agent
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
