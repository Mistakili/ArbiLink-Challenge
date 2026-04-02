import { useState } from "react";
import { useGetMcpTools, useExecuteMcpTool } from "@workspace/api-client-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Terminal, Play, CheckCircle2, XCircle, Code2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Tools() {
  const { data: toolsList, isLoading } = useGetMcpTools();
  const executeTool = useExecuteMcpTool();

  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [toolArgs, setToolArgs] = useState<Record<string, string>>({});
  const [result, setResult] = useState<any>(null);

  const activeTool = toolsList?.tools.find(t => t.name === selectedTool);

  const handleExecute = async () => {
    if (!selectedTool) return;
    
    // Parse arguments based on schema types (simple heuristic)
    const parsedArgs: Record<string, any> = {};
    Object.entries(toolArgs).forEach(([k, v]) => {
      if (v === 'true') parsedArgs[k] = true;
      else if (v === 'false') parsedArgs[k] = false;
      else if (!isNaN(Number(v)) && v !== '') parsedArgs[k] = Number(v);
      else parsedArgs[k] = v;
    });

    try {
      const res = await executeTool.mutateAsync({
        data: {
          tool: selectedTool,
          arguments: parsedArgs
        }
      });
      setResult(res);
      toast.success(`Tool ${selectedTool} executed successfully`);
    } catch (error) {
      setResult({ error: error instanceof Error ? error.message : "Unknown error occurred" });
      toast.error(`Failed to execute ${selectedTool}`);
    }
  };

  return (
    <div className="container max-w-screen-2xl p-4 sm:p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">MCP Tools Catalog</h1>
        <p className="text-muted-foreground">
          Interactive list of available Model Context Protocol tools. Test them live before integrating.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Tools List */}
        <div className="lg:col-span-5 space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Code2 className="h-5 w-5 text-primary" />
            Available Tools
          </h2>
          
          <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-4">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-[120px] w-full" />
                ))
              ) : (
                toolsList?.tools.map((tool) => (
                  <Card 
                    key={tool.name}
                    className={`cursor-pointer transition-all hover:border-primary/50 hover:shadow-[0_0_15px_rgba(40,160,240,0.1)] ${selectedTool === tool.name ? 'border-primary bg-primary/5' : 'bg-card/50'}`}
                    onClick={() => {
                      setSelectedTool(tool.name);
                      setToolArgs({});
                      setResult(null);
                    }}
                  >
                    <CardHeader className="p-4 pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base font-mono text-primary">{tool.name}</CardTitle>
                        <Badge variant="outline" className="font-mono text-[10px]">MCP</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-2">
                      <CardDescription className="text-sm text-foreground/80 line-clamp-2">
                        {tool.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Try It Panel */}
        <div className="lg:col-span-7">
          <Card className="h-full flex flex-col bg-[#03060a] border-border/50 shadow-2xl">
            <CardHeader className="border-b border-border/50 bg-card/50">
              <CardTitle className="flex items-center justify-between text-base">
                <span className="flex items-center gap-2">
                  <Terminal className="h-5 w-5" />
                  Try It: {selectedTool || "Select a tool"}
                </span>
                {activeTool && (
                  <Badge variant="secondary" className="font-mono">{activeTool.name}</Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 flex-1 flex flex-col">
              {activeTool ? (
                <div className="flex flex-col h-full">
                  <div className="p-6 border-b border-border/50 bg-card/30">
                    <h3 className="text-sm font-medium mb-4 text-muted-foreground uppercase tracking-wider">Arguments</h3>
                    <div className="space-y-4">
                      {Object.entries((activeTool.inputSchema as any)?.properties || {}).map(([key, prop]: [string, any]) => {
                        const isRequired = ((activeTool.inputSchema as any)?.required || []).includes(key);
                        return (
                          <div key={key} className="space-y-2">
                            <Label htmlFor={key} className="flex items-center gap-2 font-mono text-xs">
                              {key}
                              {isRequired && <span className="text-destructive">*</span>}
                              <span className="text-muted-foreground text-[10px]">{prop.type}</span>
                            </Label>
                            <Input
                              id={key}
                              placeholder={prop.description || `Enter ${key}...`}
                              className="font-mono bg-background/50 border-border/50 focus-visible:ring-primary"
                              value={toolArgs[key] || ''}
                              onChange={(e) => setToolArgs(prev => ({ ...prev, [key]: e.target.value }))}
                            />
                            {prop.description && (
                              <p className="text-[10px] text-muted-foreground">{prop.description}</p>
                            )}
                          </div>
                        );
                      })}
                      {Object.keys((activeTool.inputSchema as any)?.properties || {}).length === 0 && (
                        <p className="text-sm text-muted-foreground italic font-mono">No arguments required.</p>
                      )}

                      <Button 
                        onClick={handleExecute} 
                        disabled={executeTool.isPending}
                        className="w-full mt-4 font-mono font-bold tracking-widest bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        {executeTool.isPending ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Play className="mr-2 h-4 w-4 fill-current" />
                        )}
                        EXECUTE
                      </Button>
                    </div>
                  </div>

                  <div className="flex-1 p-6 relative bg-[#020408]">
                    <h3 className="text-sm font-medium mb-4 text-muted-foreground uppercase tracking-wider flex items-center justify-between">
                      Output
                      {result && (
                        result.success ? 
                          <CheckCircle2 className="h-4 w-4 text-green-500" /> : 
                          <XCircle className="h-4 w-4 text-destructive" />
                      )}
                    </h3>
                    
                    {result ? (
                      <ScrollArea className="h-[300px] w-full rounded-md border border-border/30 bg-black/50 p-4">
                        <pre className="text-xs font-mono text-green-400/90 whitespace-pre-wrap break-all">
                          {JSON.stringify(result, null, 2)}
                        </pre>
                      </ScrollArea>
                    ) : (
                      <div className="h-[300px] flex items-center justify-center border border-dashed border-border/30 rounded-md text-muted-foreground text-sm font-mono">
                        Awaiting execution...
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center text-muted-foreground p-12 text-center">
                  <div className="max-w-sm">
                    <Code2 className="h-12 w-12 mx-auto mb-4 opacity-20" />
                    <p>Select a tool from the catalog to view its schema and test it live.</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
