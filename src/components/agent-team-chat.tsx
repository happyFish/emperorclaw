"use client";

import { useEffect, useState, useRef } from "react";
import { Bot, User } from "lucide-react";

export function AgentTeamChat({ initialMessages = [], agents = [] }: { initialMessages: any[], agents: any[] }) {
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [initialMessages]);

    const getAgentName = (id: string | null) => {
        if (!id) return "System";
        const agent = agents.find(a => a.id === id);
        return agent ? agent.name : "Unknown Agent";
    };

    return (
        <div className="flex flex-col h-full">
            <div className="p-4 border-b border-zinc-800/80 flex items-center justify-between">
                <h2 className="text-lg font-medium text-zinc-200">Agent Team Chat</h2>
                <div className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                    <span className="text-xs text-zinc-500 font-medium tracking-tight uppercase">Live Feed</span>
                </div>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
                {initialMessages.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-sm text-zinc-600 italic">No communications yet.</div>
                ) : (
                    initialMessages.map((msg) => (
                        <div key={msg.id} className={`flex space-x-3 ${msg.senderType === 'human' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border ${msg.senderType === 'human' ? 'bg-zinc-800/80 border-zinc-700' : 'bg-indigo-500/10 border-indigo-500/20'}`}>
                                {msg.senderType === 'human' ? <User className="w-4 h-4 text-zinc-400" /> : <Bot className="w-4 h-4 text-indigo-400" />}
                            </div>
                            <div className={`rounded-2xl px-4 py-2.5 max-w-[85%] text-sm ${msg.senderType === 'human' ? 'bg-zinc-800/50 border border-zinc-700/50 rounded-tr-none text-zinc-200' : 'bg-zinc-800/30 border border-zinc-800/50 rounded-tl-none text-zinc-300'}`}>
                                <div className={`text-[10px] font-medium mb-1 tracking-wider uppercase flex justify-between ${msg.senderType === 'human' ? 'text-zinc-500' : 'text-indigo-400'}`}>
                                    <span>{msg.senderType === 'human' ? 'Human Manager' : getAgentName(msg.fromUserId)}</span>
                                    <span className="text-zinc-600 px-2">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                                {msg.text}
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="p-3 border-t border-zinc-800/80 bg-zinc-900/30 flex items-center justify-center space-x-2">
                <span className="text-xs text-zinc-500 font-medium">Transparency Layer Active (Read-Only)</span>
            </div>
        </div>
    );
}
