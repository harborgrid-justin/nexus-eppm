
import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Save, ChevronRight, CheckCircle, Table, FileText, User, Calendar, DollarSign, ArrowLeft, ArrowRight, Info, Settings, Sliders } from 'lucide-react';

const TemplateHeader = ({ number, title, subtitle }: { number: string, title: string, subtitle?: string }) => (
    <div className="flex items-start gap-4 mb-8">
        <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-mono text-lg font-bold shadow-lg shadow-slate-200 shrink-0">
            {number}
        </div>
        <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{title}</h2>
            {subtitle && <p className="text-slate-500 mt-1">{subtitle}</p>}
        </div>
    </div>
);

/**
 * 11. Simple Entity Form
 */
export const SimpleFormTmpl: React.FC = () => {
    const theme = useTheme();
    const [name, setName] = useState('');
    
    return (
        <div className={`h-full flex flex-col items-center justify-center ${theme.colors.background} ${theme.layout.pagePadding} overflow-y-auto`}>
            <div className="w-full max-w-md mb-6">
                 <TemplateHeader number="11" title="Simple Form" subtitle="Modal-style input capture" />
            </div>
            <Card className="w-full max-w-md p-0 overflow-hidden shadow-2xl border-0 ring-1 ring-slate-900/5">
                <div className={`p-6 border-b border-slate-100 bg-white`}>
                    <h2 className="text-lg font-bold text-slate-900">Create New Record</h2>
                    <p className="text-xs text-slate-500 mt-1">Enter basic details to initialize item.</p>
                </div>
                <div className={`${theme.layout.cardPadding} ${theme.layout.sectionSpacing} bg-white`}>
                    <div>
                        <label className={`${theme.typography.label} block mb-2`}>Record Name</label>
                        <Input placeholder="e.g. Phase 1 Audit" autoFocus className="bg-slate-50" value={name} onChange={e => setName(e.target.value)} />
                    </div>
                    <div>
                        <label className={`${theme.typography.label} block mb-2`}>Category</label>
                        <select className="w-full border border-slate-200 rounded-lg p-2.5 text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-nexus-500 outline-none transition-all cursor-pointer font-medium text-slate-700">
                            <option>Compliance</option>
                            <option>Financial</option>
                            <option>Operational</option>
                        </select>
                    </div>
                    <div>
                        <label className={`${theme.typography.label} block mb-2`}>Description</label>
                        <textarea className="w-full border border-slate-200 rounded-lg p-3 text-sm h-32 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-nexus-500 outline-none resize-none transition-all" placeholder="Add context..."></textarea>
                    </div>
                </div>
                <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
                    <Button variant="ghost">Cancel</Button>
                    <Button onClick={() => alert('Saved: ' + name)}>Create Record</Button>
                </div>
            </Card>
        </div>
    );
};

/**
 * 12. Complex Entity Form
 */
