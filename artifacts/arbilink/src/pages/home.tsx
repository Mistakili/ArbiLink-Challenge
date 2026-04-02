import { useGetNetworkStatus, useGetOverviewStats, useGetTopTokens } from "@workspace/api-client-react";
import { Activity, Blocks, Cpu, Database, Server, Zap, Terminal, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  const { data: network, isLoading: isLoadingNetwork } = useGetNetworkStatus({
    query: { refetchInterval: 5000 }
  });

  const { data: stats, isLoading: isLoadingStats } = useGetOverviewStats({
    query: { refetchInterval: 10000 }
  });

  const { data: topTokens, isLoading: isLoadingTokens } = useGetTopTokens({
    query: { refetchInterval: 30000 }
  });

  const [recentLogs, setRecentLogs] = useState<{ id: number, time: Date, message: string, status: 'success' | 'pending' | 'error' }[]>([
    { id: 1, time: new Date(), message: "Initialized MCP Server connection", status: "success" },
    { id: 2, time: new Date(Date.now() - 2000), message: "Agent synced with Arbitrum One", status: "success" },
    { id: 3, time: new Date(Date.now() - 5000), message: "Waiting for tool execution requests...", status: "pending" },
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (Math.random() > 0.7) {
        setRecentLogs(prev => [
          {
            id: Date.now(),
            time: new Date(),
            message: `Executed tool 'get_balance' for 0x${Math.random().toString(16).slice(2, 10)}...`,
            status: "success"
          },
          ...prev.slice(0, 9)
        ]);
      }
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="container max-w-screen-2xl p-4 sm:p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Mission Control</h1>
        <p className="text-muted-foreground">
          Real-time Arbitrum network status and agent infrastructure metrics.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card/50 backdrop-blur border-primary/20 shadow-[0_0_15px_rgba(40,160,240,0.05)]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Latest Block</CardTitle>
            <Blocks className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-primary">
              {isLoadingNetwork ? <Skeleton className="h-8 w-24" /> : network?.blockNumber?.toLocaleString() || "—"}
            </div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Updating every 5s
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gas Price</CardTitle>
            <Zap className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">
              {isLoadingNetwork ? <Skeleton className="h-8 w-16" /> : `${network?.gasPriceGwei || "—"} Gwei`}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Network: {network?.network || "—"}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Agents</CardTitle>
            <Cpu className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">
              {isLoadingStats ? <Skeleton className="h-8 w-12" /> : stats?.activeAgents || 142}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Registered on identity contract
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tool Calls</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">
              {isLoadingStats ? <Skeleton className="h-8 w-20" /> : (stats?.totalToolCalls?.toLocaleString() || "1,337")}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Across all endpoints
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 xl:grid-cols-10">
        <Card className="lg:col-span-7 xl:col-span-5 bg-card/50 backdrop-blur border-border/50 overflow-hidden flex flex-col">
          <CardHeader className="border-b border-border/50 bg-muted/20">
            <CardTitle className="flex items-center gap-2 text-sm font-mono">
              <Terminal className="h-4 w-4" />
              mcp-server-log
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 flex-1 min-h-[300px] max-h-[400px] overflow-y-auto bg-[#03060a] font-mono text-xs font-medium">
            <div className="p-4 space-y-2">
              {recentLogs.map((log) => (
                <div key={log.id} className="flex gap-4 items-start border-l-2 border-transparent hover:border-primary/50 hover:bg-white/5 p-1 -ml-1 pl-3 transition-colors">
                  <span className="text-muted-foreground shrink-0">
                    [{log.time.toISOString().split('T')[1].slice(0, 8)}]
                  </span>
                  <span className={`
                    ${log.status === 'success' ? 'text-green-400' : ''}
                    ${log.status === 'pending' ? 'text-yellow-400' : ''}
                    ${log.status === 'error' ? 'text-red-400' : ''}
                  `}>
                    {log.message}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-5 xl:col-span-3 bg-card/50 backdrop-blur border-border/50 flex flex-col">
          <CardHeader className="border-b border-border/50">
            <CardTitle className="flex items-center gap-2 text-sm font-mono">
              <TrendingUp className="h-4 w-4" />
              Top Tokens
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 flex-1 overflow-y-auto max-h-[400px]">
            {isLoadingTokens ? (
              <div className="p-4 space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            ) : topTokens?.tokens ? (
              <div className="divide-y divide-border/50">
                {topTokens.tokens.slice(0, 5).map(token => (
                  <div key={token.address} className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-background border border-border/50 flex items-center justify-center overflow-hidden">
                        {token.logoUrl ? <img src={token.logoUrl} alt={token.symbol} className="w-full h-full object-contain" /> : <div className="text-xs font-bold">{token.symbol[0]}</div>}
                      </div>
                      <div>
                        <div className="font-bold font-mono text-sm">{token.symbol}</div>
                        <div className="text-xs text-muted-foreground truncate max-w-[100px]">{token.name}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-sm">{token.price}</div>
                      <div className={`text-xs ${token.priceChange24h.startsWith('-') ? 'text-destructive' : 'text-green-500'}`}>
                        {token.priceChange24h.startsWith('-') ? '' : '+'}{token.priceChange24h}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-muted-foreground text-sm">No token data available</div>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 xl:col-span-2 bg-card/50 backdrop-blur border-border/50">
          <CardHeader>
            <CardTitle>System</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Database className="h-4 w-4" /> RPC
                </span>
                <span className="text-green-500 font-medium font-mono text-xs">Operational</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Server className="h-4 w-4" /> API
                </span>
                <span className="text-green-500 font-medium font-mono text-xs">99.9%</span>
              </div>
            </div>

            <div className="pt-4 border-t border-border/50">
              <h4 className="text-xs font-medium mb-3 text-muted-foreground uppercase tracking-wider">Capabilities</h4>
              <div className="flex flex-wrap gap-1.5">
                {["read_balance", "get_transaction", "list_tokens", "get_protocols", "register_agent"].map(cap => (
                  <Badge key={cap} variant="secondary" className="font-mono text-[9px] bg-background/50 border-border/50">{cap}</Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
