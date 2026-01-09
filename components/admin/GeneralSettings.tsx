
import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Building2, Globe, Clock, Landmark, Image as ImageIcon, Save, Upload } from 'lucide-react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useTheme } from '../../context/ThemeContext';

const GeneralSettings: React.FC = () => {
    const theme = useTheme();
    const { state, dispatch } = useData();
    const [orgData, setOrgData] = useState(state.governance.organization);

    const handleSave = () => {
        dispatch({ type: 'GOVERNANCE_UPDATE_ORG_PROFILE', payload: orgData });
        alert("Organization profile updated.");
    };

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                const result = ev.target?.result as string;
                setOrgData({ ...orgData, logoUrl: result });
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="space-y-8 max-w-4xl h-full flex flex-col">
            <div className="flex-1 overflow-y-auto pr-2 space-y-8">
                <section className="space-y-4">
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                        <Building2 size={16}/> Organization Profile
                    </h3>
                    <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 p-6 ${theme.components.card}`}>
                        <div className="md:col-span-2 flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-4 border-b border-slate-100 text-center sm:text-left">
                            <div className={`w-20 h-20 ${theme.colors.background} rounded-2xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 cursor-pointer hover:bg-slate-50 transition-colors shrink-0 overflow-hidden relative group`}>
                                {orgData.logoUrl ? (
                                    <img src={orgData.logoUrl} alt="Logo" className="w-full h-full object-contain p-1" />
                                ) : (
                                    <ImageIcon size={24}/>
                                )}
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Upload size={16} className="text-white"/>
                                </div>
                                <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleLogoUpload} />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-800">Corporate Branding</h4>
                                <p className="text-xs text-slate-500 mt-1">Logo will appear on all exported reports and dashlets.</p>
                                <label className="mt-2 text-xs font-bold text-nexus-600 hover:underline cursor-pointer block">
                                    Upload SVG or PNG
                                    <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                                </label>
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
                         <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Tax ID / VAT</label>
                            <Input value={orgData.taxId} onChange={e => setOrgData({...orgData, taxId: e.target.value})} />
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
                                <option>UTC +1 (CET)</option>
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
            
            <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
                 <Button variant="secondary" onClick={() => setOrgData(state.governance.organization)}>Revert</Button>
                 <Button onClick={handleSave} icon={Save}>Save Configuration</Button>
            </div>
        </div>
    );
};

export default GeneralSettings;
