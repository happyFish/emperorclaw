import { ShieldCheck, ArrowRight } from "lucide-react";

export default function TacticsPage() {
    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div className="flex flex-col space-y-1">
                    <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">Tactics & Doctrine</h1>
                    <p className="text-sm text-zinc-500 font-medium">Standard Operating Procedures managed by human operators.</p>
                </div>
                <button className="px-4 py-2 bg-zinc-100 text-zinc-950 hover:bg-white font-medium rounded-lg text-sm transition-colors shadow-sm">
                    Propose Tactic
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TacticCard
                    id="TAC-Auth-01"
                    name="GitHub Enterprise Auth Flow"
                    intent="Authenticate agent via browser using TOTP secret."
                    status="active"
                    version="v1.2"
                />
                <TacticCard
                    id="TAC-Scrape-04"
                    name="Cloudflare Bypass Strategy"
                    intent="Handle generic JS challenges via explicit waits and OS clicks."
                    status="proposed"
                    version="v2.0"
                />
                <TacticCard
                    id="TAC-Data-02"
                    name="Generic Table Extraction"
                    intent="Extract multi-page tabular data into standardized CSV format."
                    status="active"
                    version="v1.0"
                />
            </div>
        </div>
    );
}

function TacticCard({ id, name, intent, status, version }: any) {
    const isProposed = status === "proposed";

    return (
        <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-xl p-5 hover:border-zinc-700 transition-colors group flex flex-col justify-between h-48">
            <div>
                <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono text-zinc-500 bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800">{id}</span>
                    <div className="flex items-center space-x-2">
                        <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border ${isProposed ? 'bg-amber-500/20 text-amber-500 border-amber-500/30' : 'bg-emerald-500/20 text-emerald-500 border-emerald-500/30'}`}>
                            {status}
                        </span>
                        <span className="text-xs font-mono text-zinc-500">{version}</span>
                    </div>
                </div>

                <h3 className="text-base font-medium text-zinc-200 mb-2 leading-tight">{name}</h3>
                <p className="text-sm text-zinc-500 leading-snug">{intent}</p>
            </div>

            <div className="flex justify-end mt-4 pt-4 border-t border-zinc-800/50 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="text-xs font-medium text-indigo-400 flex items-center space-x-1 hover:text-indigo-300">
                    <span>View SOP</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                </button>
            </div>
        </div>
    );
}
