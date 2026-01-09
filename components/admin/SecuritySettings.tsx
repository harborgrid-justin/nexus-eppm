
import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { Shield, Lock, Fingerprint, Globe, CheckCircle, Save, Key, Clock, AlertTriangle, UserX, RotateCcw, Plus, Trash2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { SidePanel } from '../ui/SidePanel';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { generateId } from '../../utils/formatters';

const SecuritySettings: React.FC = () => {
    const { state, dispatch } = useData();
    const { user } = useAuth();
    const theme = useTheme();
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    
    const [policies, setPolicies] = useState(state.governance.security);
    const [newIp, setNewIp] = useState('');

    useEffect(() => {
        setPolicies(state.governance.security);
    }, [state.governance.security]);

    const handleSave = () => {
        dispatch({ type: 'GOVERNANCE_UPDATE_SECURITY_POLICY', payload: policies });
        alert("Security policy updated.");
    };

    const runSecurityAudit = () => {
        const jobId = generateId('AUDIT');
        dispatch({ 
            type: 'SYSTEM_QUEUE_DATA_JOB', 
            payload: {
                id: jobId,
                type: 'System',
                format: 'JSON',
                status: 'Completed',
                submittedBy: user?.name || 'Admin',
                timestamp: new Date().toLocaleString(),
                details: 'Full security compliance scan executed successfully. No critical vulnerabilities found.'
            } 
        });
        alert(`Security Audit ${jobId} initiated successfully.`);
    };
    
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

    // Generate a visual hash based on the current user ID to simulate a linked key
    const systemTokenMask = user ? `nx_live_${user.id.substring(0,4)}...${Date.now().toString().substring(8)}_secure` : 'nx_live_...';

    return (
        <div className="space-y-6 md:space-y-8 animate-in fade-in duration-300">
            {/* Security Header Banner */}
            <div className="bg-slate-800 p-6 md:p-8 rounded-2xl text-slate-200 flex flex-col lg:flex-row justify-between items-start lg:items-center shadow-xl relative overflow-hidden gap-6">
                <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-6">
                    <div className="p-3 md:p-4 bg-white/10 rounded-2xl backdrop-blur-xl border border-white/10 shrink-0">
                        <Shield className="text-nexus-400" size={32} />
                    </div>
                    <div>
                        <h3 className="text-xl md:text-2xl font-black tracking-tight text-white">System Security Perimeter</h3>
                        <p className="text-slate-400 text-xs md:text-sm mt-1 max-w-sm leading-relaxed">Centralized management of global authentication, session lifecycle, and data protection policies.</p>
                    </div>
                </div>
                <div className="flex flex-wrap gap-3 relative z-10 w-full sm:w-auto">
                    <div className="px-4 py-2 bg-green-500/10 text-green-400 text-xs font-black uppercase tracking-widest rounded-full border border-green-500/20 flex items-center gap-2 justify-center flex-1 sm:flex-none">
                        <CheckCircle size={14}/> SOC 2 Compliant
                    </div>
                    <button onClick={runSecurityAudit} className="px-4 py-2 bg-white/10 text-white text-xs font-black uppercase tracking-widest rounded-full border border-white/20 hover:bg-white/20 transition-all flex-1 sm:flex-none whitespace-nowrap">
                        Run Audit
                    </button>
                </div>
                <Shield className="absolute -right-20 -bottom-20 text-white/5 opacity-10" size={400}/>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Auth Policy */}
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

                {/* Session Policy */}
                <div className={`${theme.components.card} p-6 space-y-6 flex flex-col h-full hover:border-nexus-300 transition-colors`}>
                    <h3 className="font-black text-[10px] uppercase tracking-widest text-slate-400 flex items-center gap-2">
                        <Clock size={16} className="text-blue-600"/> Session Management
                    </h3>
                    <div className="flex-1 space-y-6">
                        <div className="space-y-2">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Timeout (Minutes)</p>
                            <input 
                                type="number" 
                                className={`w-full p-2.5 border ${theme.colors.border} rounded-lg text-sm ${theme.colors.background} font-mono font-bold`} 
                                value={policies.sessionLimit} 
                                onChange={e => setPolicies({...policies, sessionLimit: parseInt(e.target.value)})} 
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-slate-700">Prevent Concurrent Logins</span>
                            <input type="checkbox" className="w-10 h-5 rounded-full appearance-none bg-slate-200 checked:bg-nexus-600 relative cursor-pointer transition-all before:content-[''] before:absolute before:w-4 before:h-4 before:bg-white before:rounded-full before:top-0.5 before:left-0.5 checked:before:left-5 shadow-inner" />
                        </div>
                    </div>
                </div>

                {/* Network Policy */}
                <div className={`${theme.components.card} p-6 space-y-6 flex flex-col h-full hover:border-nexus-300 transition-colors`}>
                    <h3 className="font-black text-[10px] uppercase tracking-widest text-slate-400 flex items-center gap-2">
                        <Globe size={16} className="text-purple-600"/> Network Perimeter
                    </h3>
                    <div className="flex-1 space-y-6">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-slate-700">Strict IP Whitelisting</span>
                            <input type="checkbox" checked={policies.ipLock} onChange={() => setPolicies({...policies, ipLock: !policies.ipLock})} className="w-10 h-5 rounded-full appearance-none bg-slate-200 checked:bg-nexus-600 relative cursor-pointer transition-all before:content-[''] before:absolute before:w-4 before:h-4 before:bg-white before:rounded-full before:top-0.5 before:left-0.5 checked:before:left-5 shadow-inner" />
                        </div>
                        
                        {policies.ipLock && (
                            <div className="space-y-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
                                <div className="flex gap-2">
                                    <input 
                                        type="text" 
                                        placeholder="0.0.0.0/0" 
                                        className="flex-1 text-xs border rounded px-2 py-1"
                                        value={newIp}
                                        onChange={e => setNewIp(e.target.value)}
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
                                    {(!policies.allowedIps || policies.allowedIps.length === 0) && (
                                        <div className="text-[10px] text-slate-400 text-center italic">No IPs whitelisted. Access restricted.</div>
                                    )}
                                </div>
                            </div>
                        )}
                        
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-slate-700">Enforce TLS 1.3</span>
                            <input type="checkbox" checked={true} readOnly className="w-10 h-5 rounded-full appearance-none bg-nexus-600 relative cursor-default before:content-[''] before:absolute before:w-4 before:h-4 before:bg-white before:rounded-full before:top-0.5 before:left-5 shadow-inner" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Global Actions Workbench */}
            <div className={`${theme.colors.semantic.danger.bg} ${theme.colors.semantic.danger.border} border rounded-2xl p-6`}>
                <h4 className={`${theme.colors.semantic.danger.text} font-bold text-sm uppercase tracking-widest mb-4 flex items-center gap-2`}>
                    <AlertTriangle size={18}/> Emergency Governance Actions
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button 
                        onClick={() => confirm("WARNING: This will force all active users to re-authenticate via MFA. Continue?")}
                        className={`bg-white ${theme.colors.semantic.danger.border} border p-4 rounded-xl flex items-center gap-4 hover:bg-red-100 transition-all group text-left shadow-sm w-full`}
                    >
                        <div className={`p-2 ${theme.colors.semantic.danger.bg} rounded-lg ${theme.colors.semantic.danger.text} group-hover:bg-red-200 transition-colors shrink-0`}>
                            <RotateCcw size={20}/>
                        </div>
                        <div>
                            <p className="text-sm font-bold text-red-800">Force Global Re-auth</p>
                            <p className="text-xs text-red-600">Immediate session termination for all users.</p>
                        </div>
                    </button>
                    <button 
                        onClick={() => confirm("Revoke all active public sharing links across all projects?")}
                        className={`bg-white ${theme.colors.semantic.danger.border} border p-4 rounded-xl flex items-center gap-4 hover:bg-red-100 transition-all group text-left shadow-sm w-full`}
                    >
                        <div className={`p-2 ${theme.colors.semantic.danger.bg} rounded-lg ${theme.colors.semantic.danger.text} group-hover:bg-red-200 transition-colors shrink-0`}>
                            <UserX size={20}/>
                        </div>
                        <div>
                            <p className="text-sm font-bold text-red-800">Invalidate Public Links</p>
                            <p className="text-xs text-red-600">Secure all externally shared dashboard snapshots.</p>
                        </div>
                    </button>
                </div>
            </div>

            <div className="flex justify-end gap-3 pb-20">
                <Button variant="secondary" onClick={() => setIsPanelOpen(true)} icon={Key}>View API Credentials</Button>
                <Button icon={Save} onClick={handleSave}>Commit Security Baseline</Button>
            </div>

            {/* Credentials SidePanel (Scaffolded) */}
            <SidePanel
                isOpen={isPanelOpen}
                onClose={() => setIsPanelOpen(false)}
                title="Service Account & API Registry"
                width="md:w-[500px]"
                footer={<Button onClick={() => setIsPanelOpen(false)}>Done</Button>}
            >
                <div className="space-y-6">
                    <div className="bg-slate-900 p-6 rounded-2xl text-white">
                        <div className="flex items-center gap-2 mb-4">
                            <Shield size={16} className="text-nexus-400"/>
                            <span className="text-xs font-black uppercase tracking-widest text-slate-400">System Identity</span>
                        </div>
                        <p className="text-xs text-slate-300">Enterprise Service Key</p>
                        <div className="mt-1 p-2 bg-black/40 rounded-lg border border-white/5 font-mono text-xs break-all">
                            {systemTokenMask}
                        </div>
                        <button className="mt-4 text-[10px] font-black uppercase text-nexus-400 hover:text-nexus-300 underline">Regenerate Token</button>
                    </div>
                </div>
            </SidePanel>
        </div>
    );
};

export default SecuritySettings;
