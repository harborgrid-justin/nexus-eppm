import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { Shield, Clock, CheckCircle, Save, Key, AlertTriangle, RotateCcw, UserX } from 'lucide-react';
import { Button } from '../ui/Button';
import { SidePanel } from '../ui/SidePanel';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { generateId } from '../../utils/formatters';
import { AuthPolicyPanel } from './security/AuthPolicyPanel';
import { NetworkPolicyPanel } from './security/NetworkPolicyPanel';

const SecuritySettings: React.FC = () => {
    const { state, dispatch } = useData();
    const { user } = useAuth();
    const theme = useTheme();
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [policies, setPolicies] = useState(state.governance.security);

    useEffect(() => { setPolicies(state.governance.security); }, [state.governance.security]);

    const handleSave = () => {
        dispatch({ type: 'GOVERNANCE_UPDATE_SECURITY_POLICY', payload: policies });
        alert("Security policy updated.");
    };

    const runSecurityAudit = () => {
        const jobId = generateId('AUDIT');
        dispatch({ 
            type: 'SYSTEM_QUEUE_DATA_JOB', 
            payload: { id: jobId, type: 'System', format: 'JSON', status: 'Completed', submittedBy: user?.name || 'Admin', timestamp: new Date().toLocaleString(), details: 'Full scan completed.' } 
        });
        alert(`Audit ${jobId} initiated.`);
    };

    const systemTokenMask = user ? `nx_live_${user.id.substring(0,4)}...${Date.now().toString().substring(8)}_secure` : 'nx_live_...';

    return (
        <div className={`h-full flex flex-col ${theme.layout.sectionSpacing} animate-in fade-in duration-300`}>
            <div className={`p-8 rounded-2xl bg-slate-900 text-slate-200 flex flex-col lg:flex-row justify-between items-start lg:items-center shadow-xl relative overflow-hidden gap-6`}>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 pointer-events-none"></div>
                <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-6">
                    <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-xl border border-white/10 shrink-0">
                        <Shield className="text-nexus-400" size={32} />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black tracking-tight text-white uppercase tracking-tighter">System Security Perimeter</h3>
                        <p className="text-slate-400 text-sm mt-1 max-w-sm leading-relaxed">Centralized management of global authentication and data protection protocols.</p>
                    </div>
                </div>
                <div className="flex flex-wrap gap-3 relative z-10 w-full sm:w-auto">
                    <div className="px-4 py-2 bg-green-500/10 text-green-400 text-xs font-black uppercase tracking-widest rounded-full border border-green-500/20 flex items-center gap-2 justify-center flex-1 sm:flex-none">
                        <CheckCircle size={14}/> SOC 2 Compliant
                    </div>
                    <button onClick={runSecurityAudit} className="px-6 py-2 bg-white/10 text-white text-xs font-black uppercase tracking-widest rounded-full border border-white/20 hover:bg-white/20 transition-all flex-1 sm:flex-none whitespace-nowrap active:scale-95">
                        Run Audit
                    </button>
                </div>
            </div>

            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ${theme.layout.gridGap}`}>
                <AuthPolicyPanel policies={policies} setPolicies={setPolicies} />
                
                <div className={`${theme.components.card} ${theme.layout.cardPadding} flex flex-col h-full hover:border-nexus-300 transition-colors`}>
                    <h3 className="font-black text-[10px] uppercase tracking-widest text-slate-400 flex items-center gap-2 mb-6">
                        <Clock size={16} className="text-blue-600"/> Session Persistence
                    </h3>
                    <div className="flex-1 space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Inactivity Timeout (Mins)</label>
                            <input 
                                type="number" 
                                className={`w-full p-2.5 border ${theme.colors.border} rounded-lg text-sm bg-slate-50 font-mono font-bold text-slate-700 focus:ring-2 focus:ring-nexus-500 outline-none`} 
                                value={policies.sessionLimit} 
                                onChange={e => setPolicies({...policies, sessionLimit: parseInt(e.target.value)})} 
                            />
                        </div>
                    </div>
                </div>

                <NetworkPolicyPanel policies={policies} setPolicies={setPolicies} />
            </div>

            <div className={`${theme.colors.semantic.danger.bg} ${theme.colors.semantic.danger.border} border rounded-2xl ${theme.layout.cardPadding} shadow-sm`}>
                <h4 className={`${theme.colors.semantic.danger.text} font-black text-[10px] uppercase tracking-widest mb-6 flex items-center gap-2`}>
                    <AlertTriangle size={18}/> Emergency Governance Response
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button onClick={() => confirm("Force re-auth?")} className={`bg-white ${theme.colors.semantic.danger.border} border p-5 rounded-xl flex items-center gap-4 hover:bg-red-100 transition-all group text-left shadow-sm w-full active:scale-95`}>
                        <div className={`p-3 ${theme.colors.semantic.danger.bg} rounded-xl group-hover:bg-red-200 transition-colors shrink-0`}><RotateCcw size={20} className={theme.colors.semantic.danger.text}/></div>
                        <div><p className="text-sm font-black text-red-900 uppercase tracking-tight">Force Global Re-auth</p><p className="text-[10px] text-red-600 font-medium">Log out all active sessions immediately.</p></div>
                    </button>
                    <button onClick={() => confirm("Revoke links?")} className={`bg-white ${theme.colors.semantic.danger.border} border p-5 rounded-xl flex items-center gap-4 hover:bg-red-100 transition-all group text-left shadow-sm w-full active:scale-95`}>
                        <div className={`p-3 ${theme.colors.semantic.danger.bg} rounded-xl group-hover:bg-red-200 transition-colors shrink-0`}><UserX size={20} className={theme.colors.semantic.danger.text}/></div>
                        <div><p className="text-sm font-black text-red-900 uppercase tracking-tight">Invalidate Public Artifacts</p><p className="text-[10px] text-red-600 font-medium">Expire all shared document and report links.</p></div>
                    </button>
                </div>
            </div>

            <div className="flex justify-end gap-3 pb-20">
                <Button variant="secondary" onClick={() => setIsPanelOpen(true)} icon={Key}>View API Registry</Button>
                <Button icon={Save} onClick={handleSave}>Commit Security Baseline</Button>
            </div>

            <SidePanel isOpen={isPanelOpen} onClose={() => setIsPanelOpen(false)} title="System API Credentials" width="md:w-[500px]">
                <div className="space-y-6">
                    <div className="bg-slate-900 p-6 rounded-2xl text-white shadow-2xl border border-white/5">
                        <div className="flex items-center gap-2 mb-4">
                            <Shield size={16} className="text-nexus-400"/>
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">System Identity Token</span>
                        </div>
                        <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Access Key</p>
                        <div className="p-3 bg-black/40 rounded-xl border border-white/10 font-mono text-[11px] break-all text-green-400 shadow-inner">{systemTokenMask}</div>
                        <div className="mt-4 flex justify-end">
                            <button className="text-[10px] font-bold text-nexus-400 hover:text-nexus-300 uppercase tracking-widest">Rotate Key</button>
                        </div>
                    </div>
                </div>
            </SidePanel>
        </div>
    );
};

export default SecuritySettings;