export const ComplexFormTmpl: React.FC = () => {
    const theme = useTheme();
    const [tab, setTab] = useState('General');
    
    return (
        <div className="h-full flex flex-col bg-slate-50">
            {/* Action Header */}
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
                {/* Main Form Content */}
                <div className={`flex-1 overflow-y-auto ${theme.layout.pagePadding}`}>
                    <div className="max-w-5xl mx-auto">
                        <div className="mb-6">
                            <TemplateHeader number="12" title="Complex Entity" />
                        </div>
                        
                        {/* Tabs */}
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
                
                {/* Right Sidebar Meta */}
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
                    <div className="p-6 bg-slate-50 border-t border-slate-200">
                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Attachments</h4>
                        <div className="space-y-2">
                             <div className="p-3 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 flex items-center gap-3 cursor-pointer hover:border-nexus-300 hover:shadow-sm transition-all">
                                 <div className="p-1.5 bg-green-50 text-green-600 rounded"><Table size={14}/></div>
                                 Budget_v2.xlsx
                             </div>
                             <div className="p-3 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 flex items-center gap-3 cursor-pointer hover:border-nexus-300 hover:shadow-sm transition-all">
                                 <div className="p-1.5 bg-red-50 text-red-600 rounded"><FileText size={14}/></div>
                                 Contract_MSA.pdf
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

/**
 * 13. Stepper Wizard
 */
export const WizardTmpl: React.FC = () => {
    const theme = useTheme();
    const [step, setStep] = useState(1);

    return (
        <div className={`h-full flex flex-col items-center justify-center bg-slate-100 ${theme.layout.pagePadding} overflow-y-auto`}>
             <div className="w-full max-w-4xl mb-6">
                <TemplateHeader number="13" title="Multi-Step Wizard" subtitle="Progressive data collection" />
             </div>
            <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl flex flex-col min-h-[600px] overflow-hidden border border-slate-200">
                {/* Wizard Header */}
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
                    {/* Abstract bg element */}
                    <div className="absolute -right-10 -bottom-20 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
                </div>

                <div className="flex flex-1">
                    {/* Sidebar Steps */}
                    <div className="w-72 bg-slate-50 border-r border-slate-200 p-8 hidden md:block">
                        <div className="space-y-8 relative">
                             {/* Vertical Line */}
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

                    {/* Content */}
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

                        {/* Footer Controls */}
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

export const BulkEditTmpl: React.FC = () => {
    const theme = useTheme();
    const [selectedRows, setSelectedRows] = useState<number[]>([]);
    
    const toggleRow = (id: number) => {
        setSelectedRows(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    return (
        <div className={`h-full overflow-y-auto ${theme.layout.pagePadding}`}>
            <TemplateHeader number="14" title="Bulk Editor" subtitle="Spreadsheet-style data manipulation" />
            <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="p-4 text-left w-10"><input type="checkbox"/></th>
                                <th className="p-4 text-left">Item Name</th>
                                <th className="p-4 text-left">Category</th>
                                <th className="p-4 text-left">Status</th>
                                <th className="p-4 text-right">Value</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {[1, 2, 3, 4, 5].map(i => (
                                <tr key={i} className={`group hover:bg-blue-50/50 ${selectedRows.includes(i) ? 'bg-blue-50' : ''}`}>
                                    <td className="p-4"><input type="checkbox" checked={selectedRows.includes(i)} onChange={() => toggleRow(i)} className="rounded text-nexus-600"/></td>
                                    <td className="p-2"><Input defaultValue={`Item ${i}`} className="h-8 text-sm border-transparent group-hover:border-slate-300 group-hover:bg-white"/></td>
                                    <td className="p-2">
                                        <select className="w-full h-8 text-sm border border-transparent rounded px-2 bg-transparent group-hover:border-slate-300 group-hover:bg-white">
                                            <option>Hardware</option>
                                            <option>Software</option>
                                            <option>Service</option>
                                        </select>
                                    </td>
                                    <td className="p-2">
                                        <select className="w-full h-8 text-sm border border-transparent rounded px-2 bg-transparent group-hover:border-slate-300 group-hover:bg-white">
                                            <option>Active</option>
                                            <option>Pending</option>
                                            <option>Archived</option>
                                        </select>
                                    </td>
                                    <td className="p-2"><Input defaultValue={`${(i * 150).toFixed(2)}`} className="h-8 text-sm text-right font-mono border-transparent group-hover:border-slate-300 group-hover:bg-white"/></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
                    <span className="text-xs text-slate-500 font-bold uppercase">{selectedRows.length} Records Selected</span>
                    <div className="flex gap-2">
                        <Button variant="danger" size="sm">Delete</Button>
                        <Button size="sm">Update All</Button>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export const SettingsConfigTmpl: React.FC = () => {
    const theme = useTheme();
    const [activeTab, setActiveTab] = useState('General');
    const [toggles, setToggles] = useState({ maint: false, debug: true });

    return (
        <div className={`h-full flex flex-col ${theme.layout.pagePadding}`}>
            <TemplateHeader number="15" title="Configuration Panel" subtitle="System parameters & switches" />
            <div className={`flex flex-1 ${theme.layout.gridGap}`}>
                <div className="w-64 space-y-1">
                    {['General', 'Notifications', 'Security', 'Integrations'].map((tab, i) => (
                        <button 
                            key={tab} 
                            onClick={() => setActiveTab(tab)}
                            className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium ${tab === activeTab ? 'bg-nexus-50 text-nexus-700' : 'text-slate-600 hover:bg-slate-100'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
                <div className="flex-1 max-w-2xl space-y-6">
                    <Card className={theme.layout.cardPadding}>
                        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Settings size={18}/> {activeTab} Settings</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">System Name</label>
                                <Input defaultValue="Nexus Production" />
                            </div>
                            <div className="flex items-center justify-between p-3 border rounded-lg">
                                <div>
                                    <div className="text-sm font-medium text-slate-900">Maintenance Mode</div>
                                    <div className="text-xs text-slate-500">Prevent new logins during updates</div>
                                </div>
                                <input type="checkbox" checked={toggles.maint} onChange={() => setToggles({...toggles, maint: !toggles.maint})} className="w-10 h-5 rounded-full appearance-none bg-slate-200 checked:bg-nexus-600 relative cursor-pointer transition-all before:content-[''] before:absolute before:w-4 before:h-4 before:bg-white before:rounded-full before:top-0.5 before:left-0.5 checked:before:left-5 shadow-inner" />
                            </div>
                            <div className="flex items-center justify-between p-3 border rounded-lg">
                                <div>
                                    <div className="text-sm font-medium text-slate-900">Debug Logging</div>
                                    <div className="text-xs text-slate-500">Verbose output stream</div>
                                </div>
                                <input type="checkbox" checked={toggles.debug} onChange={() => setToggles({...toggles, debug: !toggles.debug})} className="w-10 h-5 rounded-full appearance-none bg-slate-200 checked:bg-nexus-600 relative cursor-pointer transition-all before:content-[''] before:absolute before:w-4 before:h-4 before:bg-white before:rounded-full before:top-0.5 before:left-0.5 checked:before:left-5 shadow-inner" />
                            </div>
                        </div>
                    </Card>
                    <div className="flex justify-end gap-3">
                        <Button variant="ghost">Reset Defaults</Button>
                        <Button>Save Changes</Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
