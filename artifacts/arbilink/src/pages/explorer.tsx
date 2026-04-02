import { useState } from "react";
import { useGetTransaction, useGetBalance, useExecuteMcpTool } from "@workspace/api-client-react";
import { Search, FileCode2, ShieldCheck, PieChart, TrendingUp, TrendingDown, ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PortfolioHolding {
  symbol: string;
  name: string;
  address: string;
  logoUrl: string;
  balance: string;
  priceUsd: string;
  valueUsd: string;
  change24h: string;
  portfolioPercent: string;
}

interface PortfolioResult {
  address: string;
  network: string;
  explorerUrl: string;
  totalValueUsd: string;
  totalValueRaw: number;
  holdingsCount: number;
  holdings: PortfolioHolding[];
  fetchedAt: string;
}

function PortfolioView({ address }: { address: string }) {
  const executeTool = useExecuteMcpTool();
  const [portfolio, setPortfolio] = useState<PortfolioResult | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await executeTool.mutateAsync({
        data: { tool: "get_wallet_portfolio", arguments: { address, network: "mainnet" } }
      });
      if (res.success && res.result) {
        setPortfolio(res.result as unknown as PortfolioResult);
      }
    } catch { /* ignore */ }
    setLoaded(true);
    setLoading(false);
  }

  if (!loaded && !loading) {
    load();
  }

  if (loading || (!loaded && !portfolio)) {
    return (
      <div className="space-y-3 p-6">
        <Skeleton className="h-16 w-full" />
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (!portfolio) {
    return (
      <div className="p-12 text-center text-muted-foreground">
        Unable to load portfolio data.
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-3xl font-bold font-mono text-primary">{portfolio.totalValueUsd}</div>
          <div className="text-xs text-muted-foreground mt-1">
            {portfolio.holdingsCount} holdings on {portfolio.network}
          </div>
        </div>
        <a
          href={portfolio.explorerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
        >
          View on Arbiscan <ExternalLink className="h-3 w-3" />
        </a>
      </div>

      <div className="space-y-2">
        {portfolio.holdings.map((holding) => {
          const isDown = holding.change24h.startsWith("-");
          const pct = parseFloat(holding.portfolioPercent) || 0;
          return (
            <div
              key={holding.symbol}
              className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/5 transition-colors border border-border/30 bg-card/20"
            >
              <div className="w-8 h-8 rounded-full bg-background border border-border/50 flex items-center justify-center overflow-hidden shrink-0">
                {holding.logoUrl ? (
                  <img src={holding.logoUrl} alt={holding.symbol} className="w-full h-full object-contain" />
                ) : (
                  <span className="text-xs font-bold">{holding.symbol[0]}</span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono font-bold text-sm">{holding.symbol}</span>
                  <span className="font-mono font-bold text-sm">{holding.valueUsd}</span>
                </div>
                <div className="flex items-center justify-between gap-2 mt-0.5">
                  <span className="text-xs text-muted-foreground">{holding.balance} · {holding.priceUsd}</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs flex items-center gap-0.5 ${isDown ? "text-destructive" : "text-green-500"}`}>
                      {isDown ? <TrendingDown className="h-3 w-3" /> : <TrendingUp className="h-3 w-3" />}
                      {holding.change24h}
                    </span>
                    <span className="text-xs text-muted-foreground font-mono">{holding.portfolioPercent}</span>
                  </div>
                </div>
                <div className="mt-1.5 h-1 rounded-full bg-border/30 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary/50"
                    style={{ width: `${Math.min(pct, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-[10px] text-muted-foreground font-mono text-right">
        Fetched at {new Date(portfolio.fetchedAt).toLocaleTimeString()} · Top 10 Arbitrum tokens tracked
      </p>
    </div>
  );
}

export default function Explorer() {
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const isTxHash = searchQuery.length === 66 && searchQuery.startsWith("0x");
  const isAddress = searchQuery.length === 42 && searchQuery.startsWith("0x");

  const { data: txData, isLoading: isLoadingTx } = useGetTransaction(searchQuery, {
    query: { enabled: isTxHash }
  });

  const { data: balanceData, isLoading: isLoadingBalance } = useGetBalance(searchQuery, {
    query: { enabled: isAddress }
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) setSearchQuery(searchInput.trim());
  };

  const EXAMPLE_ADDRESSES = [
    { label: "Vitalik (Arb)", address: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045" },
    { label: "GMX Treasury", address: "0x9fDcD219D6F04FcCDf71b2f3236c0C8c39Ed5F22" },
  ];

  return (
    <div className="container max-w-screen-xl p-4 sm:p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2 max-w-2xl mx-auto text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Block Explorer</h1>
        <p className="text-muted-foreground">
          Inspect any Arbitrum wallet or transaction hash. Paste an address to see the full portfolio breakdown.
        </p>
      </div>

      <form onSubmit={handleSearch} className="max-w-3xl mx-auto flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Wallet address or transaction hash (0x...)"
            className="pl-10 h-14 bg-card/50 border-primary/20 focus-visible:ring-primary font-mono text-sm"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>
        <Button type="submit" className="h-14 px-8 font-bold tracking-wider">
          SEARCH
        </Button>
      </form>

      {!searchQuery && (
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <span className="text-xs text-muted-foreground shrink-0">Try:</span>
          {EXAMPLE_ADDRESSES.map((ex) => (
            <button
              key={ex.address}
              onClick={() => { setSearchInput(ex.address); setSearchQuery(ex.address); }}
              className="text-xs font-mono text-primary/70 hover:text-primary transition-colors underline underline-offset-2"
            >
              {ex.label}
            </button>
          ))}
        </div>
      )}

      {/* Transaction View */}
      {isTxHash && (
        <div className="max-w-4xl mx-auto space-y-6">
          <Card className="bg-card/50 backdrop-blur border-border/50">
            <CardHeader className="border-b border-border/50">
              <CardTitle className="flex items-center gap-2">
                <FileCode2 className="h-5 w-5 text-primary" />
                Transaction Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {isLoadingTx ? (
                <div className="p-6 space-y-4">
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-2/3" />
                  <Skeleton className="h-6 w-full" />
                </div>
              ) : txData ? (
                <dl className="divide-y divide-border/50">
                  {[
                    { label: "Hash", value: txData.hash, mono: true, color: "text-primary" },
                    { label: "Status", value: txData.status, badge: true },
                    { label: "Block", value: txData.blockNumber?.toLocaleString(), mono: true },
                    { label: "From", value: txData.from, mono: true },
                    { label: "To", value: txData.to || "Contract Creation", mono: true },
                    { label: "Value (ETH)", value: txData.valueFormatted, mono: true },
                    { label: "Gas Used", value: txData.gasUsed, mono: true },
                  ].map(({ label, value, mono, color, badge }) => (
                    <div key={label} className="p-5 grid grid-cols-1 md:grid-cols-4 gap-2">
                      <dt className="text-sm font-medium text-muted-foreground">{label}</dt>
                      <dd className={`md:col-span-3 ${mono ? "font-mono text-sm break-all" : "text-sm"} ${color ?? ""}`}>
                        {badge ? (
                          <Badge variant={value === "success" ? "default" : "destructive"} className={value === "success" ? "bg-green-500/20 text-green-500 border-green-500/50" : ""}>
                            {value === "success" && <ShieldCheck className="w-3 h-3 mr-1" />}
                            {String(value).toUpperCase()}
                          </Badge>
                        ) : (value ?? "—")}
                      </dd>
                    </div>
                  ))}
                </dl>
              ) : (
                <div className="p-12 text-center text-muted-foreground">
                  Transaction not found or not yet indexed.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Address / Portfolio View */}
      {isAddress && (
        <div className="max-w-4xl mx-auto space-y-6">
          <Card className="bg-card/50 backdrop-blur border-border/50">
            <CardHeader className="flex flex-row items-center gap-4 pb-4 border-b border-border/50">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                <PieChart className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <CardTitle className="text-base font-mono truncate">{searchQuery}</CardTitle>
                <CardDescription className="mt-0.5">
                  {isLoadingBalance ? <Skeleton className="h-3 w-32" /> : balanceData?.network ?? "Arbitrum One"}
                </CardDescription>
              </div>
            </CardHeader>

            <Tabs defaultValue="portfolio">
              <div className="px-6 pt-4">
                <TabsList className="bg-background/50">
                  <TabsTrigger value="portfolio" className="font-mono text-xs gap-1.5">
                    <PieChart className="h-3 w-3" /> Portfolio
                  </TabsTrigger>
                  <TabsTrigger value="raw" className="font-mono text-xs">
                    Raw Balance
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="portfolio" className="mt-0">
                <PortfolioView key={searchQuery} address={searchQuery} />
              </TabsContent>

              <TabsContent value="raw" className="mt-0">
                <CardContent className="p-6">
                  {isLoadingBalance ? (
                    <div className="space-y-4">
                      <Skeleton className="h-20 w-full" />
                      <Skeleton className="h-40 w-full" />
                    </div>
                  ) : balanceData ? (
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-lg bg-background/50 border border-border/50">
                          <div className="text-xs text-muted-foreground mb-1">ETH Balance</div>
                          <div className="text-2xl font-mono font-bold text-primary">{balanceData.ethBalanceFormatted}</div>
                        </div>
                        <div className="p-4 rounded-lg bg-background/50 border border-border/50">
                          <div className="text-xs text-muted-foreground mb-1">USD Value</div>
                          <div className="text-2xl font-mono font-bold">{balanceData.usdValue || "—"}</div>
                        </div>
                      </div>
                      {balanceData.tokens && balanceData.tokens.length > 0 && (
                        <div className="rounded-md border border-border/50 overflow-hidden">
                          <table className="w-full text-sm">
                            <thead className="bg-muted/30 font-mono text-xs uppercase text-muted-foreground">
                              <tr>
                                <th className="px-4 py-3 text-left">Token</th>
                                <th className="px-4 py-3 text-right">Balance</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-border/50">
                              {balanceData.tokens.map((token, i) => (
                                <tr key={i} className="hover:bg-white/5 transition-colors">
                                  <td className="px-4 py-3 font-mono font-medium">{token.symbol}</td>
                                  <td className="px-4 py-3 text-right font-mono text-sm">{token.balance}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-12 text-center text-muted-foreground">No data available.</div>
                  )}
                </CardContent>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      )}

      {!isTxHash && !isAddress && searchQuery && (
        <div className="max-w-3xl mx-auto p-6 rounded-lg border border-destructive/50 bg-destructive/10 text-destructive text-center text-sm">
          Please enter a valid Arbitrum address (42 chars) or transaction hash (66 chars).
        </div>
      )}
    </div>
  );
}
