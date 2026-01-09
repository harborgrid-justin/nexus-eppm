
import React, { useState } from 'react';
import { Globe, Plus, Trash2 } from 'lucide-react';
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
            alert("Invalid IP Address or CIDR block.");
        }
    };

    const removeIp = (ip: string) => {
        const currentIps = policies.allowedIps || [];
        setPolicies({ ...policies, allowedIps: currentIps.filter(i => i !== ip) });
    };

    return (
        <div className={`${theme.components.card} p-6 space-y-6 flex flex-col h-full hover:border-nexus-300 transition-colors`}>
            <h3 className="font-black text-[10px] uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <Globe size={16} className="text-purple-600"/> Network Perimeter
            </h3>
            <div className="flex-1 space-y-6">
                <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-700">Strict IP Whitelisting</span>
                    <input type="checkbox" checked={policies.ipLock} onChange={() => setPolicies({...policies, ipLock: !policies.ipLock})} className="w-10 h-5 rounded-full appearance-none bg-slate-200 checked:bg-nexus-600 relative cursor-pointer transition-all shadow-inner" />
                </div>
                
                {policies.ipLock && (
                    <div className="space-y-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
                        <div className="flex gap-2">
                            <input 
                                type="text" placeholder="0.0.0.0/0" className="flex-1 text-xs border rounded px-2 py-1"
                                value={newIp} onChange={e => setNewIp(e.target.value)}
                            />
                            <button onClick={addIp} className="bg-nexus-600 text-white rounded p-1"><Plus size={14}/></button>
                        </div>
                        <div className="max-h-32 overflow-y-auto space-y-1">
                            {policies.allowedIps?.map(ip => (
                                <div key={ip} className="flex justify-between items-center text-xs bg-white border px-2 py-1 rounded">
                                    <span className="font-mono">{ip}</span>
                                    <button onClick={() => removeIp(ip)} className="text-red-500 hover:text-red-700"><Trash2 size={12}/></button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                
                <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-700">Enforce TLS 1.3</span>
                    <input type="checkbox" checked={true} readOnly className="w-10 h-5 rounded-full bg-nexus-600" />
                </div>
            </div>
        </div>
    );
};
