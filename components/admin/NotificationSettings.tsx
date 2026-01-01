
import React, { useState } from 'react';
import { Bell, Mail, Smartphone, Globe, MessageCircle, Save, Sliders } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useData } from '../../context/DataContext';

const NotificationSettings: React.FC = () => {
    const theme = useTheme();
    const { dispatch } = useData();
    const [preferences, setPreferences] = useState([
        { id: 'fin', label: 'Financial Breaches', email: true, app: true, sms: false },
        { id: 'risk', label: 'New High Risks', email: true, app: true, sms: true },
        { id: 'sched', label: 'Schedule Delays', email: false, app: true, sms: false },
        { id: 'qual', label: 'NCR Findings', email: true, app: true, sms: false },
        { id: 'gov', label: 'Governance Decisions', email: true, app: true, sms: false },
        { id: 'system', label: 'System Maintenance', email: true, app: false, sms: false },
    ]);

    const togglePref = (id: string, channel: 'email' | 'app' | 'sms') => {
        const pref = preferences.find(p => p.id === id);
        if (pref) {
            const newValue = !pref[channel];
            setPreferences(prev => prev.map(p => p.id === id ? { ...p, [channel]: newValue } : p));
            dispatch({ type: 'UPDATE_NOTIFICATION_PREFERENCE', payload: { id, field: channel, value: newValue } });
        }
    };

    return (
        <div className="space-y-8 max-w-4xl mx-auto w-full">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <Sliders size={18} className="text-nexus-600"/> Notification Routing Matrix
                </h3>
                
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                            <tr className="border-b border-slate-100">
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
        </div>
    );
};

export default NotificationSettings;
