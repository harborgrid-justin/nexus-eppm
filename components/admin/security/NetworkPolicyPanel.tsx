import React, { useState } from 'react';
import { Globe, Plus, Trash2, Server } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { SecurityPolicy } from '../../../types/business';

interface Props {
    policies: SecurityPolicy;
    setPolicies: (p: SecurityPolicy) => void;
}

export const NetworkPolicyPanel: React.FC<Props> = ({ policies, setPolicies }) => {
    const theme = useTheme();
    const [newIp, setNewIp] = useState('');

    const addIp = () => {
        if (newIp && /^(\d{1,3}\.){3}\d{1,3}(\/\d{1,2})?$/.test(newIp)) {
            const currentIps = policies.allowedIps || [];
            if (!currentIps.includes(newIp)) {
                setPolicies({ ...policies, allowedIps: [...currentIps, newIp] });
                setNewIp('');
            }
        } else {
            alert("Security Protocol: Invalid IP Address or CIDR block format.");
        }
    };

    const removeIp = (ip: string) => {
        const currentIps = policies.allowedIps || [];
        setPolicies({ ...policies, allowedIps: currentIps.filter(i => i !== ip) });
    };

    return (
        <div className={`${theme.components.card} p-8 rounded-[2.5rem] space-y-8 flex flex-col h-full hover:border-nexus-300 transition-all bg-white shadow-sm relative overflow-hidden group`}>
            <div className="absolute top-0 right-0 p-8 bg-purple-500/5 rounded-full blur-2xl group-hover:bg-purple-500/10 transition-colors"></div>
            <h3 className="font-black text-[10px] uppercase tracking-[0.2em] text-slate-400 flex items-center gap-3 relative z-10 border-b border-slate-50 pb-4">
                <Globe size={16} className="text-purple-600"/> Network Isolation (Firewall)
            </h3>
            <div className="flex-1 space-y-10 relative z-10">
                <div className="flex items-center justify-between p-5 rounded-2xl bg-slate-50/50 border border-slate-100 hover:bg-white hover:border-nexus-200 transition-all group/toggle cursor-pointer" onClick={() => setPolicies({...policies, ipLock: !policies.ipLock})}>
                    <div>
                        <p className="text-sm font-black uppercase tracking-tight text-slate-800">Geospatial IP Lock</p>
                        <p className="text-[10px] text-slate-500 font-medium">Restrict access to corporate authorized network nodes only.</p>
                    </div>
                    <div className={`w-12 h-6 rounded-full transition-all relative ${policies.ipLock ? 'bg-purple-600 shadow-lg shadow-purple-500/30' : 'bg-slate-200 shadow-inner'}`}>
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-300 ${policies.ipLock ? 'left-7' : 'left-1'}`}></div>
                    </div>
                </div>
                
                {policies.ipLock && (
                    <div className="space-y-4 bg-slate-50/50 p-5 rounded-3xl border border-slate-100 shadow-inner animate-nexus-in">
                        <div className="flex gap-3">
                            <input 
                                type="text" placeholder="CIDR e.g. 192.168.1.0/24" 
                                className="flex-1 text-xs font-mono font-black border border-slate-200 rounded-xl px-4 py-2 outline-none focus:ring-4 focus:ring-nexus-500/5 focus:border-nexus-500 transition-all bg-white"
                                value={newIp} onChange={e => setNewIp(e.target.value)}
                            />
                            <button onClick={addIp} className="bg-slate-900 text-white rounded-xl px-3 hover:bg-black transition-all active:scale-95 shadow-lg"><Plus size={18}/></button>
                        </div>
                        <div className="max-h-40 overflow-y-auto space-y-1.5 scrollbar-thin pr-1">
                            {policies.allowedIps?.map(ip => (
                                <div key={ip} className="flex justify-between items-center text-[11px] font-mono font-bold bg-white border border-slate-100 px-4 py-2 rounded-xl shadow-sm group/row">
                                    <span className="text-slate-700">{ip}</span>
                                    <button onClick={() => removeIp(ip)} className="text-slate-300 hover:text-red-500 opacity-0 group-hover/row:opacity-100 transition-opacity"><Trash2 size={14}/></button>
                                </div>
                            ))}
                            {(!policies.allowedIps || policies.allowedIps.length === 0) && (
                                <div className="text-[10px] text-slate-400 font-bold uppercase text-center py-4 italic">No authorized CIDR nodes</div>
                            )}
                        </div>
                    </div>
                )}
                
                <div className="flex items-center justify-between p-5 bg-white border border-slate-100 rounded-2xl opacity-60">
                    <div className="flex items-center gap-3">
                        <Server size={18} className="text-slate-400"/>
                        <span className="text-sm font-black uppercase tracking-tight text-slate-500">Force Protocol: TLS 1.3</span>
                    </div>
                    <div className="w-4 h-4 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/30">
                        <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};