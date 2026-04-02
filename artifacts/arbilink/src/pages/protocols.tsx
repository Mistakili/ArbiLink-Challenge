import { useGetProtocols } from "@workspace/api-client-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ExternalLink, LayoutGrid, ShieldAlert, ShieldCheck } from "lucide-react";

export default function Protocols() {
  const { data: protocolData, isLoading } = useGetProtocols();

  return (
    <div className="container max-w-screen-2xl p-4 sm:p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Ecosystem Protocols</h1>
        <p className="text-muted-foreground">
          Discover and interact with major DeFi protocols on Arbitrum.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {isLoading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="bg-card/50">
              <CardHeader className="pb-4">
                <Skeleton className="h-12 w-12 rounded-full mb-2" />
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-4 w-1/3" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-16 w-full" />
              </CardContent>
            </Card>
          ))
        ) : protocolData?.protocols.map((protocol) => (
          <Card key={protocol.name} className="bg-card/50 backdrop-blur border-border/50 hover:border-primary/50 transition-colors flex flex-col hover:shadow-[0_0_20px_rgba(40,160,240,0.1)] group">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start mb-2">
                <div className="h-12 w-12 rounded-xl bg-background border border-border/50 flex items-center justify-center overflow-hidden p-2 group-hover:scale-110 transition-transform duration-500">
                  {protocol.logoUrl ? (
                    <img src={protocol.logoUrl} alt={protocol.name} className="w-full h-full object-contain" />
                  ) : (
                    <LayoutGrid className="w-6 h-6 text-muted-foreground" />
                  )}
                </div>
                <Badge variant={protocol.isActive ? "default" : "secondary"} className="font-mono text-[10px] uppercase">
                  {protocol.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
              <CardTitle className="text-xl">{protocol.name}</CardTitle>
              <CardDescription className="font-mono text-primary/80">
                {protocol.category}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-sm text-muted-foreground line-clamp-3">
                {protocol.description}
              </p>
              {protocol.tvl && (
                <div className="mt-4 p-3 bg-background/50 rounded-lg border border-border/30">
                  <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">TVL</div>
                  <div className="font-mono font-bold text-lg">{protocol.tvl}</div>
                </div>
              )}
            </CardContent>
            <CardFooter className="pt-0 flex gap-2">
              {protocol.website && (
                <Button variant="outline" size="sm" className="w-full gap-2 border-border/50 hover:bg-primary/10 hover:text-primary" asChild>
                  <a href={protocol.website} target="_blank" rel="noreferrer">
                    <ExternalLink className="h-4 w-4" />
                    Visit App
                  </a>
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {!isLoading && protocolData?.protocols.length === 0 && (
        <div className="text-center p-12 border border-dashed border-border/50 rounded-lg text-muted-foreground">
          No protocols found.
        </div>
      )}
    </div>
  );
}
