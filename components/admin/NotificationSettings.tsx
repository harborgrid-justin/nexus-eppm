
import React from 'react';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';
import { useI18n } from '../../context/I18nContext';
import { Bell, Mail, Smartphone, Globe, Plus, Save, ShieldAlert } from 'lucide-react';
import { Button } from '../ui/Button';
import { EmptyGrid } from '../common/EmptyGrid';
import { generateId } from '../../utils/formatters';

const NotificationSettings: React.FC = () => {
    const { state, dispatch } = useData();
    const theme = useTheme();
    const { t } = useI18n();
    const preferences = state.governance.notificationPreferences || [];

    const handleToggle = (id: string, field: string) => {
        dispatch({ type: 'GOVERNANCE_UPDATE_NOTIFICATION_PREFERENCE', payload: { id, field } });
    };

    const handleAddRule = () => {
        const name = prompt("Enter Notification Channel Name (e.g. Schedule Variance):");
        if (name) {
            dispatch({
                type: 'GOVERNANCE_ADD_NOTIFICATION_PREFERENCE',
                payload: { id: generateId('NOTIF'), label: name, email: true, app: true, sms: false }
            });
        }
    };

    return (
        <div className="h-full flex flex-col space-y-6 animate-in fade-in pb-20">
            <div className={`p-6 rounded-[2rem] border ${theme.colors.border} ${theme.colors.surface} shadow-sm flex-shrink-0`}>
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-50">
                    <div>
                        <h3 className="font-black uppercase text-sm tracking-tighter text-slate-800 flex items-center gap-2">
                            <Bell size={18} className="text-nexus-600"/> {t('admin.notif_routing', 'Notification Transmission Matrix')}
                        </h3>
                        <p className="text-xs text-slate-500 mt-1 font-medium">{t('admin.notif_subtitle', 'Configure automated alert dispatch logic across organizational nodes.')}</p>
                    </div>
                    <Button size="sm" variant="outline" icon={Plus} onClick={handleAddRule}>{t('common.add', 'Establish Route')}</Button>
                </div>

                <div className="overflow-hidden rounded-2xl border border-slate-100 shadow-inner">
                    {preferences.length > 0 ? (
                        <table className="min-w-full divide-y divide-slate-100 border-separate border-spacing-0">
                            <thead className="bg-slate-50/80 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                                <tr>
                                    <th className="px-8 py-5 text-left border-b border-slate-100">Event Topology</th>
                                    <th className="px-6 py-5 text-center border-b border-slate-100 w-32"><div className="flex flex-col items-center gap-1"><Mail size={16}/><span className="text-[8px]">SMTP</span></div></th>
                                    <th className="px-6 py-5 text-center border-b border-slate-100 w-32"><div className="flex flex-col items-center gap-1"><Globe size={16}/><span className="text-[8px]">BROWSER</span></div></th>
                                    <th className="px-6 py-5 text-center border-b border-slate-100 w-32"><div className="flex flex-col items-center gap-1"><Smartphone size={16}/><span className="text-[8px]">MOBILE</span></div></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 bg-white">
                                {preferences.map(pref => (
                                    <tr key={pref.id} className="hover:bg-slate-50 transition-colors group">
                                        <td className="px-8 py-5">
                                            <div className="font-black text-sm text-slate-800 uppercase tracking-tight group-hover:text-nexus-700 transition-colors">{pref.label}</div>
                                            <div className="text-[9px] font-mono text-slate-400 mt-1">NODE_ID: {pref.id}</div>
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <button onClick={() => handleToggle(pref.id, 'email')} className={`p-2 rounded-xl border transition-all ${pref.email ? 'bg-nexus-50 border-nexus-200 text-nexus-600 shadow-sm' : 'bg-white border-slate-200 text-slate-300'}`}>
                                                <div className={`w-4 h-4 rounded-full border-2 border-current flex items-center justify-center`}>{pref.email && <div className="w-1.5 h-1.5 bg-current rounded-full"></div>}</div>
                                            </button>
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <button onClick={() => handleToggle(pref.id, 'app')} className={`p-2 rounded-xl border transition-all ${pref.app ? 'bg-nexus-50 border-nexus-200 text-nexus-600 shadow-sm' : 'bg-white border-slate-200 text-slate-300'}`}>
                                                <div className={`w-4 h-4 rounded-full border-2 border-current flex items-center justify-center`}>{pref.app && <div className="w-1.5 h-1.5 bg-current rounded-full"></div>}</div>
                                            </button>
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <button onClick={() => handleToggle(pref.id, 'sms')} className={`p-2 rounded-xl border transition-all ${pref.sms ? 'bg-nexus-50 border-nexus-200 text-nexus-600 shadow-sm' : 'bg-white border-slate-200 text-slate-300'}`}>
                                                <div className={`w-4 h-4 rounded-full border-2 border-current flex items-center justify-center`}>{pref.sms && <div className="w-1.5 h-1.5 bg-current rounded-full"></div>}</div>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="h-64">
                            <EmptyGrid 
                                title="No Routing Rules Defined" 
                                description="Configure how the platform dispatches automated alerts for financial, risk, and schedule events."
                                icon={ShieldAlert}
                                actionLabel="Define Global Rule"
                                onAdd={handleAddRule}
                            />
                        </div>
                    )}
                </div>
            </div>
            
            <div className="p-4 bg-slate-900 rounded-[2rem] text-white relative overflow-hidden shadow-2xl mx-4">
                <div className="relative z-10 flex gap-4 items-start">
                     <div className="p-3 bg-white/10 rounded-2xl border border-white/10"><Bell size={24} className="text-nexus-400 animate-pulse"/></div>
                     <div>
                        <h4 className="font-black text-sm uppercase tracking-widest">Rule Synchronization Active</h4>
                        <p className="text-[11px] text-slate-400 mt-1 leading-relaxed font-medium uppercase tracking-tight">Transmission matrix is globally enforced across all partition nodes. Emergency broadcast capabilities override these settings for critical security events.</p>
                     </div>
                </div>
            </div>
        </div>
    );
};
export default NotificationSettings;
