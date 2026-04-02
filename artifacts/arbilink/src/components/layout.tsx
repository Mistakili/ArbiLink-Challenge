import { Link, useLocation } from "wouter";
import { Hexagon, Activity, Wrench, Search, LayoutGrid, Cpu } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useGetNetworkStatus } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { data: networkStatus, isLoading } = useGetNetworkStatus();

  const navItems = [
    { href: "/", label: "Dashboard", icon: Activity },
    { href: "/tools", label: "MCP Tools", icon: Wrench },
    { href: "/explorer", label: "Explorer", icon: Search },
    { href: "/protocols", label: "Protocols", icon: LayoutGrid },
    { href: "/agent", label: "Agent", icon: Cpu },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-mono selection:bg-primary/30">
      <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-2xl items-center justify-between px-4 sm:px-8">
          <div className="flex items-center gap-6 md:gap-10">
            <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
              <div className="relative flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
                <Hexagon className="h-5 w-5 text-primary animate-[pulse_4s_ease-in-out_infinite]" />
              </div>
              <span className="hidden font-bold tracking-tight text-lg sm:inline-block">
                Arbi<span className="text-primary">Link</span>
              </span>
            </Link>
            <nav className="flex items-center gap-1 sm:gap-2">
              {navItems.map((item) => {
                const isActive = location === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden md:inline-block">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            {isLoading ? (
              <Skeleton className="h-6 w-24 rounded-full" />
            ) : networkStatus ? (
              <Badge 
                variant={networkStatus.isMainnet ? "default" : "outline"} 
                className={`font-mono text-xs uppercase ${networkStatus.isMainnet ? '' : 'border-primary/50 text-primary'}`}
              >
                <span className="mr-1.5 flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                {networkStatus.network}
              </Badge>
            ) : (
              <Badge variant="destructive" className="font-mono text-xs uppercase">
                <span className="mr-1.5 flex h-2 w-2 rounded-full bg-red-500"></span>
                Offline
              </Badge>
            )}
          </div>
        </div>
      </header>
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
