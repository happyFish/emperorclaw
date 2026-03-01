"use client";

import { CheckCircle2 } from "lucide-react";

export function IncidentRow({ id, severity, taskId, summary, time, status }: any) {
    const isResolved = status === 'resolved';

    const handleNotifyAgent = async () => {
        try {
            await fetch('/api/mcp/messages/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: 'human_manager',
                    text: `URGENT INCIDENT (${severity}): Review incident ${id} on task ${taskId}. Please investigate the blockage and report back.`,
                })
            });
            // Show optimistic feedback in a real app, for now just log success
            console.log(`Instructed OpenClaw agent to address incident: ${id}`);
        } catch (e) {
            console.error("Failed to notify agent", e);
        }
    };

    const colors = {
        high: "bg-red-500/20 text-red-500 border-red-500/30",
        medium: "bg-amber-500/20 text-amber-500 border-amber-500/30",
        low: "bg-zinc-500/20 text-zinc-400 border-zinc-500/30",
    }[severity as string] || "bg-zinc-500/20";

    return (
        <div className={`grid grid-cols-12 gap-4 p-4 items-center hover:bg-zinc-800/30 transition-colors ${isResolved ? 'opacity-50' : ''}`}>
            <div className="col-span-1">
                <div className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border inline-block ${colors}`}>
                    {severity}
                </div>
            </div>
            <div className="col-span-2 font-mono text-xs text-zinc-400">
                {taskId}
            </div>
            <div className="col-span-5 text-sm font-medium text-zinc-200">
                <span className="mr-2 text-xs text-zinc-500 font-mono">{id}</span>
                {summary}
            </div>
            <div className="col-span-2 text-xs text-zinc-500">
                {time}
            </div>
            <div className="col-span-2 text-right">
                {!isResolved ? (
                    <button
                        onClick={handleNotifyAgent}
                        className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors bg-indigo-500/10 hover:bg-indigo-500/20 px-3 py-1.5 rounded border border-indigo-500/20"
                    >
                        Notify Agent
                    </button>
                ) : (
                    <div className="flex justify-end items-center text-xs text-zinc-500 space-x-1">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Resolved</span>
                    </div>
                )}
            </div>
        </div>
    );
}
