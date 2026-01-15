
import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';
import { useI18n } from '../../context/I18nContext';
import { Shield, Lock, Save, Key, CheckCircle, ShieldAlert, Cpu } from 'lucide-react';
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
        alert(t('security.saved', 'Security baseline updated and committed to enterprise core.'));
    };

    const securityScore = [
        policies.mfa,
        policies.ipLock,
        policies.enforceHttps,
        policies.passwordComplexity !== 'Standard (8 chars)'
    ].filter(Boolean).length;

    return (
        <div className="h-full flex flex-col space-y-8 animate-in fade-in duration-500 pb-20">
            <div className={`p-10 rounded-[3rem] bg-slate-900 text-white flex flex-col md:flex-row justify-between items-start md:items-center shadow-2xl relative overflow-hidden group border border-white/5`}>
                <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
                <div className="absolute top-0 right-0 p-40 bg-nexus-500/10 rounded-full blur-[100px] -mr-20 -mt-20 group-hover:bg-nexus-500/15 transition-all"></div>
                
                <div className="relative z-10">
                    <h3 className="text-3xl font-black tracking-tighter uppercase text-white">{t('security.perimeter', 'System Security Perimeter')}</h3>
                    <p className="text-slate-400 text-sm mt-2 font-medium max-w-xl">{t('security.subtitle', 'Enterprise-grade authentication controls, network isolation policies, and immutable data protection protocols.')}</p>
                    <div className="mt-8 flex gap-6">
                        <div className="flex items-center gap-2.5 px-4 py-2 bg-green-500/10 text-green-400 text-[10px] font-black uppercase rounded-2xl border border-green-500/20 backdrop-blur-md shadow-lg">
                            <CheckCircle size={14}/> SOC 2 TYPE II 
                        </div>
                        <div className="flex items-center gap-2.5 px-4 py-2 bg-blue-500/10 text-blue-400 text-[10px] font-black uppercase rounded-2xl border border-blue-500/20 backdrop-blur-md shadow-lg">
                            <Shield size={14}/> FIPS 140-2
                        </div>
                    </div>
                </div>

                <div className="relative z-10 flex flex-col items-center mt-8 md:mt-0 bg-white/5 p-6 rounded-[2rem] border border-white/10 backdrop-blur-sm shadow-inner min-w-[180px]">
                    <div className="relative w-20 h-20 mb-3">
                         <svg className="w-full h-full transform -rotate-90">
                            <circle cx="40" cy="40" r="34" stroke="rgba(255,255,255,0.1)" strokeWidth="6" fill="transparent" />
                            <circle cx="40" cy="40" r="34" stroke="#0ea5e9" strokeWidth="6" fill="transparent" strokeDasharray="213.6" strokeDashoffset={213.6 - (213.6 * (securityScore / 4))} className="transition-all duration-1000 shadow-[0_0_10px_#0ea5e9]" />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center font-black text-xl">{Math.round((securityScore/4)*100)}%</div>
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Hardening Index</p>
                </div>
                
                <Shield size={240} className="absolute -right-16 -bottom-16 opacity-[0.03] text-white pointer-events-none rotate-12" />
            </div>

            <div className={`grid grid-cols-1 lg:grid-cols-3 ${theme.layout.gridGap}`}>
                <AuthPolicyPanel policies={policies} setPolicies={setPolicies} />
                
                <div className={`${theme.components.card} p-8 rounded-[2.5rem] bg-white border-slate-100 shadow-sm flex flex-col h-full hover:border-nexus-300 transition-all group`}>
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8 flex items-center gap-2 border-b border-slate-50 pb-4 group-hover:text-nexus-600 transition-colors">
                        <Cpu size={16}/> {t('security.session', 'Operational Session Controls')}
                    </h4>
                    <div className="space-y-10 flex-1 flex flex-col justify-center">
                        <div>
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 ml-1">{t('security.timeout', 'Global Inactivity Timeout')}</label>
                            <div className="relative group/input">
                                <input 
                                    type="number" 
                                    className={`w-full p-4 border-2 ${theme.colors.border} rounded-2xl bg-slate-50 font-mono font-black text-slate-800 text-xl outline-none focus:ring-8 focus:ring-nexus-500/5 focus:border-nexus-500 transition-all shadow-inner`} 
                                    value={policies.sessionLimit} 
                                    onChange={e => setPolicies({...policies, sessionLimit: parseInt(e.target.value)})} 
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400 uppercase tracking-widest">MINUTES</span>
                            </div>
                        </div>
                        <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                             <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                                 <span>Automatic Log-Rotation</span>
                                 <span className="text-green-600 font-black">ENABLED</span>
                             </div>
                             <div className="h-1.5 w-full bg-slate-200 rounded-full mt-3 overflow-hidden">
                                <div className="h-full bg-green-500 w-[70%]"></div>
                             </div>
                        </div>
                    </div>
                </div>

                <NetworkPolicyPanel policies={policies} setPolicies={setPolicies} />
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-4 pb-12 pt-6 border-t border-slate-100">
                <Button variant="outline" size="lg" icon={Key} className="rounded-2xl font-black uppercase tracking-widest text-[10px] px-8 h-14">{t('security.rotate', 'Rotate Encryption Keys')}</Button>
                <Button size="lg" icon={Save} onClick={handleSave} className="rounded-2xl font-black uppercase tracking-widest text-[10px] px-12 h-14 shadow-2xl shadow-nexus-500/20">{t('security.commit', 'Commit Security Baseline')}</Button>
            </div>
        </div>
    );
};
export default SecuritySettings;
