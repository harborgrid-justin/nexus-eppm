import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';
import { useI18n } from '../../context/I18nContext';
import { Shield, Lock, Save, Key, CheckCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { AuthPolicyPanel } from './security/AuthPolicyPanel';
import { NetworkPolicyPanel } from './security/NetworkPolicyPanel';

const SecuritySettings: React.FC = () => {
    const { state, dispatch } = useData();
    const theme = useTheme();
    const { t } = useI18n();
    const [policies, setPolicies] = useState(state.governance.security);

    const handleSave = () => {
        dispatch({ type: 'GOVERNANCE_UPDATE_SECURITY_POLICY', payload: policies });
        alert(t('security.saved', 'Security baseline updated.'));
    };

    return (
        <div className="h-full flex flex-col space-y-6 animate-in fade-in">
            <div className={`p-8 rounded-2xl bg-slate-900 text-white flex justify-between items-center shadow-xl relative overflow-hidden`}>
                <div className="relative z-10">
                    <h3 className="text-2xl font-black tracking-tight uppercase tracking-tighter">{t('security.perimeter', 'System Security Perimeter')}</h3>
                    <p className="text-slate-400 text-sm mt-1">{t('security.subtitle', 'Authentication and data protection protocols.')}</p>
                    <div className="mt-4 flex gap-2">
                        <span className="px-3 py-1 bg-green-500/10 text-green-400 text-[10px] font-black uppercase rounded-full border border-green-500/20 flex items-center gap-1"><CheckCircle size={12}/> SOC 2 Compliant</span>
                    </div>
                </div>
                <Shield size={160} className="absolute -right-8 -bottom-8 opacity-5 text-white pointer-events-none rotate-12" />
            </div>

            <div className={`grid grid-cols-1 lg:grid-cols-3 ${theme.layout.gridGap}`}>
                <AuthPolicyPanel policies={policies} setPolicies={setPolicies} />
                <div className={`p-6 rounded-2xl border ${theme.colors.border} ${theme.colors.surface} shadow-sm`}>
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">{t('security.session', 'Session Controls')}</h4>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5 ml-1">{t('security.timeout', 'Inactivity Timeout (Mins)')}</label>
                    <input type="number" className={`w-full p-2.5 border ${theme.colors.border} rounded-lg bg-slate-50 font-mono`} value={policies.sessionLimit} onChange={e => setPolicies({...policies, sessionLimit: parseInt(e.target.value)})} />
                </div>
                <NetworkPolicyPanel policies={policies} setPolicies={setPolicies} />
            </div>

            <div className="flex justify-end gap-3 pb-20">
                <Button variant="secondary" icon={Key}>{t('security.rotate', 'Rotate API Keys')}</Button>
                <Button icon={Save} onClick={handleSave}>{t('security.commit', 'Commit Security Baseline')}</Button>
            </div>
        </div>
    );
};
export default SecuritySettings;