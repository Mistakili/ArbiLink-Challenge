import { useState } from "react";
import { useGetTransaction, useGetBalance } from "@workspace/api-client-react";
import { Search, ArrowRight, Clock, ShieldCheck, FileCode2, Coins } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
    if (searchInput.trim()) {
      setSearchQuery(searchInput.trim());
    }
  };

  return (
    <div className="container max-w-screen-xl p-4 sm:p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2 max-w-2xl mx-auto text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Block Explorer</h1>
        <p className="text-muted-foreground">
          Inspect any Arbitrum address, token, or transaction hash. Real-time data direct from the node.
        </p>
      </div>

      <form onSubmit={handleSearch} className="max-w-3xl mx-auto flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search by Address / Txn Hash (0x...)"
            className="pl-10 h-14 bg-card/50 border-primary/20 focus-visible:ring-primary font-mono text-lg"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>
        <Button type="submit" className="h-14 px-8 font-bold tracking-wider">
          SEARCH
        </Button>
      </form>

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
                  <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <dt className="text-sm font-medium text-muted-foreground">Transaction Hash</dt>
                    <dd className="md:col-span-3 font-mono text-sm break-all text-primary">{txData.hash}</dd>
                  </div>
                  <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <dt className="text-sm font-medium text-muted-foreground">Status</dt>
                    <dd className="md:col-span-3">
                      <Badge variant={txData.status === "success" ? "default" : "destructive"} className={txData.status === "success" ? "bg-green-500/20 text-green-500 border-green-500/50" : ""}>
                        {txData.status === "success" ? <ShieldCheck className="w-3 h-3 mr-1" /> : null}
                        {txData.status.toUpperCase()}
                      </Badge>
                    </dd>
                  </div>
                  <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <dt className="text-sm font-medium text-muted-foreground">Block</dt>
                    <dd className="md:col-span-3 font-mono text-sm">{txData.blockNumber}</dd>
                  </div>
                  <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <dt className="text-sm font-medium text-muted-foreground">From</dt>
                    <dd className="md:col-span-3 font-mono text-sm break-all">{txData.from}</dd>
                  </div>
                  <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <dt className="text-sm font-medium text-muted-foreground">To</dt>
                    <dd className="md:col-span-3 font-mono text-sm break-all">{txData.to || "Contract Creation"}</dd>
                  </div>
                  <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <dt className="text-sm font-medium text-muted-foreground">Value</dt>
                    <dd className="md:col-span-3 font-mono text-sm">{txData.valueFormatted}</dd>
                  </div>
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

      {/* Address View */}
      {isAddress && (
        <div className="max-w-4xl mx-auto space-y-6">
          <Card className="bg-card/50 backdrop-blur border-border/50">
            <CardHeader className="flex flex-row items-center gap-4 pb-6 border-b border-border/50">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Coins className="h-8 w-8 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <CardTitle className="text-xl font-mono truncate">{searchQuery}</CardTitle>
                <CardDescription className="mt-1">
                  {isLoadingBalance ? <Skeleton className="h-4 w-32 mt-1" /> : balanceData?.network}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {isLoadingBalance ? (
                <div className="space-y-4">
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-40 w-full" />
                </div>
              ) : balanceData ? (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-background/50 border border-border/50">
                      <div className="text-sm text-muted-foreground mb-1">ETH Balance</div>
                      <div className="text-2xl font-mono font-bold text-primary">{balanceData.ethBalanceFormatted}</div>
                    </div>
                    <div className="p-4 rounded-lg bg-background/50 border border-border/50">
                      <div className="text-sm text-muted-foreground mb-1">USD Value (Est)</div>
                      <div className="text-2xl font-mono font-bold">{balanceData.usdValue || "—"}</div>
                    </div>
                  </div>

                  {balanceData.tokens && balanceData.tokens.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-4">ERC-20 Tokens</h3>
                      <div className="rounded-md border border-border/50 overflow-hidden">
                        <table className="w-full text-sm text-left">
                          <thead className="bg-muted/50 font-mono text-xs uppercase text-muted-foreground">
                            <tr>
                              <th className="px-4 py-3 font-medium">Asset</th>
                              <th className="px-4 py-3 font-medium text-right">Balance</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border/50 bg-card/30">
                            {balanceData.tokens.map((token, i) => (
                              <tr key={i} className="hover:bg-white/5 transition-colors">
                                <td className="px-4 py-3">
                                  <div className="font-medium font-mono">{token.symbol}</div>
                                  <div className="text-xs text-muted-foreground truncate max-w-[200px]">{token.name}</div>
                                </td>
                                <td className="px-4 py-3 text-right font-mono">
                                  {token.balance}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-12 text-center text-muted-foreground">
                  Address not found or error loading data.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Initial State */}
      {!isTxHash && !isAddress && searchQuery && (
        <div className="max-w-3xl mx-auto p-8 rounded-lg border border-destructive/50 bg-destructive/10 text-destructive text-center">
          Invalid search format. Please enter a valid Arbitrum address (42 chars) or transaction hash (66 chars).
        </div>
      )}

    </div>
  );
}
