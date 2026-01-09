
import React, { useState } from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { CheckCircle, Info, ArrowLeft, ArrowRight } from 'lucide-react';
import { TemplateHeader } from '../TemplateHeader';

export const WizardTmpl: React.FC = () => {
    const theme = useTheme();
    const [step, setStep] = useState(1);

    return (
        <div className={`h-full flex flex-col items-center justify-center bg-slate-100 ${theme.layout.pagePadding} overflow-y-auto`}>
             <div className="w-full max-w-4xl mb-6">
                <TemplateHeader number="13" title="Multi-Step Wizard" subtitle="Progressive data collection" />
             </div>
            <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl flex flex-col min-h-[600px] overflow-hidden border border-slate-200">
                <div className="bg-slate-900 p-10 text-white flex justify-between items-center relative overflow-hidden">
                    <div className="relative z-10">
                        <h2 className="text-3xl font-black tracking-tight mb-2">New Project Setup</h2>
                        <p className="text-slate-400 text-sm">Configure project baseline and initial parameters.</p>
                    </div>
                    <div className="flex items-center gap-6 relative z-10">
                         <div className="text-right hidden sm:block">
                             <p className="text-xs font-black uppercase tracking-widest text-nexus-400 mb-1">Step {step} of 4</p>
                             <p className="font-bold text-white text-lg">Resource Planning</p>
                         </div>
                         <div className="w-16 h-16 rounded-full border-4 border-nexus-500 flex items-center justify-center font-black text-2xl bg-slate-800 shadow-lg">{step * 25}%</div>
                    </div>
                    <div className="absolute -right-10 -bottom-20 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
                </div>

                <div className="flex flex-1">
                    <div className="w-72 bg-slate-50 border-r border-slate-200 p-8 hidden md:block">
                        <div className="space-y-8 relative">
                             <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-slate-200 -z-10"></div>
                             
                             {[
                                 { label: 'General Info', status: step > 1 ? 'done' : step === 1 ? 'current' : 'pending' },
                                 { label: 'Resource Planning', status: step > 2 ? 'done' : step === 2 ? 'current' : 'pending' },
                                 { label: 'Financials', status: step > 3 ? 'done' : step === 3 ? 'current' : 'pending' },
                                 { label: 'Review', status: step === 4 ? 'current' : 'pending' },
                             ].map((s, i) => (
                                 <div key={i} className="flex gap-4 items-center group">
                                     <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all shadow-sm ${
                                         s.status === 'done' ? 'bg-green-500 border-green-500 text-white' :
                                         s.status === 'current' ? 'bg-white border-nexus-600 text-nexus-600 ring-4 ring-nexus-50' :
                                         'bg-white border-slate-200 text-slate-300'
                                     }`}>
                                         {s.status === 'done' ? <CheckCircle size={18}/> : i+1}
                                     </div>
                                     <span className={`text-sm font-medium transition-colors ${s.status === 'current' ? 'text-slate-900 font-bold' : s.status === 'done' ? 'text-slate-700' : 'text-slate-400'}`}>
                                         {s.label}
                                     </span>
                                 </div>
                             ))}
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col bg-white">
                        <div className={`flex-1 ${theme.layout.cardPadding} overflow-y-auto`}>
                            <h3 className="font-bold text-2xl text-slate-900 mb-8 pb-4 border-b border-slate-100">Step {step} Details</h3>
                            <div className="space-y-8 max-w-xl">
                                <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 text-sm text-blue-800 flex gap-3 items-start">
                                    <Info className="shrink-0 mt-0.5" size={18}/>
                                    Estimate the primary labor and equipment needs for the initial phase. Detailed assignments can be adjusted later.
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Estimated Headcount</label>
                                    <Input placeholder="e.g. 12" type="number" className="h-12 text-lg" />
                                </div>
                            </div>
                        </div>

                        <div className="p-6 border-t border-slate-200 flex justify-between bg-slate-50 items-center">
                            <Button variant="ghost" icon={ArrowLeft} className="text-slate-500" onClick={() => setStep(s => Math.max(1, s - 1))} disabled={step===1}>Back</Button>
                            <div className="flex gap-3">
                                <Button variant="secondary">Save Draft</Button>
                                <Button icon={ArrowRight} className="shadow-lg shadow-nexus-500/30" onClick={() => setStep(s => Math.min(4, s + 1))}>Next Step</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
