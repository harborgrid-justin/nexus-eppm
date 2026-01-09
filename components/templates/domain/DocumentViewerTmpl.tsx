
import React, { useState } from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { FileText, Download } from 'lucide-react';
import { Button } from '../../ui/Button';

export const DocumentViewerTmpl: React.FC = () => {
    const theme = useTheme();
    const [page, setPage] = useState(1);
    
    return (
        <div className="h-full flex bg-slate-900 overflow-hidden">
            {/* Viewer Canvas */}
            <div className="flex-1 flex items-center justify-center p-8 bg-black/20 backdrop-blur-sm relative">
                <div className="bg-white w-full max-w-3xl aspect-[8.5/11] shadow-2xl flex flex-col items-center justify-center text-slate-300 animate-in zoom-in-95 duration-300 relative">
                    <FileText size={80} className="mb-4 text-slate-200"/>
                    <p className="font-medium text-slate-400">PDF Preview - Page {page}</p>
                    <div className="absolute top-4 right-4 text-xs font-mono text-slate-300">CONFIDENTIAL</div>
                </div>
                
                {/* Floating Controls */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white px-4 py-2 rounded-full shadow-lg flex gap-4 text-sm font-bold border border-slate-700 select-none">
                    <button onClick={() => setPage(p => Math.max(1, p-1))} className="hover:text-nexus-400 disabled:opacity-30" disabled={page===1}>Prev</button>
                    <span className="text-slate-500">|</span>
                    <span>Page {page} / 12</span>
                    <span className="text-slate-500">|</span>
                    <button onClick={() => setPage(p => Math.min(12, p+1))} className="hover:text-nexus-400 disabled:opacity-30" disabled={page===12}>Next</button>
                </div>
            </div>

            {/* Meta Sidebar */}
            <div className="w-96 bg-white border-l border-slate-200 flex flex-col shadow-xl z-10">
                <div className="p-6 border-b border-slate-100">
                    <div className="flex items-start gap-3">
                        <div className="p-3 bg-red-50 text-red-600 rounded-lg"><FileText size={24}/></div>
                        <div>
                            <h3 className="font-bold text-lg text-slate-900 leading-tight">Project_Charter_v2.pdf</h3>
                            <p className="text-xs text-slate-500 mt-1">Updated 2h ago by Mike Ross</p>
                        </div>
                    </div>
                </div>
                
                <div className="flex-1 p-6 space-y-6 overflow-y-auto">
                    <div className="space-y-1">
                        <label className="text-xs font-bold uppercase text-slate-400 tracking-wider">Description</label>
                        <p className="text-sm text-slate-600 leading-relaxed">Signed charter for Phase 1 construction initiation. Includes scope statement and authorized budget limits.</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold uppercase text-slate-400 tracking-wider">Version</label>
                            <p className="text-sm font-mono font-bold text-slate-800">2.0 (Draft)</p>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold uppercase text-slate-400 tracking-wider">Size</label>
                            <p className="text-sm font-mono font-bold text-slate-800">4.2 MB</p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-slate-400 tracking-wider">Tags</label>
                        <div className="flex flex-wrap gap-2">
                            <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-medium border border-slate-200">Contract</span>
                            <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-medium border border-slate-200">Legal</span>
                            <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-medium border border-slate-200">Phase 1</span>
                        </div>
                    </div>
                    
                    <div className="pt-6 border-t border-slate-100">
                        <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-3">Approvals</h4>
                        <div className="flex items-center justify-between text-sm p-2 bg-green-50 text-green-700 rounded border border-green-100">
                            <span className="font-bold">Project Manager</span>
                            <span>Signed ✓</span>
                        </div>
                    </div>
                </div>
                
                <div className="p-6 border-t border-slate-200 bg-slate-50">
                    <Button className="w-full" icon={Download}>Download Original</Button>
                </div>
            </div>
        </div>
    );
};
