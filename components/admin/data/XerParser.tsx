
import React, { useState } from 'react';
import { FileCode, Upload, ArrowRight, CheckCircle, List, Calendar, Activity, AlertTriangle, Layers, Play } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { Button } from '../../ui/Button';
import { useData } from '../../../context/DataContext';
import { useNavigate } from 'react-router-dom';

export const XerParser: React.FC = () => {
    const theme = useTheme();
    const { dispatch } = useData();
    const navigate = useNavigate();
    
    const [file, setFile] = useState<File | null>(null);
    const [status, setStatus] = useState<'idle' | 'parsing' | 'complete'>('idle');
    const [stats, setStats] = useState({ projects: 0, wbs: 0, activities: 0, relationships: 0 });

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setStatus('idle');
        }
    };

    const runParser = () => {
        setStatus('parsing');
        // Simulate complex binary parsing
        setTimeout(() => {
            setStats({
                projects: 1,
                wbs: 45,
                activities: 1240,
                relationships: 3402
            });
            setStatus('complete');
        }, 2000);
    };

    const handlePushToStaging = () => {
        // Mock the result of parsing the XER file into the Staging format
        // In a real app, this would be the output of the WASM parser
        const parsedData = [
            { Name: 'Detailed Engineering', Duration: 20, Start: '2024-01-01', Finish: '2024-01-20' },
            { Name: 'Procurement Cycle', Duration: 45, Start: '2024-01-15', Finish: '2024-02-28' },
            { Name: 'Construction Phase 1', Duration: 120, Start: '2024-03-01', Finish: '2024-07-01' },
            { Name: 'Commissioning', Duration: 30, Start: '2024-07-01', Finish: '2024-08-01' }
        ];

        dispatch({ 
            type: 'STAGING_INIT', 
            payload: { 
                type: 'Task', // We are importing Tasks
                data: parsedData 
            } 
        });

        // Navigate to the Import Wizard tab to review/commit
        // We assume the parent component handles tab switching or we navigate to the route
        // Since DataExchange manages tabs internally via state, we might need to alert the user
        // or if we are in a route-based view (future), navigate.
        // For now, simple alert and state update.
        alert("Schedule data pushed to Staging Area. Please switch to 'Data Import' tab to review and commit.");
    };

    return (
        <div className="h-full flex flex-col bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        <FileCode className="text-nexus-600" /> Native Schedule Parser
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">Directly import .XER (Primavera) or .MPP (MS Project) binary files.</p>
                </div>
                <div className="flex gap-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded border border-blue-200">v18.8+ Supported</span>
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded border border-purple-200">2016+ Supported</span>
                </div>
            </div>

            <div className="flex-1 p-8 overflow-y-auto">
                {status === 'idle' && (
                    <div className="max-w-xl mx-auto text-center border-2 border-dashed border-slate-300 rounded-2xl p-12 bg-slate-50 hover:bg-white hover:border-nexus-400 transition-colors group cursor-pointer relative">
                        <input type="file" accept=".xer,.mpp,.xml" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileUpload} />
                        <div className="w-20 h-20 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                            <Upload size={40} className="text-nexus-500" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-700 mb-2">
                            {file ? file.name : "Drop Schedule File Here"}
                        </h3>
                        <p className="text-slate-400 text-sm">
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

                {status === 'parsing' && (
                    <div className="flex flex-col items-center justify-center h-full">
                        <div className="w-16 h-16 border-4 border-nexus-200 border-t-nexus-600 rounded-full animate-spin mb-6"></div>
                        <h3 className="text-lg font-bold text-slate-800">Deconstructing Binary...</h3>
                        <p className="text-slate-500 font-mono text-xs mt-2 bg-slate-100 px-3 py-1 rounded">0x4F5241434C45 (ORACLE)</p>
                        <div className="w-64 h-2 bg-slate-200 rounded-full mt-6 overflow-hidden">
                            <div className="h-full bg-nexus-600 animate-[progress_2s_ease-in-out_infinite]"></div>
                        </div>
                    </div>
                )}

                {status === 'complete' && (
                    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4">
                        <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8 flex items-center gap-4">
                            <div className="p-3 bg-green-100 rounded-full text-green-700"><CheckCircle size={32}/></div>
                            <div>
                                <h3 className="text-lg font-bold text-green-800">Parsing Successful</h3>
                                <p className="text-green-700 text-sm">File structure valid. Ready for mapping.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-4 gap-4 mb-8">
                            <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm text-center">
                                <div className="text-slate-400 mb-2"><Layers className="mx-auto" size={20}/></div>
                                <div className="text-2xl font-black text-slate-900">{stats.projects}</div>
                                <div className="text-xs font-bold text-slate-500 uppercase">Project</div>
                            </div>
                            <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm text-center">
                                <div className="text-slate-400 mb-2"><List className="mx-auto" size={20}/></div>
                                <div className="text-2xl font-black text-slate-900">{stats.wbs}</div>
                                <div className="text-xs font-bold text-slate-500 uppercase">WBS Nodes</div>
                            </div>
                            <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm text-center">
                                <div className="text-slate-400 mb-2"><Calendar className="mx-auto" size={20}/></div>
                                <div className="text-2xl font-black text-slate-900">{stats.activities}</div>
                                <div className="text-xs font-bold text-slate-500 uppercase">Activities</div>
                            </div>
                            <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm text-center">
                                <div className="text-slate-400 mb-2"><Activity className="mx-auto" size={20}/></div>
                                <div className="text-2xl font-black text-slate-900">{stats.relationships}</div>
                                <div className="text-xs font-bold text-slate-500 uppercase">Relationships</div>
                            </div>
                        </div>

                        <div className="bg-slate-900 rounded-xl p-6 text-white font-mono text-xs overflow-hidden relative">
                             <div className="absolute top-4 right-4 text-green-400 font-bold uppercase tracking-widest text-[10px]">Preview</div>
                             <div className="opacity-70 space-y-1">
                                <p className="text-yellow-400">PROJECT: "Downtown Metro Hub"</p>
                                <p className="pl-4 text-blue-300">WBS: 1 "Design"</p>
                                <p className="pl-8">ACT: A1000 "Detailed Engineering" (20d)</p>
                                <p className="pl-8">ACT: A1010 "Review Cycle" (5d)</p>
                                <p className="pl-4 text-blue-300">WBS: 2 "Procurement"</p>
                                <p className="pl-8">ACT: A2000 "Long Lead Items" (45d)</p>
                                <p className="pl-12 text-slate-500">... {stats.activities} more lines</p>
                             </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-8">
                            <Button variant="secondary" onClick={() => setStatus('idle')}>Discard</Button>
                            <Button icon={ArrowRight} onClick={handlePushToStaging}>Map Fields & Import</Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
