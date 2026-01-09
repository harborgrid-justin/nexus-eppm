
import React from 'react';
import { Terminal, Lock } from 'lucide-react';

export const AuditLogTmpl: React.FC = () => {
    return (
        <div className="h-full bg-slate-950 p-6 flex flex-col font-mono text-xs md:text-sm shadow-inner overflow-hidden">
            <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-4 flex-shrink-0">
                <h2 className="text-green-400 font-bold flex items-center gap-3">
                    <Terminal size={18}/> 
                    <span className="tracking-widest">SYSTEM_AUDIT_STREAM</span>
                </h2>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-1 bg-slate-900 rounded border border-slate-800 text-slate-400">
                        <Lock size={12}/> Secure
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-slate-500 animate-pulse">●</span>
                        <span className="text-slate-400">Live</span>
                    </div>
                </div>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-2 text-slate-300 font-medium pb-4 pr-2 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
                <div className="opacity-50">
                    <span className="text-slate-600 mr-3">[10:41:55]</span> 
                    <span className="text-purple-400 mr-2">SYSTEM</span> 
                    Initializing connection pool...
                </div>
                <div>
                    <span className="text-slate-600 mr-3">[10:42:01]</span> 
                    <span className="text-blue-400 mr-2">INFO</span> 
                    User 'admin' initiated sync job <span className="text-white">#J-992</span>
                </div>
                <div>
                    <span className="text-slate-600 mr-3">[10:42:05]</span> 
                    <span className="text-yellow-500 mr-2">WARN</span> 
                    API rate limit approaching (80% capacity)
                </div>
                <div>
                    <span className="text-slate-600 mr-3">[10:42:12]</span> 
                    <span className="text-blue-400 mr-2">INFO</span> 
                    Data packet received from Gateway-01. Size: 4.2MB
                </div>
                <div>
                    <span className="text-slate-600 mr-3">[10:42:15]</span> 
                    <span className="text-green-500 mr-2">SUCCESS</span> 
                    Transaction committed to immutable ledger. Block #49210
                </div>
                <div>
                    <span className="text-slate-600 mr-3">[10:45:00]</span> 
                    <span className="text-blue-400 mr-2">INFO</span> 
                    Heartbeat check... OK
                </div>
                <div className="flex items-center gap-2 mt-4 text-green-500">
                    <span>&gt;</span>
                    <span className="animate-pulse">_</span>
                </div>
            </div>
        </div>
    );
};
