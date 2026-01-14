
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
        <div className={`h-full flex flex-col ${theme.colors.surface} border ${theme.colors.border} rounded-xl shadow-sm overflow-hidden`}>
            <div className={`p-6 border-b ${theme.colors.border} flex justify-between items-center ${theme.colors.background}`}>
                <div>
                    <h2 className={`text-xl font-bold ${theme.colors.text.primary} flex items-center gap-2`}>
                        <FileCode className="text-nexus-600" /> Native Schedule Parser
                    </h2>
                    <p className={`text-sm ${theme.colors.text.secondary} mt-1`}>Directly import .XER (Primavera) or .MPP (MS Project) binary files.</p>
                </div>
                <div className="flex gap-2">
                    <span className={`px-2 py-1 ${theme.colors.semantic.info.bg} ${theme.colors.semantic.info.text} text-xs font-bold rounded border ${theme.colors.semantic.info.border}`}>v18.8+ Supported</span>
                </div>
            </div>

            <div className="flex-1 p-8 overflow-y-auto">
                {status === 'idle' && (
                    <div className={`max-w-xl mx-auto text-center border-2 border-dashed ${theme.colors.border} rounded-2xl p-12 ${theme.colors.background} hover:${theme.colors.surface} hover:border-nexus-400 transition-colors group cursor-pointer relative`}>
                        <input type="file" accept=".xer,.mpp,.xml" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileUpload} />
                        <div className={`w-20 h-20 ${theme.colors.surface} rounded-full shadow-sm flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform`}>
                            <Upload size={40} className="text-nexus-500" />
                        </div>
                        <h3 className={`text-lg font-bold ${theme.colors.text.primary} mb-2`}>
                            {file ? file.name : "Drop Schedule File Here"}
                        </h3>
                        <p className={`text-sm ${theme.colors.text.tertiary}`}>
                            {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : "Supports .XER, .MPP, .XML"}
                        </p>
                    </div>
                )}

                {status === 'processing' && (
                     <div className="flex flex-col items-center justify-center h-full">
                         <div className="w-16 h-16 border-4 border-nexus-200 border-t-nexus-600 rounded-full animate-spin mb-4"></div>
                         <p className={`font-bold ${theme.colors.text.primary}`}>Parsing Binary Structure...</p>
                     </div>
                )}

                {status === 'idle' && file && (
                    <div className="mt-8 flex justify-center">
                        <Button onClick={runParser} size="lg" icon={Activity}>Run Parser</Button>
                    </div>
                )}

                {status === 'complete' && (
                    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4">
                        <div className={`${theme.colors.semantic.success.bg} border ${theme.colors.semantic.success.border} rounded-xl p-6 mb-8 flex items-center gap-4`}>
                            <div className={`p-3 bg-white rounded-full ${theme.colors.semantic.success.text}`}><CheckCircle size={32}/></div>
                            <div>
                                <h3 className={`text-lg font-bold ${theme.colors.semantic.success.text}`}>File Analyzed</h3>
                                <p className={`${theme.colors.semantic.success.text} text-sm`}>Ready for staging and mapping.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-4 gap-4 mb-8">
                            <div className={`p-4 ${theme.colors.surface} border ${theme.colors.border} rounded-xl shadow-sm text-center`}>
                                <div className={`${theme.colors.text.tertiary} mb-2`}><Layers className="mx-auto" size={20}/></div>
                                <div className={`text-2xl font-black ${theme.colors.text.primary}`}>{stats.projects}</div>
                                <div className={`text-xs font-bold ${theme.colors.text.secondary} uppercase`}>Project</div>
                            </div>
                            <div className={`p-4 ${theme.colors.surface} border ${theme.colors.border} rounded-xl shadow-sm text-center`}>
                                <div className={`${theme.colors.text.tertiary} mb-2`}><List className="mx-auto" size={20}/></div>
                                <div className={`text-2xl font-black ${theme.colors.text.primary}`}>{stats.wbs}</div>
                                <div className={`text-xs font-bold ${theme.colors.text.secondary} uppercase`}>WBS Nodes</div>
                            </div>
                            <div className={`p-4 ${theme.colors.surface} border ${theme.colors.border} rounded-xl shadow-sm text-center`}>
                                <div className={`${theme.colors.text.tertiary} mb-2`}><Calendar className="mx-auto" size={20}/></div>
                                <div className={`text-2xl font-black ${theme.colors.text.primary}`}>{stats.activities}</div>
                                <div className={`text-xs font-bold ${theme.colors.text.secondary} uppercase`}>Activities</div>
                            </div>
                            <div className={`p-4 ${theme.colors.surface} border ${theme.colors.border} rounded-xl shadow-sm text-center`}>
                                <div className={`${theme.colors.text.tertiary} mb-2`}><Activity className="mx-auto" size={20}/></div>
                                <div className={`text-2xl font-black ${theme.colors.text.primary}`}>{stats.relationships}</div>
                                <div className={`text-xs font-bold ${theme.colors.text.secondary} uppercase`}>Relationships</div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-8">
                            <Button variant="secondary" onClick={reset}>Discard</Button>
                            <Button icon={ArrowRight} onClick={onPushClick}>Map Fields & Import</Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
