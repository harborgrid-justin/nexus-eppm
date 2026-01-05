
import React from 'react';
import { FileCode, Upload, ArrowRight, CheckCircle, List, Calendar, Activity, Layers, Play } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { Button } from '../../ui/Button';
import { useXerParserLogic } from '../../../hooks/domain/useXerParserLogic';

export const XerParser: React.FC = () => {
    const theme = useTheme();
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
        handlePushToStaging();
        alert("File analyzed. Data pushed to Import Staging Area for mapping.");
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
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded border border-blue-200">v18.8+ Supported</span>
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded border border-purple-200">2016+ Supported</span>
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
                        {file && (
                            <Button className="mt-6 pointer-events-none" onClick={(e) => e.preventDefault()} icon={Play}>Analyze File Structure</Button>
                        )}
                    </div>
                )}

                {status === 'idle' && file && (
                    <div className="mt-8 flex justify-center">
                        <Button onClick={runParser} size="lg" icon={Activity}>Run Parser</Button>
                    </div>
                )}

                {status === 'complete' && (
                    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4">
                        <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8 flex items-center gap-4">
                            <div className="p-3 bg-green-100 rounded-full text-green-700"><CheckCircle size={32}/></div>
                            <div>
                                <h3 className="text-lg font-bold text-green-800">File Analyzed</h3>
                                <p className="text-green-700 text-sm">Ready for staging and mapping.</p>
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
