import { Link, useLocation } from "wouter";
import { Hexagon, Home, Activity, Wrench, Search, LayoutGrid, Cpu, Map, Menu, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useGetNetworkStatus } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect } from "react";

const NAV_ITEMS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/dashboard", label: "Dashboard", icon: Activity },
  { href: "/tools", label: "MCP Tools", icon: Wrench },
  { href: "/explorer", label: "Explorer", icon: Search },
  { href: "/protocols", label: "Protocols", icon: LayoutGrid },
  { href: "/agent", label: "Agent", icon: Cpu },
  { href: "/roadmap", label: "Roadmap", icon: Map },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const { data: networkStatus, isLoading } = useGetNetworkStatus();

  // Close menu on route change
  useEffect(() => { setMenuOpen(false); }, [location]);

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const NetworkBadge = () => {
    if (isLoading) return <Skeleton className="h-6 w-20 rounded-full" />;
    if (!networkStatus) return (
      <Badge variant="destructive" className="font-mono text-xs uppercase">
        <span className="mr-1.5 flex h-2 w-2 rounded-full bg-red-500" />
        Offline
      </Badge>
    );
    return (
      <Badge
        variant={networkStatus.isMainnet ? "default" : "outline"}
        className={`font-mono text-xs uppercase ${networkStatus.isMainnet ? "" : "border-primary/50 text-primary"}`}
      >
        <span className="mr-1.5 flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
        {networkStatus.network}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-mono selection:bg-primary/30">
      <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center justify-between px-4 sm:px-6">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0 transition-opacity hover:opacity-80">
            <div className="relative flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
              <Hexagon className="h-5 w-5 text-primary animate-[pulse_4s_ease-in-out_infinite]" />
            </div>
            <span className="font-bold tracking-tight text-lg">
              Arbi<span className="text-primary">Link</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
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
                  <span className="hidden lg:inline">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex">
              <NetworkBadge />
            </div>

            {/* Hamburger — mobile only */}
            <button
              className="md:hidden flex items-center justify-center h-9 w-9 rounded-md hover:bg-accent/50 transition-colors"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <div
        className={`fixed top-14 left-0 right-0 z-40 md:hidden bg-background border-b border-border/50 transition-all duration-200 ${
          menuOpen ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0 pointer-events-none"
        }`}
      >
        <div className="px-4 py-3 flex items-center gap-2 border-b border-border/30">
          <NetworkBadge />
        </div>
        <nav className="px-2 py-3 space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = location === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-md px-4 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
