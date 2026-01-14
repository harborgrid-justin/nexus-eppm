import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { 
  Building2, Globe, Clock, Landmark, Image as ImageIcon, 
  Save, Upload, RotateCcw, ShieldCheck, DollarSign, Info 
} from 'lucide-react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';

const GeneralSettings: React.FC = () => {
    const theme = useTheme();
    const { state, dispatch } = useData();
    const { success } = useToast();
    
    // Mirroring state for local editing before commit
    const [orgData, setOrgData] = useState(state.governance.organization);
    const [isDirty, setIsDirty] = useState(false);

    // Sync if global state changes externally
    useEffect(() => {
        setOrgData(state.governance.organization);
    }, [state.governance.organization]);

    const handleFieldChange = (field: string, value: any) => {
        setOrgData(prev => ({ ...prev, [field]: value }));
        setIsDirty(true);
    };

    const handleSave = () => {
        dispatch({ 
            type: 'GOVERNANCE_UPDATE_ORG_PROFILE', 
            payload: orgData 
        });
        setIsDirty(false);
        success("System Config Updated", "Organization profile and fiscal parameters synchronized.");
    };

    const handleRevert = () => {
        setOrgData(state.governance.organization);
        setIsDirty(false);
    };

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                const result = ev.target?.result as string;
                handleFieldChange('logoUrl', result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="space-y-8 max-w-5xl h-full flex flex-col animate-nexus-in p-6">
            <div className="flex-1 overflow-y-auto pr-4 space-y-8 scrollbar-thin">
                
                {/* 1. Organization Identity Section */}
                <section className="space-y-4">
                    <div className="flex items-center gap-2">
                        <Building2 size={16} className="text-nexus-600"/>
                        <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">Organization Profile</h3>
                    </div>
                    
                    <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 p-8 ${theme.components.card}`}>
                        {/* Branding Asset Manager */}
                        <div className="md:col-span-1 flex flex-col items-center justify-center border-r border-slate-100 pr-8">
                            <div className="relative group w-full aspect-square">
                                {orgData.logoUrl ? (
                                    <div className="w-full h-full rounded-2xl border border-slate-200 p-4 bg-white shadow-inner flex items-center justify-center overflow-hidden">
                                        <img src={orgData.logoUrl} alt="Org Logo" className="max-w-full max-h-full object-contain" />
                                    </div>
                                ) : (
                                    <div className="w-full h-full rounded-2xl nexus-empty-pattern border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 group-hover:border-nexus-400 transition-all">
                                        <ImageIcon size={32} className="opacity-30 mb-2"/>
                                        <span className="text-[10px] font-black uppercase tracking-tighter">Null Asset</span>
                                    </div>
                                )}
                                
                                <label className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 rounded-2xl flex flex-col items-center justify-center text-white cursor-pointer transition-opacity backdrop-blur-[2px]">
                                    <Upload size={24} className="mb-1"/>
                                    <span className="text-[10px] font-bold uppercase tracking-widest">Update Logo</span>
                                    <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                                </label>
                            </div>
                            <div className="mt-4 text-center">
                                <p className="text-xs font-bold text-slate-800">Corporate Branding</p>
                                <p className="text-[10px] text-slate-500 mt-1">Global report header asset.</p>
                            </div>
                        </div>

                        {/* Text Metadata Fields */}
                        <div className="md:col-span-2 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Legal Entity Name</label>
                                    <Input 
                                        value={orgData.name || ''} 
                                        onChange={e => handleFieldChange('name', e.target.value)} 
                                        placeholder="Full legal name"
                                        className="bg-slate-50 font-bold"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Organization Short Name</label>
                                    <Input 
                                        value={orgData.shortName || ''} 
                                        onChange={e => handleFieldChange('shortName', e.target.value)} 
                                        placeholder="NEXUS"
                                        className="bg-slate-50 font-mono font-bold"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Tax ID / VAT</label>
                                <Input 
                                    value={orgData.taxId || ''} 
                                    onChange={e => handleFieldChange('taxId', e.target.value)} 
                                    placeholder="Enter corporate tax reference"
                                    className="bg-slate-50"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* 2. Localization & Fiscal Strategy Section */}
                <section className="space-y-4">
                    <div className="flex items-center gap-2">
                        <Globe size={16} className="text-nexus-600"/>
                        <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">Localization & Fiscal</h3>
                    </div>
                    
                    <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 p-8 ${theme.components.card}`}>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1 flex items-center gap-1.5">
                                    <Clock size={12}/> System Timezone
                                </label>
                                <select 
                                    className="w-full p-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:ring-2 focus:ring-nexus-500 outline-none font-bold text-slate-700"
                                    value={orgData.timezone}
                                    onChange={e => handleFieldChange('timezone', e.target.value)}
                                >
                                    <option value="UTC -8 (Pacific Time)">UTC -8 (Pacific Time)</option>
                                    <option value="UTC -5 (Eastern Time)">UTC -5 (Eastern Time)</option>
                                    <option value="UTC +0 (GMT)">UTC +0 (GMT)</option>
                                    <option value="UTC +1 (CET)">UTC +1 (CET)</option>
                                    <option value="UTC +8 (China)">UTC +8 (China Standard)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1 flex items-center gap-1.5">
                                    <Landmark size={12}/> Fiscal Year Start
                                </label>
                                <select 
                                    className="w-full p-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:ring-2 focus:ring-nexus-500 outline-none font-bold text-slate-700"
                                    value={orgData.fiscalYearStart}
                                    onChange={e => handleFieldChange('fiscalYearStart', e.target.value)}
                                >
                                    <option value="January">January</option>
                                    <option value="April">April</option>
                                    <option value="July">July</option>
                                    <option value="October">October</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Primary Language</label>
                                <select 
                                    className="w-full p-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:ring-2 focus:ring-nexus-500 outline-none font-bold text-slate-700"
                                    value={orgData.language}
                                    onChange={e => handleFieldChange('language', e.target.value)}
                                >
                                    <option value="English (US)">English (US)</option>
                                    <option value="Spanish (ES)">Español</option>
                                    <option value="French (FR)">Français</option>
                                    <option value="German (DE)">Deutsch</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Reporting Currency</label>
                                <div className="relative">
                                    <DollarSign size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"/>
                                    <input 
                                        disabled
                                        className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-500 font-black"
                                        value={orgData.currency || 'USD'} 
                                    />
                                </div>
                                <div className="mt-2 flex items-start gap-2 bg-amber-50/50 p-2 rounded-lg border border-amber-100">
                                    <Info size={12} className="text-amber-600 mt-0.5 shrink-0"/>
                                    <p className="text-[10px] text-amber-800 font-medium leading-relaxed">
                                        Base currency is locked to the global fiscal standard. To add secondary currencies, visit the <strong>Currency Registry</strong>.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
            
            {/* Global Commitment Bar */}
            <div className="pt-6 border-t border-slate-200 flex justify-end gap-3 pb-6">
                 <button 
                    disabled={!isDirty}
                    onClick={handleRevert}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                        isDirty 
                        ? 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 shadow-sm active:scale-95' 
                        : 'bg-transparent text-slate-300 cursor-not-allowed'
                    }`}
                 >
                    <RotateCcw size={14} /> Revert Changes
                 </button>
                 <button 
                    disabled={!isDirty}
                    onClick={handleSave}
                    className={`flex items-center gap-2 px-8 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                        isDirty 
                        ? 'bg-nexus-600 text-white hover:bg-nexus-700 shadow-lg shadow-nexus-500/20 active:scale-95' 
                        : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                    }`}
                 >
                    <ShieldCheck size={16} /> Save Configuration
                 </button>
            </div>
        </div>
    );
};

export default GeneralSettings;