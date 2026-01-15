
import React from 'react';
import { FileCode, Upload, ArrowRight, CheckCircle, List, Calendar, Activity, Layers, Play } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { Button } from '../../ui/Button';
import { useXerParserLogic } from '../../../hooks/domain/useXerParserLogic';
import { useToast } from '../../../context/ToastContext';

export const XerParser: React.FC = () => {
    const theme = useTheme();
    const { success, error } = useToast();
    const {
        file,
        status,
        stats,
        handleFileUpload,
        runParser,
        handlePushToStaging,
        reset
    } = useXerParserLogic();

    const onPushClick = () => {
        const res = handlePushToStaging();
        if (res?.success) {
            success("Import Staged", "Schedule data pushed to Import Staging Area for mapping.");
        } else {
            error("Import Failed", "Could not stage data. Check file validity.");
        }
    };

    return (
        <div className={`h-full flex flex-col bg-white overflow-hidden shadow-inner`}>
            <div className={`p-10 border-b border-slate-100 flex justify-between items-center bg-slate-50/30`}>
                <div>
                    <h2 className={`text-2xl font-black text-slate-900 flex items-center gap-4 uppercase tracking-tighter`}>
                        <FileCode className="text-nexus-600" size={32} /> Schedule Binary Ingestion
                    </h2>
                    <p className={`text-sm text-slate-500 mt-1 font-medium`}>Directly import .XER (Primavera) or .MPP (MS Project) artifacts.</p>
                </div>
                <div className="flex gap-2">
                    <span className={`px-4 py-2 bg-blue-50 text-blue-700 text-[10px] font-black uppercase tracking-widest rounded-xl border border-blue-100 shadow-sm`}>v18.8+ HANDSHAKE READY</span>
                </div>
            </div>

            <div className="flex-1 p-12 overflow-y-auto scrollbar-thin">
                {status === 'idle' && (
                    <div className={`max-w-2xl mx-auto text-center border-4 border-dashed border-slate-200 rounded-[3rem] p-20 bg-slate-50 hover:bg-white hover:border-nexus-400 transition-all group cursor-pointer relative shadow-inner nexus-empty-pattern`}>
                        <input type="file" accept=".xer,.mpp,.xml" className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={handleFileUpload} />
                        <div className={`w-24 h-24 bg-white rounded-3xl shadow-2xl flex items-center justify-center mx-auto mb-10 group-hover:scale-110 transition-transform rotate-3 group-hover:rotate-0 duration-500 border border-slate-100`}>
                            <Upload size={48} className="text-nexus-500" />
                        </div>
                        <h3 className={`text-xl font-black text-slate-900 mb-2 uppercase tracking-tighter`}>
                            {file ? file.name : "Drop Schedule Artifact Here"}
                        </h3>
                        <p className={`text-sm text-slate-400 font-medium`}>
                            {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : "Industry standard .XER, .MPP, or schema .XML files (Max 50MB)"}
                        </p>
                    </div>
                )}

                {status === 'processing' && (
                     <div className="flex flex-col items-center justify-center h-full py-20">
                         <div className="w-20 h-20 border-8 border-slate-100 border-t-nexus-600 rounded-full animate-spin mb-8 shadow-inner"></div>
                         <p className={`font-black uppercase tracking-[0.3em] text-nexus-700 animate-pulse`}>Parsing Binary Logic Structure...</p>
                     </div>
                )}

                {status === 'idle' && file && (
                    <div className="mt-12 flex justify-center">
                        <Button onClick={runParser} size="lg" icon={Activity} className="px-12 h-14 font-black uppercase tracking-widest shadow-2xl shadow-nexus-500/20">Analyze Schema</Button>
                    </div>
                )}

                {status === 'complete' && (
                    <div className="max-w-5xl mx-auto animate-nexus-in">
                        <div className={`bg-green-50 border border-green-200 rounded-[2.5rem] p-10 mb-10 flex items-center gap-8 shadow-sm`}>
                            <div className={`p-5 bg-white rounded-3xl text-green-600 shadow-xl border border-green-100 shrink-0`}><CheckCircle size={40}/></div>
                            <div>
                                <h3 className={`text-2xl font-black text-green-900 uppercase tracking-tighter`}>Heuristic Analysis Complete</h3>
                                <p className={`text-green-800 font-medium mt-1`}>Network logic verified. Ready for staging and domain mapping.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                            {[
                                { icon: Layers, label: 'Projects', val: stats.projects, color: 'text-blue-500' },
                                { icon: List, label: 'WBS Nodes', val: stats.wbs, color: 'text-indigo-500' },
                                { icon: Calendar, label: 'Activities', val: stats.activities, color: 'text-purple-500' },
                                { icon: Activity, label: 'Logic Links', val: stats.relationships, color: 'text-red-500' }
                            ].map((s, idx) => (
                                <div key={idx} className={`p-8 bg-white border border-slate-200 rounded-[2rem] shadow-sm text-center group hover:border-nexus-300 transition-all`}>
                                    <div className={`${s.color} mb-4 opacity-40 group-hover:opacity-100 transition-opacity`}><s.icon className="mx-auto" size={28}/></div>
                                    <div className={`text-4xl font-black text-slate-900 font-mono tracking-tighter`}>{s.val}</div>
                                    <div className={`text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2`}>{s.label}</div>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-end gap-4 mt-12 pb-20 border-t border-slate-100 pt-8">
                            <Button variant="ghost" onClick={reset} className="font-black uppercase tracking-widest text-[10px]">Discard Artifact</Button>
                            <Button icon={ArrowRight} onClick={onPushClick} className="px-12 h-14 font-black uppercase tracking-widest shadow-2xl shadow-nexus-500/20">Commit to Staging Area</Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
