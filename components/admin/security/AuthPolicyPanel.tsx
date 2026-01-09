
import React from 'react';
import { Fingerprint } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { SecurityPolicy } from '../../../types/business';

interface Props {
    policies: SecurityPolicy;
    setPolicies: (p: SecurityPolicy) => void;
}

export const AuthPolicyPanel: React.FC<Props> = ({ policies, setPolicies }) => {
    const theme = useTheme();
    return (
        <div className={`${theme.components.card} p-6 space-y-6 flex flex-col h-full hover:border-nexus-300 transition-colors`}>
            <h3 className="font-black text-[10px] uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <Fingerprint size={16} className="text-nexus-600"/> Authentication
            </h3>
            <div className="flex-1 space-y-6">
                <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-700">Enforce Multi-Factor (MFA)</span>
                    <input type="checkbox" checked={policies.mfa} onChange={() => setPolicies({...policies, mfa: !policies.mfa})} className="w-10 h-5 rounded-full appearance-none bg-slate-200 checked:bg-nexus-600 relative cursor-pointer transition-all before:content-[''] before:absolute before:w-4 before:h-4 before:bg-white before:rounded-full before:top-0.5 before:left-0.5 checked:before:left-5 shadow-inner" />
                </div>
                <div className="space-y-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Complexity Requirement</p>
                    <select className={`w-full p-2.5 border ${theme.colors.border} rounded-lg text-sm ${theme.colors.background} font-bold text-slate-700`} value={policies.passwordComplexity} onChange={e => setPolicies({...policies, passwordComplexity: e.target.value})}>
                        <option>Standard (8 chars)</option>
                        <option>High (12 chars + Special)</option>
                        <option>Strict (16+ chars + Bio)</option>
                    </select>
                </div>
            </div>
        </div>
    );
};
