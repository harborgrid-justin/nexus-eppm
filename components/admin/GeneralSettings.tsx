
import React, { useState } from 'react';
import { Building2, Globe, Clock, Landmark, Image as ImageIcon, Save } from 'lucide-react';
import { Input } from '../ui/Input';
import { useTheme } from '../../context/ThemeContext';

const GeneralSettings: React.FC = () => {
    const theme = useTheme();
    const [orgData, setOrgData] = useState({
        name: 'Acme Corp Construction',
        shortName: 'ACME',
        taxId: 'XX-XXXXXXX',
        fiscalYearStart: 'January',
        timezone: 'UTC -5 (Eastern Time)',
        language: 'English (US)',
        currency: 'USD ($)'
    });

    return (
        <div className="space-y-8 max-w-4xl">
            <section className="space-y-4">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                    <Building2 size={16}/> Organization Profile
                </h3>
                <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 p-6 ${theme.components.card}`}>
                    <div className="md:col-span-2 flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-4 border-b border-slate-100 text-center sm:text-left">
                        <div className={`w-20 h-20 ${theme.colors.background} rounded-2xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 cursor-pointer hover:bg-slate-50 transition-colors shrink-0`}>
                            <ImageIcon size={24}/>
                            <span className="text-[10px] font-bold mt-1 uppercase">Logo</span>
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-800">Corporate Branding</h4>
                            <p className="text-xs text-slate-500 mt-1">Logo will appear on all exported reports and dashlets.</p>
                            <button className="mt-2 text-xs font-bold text-nexus-600 hover:underline">Upload SVG or PNG</button>
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Legal Entity Name</label>
                        <Input value={orgData.name} onChange={e => setOrgData({...orgData, name: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Organization Short Name</label>
                        <Input value={orgData.shortName} onChange={e => setOrgData({...orgData, shortName: e.target.value})} />
                    </div>
                </div>
            </section>

            <section className="space-y-4">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                    <Globe size={16}/> Localization & Fiscal
                </h3>
                <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 p-6 ${theme.components.card}`}>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-tight flex items-center gap-1"><Clock size={12}/> System Timezone</label>
                        <select className={`w-full p-2 border ${theme.colors.border} rounded-lg text-sm ${theme.colors.surface}`} value={orgData.timezone} onChange={e => setOrgData({...orgData, timezone: e.target.value})}>
                            <option>UTC -8 (Pacific Time)</option>
                            <option>UTC -5 (Eastern Time)</option>
                            <option>UTC +0 (GMT)</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-tight flex items-center gap-1"><Landmark size={12}/> Fiscal Year Start</label>
                        <select className={`w-full p-2 border ${theme.colors.border} rounded-lg text-sm ${theme.colors.surface}`} value={orgData.fiscalYearStart} onChange={e => setOrgData({...orgData, fiscalYearStart: e.target.value})}>
                            <option>January</option>
                            <option>April</option>
                            <option>July</option>
                            <option>October</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-tight">Primary Language</label>
                        <select className={`w-full p-2 border ${theme.colors.border} rounded-lg text-sm ${theme.colors.surface}`} value={orgData.language} onChange={e => setOrgData({...orgData, language: e.target.value})}>
                            <option>English (US)</option>
                            <option>English (UK)</option>
                            <option>Spanish (ES)</option>
                            <option>French (FR)</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-tight">Reporting Currency</label>
                        <Input value={orgData.currency} disabled />
                        <p className="text-[10px] text-slate-400 mt-1">Controlled via Currency Registry</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default GeneralSettings;
