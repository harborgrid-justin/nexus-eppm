import React from 'react';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';
import { useI18n } from '../../context/I18nContext';
import { Bell, Mail, Smartphone, Globe, Plus, Save } from 'lucide-react';
import { Button } from '../ui/Button';

const NotificationSettings: React.FC = () => {
    const { state, dispatch } = useData();
    const theme = useTheme();
    const { t } = useI18n();
    const preferences = state.governance.notificationPreferences;

    return (
        <div className="h-full flex flex-col space-y-6 animate-in fade-in">
            <div className={`p-6 rounded-2xl border ${theme.colors.border} ${theme.colors.surface} shadow-sm`}>
                <div className="flex justify-between items-center mb-6 pb-2 border-b">
                    <div>
                        <h3 className="font-black uppercase text-xs tracking-widest text-slate-800 flex items-center gap-2">
                            <Bell size={14} className="text-nexus-600"/> {t('admin.notif_routing', 'Notification Routing Matrix')}
                        </h3>
                        <p className="text-xs text-slate-500 mt-1">{t('admin.notif_subtitle', 'Configure automated alert dispatch logic.')}</p>
                    </div>
                    <Button size="sm" icon={Plus}>{t('common.add', 'Add Rule')}</Button>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200 border-separate border-spacing-0">
                        <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                            <tr>
                                <th className="px-6 py-4 text-left">{t('admin.event_topology', 'Event Topology')}</th>
                                <th className="px-6 py-4 text-center"><Mail size={16} className="mx-auto"/></th>
                                <th className="px-6 py-4 text-center"><Globe size={16} className="mx-auto"/></th>
                                <th className="px-6 py-4 text-center"><Smartphone size={16} className="mx-auto"/></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 bg-white">
                            {preferences.map(pref => (
                                <tr key={pref.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 text-sm font-bold text-slate-700">{pref.label}</td>
                                    <td className="px-6 py-4 text-center"><input type="checkbox" checked={pref.email} readOnly className="w-5 h-5 rounded border-slate-300 text-nexus-600 focus:ring-nexus-500" /></td>
                                    <td className="px-6 py-4 text-center"><input type="checkbox" checked={pref.app} readOnly className="w-5 h-5 rounded border-slate-300 text-nexus-600 focus:ring-nexus-500" /></td>
                                    <td className="px-6 py-4 text-center"><input type="checkbox" checked={pref.sms} readOnly className="w-5 h-5 rounded border-slate-300 text-nexus-600 focus:ring-nexus-500" /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="flex justify-end pt-4 pb-20">
                <Button icon={Save}>{t('common.save', 'Save Preferences')}</Button>
            </div>
        </div>
    );
};
export default NotificationSettings;