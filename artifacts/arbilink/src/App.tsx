import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { Layout } from "@/components/layout";

import Landing from "@/pages/landing";
import Home from "@/pages/home";
import Tools from "@/pages/tools";
import Explorer from "@/pages/explorer";
import Protocols from "@/pages/protocols";
import Agent from "@/pages/agent";
import Roadmap from "@/pages/roadmap";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    },
  },
});

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Landing} />
        <Route path="/dashboard" component={Home} />
        <Route path="/tools" component={Tools} />
        <Route path="/explorer" component={Explorer} />
        <Route path="/protocols" component={Protocols} />
        <Route path="/agent" component={Agent} />
        <Route path="/roadmap" component={Roadmap} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster theme="dark" position="bottom-right" />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
