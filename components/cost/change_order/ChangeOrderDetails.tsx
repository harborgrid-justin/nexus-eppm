import React from 'react';
import { ChangeOrder } from '../../../types/index';
import { useTheme } from '../../../context/ThemeContext';
import { FileText, Target, ShieldAlert, Layers } from 'lucide-react';

interface ChangeOrderDetailsProps {
    co: ChangeOrder;
    isReadOnly: boolean;
    onChange: (field: keyof ChangeOrder, value: any) => void;
}

export const ChangeOrderDetails: React.FC<ChangeOrderDetailsProps> = ({ co, isReadOnly, onChange }) => {
    const theme = useTheme();
    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-400">
            <div className="grid grid-cols-1 gap-10">
                <div className="relative group">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 block ml-1 flex items-center gap-2">
                        <FileText size={14}/> Descriptive Narrative
                    </label>
                    <textarea 
                        value={co.description}
                        disabled={isReadOnly}
                        onChange={(e) => onChange('description', e.target.value)}
                        placeholder="Detailed technical description of the proposed scope change..."
                        className={`w-full p-5 border-2 ${theme.colors.border} rounded-[2rem] text-sm h-48 focus:ring-8 focus:ring-nexus-500/5 focus:border-nexus-500 outline-none resize-none bg-slate-50/50 shadow-inner leading-relaxed transition-all`}
                    />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className={`${theme.components.card} p-8 rounded-[2.5rem] bg-white border-slate-100 shadow-sm relative overflow-hidden`}>
                        <div className="absolute top-0 right-0 p-12 bg-nexus-500/5 rounded-full blur-3xl pointer-events-none"></div>
                        <h3 className="font-black text-slate-900 text-sm uppercase tracking-widest mb-8 flex items-center gap-3 border-b border-slate-50 pb-4">
                            <Layers size={18} className="text-nexus-600"/> Classification Matrix
                        </h3>
                        <div className="space-y-8">
                            <div>
                                <label className="text-[10px] text-slate-500 block mb-2 font-black uppercase tracking-wider ml-1">Lifecycle Category</label>
                                <select 
                                    value={co.category || 'Client Request'} 
                                    onChange={(e) => onChange('category', e.target.value)}
                                    disabled={isReadOnly}
                                    className={`w-full p-4 border ${theme.colors.border} rounded-2xl text-sm font-bold bg-white focus:ring-4 focus:ring-nexus-500/10 transition-all cursor-pointer shadow-sm text-slate-700 outline-none`}
                                >
                                    <option>Client Request</option>
                                    <option>Design Error</option>
                                    <option>Unforeseen Condition</option>
                                    <option>Regulatory Compliance</option>
                                    <option>Value Engineering</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-[10px] text-slate-500 block mb-3 font-black uppercase tracking-wider ml-1">Exposure Criticality</label>
                                <div className="flex gap-2.5">
                                    {['Low', 'Medium', 'High', 'Critical'].map(p => (
                                        <button
                                            key={p}
                                            onClick={() => onChange('priority', p)}
                                            disabled={isReadOnly}
                                            className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all shadow-sm ${
                                                co.priority === p 
                                                ? `${theme.colors.semantic.info.bg} border-nexus-500 ${theme.colors.semantic.info.text} ring-1 ring-nexus-500 scale-105 z-10` 
                                                : `bg-white ${theme.colors.border} text-slate-400 hover:border-slate-300 hover:bg-slate-50`
                                            }`}
                                        >
                                            {p}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={`${theme.components.card} p-8 rounded-[2.5rem] bg-slate-900 text-white shadow-2xl relative overflow-hidden group`}>
                         <div className="absolute top-0 right-0 p-24 bg-white/5 rounded-full blur-3xl -mr-8 -mt-8 pointer-events-none group-hover:bg-white/10 transition-colors duration-700"></div>
                         <h3 className="font-black text-nexus-400 text-[10px] uppercase tracking-[0.2em] mb-8 flex items-center gap-3 border-b border-white/10 pb-4 relative z-10">
                            <Target size={18}/> Technical Justification
                        </h3>
                        <textarea 
                            value={co.justification || ''}
                            onChange={(e) => onChange('justification', e.target.value)}
                            disabled={isReadOnly}
                            placeholder="State the objective reason why this change is necessary for project completion..."
                            className={`w-full p-4 bg-white/5 border-2 border-white/10 rounded-2xl text-sm h-48 resize-none focus:ring-4 focus:ring-nexus-400/20 focus:border-nexus-400 transition-all outline-none leading-relaxed relative z-10 font-medium placeholder:text-slate-600`}
                        />
                    </div>
                </div>
            </div>
            
            <div className={`p-6 bg-amber-50/50 border border-amber-100 rounded-3xl flex gap-4 items-start shadow-sm`}>
                <ShieldAlert size={24} className="text-amber-600 shrink-0 mt-0.5"/>
                <div className="space-y-1">
                    <h4 className="text-[10px] font-black text-amber-900 uppercase tracking-widest">Configuration Alert</h4>
                    <p className="text-xs text-amber-800 leading-relaxed font-medium">Modifying these parameters will trigger an automated reassessment of the <strong>Performance Measurement Baseline (PMB)</strong>. Changes are not final until signed-off by the CCB.</p>
                </div>
            </div>
        </div>
    );
};