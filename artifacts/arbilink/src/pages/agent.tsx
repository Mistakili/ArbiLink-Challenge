import { useState } from "react";
import { useRegisterAgent, useGetAgentStatus } from "@workspace/api-client-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Cpu, Key, Network, ShieldAlert, CheckCircle2, Copy, AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function Agent() {
  const [addressCheck, setAddressCheck] = useState("");
  const [activeAddress, setActiveAddress] = useState("");
  
  const { data: agentStatus, isLoading: isLoadingStatus } = useGetAgentStatus(activeAddress, {
    query: { enabled: !!activeAddress && activeAddress.length === 42 }
  });

  const registerAgent = useRegisterAgent();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    privateKey: "",
    network: "sepolia" as "mainnet" | "sepolia"
  });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.privateKey) {
      toast.error("Name and private key are required");
      return;
    }

    try {
      const res = await registerAgent.mutateAsync({
        data: {
          name: formData.name,
          description: formData.description,
          privateKey: formData.privateKey,
          network: formData.network
        }
      });
      toast.success("Agent registered successfully!");
      if (res.agentAddress) {
        setActiveAddress(res.agentAddress);
        setAddressCheck(res.agentAddress);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to register agent");
    }
  };

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (addressCheck.length === 42) {
      setActiveAddress(addressCheck);
    } else {
      toast.error("Invalid Arbitrum address");
    }
  };

  const copyConfig = () => {
    const config = {
      "mcpServers": {
        "arbilink": {
          "command": "node",
          "args": ["/path/to/arbilink/build/index.js"],
          "env": {
            "ARBITRUM_RPC_URL": "https://arb1.arbitrum.io/rpc"
          }
        }
      }
    };
    navigator.clipboard.writeText(JSON.stringify(config, null, 2));
    toast.success("Config copied to clipboard");
  };

  return (
    <div className="container max-w-screen-lg p-4 sm:p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2 text-center max-w-2xl mx-auto mb-8">
        <div className="mx-auto h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
          <Cpu className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Agent Identity</h1>
        <p className="text-muted-foreground">
          Register your AI agent on the Arbitrum identity registry and generate Claude Desktop configurations.
        </p>
      </div>

      <Tabs defaultValue="register" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto mb-8">
          <TabsTrigger value="register">Register</TabsTrigger>
          <TabsTrigger value="status">Check Status</TabsTrigger>
          <TabsTrigger value="config">MCP Config</TabsTrigger>
        </TabsList>

        <TabsContent value="register">
          <Card className="bg-card/50 backdrop-blur border-primary/20 max-w-2xl mx-auto shadow-2xl shadow-primary/5">
            <CardHeader>
              <CardTitle>Register On-Chain Identity</CardTitle>
              <CardDescription>Deploy your agent's identity to the Arbitrum registry contract.</CardDescription>
            </CardHeader>
            <form onSubmit={handleRegister}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Agent Name</Label>
                  <Input 
                    id="name" 
                    placeholder="e.g. DeFi Trader Alpha" 
                    className="bg-background/50 font-mono"
                    value={formData.name}
                    onChange={e => setFormData(p => ({...p, name: e.target.value}))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="desc">Description</Label>
                  <Textarea 
                    id="desc" 
                    placeholder="Agent capabilities and purpose..." 
                    className="bg-background/50 font-mono resize-none"
                    value={formData.description}
                    onChange={e => setFormData(p => ({...p, description: e.target.value}))}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="network">Network</Label>
                    <Select value={formData.network} onValueChange={(v: "mainnet"|"sepolia") => setFormData(p => ({...p, network: v}))}>
                      <SelectTrigger id="network" className="bg-background/50 font-mono">
                        <SelectValue placeholder="Select network" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mainnet">Arbitrum One</SelectItem>
                        <SelectItem value="sepolia">Arbitrum Sepolia</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pk" className="flex items-center gap-2">
                      Private Key
                      <ShieldAlert className="h-3 w-3 text-yellow-500" />
                    </Label>
                    <Input 
                      id="pk" 
                      type="password" 
                      placeholder="0x..." 
                      className="bg-background/50 font-mono"
                      value={formData.privateKey}
                      onChange={e => setFormData(p => ({...p, privateKey: e.target.value}))}
                    />
                  </div>
                </div>
                <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-md flex gap-3 text-sm text-yellow-600/90 mt-4">
                  <AlertCircle className="h-5 w-5 shrink-0" />
                  <p>Your private key is used only once server-side to sign the registration transaction and is NEVER stored.</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full font-bold tracking-widest" disabled={registerAgent.isPending}>
                  {registerAgent.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Key className="mr-2 h-4 w-4" />}
                  REGISTER IDENTITY
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="status">
          <Card className="bg-card/50 backdrop-blur border-border/50 max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Verify Registration</CardTitle>
              <CardDescription>Check if an agent address is validly registered on the Arbitrum network.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleCheck} className="flex gap-2">
                <Input 
                  placeholder="Agent Address (0x...)" 
                  className="font-mono bg-background/50"
                  value={addressCheck}
                  onChange={e => setAddressCheck(e.target.value)}
                />
                <Button type="submit" variant="secondary">Check</Button>
              </form>

              {isLoadingStatus && (
                <div className="p-6 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" /></div>
              )}

              {agentStatus && (
                <div className={`p-6 rounded-lg border ${agentStatus.isRegistered ? 'bg-green-500/10 border-green-500/30' : 'bg-destructive/10 border-destructive/30'}`}>
                  <div className="flex items-center gap-3 mb-4">
                    {agentStatus.isRegistered ? (
                      <CheckCircle2 className="h-8 w-8 text-green-500" />
                    ) : (
                      <AlertCircle className="h-8 w-8 text-destructive" />
                    )}
                    <div>
                      <h3 className={`text-lg font-bold ${agentStatus.isRegistered ? 'text-green-500' : 'text-destructive'}`}>
                        {agentStatus.isRegistered ? 'Registered Agent' : 'Not Registered'}
                      </h3>
                      <p className="text-sm font-mono text-muted-foreground">{agentStatus.address}</p>
                    </div>
                  </div>
                  
                  {agentStatus.isRegistered && (
                    <div className="space-y-2 text-sm mt-6 pt-4 border-t border-green-500/20 font-mono">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Network</span>
                        <span>{agentStatus.network}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Registry Contract</span>
                        <span className="text-primary truncate max-w-[200px]">{agentStatus.registryAddress}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="config">
          <Card className="bg-card/50 backdrop-blur border-border/50 max-w-3xl mx-auto">
            <CardHeader className="flex flex-row items-start justify-between">
              <div>
                <CardTitle>Claude Desktop Config</CardTitle>
                <CardDescription>Add this to your claude_desktop_config.json to use ArbiLink tools directly.</CardDescription>
              </div>
              <Button variant="outline" size="icon" onClick={copyConfig}>
                <Copy className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="bg-[#03060a] border border-border/50 rounded-lg p-6 relative group overflow-hidden">
                <div className="absolute right-0 top-0 h-full w-1 bg-primary"></div>
                <pre className="text-sm font-mono text-green-400/90 whitespace-pre-wrap">
{`{
  "mcpServers": {
    "arbilink": {
      "command": "node",
      "args": ["/path/to/arbilink/build/index.js"],
      "env": {
        "ARBITRUM_RPC_URL": "https://arb1.arbitrum.io/rpc"
      }
    }
  }
}`}
                </pre>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                Replace <code className="text-primary">/path/to/arbilink/build/index.js</code> with the absolute path to your local ArbiLink API server build.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
