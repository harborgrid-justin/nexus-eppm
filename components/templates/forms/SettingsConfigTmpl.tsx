
import React, { useState } from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { Settings } from 'lucide-react';
import { TemplateHeader } from '../TemplateHeader';

export const SettingsConfigTmpl: React.FC = () => {
    const theme = useTheme();
    const [activeTab, setActiveTab] = useState('General');
    const [toggles, setToggles] = useState({ maint: false, debug: true });

    return (
        <div className={`h-full flex flex-col ${theme.layout.pagePadding}`}>
            <TemplateHeader number="15" title="Configuration Panel" subtitle="System parameters & switches" />
            <div className={`flex flex-1 ${theme.layout.gridGap}`}>
                <div className="w-64 space-y-1">
                    {['General', 'Notifications', 'Security', 'Integrations'].map((tab, i) => (
                        <button 
                            key={tab} 
                            onClick={() => setActiveTab(tab)}
                            className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium ${tab === activeTab ? 'bg-nexus-50 text-nexus-700' : 'text-slate-600 hover:bg-slate-100'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
                <div className="flex-1 max-w-2xl space-y-6">
                    <Card className={theme.layout.cardPadding}>
                        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Settings size={18}/> {activeTab} Settings</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">System Name</label>
                                <Input defaultValue="Nexus Production" />
                            </div>
                            <div className="flex items-center justify-between p-3 border rounded-lg">
                                <div>
                                    <div className="text-sm font-medium text-slate-900">Maintenance Mode</div>
                                    <div className="text-xs text-slate-500">Prevent new logins during updates</div>
                                </div>
                                <input type="checkbox" checked={toggles.maint} onChange={() => setToggles({...toggles, maint: !toggles.maint})} className="w-10 h-5 rounded-full appearance-none bg-slate-200 checked:bg-nexus-600 relative cursor-pointer transition-all before:content-[''] before:absolute before:w-4 before:h-4 before:bg-white before:rounded-full before:top-0.5 before:left-0.5 checked:before:left-5 shadow-inner" />
                            </div>
                            <div className="flex items-center justify-between p-3 border rounded-lg">
                                <div>
                                    <div className="text-sm font-medium text-slate-900">Debug Logging</div>
                                    <div className="text-xs text-slate-500">Verbose output stream</div>
                                </div>
                                <input type="checkbox" checked={toggles.debug} onChange={() => setToggles({...toggles, debug: !toggles.debug})} className="w-10 h-5 rounded-full appearance-none bg-slate-200 checked:bg-nexus-600 relative cursor-pointer transition-all before:content-[''] before:absolute before:w-4 before:h-4 before:bg-white before:rounded-full before:top-0.5 before:left-0.5 checked:before:left-5 shadow-inner" />
                            </div>
                        </div>
                    </Card>
                    <div className="flex justify-end gap-3">
                        <Button variant="ghost">Reset Defaults</Button>
                        <Button>Save Changes</Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
