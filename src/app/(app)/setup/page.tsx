import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Terminal, Settings, Link as LinkIcon, Download } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SetupPage() {
    return (
        <div className="flex-1 space-y-4 p-8 pt-6 max-w-4xl">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight text-white mb-6">OpenClaw Integration</h2>
            </div>
            <p className="text-zinc-400 mb-8">
                Connect your OpenClaw agent to the Emperor Claw Control Plane by installing the official Emperor Claw skill.
                Once installed, the skill will automatically configure the endpoint URLs and authentication required to retrieve tasks and synchronize chat.
            </p>

            <Tabs defaultValue="install" className="space-y-4">
                <TabsList className="bg-zinc-900 border border-zinc-800">
                    <TabsTrigger value="install" className="data-[state=active]:bg-zinc-800">1. Install the Skill</TabsTrigger>
                    <TabsTrigger value="configure" className="data-[state=active]:bg-zinc-800">2. Configuration Options</TabsTrigger>
                </TabsList>

                <TabsContent value="install" className="space-y-4">
                    <Card className="bg-zinc-950 border-zinc-800 text-zinc-100">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Download className="w-5 h-5 text-indigo-400" />
                                Add the Emperor Claw Skill
                            </CardTitle>
                            <CardDescription className="text-zinc-400">
                                Run this command in your OpenClaw environment to install the required capabilities.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="bg-zinc-900 p-4 rounded-md border border-zinc-800 overflow-x-auto">
                                <pre className="text-sm font-mono text-zinc-300">
                                    {`openclaw install https://emperorclaw.app/api/skills/registry/emperor-claw`}
                                </pre>
                            </div>
                            <p className="text-sm text-zinc-400">
                                This will download the <code className="text-indigo-400 px-1 py-0.5 rounded bg-indigo-500/10">SKILL.md</code> which automatically routes all MCP requests to the correct Emperor Claw backend endpoint.
                            </p>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="configure" className="space-y-4">
                    <Card className="bg-zinc-950 border-zinc-800 text-zinc-100">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Settings className="w-5 h-5 text-rose-400" />
                                Local Environment & Tokens
                            </CardTitle>
                            <CardDescription className="text-zinc-400">
                                The installed skill requires an API Token to authenticate with Emperor Claw.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm text-zinc-400">
                                Open your OpenClaw environment settings (e.g., your `.env` file) and add the following variable representing your Company Token.
                            </p>
                            <div className="bg-zinc-900 p-4 rounded-md border border-zinc-800 overflow-x-auto">
                                <pre className="text-sm font-mono text-zinc-300">
                                    {`# Required: Get your Company Token from the API Access page
EMPEROR_CLAW_API_TOKEN=your_token_here

# Optional: Override the target URL for local testing (Default: https://emperorclaw.app)
# EMPEROR_CLAW_URL=http://localhost:3000`}
                                </pre>
                            </div>
                            <p className="text-sm text-zinc-400 mt-4">
                                **Note on Network Architecture:**
                                If you are running OpenClaw locally behind a firewall, the skill is pre-configured to automatically poll <code className="text-rose-400 px-1 py-0.5 rounded bg-rose-500/10">GET /api/mcp/messages/sync</code> to retrieve human commands without requiring inbound webhooks.
                            </p>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
