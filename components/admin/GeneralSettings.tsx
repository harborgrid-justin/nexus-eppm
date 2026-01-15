
import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { Building2, Globe, Save, RotateCcw, ShieldCheck } from 'lucide-react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';

const GeneralSettings: React.FC = () => {
    const theme = useTheme();
    const { state, dispatch } = useData();
    const { success } = useToast();
    const [orgData, setOrgData] = useState(state.governance.organization);
    const [isDirty, setIsDirty] = useState(false);

    useEffect(() => { setOrgData(state.governance.organization); }, [state.governance.organization]);

    const handleFieldChange = (field: string, value: any) => {
        setOrgData(prev => ({ ...prev, [field]: value }));
        setIsDirty(true);
    };

    const handleSave = () => {
        dispatch({ type: 'GOVERNANCE_UPDATE_ORG_PROFILE', payload: orgData });
        setIsDirty(false);
        success("Profile Updated", "Organization parameters globally committed.");
    };

    return (
        <div className="space-y-8 max-w-5xl h-full flex flex-col p-6 animate-nexus-in">
            <div className="flex-1 overflow-y-auto space-y-8 pr-4 scrollbar-thin">
                <section className="space-y-4">
                    <div className="flex items-center gap-2">
                        <Building2 size={16} className="text-nexus-600"/><h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Legal Identity</h3>
                    </div>
                    <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 p-8 ${theme.components.card} bg-white rounded-2xl border ${theme.colors.border}`}>
                        <Input label="Entity Name" value={orgData.name} onChange={e => handleFieldChange('name', e.target.value)} className="bg-slate-50 font-bold" />
                        <Input label="Organization Code" value={orgData.shortName} onChange={e => handleFieldChange('shortName', e.target.value)} className="bg-slate-50 font-mono" />
                        <Input label="Tax Identifier" value={orgData.taxId} onChange={e => handleFieldChange('taxId', e.target.value)} className="bg-slate-50" />
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Base Reporting Currency</label>
                            <input disabled className="w-full p-2.5 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-500 font-black" value={orgData.currency} />
                        </div>
                    </div>
                </section>
                <section className="space-y-4">
                    <div className="flex items-center gap-2">
                        <Globe size={16} className="text-nexus-600"/><h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Localization Basis</h3>
                    </div>
                    <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 p-8 ${theme.components.card} bg-white rounded-2xl border ${theme.colors.border}`}>
                        <select className="w-full p-2.5 border rounded-lg bg-slate-50 text-sm font-bold" value={orgData.timezone} onChange={e => handleFieldChange('timezone', e.target.value)}>
                            <option value="UTC">UTC (Universal)</option>
                            <option value="EST">EST (New York)</option>
                        </select>
                         <select className="w-full p-2.5 border rounded-lg bg-slate-50 text-sm font-bold" value={orgData.language} onChange={e => handleFieldChange('language', e.target.value)}>
                            <option value="en-US">English (Global)</option>
                            <option value="es-ES">Spanish (ES)</option>
                        </select>
                    </div>
                </section>
            </div>
            <div className="pt-6 border-t border-slate-200 flex justify-end gap-3">
                 <button onClick={() => { setOrgData(state.governance.organization); setIsDirty(false); }} disabled={!isDirty} className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest ${isDirty ? 'bg-white border text-slate-700' : 'text-slate-300'}`}><RotateCcw size={14} className="inline mr-2"/> Revert</button>
                 <Button disabled={!isDirty} onClick={handleSave} icon={ShieldCheck} className="px-8 shadow-xl shadow-nexus-500/10">Commit Settings</Button>
            </div>
        </div>
    );
};
export default GeneralSettings;
