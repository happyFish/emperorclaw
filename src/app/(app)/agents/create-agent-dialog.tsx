"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function CreateAgentDialog() {
    const [open, setOpen] = useState(false);
    const [roleDescription, setRoleDescription] = useState("");

    const handleCreate = async () => {
        console.log("Sending agent creation request to OpenClaw chat:", roleDescription);
        try {
            const res = await fetch("/api/mcp/messages/send", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    text: `Please spawn a new agent with the exact capabilities described below. Once created, ensure you register it in the Emperor Claw Control Plane via the /api/mcp/agents endpoint so it appears here in the UI.\n\nRequired Capabilites:\n${roleDescription}`,
                    senderType: "human"
                })
            });
            if (res.ok) {
                setOpen(false);
                setRoleDescription("");
            }
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="default" className="shadow-sm">Register Agent</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-zinc-950 border-zinc-800 text-zinc-200">
                <DialogHeader>
                    <DialogTitle className="text-zinc-100">Register New Agent</DialogTitle>
                    <DialogDescription className="text-zinc-500">
                        Describe the role, persona, and capabilities of the new agent. OpenClaw will automatically spawn and position this operative.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <Textarea
                        id="roleDescription"
                        className="bg-zinc-900 border-zinc-800 focus-visible:ring-indigo-500 text-sm h-32"
                        placeholder="Example: I need a highly-specialized Data Extraction agent capable of writing Python scripts to parse massive unformatted PDF reports."
                        value={roleDescription}
                        onChange={(e) => setRoleDescription(e.target.value)}
                    />
                </div>
                <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setOpen(false)} className="border-zinc-800 text-zinc-300 hover:bg-zinc-800">
                        Cancel
                    </Button>
                    <Button type="button" onClick={handleCreate} disabled={!roleDescription.trim()} className="bg-indigo-600 hover:bg-indigo-500 text-white">
                        Create & Request from OpenClaw
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
