import React, { useState } from 'react';
import { Mail, Smartphone, Globe, Sliders, Plus } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useData } from '../../context/DataContext';
import { Button } from '../ui/Button';
import { generateId } from '../../utils/formatters';

const NotificationSettings: React.FC = () => {
    const theme = useTheme();
    const { state, dispatch } = useData();
    const preferences = state.governance.notificationPreferences;
    const [newLabel, setNewLabel] = useState('');

    const togglePref = (id: string, channel: 'email' | 'app' | 'sms') => {
        dispatch({ type: 'GOVERNANCE_UPDATE_NOTIFICATION_PREFERENCE', payload: { id, field: channel } });
    };

    const addRule = () => {
        if (!newLabel) return;
        const newRule = {
            id: generateId('NOTIF'),
            label: newLabel,
            email: true,
            app: true,
            sms: false
        };
        dispatch({ type: 'GOVERNANCE_ADD_NOTIFICATION_PREFERENCE', payload: newRule });
        setNewLabel('');
    };

    return (
        <div className={`h-full flex flex-col ${theme.layout.sectionSpacing}`}>
            <div className={`${theme.components.card} flex-1 flex flex-col overflow-hidden`}>
                <div className={`p-6 border-b ${theme.colors.border} flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50/30`}>
                    <div>
                        <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                            <Sliders size={18} className="text-nexus-600"/> Notification Routing Matrix
                        </h3>
                        <p className="text-xs text-slate-500 mt-1">Configure automated alert dispatch logic across channels.</p>
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                        <input 
                            className={`flex-1 sm:w-48 px-3 py-1.5 border ${theme.colors.border} rounded-lg text-sm bg-white focus:ring-2 focus:ring-nexus-500 outline-none transition-all shadow-sm`} 
                            placeholder="New Alert Category..." 
                            value={newLabel}
                            onChange={(e) => setNewLabel(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && addRule()}
                        />
                        <Button size="sm" icon={Plus} onClick={addRule}>Add Rule</Button>
                    </div>
                </div>
                
                <div className="overflow-auto flex-1 scrollbar-thin">
                    <table className="min-w-full divide-y divide-slate-100">
                        <thead className={`${theme.colors.background}/80 sticky top-0 z-10 backdrop-blur-sm border-b`}>
                            <tr>
                                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Event Topology</th>
                                <th className="px-6 py-4 text-center">
                                    <div className="flex flex-col items-center gap-1">
                                        <Mail size={16} className="text-slate-400"/>
                                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-tighter">Email</span>
                                    </div>
                                </th>
                                <th className="px-6 py-4 text-center">
                                    <div className="flex flex-col items-center gap-1">
                                        <Globe size={16} className="text-slate-400"/>
                                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-tighter">In-App</span>
                                    </div>
                                </th>
                                <th className="px-6 py-4 text-center">
                                    <div className="flex flex-col items-center gap-1">
                                        <Smartphone size={16} className="text-slate-400"/>
                                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-tighter">Mobile</span>
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {preferences.map(pref => (
                                <tr key={pref.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4 text-sm font-bold text-slate-800 whitespace-nowrap">{pref.label}</td>
                                    <td className="px-6 py-4 text-center">
                                        <input type="checkbox" checked={pref.email} onChange={() => togglePref(pref.id, 'email')} className="w-5 h-5 rounded border-slate-300 text-nexus-600 focus:ring-nexus-500 cursor-pointer shadow-sm" />
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <input type="checkbox" checked={pref.app} onChange={() => togglePref(pref.id, 'app')} className="w-5 h-5 rounded border-slate-300 text-nexus-600 focus:ring-nexus-500 cursor-pointer shadow-sm" />
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <input type="checkbox" checked={pref.sms} onChange={() => togglePref(pref.id, 'sms')} className="w-5 h-5 rounded border-slate-300 text-nexus-600 focus:ring-nexus-500 cursor-pointer shadow-sm" />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <div className={`p-4 ${theme.colors.semantic.info.bg} border ${theme.colors.semantic.info.border} rounded-xl flex-shrink-0 shadow-sm`}>
                 <p className={`text-[11px] ${theme.colors.semantic.info.text} leading-relaxed font-bold uppercase tracking-tight text-center`}>
                     Enterprise routing rules apply globally. User-specific suppressions can be managed in individual profile settings.
                 </p>
            </div>
        </div>
    );
};

export default NotificationSettings;