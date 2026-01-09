
import React, { useState } from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { Save, FileText, User, Calendar } from 'lucide-react';
import { TemplateHeader } from '../TemplateHeader';

export const ComplexFormTmpl: React.FC = () => {
    const theme = useTheme();
    const [tab, setTab] = useState('General');
    
    return (
        <div className="h-full flex flex-col bg-slate-50">
            <div className={`bg-white border-b border-slate-200 ${theme.layout.pagePadding} py-5 flex justify-between items-center shadow-sm z-10 sticky top-0`}>
                <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-nexus-50 text-nexus-600 rounded-xl border border-nexus-100 shadow-sm"><FileText size={24}/></div>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Project Alpha Specification</h1>
                            <span className="bg-green-100 text-green-700 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide border border-green-200">Active</span>
                        </div>
                        <div className="text-xs text-slate-500 mt-1 font-mono">ID: P-1002 • REV: 3.1</div>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline">Discard Changes</Button>
                    <Button icon={Save}>Save & Close</Button>
                </div>
            </div>
            
            <div className="flex-1 overflow-hidden flex">
                <div className={`flex-1 overflow-y-auto ${theme.layout.pagePadding}`}>
                    <div className="max-w-5xl mx-auto">
                        <div className="mb-6">
                            <TemplateHeader number="12" title="Complex Entity" />
                        </div>
                        
                        <div className="flex gap-1 border-b border-slate-200 mb-8">
                            {['General', 'Financials', 'Schedule', 'Resources'].map(t => (
                                <button key={t} onClick={() => setTab(t)} className={`px-6 py-3 text-sm font-bold border-b-2 transition-all ${tab === t ? 'border-nexus-600 text-nexus-700 bg-white rounded-t-lg shadow-sm' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>
                                    {t}
                                </button>
                            ))}
                        </div>

                        <Card className={`${theme.layout.cardPadding} mb-6 shadow-sm border-slate-200`}>
                            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                                <span className="w-1 h-6 bg-nexus-500 rounded-full"></span> {tab} Information
                            </h3>
                            <div className={`grid grid-cols-1 md:grid-cols-2 ${theme.layout.gridGap}`}>
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Title</label>
                                    <Input defaultValue="Project Alpha Specification" className="font-bold text-slate-800" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Owner</label>
                                    <div className="relative">
                                        <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                                        <Input className="pl-10" defaultValue="Mike Ross" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Due Date</label>
                                    <div className="relative">
                                        <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                                        <Input className="pl-10" type="date" />
                                    </div>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Detailed Description</label>
                                    <textarea className="w-full border border-slate-200 bg-slate-50 rounded-lg p-4 text-sm h-32 focus:bg-white focus:ring-2 focus:ring-nexus-500 outline-none transition-all" placeholder="Enter details..."></textarea>
                                </div>
                            </div>
                        </Card>

                        {tab === 'General' && (
                            <Card className={`${theme.layout.cardPadding} shadow-sm border-slate-200`}>
                                <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                                    <span className="w-1 h-6 bg-green-500 rounded-full"></span> Additional Metadata
                                </h3>
                                <div className={`grid grid-cols-1 md:grid-cols-3 ${theme.layout.gridGap}`}>
                                     <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Priority</label>
                                        <select className="w-full border border-slate-200 p-2.5 rounded-lg bg-slate-50 text-sm font-medium outline-none focus:ring-2 focus:ring-nexus-500"><option>High</option></select>
                                     </div>
                                     <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Department</label>
                                        <select className="w-full border border-slate-200 p-2.5 rounded-lg bg-slate-50 text-sm font-medium outline-none focus:ring-2 focus:ring-nexus-500"><option>Engineering</option></select>
                                     </div>
                                </div>
                            </Card>
                        )}
                    </div>
                </div>
                
                <div className="w-80 border-l border-slate-200 bg-white flex flex-col h-full shadow-lg z-20">
                    <div className="p-6 border-b border-slate-100 bg-slate-50">
                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Audit Log</h4>
                    </div>
                    <div className="p-6 space-y-6 overflow-y-auto flex-1">
                        {[
                            { user: 'Mike Ross', action: 'Updated status', time: '2h ago' },
                            { user: 'Sarah Chen', action: 'Approved budget', time: '1d ago' },
                            { user: 'System', action: 'Created record', time: '3d ago' },
                        ].map((log, i) => (
                            <div key={i} className="flex gap-4 relative">
                                <div className="flex flex-col items-center">
                                    <div className="w-2.5 h-2.5 rounded-full bg-slate-300 mt-1.5 ring-4 ring-white"></div>
                                    {i < 2 && <div className="w-px h-full bg-slate-200 my-1"></div>}
                                </div>
                                <div>
                                    <p className="font-bold text-sm text-slate-800">{log.user}</p>
                                    <p className="text-slate-500 text-xs mt-0.5">{log.action}</p>
                                    <p className="text-[10px] text-slate-400 mt-1 font-mono">{log.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
