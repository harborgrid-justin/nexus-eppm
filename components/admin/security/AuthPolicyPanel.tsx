
import React from 'react';
import { Fingerprint, ShieldCheck } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { SecurityPolicy } from '../../../types/business';

interface Props {
    policies: SecurityPolicy;
    setPolicies: (p: SecurityPolicy) => void;
}

export const AuthPolicyPanel: React.FC<Props> = ({ policies, setPolicies }) => {
    const theme = useTheme();
    return (
        <div className={`${theme.components.card} p-8 rounded-[2.5rem] space-y-8 flex flex-col h-full hover:border-nexus-300 transition-all bg-white shadow-sm relative overflow-hidden group border border-slate-200`}>
            <div className="absolute top-0 right-0 p-8 bg-nexus-500/5 rounded-full blur-2xl group-hover:bg-nexus-500/10 transition-colors"></div>
            <h3 className="font-black text-[10px] uppercase tracking-[0.2em] text-slate-400 flex items-center gap-3 relative z-10 border-b border-slate-50 pb-4">
                <Fingerprint size={16} className="text-nexus-600"/> Identity Persistence
            </h3>
            <div className="flex-1 space-y-10 relative z-10">
                <div className="flex items-center justify-between p-5 rounded-2xl bg-slate-50/50 border border-slate-100 hover:bg-white hover:border-nexus-200 transition-all group/toggle cursor-pointer" onClick={() => setPolicies({...policies, mfa: !policies.mfa})}>
                    <div>
                        <p className="text-sm font-black uppercase tracking-tight text-slate-800">Enforce Multi-Factor (MFA)</p>
                        <p className="text-[10px] text-slate-500 font-medium">Secondary authentication token required for all nodes.</p>
                    </div>
                    <div className={`w-12 h-6 rounded-full transition-all relative ${policies.mfa ? 'bg-nexus-600 shadow-lg shadow-nexus-500/30' : 'bg-slate-200 shadow-inner'}`}>
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-300 ${policies.mfa ? 'left-7' : 'left-1'}`}></div>
                    </div>
                </div>
                
                <div className="space-y-3">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password Entropy Baseline</p>
                    <select 
                        className={`w-full p-4 border border-slate-200 rounded-2xl text-sm font-bold bg-white focus:ring-8 focus:ring-nexus-500/5 focus:border-nexus-500 outline-none transition-all cursor-pointer shadow-sm text-slate-700`}
                        value={policies.passwordComplexity} 
                        onChange={e => setPolicies({...policies, passwordComplexity: e.target.value})}
                    >
                        <option>Standard (8 chars)</option>
                        <option>High (12 chars + Special)</option>
                        <option>Strict (16+ chars + Bio/Key)</option>
                    </select>
                </div>

                <div className="p-4 bg-green-50 border border-green-100 rounded-2xl flex items-start gap-3 shadow-sm">
                    <ShieldCheck size={18} className="text-green-600 shrink-0 mt-0.5" />
                    <p className="text-[10px] text-green-900 leading-relaxed font-bold uppercase tracking-tight">
                        SSO Handshake Active. Identity provider (OIDC) is managing top-level token issuance.
                    </p>
                </div>
            </div>
        </div>
    );
};
