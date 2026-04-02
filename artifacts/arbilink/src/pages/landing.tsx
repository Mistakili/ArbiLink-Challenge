import { Link } from "wouter";
import { useGetNetworkStatus } from "@workspace/api-client-react";
import {
  ArrowRight,
  Blocks,
  Zap,
  Wallet,
  Hash,
  Coins,
  LayoutGrid,
  Bot,
  BarChart3,
  CheckCircle2,
  Copy,
  Check,
  ExternalLink,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TOOLS = [
  {
    icon: Blocks,
    name: "get_network_status",
    label: "Network Status",
    description: "Live block number, gas price, chain ID, and RPC health for Arbitrum One or Sepolia.",
    color: "text-primary",
  },
  {
    icon: Wallet,
    name: "get_wallet_balance",
    label: "Wallet Balance",
    description: "Query ETH balance for any address. ENS-style lookups work too.",
    color: "text-blue-400",
  },
  {
    icon: Hash,
    name: "get_transaction",
    label: "Transaction Lookup",
    description: "Inspect any tx hash — status, value, gas used, block confirmation.",
    color: "text-violet-400",
  },
  {
    icon: Coins,
    name: "get_top_tokens",
    label: "Token Prices",
    description: "Live prices for ARB, WETH, USDC, USDT, and more from CoinGecko.",
    color: "text-yellow-400",
  },
  {
    icon: LayoutGrid,
    name: "get_protocols",
    label: "DeFi Protocols",
    description: "Discover the full Arbitrum DeFi ecosystem — Uniswap, Aave, GMX, and 20+ more.",
    color: "text-green-400",
  },
  {
    icon: Bot,
    name: "get_agent_status",
    label: "Agent Identity",
    description: "Check if an Ethereum address is registered in the on-chain ArbiLink agent registry.",
    color: "text-orange-400",
  },
  {
    icon: BarChart3,
    name: "get_overview_stats",
    label: "Overview Stats",
    description: "Aggregate metrics: total tool calls, active agents, supported protocols.",
    color: "text-pink-400",
  },
];

const STEPS = [
  {
    number: "01",
    title: "Paste one config",
    description: "Add the ArbiLink server to your Claude Desktop, Cursor, or Windsurf config. One URL. Restart your client.",
  },
  {
    number: "02",
    title: "Ask in plain English",
    description: "\"What's the gas price?\" \"Check 0x... balance.\" \"Show me the top DeFi protocols.\" No special syntax.",
  },
  {
    number: "03",
    title: "Get live blockchain data",
    description: "ArbiLink queries Arbitrum's RPC nodes and returns structured data directly inside your AI conversation.",
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
      <section className="relative overflow-hidden border-b border-border/50">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(40,160,240,0.08),transparent_60%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(40,160,240,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(40,160,240,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />

        <div className="relative container max-w-screen-xl px-4 sm:px-8 pt-20 pb-24 flex flex-col items-center text-center gap-6">
          <Badge variant="outline" className="font-mono text-xs border-primary/40 text-primary gap-1.5 px-3 py-1">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
            </span>
            MCP protocol 2024-11-05 · JSON-RPC 2.0 · Live on Arbitrum
          </Badge>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-tight max-w-3xl">
            Your AI assistant is{" "}
            <span className="text-muted-foreground line-through decoration-destructive">blockchain&#8209;blind</span>
            .<br />
            <span className="text-primary">ArbiLink</span> fixes that.
          </h1>

          <p className="text-muted-foreground text-lg max-w-xl leading-relaxed">
            A native MCP server that connects Claude, Cursor, and any AI agent directly
            to live Arbitrum data — balances, tokens, transactions, DeFi protocols, and on-chain agent identity.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Open Dashboard <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/tools"
              className="inline-flex items-center gap-2 rounded-md border border-border/60 bg-background/50 px-5 py-2.5 text-sm font-medium hover:bg-accent/50 transition-colors"
            >
              Try the Playground
            </Link>
          </div>

          {network && (
            <div className="flex items-center gap-6 pt-4 text-xs font-mono text-muted-foreground">
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

      <section className="container max-w-screen-xl px-4 sm:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div className="space-y-6">
            <div className="space-y-2">
              <p className="text-xs font-mono text-primary uppercase tracking-widest">Quick Start</p>
              <h2 className="text-2xl font-bold tracking-tight">Connect in 60 seconds</h2>
              <p className="text-muted-foreground">
                Paste this into your <code className="text-xs bg-muted px-1 py-0.5 rounded">claude_desktop_config.json</code> and restart Claude Desktop.
                That's it — all 7 tools are instantly available.
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
              <pre className="p-4 text-xs font-mono text-green-300 overflow-x-auto leading-relaxed">
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
                "Implements MCP protocol 2024-11-05 — no bridge needed",
              ].map((point) => (
                <div key={point} className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
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
          </div>
        </div>
      </section>

      <section className="border-t border-border/50 bg-muted/10">
        <div className="container max-w-screen-xl px-4 sm:px-8 py-20 space-y-10">
          <div className="space-y-2 text-center">
            <p className="text-xs font-mono text-primary uppercase tracking-widest">Tools</p>
            <h2 className="text-2xl font-bold tracking-tight">7 live tools, ready to use</h2>
            <p className="text-muted-foreground max-w-md mx-auto text-sm">
              Each tool is callable from any MCP host or OpenAI-compatible agent framework. All data is fetched live from Arbitrum nodes.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {TOOLS.map((tool) => {
              const Icon = tool.icon;
              return (
                <Card
                  key={tool.name}
                  className="bg-card/40 border-border/50 hover:border-border hover:bg-card/70 transition-all group"
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

            <Card className="bg-primary/5 border-primary/20 hover:border-primary/40 transition-all flex flex-col justify-center items-center text-center p-6 gap-3 group cursor-default">
              <p className="text-xs text-muted-foreground">More tools coming</p>
              <p className="text-[10px] font-mono text-primary/60">Aave · GMX · Uniswap · Chainlink</p>
            </Card>
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

      <section className="border-t border-border/50">
        <div className="container max-w-screen-xl px-4 sm:px-8 py-16 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <h2 className="text-xl font-bold tracking-tight">
              Ready to give your AI eyes on Arbitrum?
            </h2>
            <p className="text-muted-foreground text-sm">
              Live. Free. No API key required to start.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Open Dashboard <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/agent"
              className="inline-flex items-center gap-2 rounded-md border border-border/60 bg-background/50 px-5 py-2.5 text-sm font-medium hover:bg-accent/50 transition-colors"
            >
              Register Your Agent
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
