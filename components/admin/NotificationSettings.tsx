
import React from 'react';
import { Mail, Smartphone, Globe, Sliders } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useData } from '../../context/DataContext';

const NotificationSettings: React.FC = () => {
    const theme = useTheme();
    const { state, dispatch } = useData();
    const preferences = state.governance.notificationPreferences;

    const togglePref = (id: string, channel: 'email' | 'app' | 'sms') => {
        const pref = preferences.find(p => p.id === id);
        if (pref) {
            const newValue = !pref[channel];
            dispatch({ type: 'GOVERNANCE_UPDATE_NOTIFICATION_PREFERENCE', payload: { id, field: channel, value: newValue } });
        }
    };

    return (
        <div className="space-y-8 max-w-4xl mx-auto w-full h-full flex flex-col">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex-1 flex flex-col overflow-hidden">
                <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2 flex-shrink-0">
                    <Sliders size={18} className="text-nexus-600"/> Notification Routing Matrix
                </h3>
                
                <div className="overflow-auto flex-1">
                    <table className="min-w-full">
                        <thead className="bg-slate-50 sticky top-0 z-10">
                            <tr className="border-b border-slate-200">
                                <th className="px-4 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Alert Category</th>
                                <th className="px-4 py-4 text-center">
                                    <div className="flex flex-col items-center gap-1">
                                        <Mail size={16} className="text-slate-400"/>
                                        <span className="text-[10px] font-bold text-slate-500 uppercase">Email</span>
                                    </div>
                                </th>
                                <th className="px-4 py-4 text-center">
                                    <div className="flex flex-col items-center gap-1">
                                        <Globe size={16} className="text-slate-400"/>
                                        <span className="text-[10px] font-bold text-slate-500 uppercase">In-App</span>
                                    </div>
                                </th>
                                <th className="px-4 py-4 text-center">
                                    <div className="flex flex-col items-center gap-1">
                                        <Smartphone size={16} className="text-slate-400"/>
                                        <span className="text-[10px] font-bold text-slate-500 uppercase">Mobile</span>
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {preferences.map(pref => (
                                <tr key={pref.id} className="hover:bg-slate-50/50">
                                    <td className="px-4 py-4 text-sm font-medium text-slate-700 whitespace-nowrap">{pref.label}</td>
                                    <td className="px-4 py-4 text-center">
                                        <input type="checkbox" checked={pref.email} onChange={() => togglePref(pref.id, 'email')} className="w-5 h-5 rounded border-slate-300 text-nexus-600 focus:ring-nexus-500 cursor-pointer" />
                                    </td>
                                    <td className="px-4 py-4 text-center">
                                        <input type="checkbox" checked={pref.app} onChange={() => togglePref(pref.id, 'app')} className="w-5 h-5 rounded border-slate-300 text-nexus-600 focus:ring-nexus-500 cursor-pointer" />
                                    </td>
                                    <td className="px-4 py-4 text-center">
                                        <input type="checkbox" checked={pref.sms} onChange={() => togglePref(pref.id, 'sms')} className="w-5 h-5 rounded border-slate-300 text-nexus-600 focus:ring-nexus-500 cursor-pointer" />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex-shrink-0">
                 <p className="text-xs text-blue-800 leading-relaxed font-medium text-center">
                     Changes to notification routing take effect immediately for all system-generated alerts. User-level overrides may apply if configured in personal profile settings.
                 </p>
            </div>
        </div>
    );
};

export default NotificationSettings;
