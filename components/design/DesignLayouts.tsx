import React, { useState } from 'react';
import { 
  LayoutTemplate, PanelLeftClose, PanelLeftOpen, Maximize2, Minimize2, 
  Menu, Search, Bell, User, Settings, ChevronRight, MoreHorizontal, 
  Plus, Filter, Download, Upload, Calendar, Grid, List, CheckSquare,
  ArrowLeft, Sidebar as SidebarIcon, Columns, Monitor, Smartphone, Tablet,
  MessageSquare, Folder, FileText, Check, DollarSign, Globe, Terminal,
  Info, ExternalLink, Hash, MoreVertical, XCircle, AlertTriangle, FileCode,
  FolderOpen, Home, CheckCircle, Square, Layers, Layout, 
  CreditCard, Share2, MousePointer2, GitPullRequest, Copy, RefreshCw,
  // Added missing ChevronDown and X icons to fix compilation errors
  ChevronDown, X
} from 'lucide-react';
import { SectionHeading, DemoContainer, ComponentLabel, EmptyPatternDemo } from './DesignHelpers';
import { Badge } from '../ui/Badge';
import { ProgressBar } from '../common/ProgressBar';
import { Button } from '../ui/Button';

export const DesignLayouts = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="space-y-16 animate-nexus-in pb-32">
        <SectionHeading title="Structural Layouts" icon={LayoutTemplate} count="LO-01 to LO-70" />
        
        {/* --- 1. APPLICATION SHELLS (01-10) --- */}
        <div className="space-y-6">
            <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Global App Shells</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <DemoContainer>
                    <ComponentLabel id="LO-01" name="App Shell (Sidebar)" />
                    <div className="h-32 border border-slate-200 rounded-xl flex overflow-hidden bg-white shadow-sm">
                        <div className={`bg-slate-800 h-full transition-all duration-300 flex flex-col ${sidebarCollapsed ? 'w-6' : 'w-16'}`}>
                            <div className="h-4 w-4 bg-nexus-500 m-2 rounded-md"></div>
                        </div>
                        <div className="flex-1 flex flex-col">
                            <div className="h-8 border-b bg-white flex items-center px-2 justify-between">
                                <div className="h-2 w-16 bg-slate-100 rounded"></div>
                                <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="text-slate-400 hover:text-nexus-600 transition-colors">
                                    {sidebarCollapsed ? <PanelLeftOpen size={12}/> : <PanelLeftClose size={12}/>}
                                </button>
                            </div>
                            <div className="flex-1 bg-slate-50/50 p-2">
                                <div className="h-full bg-white border border-dashed border-slate-200 rounded flex items-center justify-center text-[8px] font-black text-slate-300 uppercase">Workspace</div>
                            </div>
                        </div>
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="LO-02" name="Holy Grail (3-Pane)" />
                    <div className="h-32 border border-slate-200 rounded-xl flex flex-col bg-white overflow-hidden shadow-sm">
                        <div className="h-6 bg-slate-900 w-full"></div>
                        <div className="flex-1 flex">
                            <div className="w-10 bg-slate-50 border-r border-slate-100"></div>
                            <div className="flex-1 bg-white"></div>
                            <div className="w-14 bg-slate-50 border-l border-slate-100"></div>
                        </div>
                        <div className="h-3 bg-slate-100 border-t border-slate-200 w-full"></div>
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="LO-03" name="Canvas (No Chrome)" />
                    <div className="h-32 border-2 border-slate-900 rounded-xl bg-white relative flex items-center justify-center overflow-hidden">
                        <div className="absolute inset-0 nexus-empty-pattern opacity-30"></div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest relative z-10">Fullscreen Focus</span>
                    </div>
                </DemoContainer>
            </div>
        </div>

        {/* --- 2. NAVIGATION SYSTEMS (11-20) --- */}
        <div className="space-y-6">
            <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Navigation Structures</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <DemoContainer>
                    <ComponentLabel id="LO-11" name="Stacked Tab Navigation" />
                    <div className="space-y-3">
                        <div className="flex border-b border-slate-200 gap-6 px-2">
                             <div className="pb-2 border-b-2 border-nexus-600 text-[10px] font-black uppercase text-nexus-700">Active</div>
                             <div className="pb-2 border-b-2 border-transparent text-[10px] font-bold uppercase text-slate-400">Queue</div>
                             <div className="pb-2 border-b-2 border-transparent text-[10px] font-bold uppercase text-slate-400">Archive</div>
                        </div>
                        <div className="h-12 bg-slate-50 rounded-lg"></div>
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="LO-14" name="Nested Vertical Rail" />
                    <div className="flex gap-4">
                        <div className="w-8 space-y-2 py-2">
                            <div className="w-8 h-8 rounded-lg bg-slate-900"></div>
                            <div className="w-8 h-8 rounded-lg bg-slate-200"></div>
                            <div className="w-8 h-8 rounded-lg bg-slate-200"></div>
                        </div>
                        <div className="flex-1 space-y-2 border-l border-slate-100 pl-4 py-2">
                             <div className="h-2 w-24 bg-slate-300 rounded"></div>
                             <div className="h-2 w-32 bg-slate-100 rounded"></div>
                             <div className="h-2 w-20 bg-slate-100 rounded"></div>
                        </div>
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="LO-18" name="Floating Breadcrumb Bar" />
                    <div className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-full shadow-sm text-[10px] font-bold text-slate-500 w-fit">
                        <Home size={10}/> <ChevronRight size={10}/> <span>Strategy</span> <ChevronRight size={10}/> <span className="text-slate-900">Roadmap</span>
                    </div>
                </DemoContainer>
            </div>
        </div>

        {/* --- 3. UTILITY & WIDGETS (36-50) - PIXEL PERFECT REQUESTED --- */}
        <div className="space-y-6">
            <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Utility & Functional Widgets</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                
                {/* LO-36: Comment Thread */}
                <DemoContainer className="h-[400px] flex flex-col bg-slate-50">
                    <ComponentLabel id="LO-36" name="Interactive Comment Thread" />
                    <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-thin">
                        {[
                            { user: 'Jessica P.', color: 'bg-indigo-600', text: 'Baseline needs audit verification before Friday.', time: '12m ago', align: 'left' },
                            { user: 'Mike R.', color: 'bg-emerald-600', text: 'I have attached the XER artifacts to the record.', time: '8m ago', align: 'right' },
                            { user: 'Jessica P.', color: 'bg-indigo-600', text: 'Received. Pushing to CCB review queue.', time: 'Just now', align: 'left' }
                        ].map((msg, i) => (
                            <div key={i} className={`flex gap-3 ${msg.align === 'right' ? 'flex-row-reverse' : ''}`}>
                                <div className={`w-8 h-8 rounded-lg ${msg.color} text-white flex items-center justify-center text-[10px] font-black shrink-0 shadow-sm border border-white/20`}>
                                    {msg.user.charAt(0)}
                                </div>
                                <div className={`max-w-[80%] ${msg.align === 'right' ? 'items-end' : 'items-start'} flex flex-col`}>
                                    <div className="flex items-baseline gap-2 mb-1">
                                        <span className="text-[10px] font-black text-slate-700 uppercase">{msg.user}</span>
                                        <span className="text-[9px] text-slate-400 font-bold">{msg.time}</span>
                                    </div>
                                    <div className={`p-3 rounded-2xl text-xs leading-relaxed shadow-sm border ${msg.align === 'right' ? 'bg-nexus-600 text-white border-nexus-700 rounded-tr-none' : 'bg-white text-slate-700 border-slate-200 rounded-tl-none'}`}>
                                        {msg.text}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 p-3 bg-white border border-slate-200 rounded-xl shadow-sm flex gap-2">
                        <input className="flex-1 bg-transparent text-xs outline-none font-medium placeholder:text-slate-300" placeholder="Type a response..." />
                        <button className="p-1.5 bg-nexus-600 text-white rounded-lg hover:bg-nexus-700 transition-colors"><ChevronRight size={16}/></button>
                    </div>
                </DemoContainer>

                {/* LO-38: File Tree */}
                <DemoContainer className="h-[400px] flex flex-col">
                    <ComponentLabel id="LO-38" name="System Hierarchy (File Tree)" />
                    <div className="flex-1 bg-white border border-slate-100 rounded-xl overflow-y-auto p-4 space-y-1 shadow-inner scrollbar-thin">
                        <div className="flex items-center gap-2 p-2 hover:bg-slate-50 rounded-lg cursor-pointer group">
                             <ChevronDown size={14} className="text-slate-300"/>
                             <Folder size={16} className="text-blue-500 fill-blue-50"/>
                             <span className="text-xs font-black text-slate-800 uppercase tracking-tight">Root Repository</span>
                        </div>
                        <div className="ml-6 space-y-1">
                            <div className="flex items-center gap-2 p-2 bg-nexus-50 text-nexus-700 rounded-lg border border-nexus-100 cursor-pointer">
                                <ChevronDown size={14} className="text-nexus-400"/>
                                <Folder size={16} className="text-nexus-600 fill-nexus-100"/>
                                <span className="text-xs font-black uppercase tracking-tight">Project Artifacts</span>
                            </div>
                            <div className="ml-10 space-y-1">
                                <div className="flex items-center gap-2 p-1.5 hover:bg-slate-50 rounded-md cursor-pointer group">
                                    <FileText size={14} className="text-red-500"/>
                                    <span className="text-xs text-slate-600 font-medium">charter_final.pdf</span>
                                </div>
                                <div className="flex items-center gap-2 p-1.5 hover:bg-slate-50 rounded-md cursor-pointer group">
                                    <FileCode size={14} className="text-blue-500"/>
                                    <span className="text-xs text-slate-600 font-medium">logic_engine.xml</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 p-2 hover:bg-slate-50 rounded-lg cursor-pointer text-slate-400 opacity-60">
                                <ChevronRight size={14}/>
                                <Folder size={16}/>
                                <span className="text-xs font-bold uppercase tracking-tight">Archives</span>
                            </div>
                        </div>
                    </div>
                </DemoContainer>

                {/* LO-45: Pricing Table */}
                <DemoContainer className="h-[400px] flex flex-col justify-center">
                    <ComponentLabel id="LO-45" name="Multi-Tier Pricing Matrix" />
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-5 border border-slate-200 rounded-2xl bg-white shadow-sm flex flex-col items-center text-center">
                            <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">Standard</span>
                            <div className="text-3xl font-black text-slate-900">$49</div>
                            <p className="text-[10px] text-slate-500 mt-1">per user / month</p>
                            <div className="w-full h-px bg-slate-100 my-4"></div>
                            <ul className="text-[10px] text-slate-600 space-y-2 mb-6">
                                <li className="flex items-center gap-1.5 justify-center"><Check size={12} className="text-green-500"/> CPM Engine</li>
                                <li className="flex items-center gap-1.5 justify-center"><Check size={12} className="text-green-500"/> 5 Projects</li>
                                <li className="flex items-center gap-1.5 justify-center opacity-30"><X size={12} className="text-slate-400"/> AI Assistant</li>
                            </ul>
                            <Button size="sm" variant="secondary" className="w-full">Select</Button>
                        </div>
                        <div className="p-5 border-2 border-nexus-500 rounded-2xl bg-nexus-900 text-white shadow-2xl flex flex-col items-center text-center relative overflow-hidden scale-105">
                            <div className="absolute top-0 right-0 p-12 bg-white/5 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                            <span className="text-[10px] font-black uppercase text-nexus-400 tracking-widest mb-2">Enterprise</span>
                            <div className="text-3xl font-black">$249</div>
                            <p className="text-[10px] text-slate-400 mt-1">unlimited users</p>
                            <div className="w-full h-px bg-white/10 my-4"></div>
                            <ul className="text-[10px] text-slate-200 space-y-2 mb-6">
                                <li className="flex items-center gap-1.5 justify-center"><Check size={12} className="text-nexus-400"/> Global EPS</li>
                                <li className="flex items-center gap-1.5 justify-center"><Check size={12} className="text-nexus-400"/> Risk Modeling</li>
                                <li className="flex items-center gap-1.5 justify-center"><Check size={12} className="text-nexus-400"/> AI Advisor</li>
                            </ul>
                            <Button size="sm" className="w-full bg-nexus-500 border-0 hover:bg-nexus-400 text-white">Contact Sales</Button>
                        </div>
                    </div>
                </DemoContainer>

                {/* LO-46: Invoice Layout */}
                <DemoContainer className="h-[400px] flex flex-col bg-slate-50">
                    <ComponentLabel id="LO-46" name="Fiscal Asset (Invoice)" />
                    <div className="flex-1 bg-white border border-slate-200 rounded-lg shadow-2xl m-4 flex flex-col overflow-hidden">
                        <div className="p-4 border-b bg-slate-50/50 flex justify-between items-start">
                             <div className="w-8 h-8 bg-slate-900 rounded-md flex items-center justify-center text-white font-bold text-xs shadow-md">N</div>
                             <div className="text-right">
                                 <p className="text-[8px] font-black uppercase text-slate-400 tracking-widest">INV-4921</p>
                                 <p className="text-[10px] font-bold text-slate-800">12 OCT 2024</p>
                             </div>
                        </div>
                        <div className="p-4 flex-1">
                             <div className="mb-4">
                                <p className="text-[8px] font-black uppercase text-slate-400">Bill To</p>
                                <p className="text-[10px] font-bold text-slate-800">Acme Construction Corp.</p>
                             </div>
                             <table className="min-w-full text-[9px] border-t border-slate-100 mt-4">
                                 <thead className="text-slate-400 font-black uppercase">
                                     <tr><th className="py-2 text-left">Scope</th><th className="py-2 text-right">Amt</th></tr>
                                 </thead>
                                 <tbody className="text-slate-700">
                                     <tr className="border-b border-slate-50"><td className="py-1.5">Excavation S4</td><td className="py-1.5 text-right font-mono">$12,400</td></tr>
                                     <tr className="border-b border-slate-50"><td className="py-1.5">Safety Audit</td><td className="py-1.5 text-right font-mono">$1,200</td></tr>
                                 </tbody>
                                 <tfoot>
                                     <tr className="font-black text-slate-900"><td className="pt-3">Total Due</td><td className="pt-3 text-right font-mono">$13,600</td></tr>
                                 </tfoot>
                             </table>
                        </div>
                        <div className="p-2 bg-slate-900 flex justify-center items-center">
                             <span className="text-[8px] font-black text-white uppercase tracking-[0.2em]">Authorized for Payment</span>
                        </div>
                    </div>
                </DemoContainer>

                {/* LO-50: Terminal Layout */}
                <DemoContainer className="h-[400px] flex flex-col">
                    <ComponentLabel id="LO-50" name="System Output (Terminal)" />
                    <div className="flex-1 bg-slate-950 rounded-xl border border-slate-800 p-4 font-mono text-[11px] flex flex-col shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500/50 to-purple-500/50 opacity-40"></div>
                        <div className="flex-1 space-y-1.5 overflow-hidden">
                            <div className="flex gap-2">
                                <span className="text-slate-600 select-none">$</span>
                                <span className="text-white">npm run build:nexus --prod</span>
                            </div>
                            <div className="text-blue-400">> nexus-core@1.2.0 build</div>
                            <div className="text-slate-400">Loading enterprise graph... [OK]</div>
                            <div className="text-slate-400">Validating CPM engine v3.1... [OK]</div>
                            <div className="text-yellow-500">WARN: deprecated dependency 'xer-parser' at line 42</div>
                            <div className="text-slate-400">Compiling financial schemas... [42/42]</div>
                            <div className="text-green-500 font-bold">SUCCESS: Artifact generated (2.4s)</div>
                            <div className="pt-4 flex gap-2">
                                <span className="text-white">nexus_id_4920:</span>
                                <span className="text-slate-500 animate-pulse">█</span>
                            </div>
                        </div>
                        <div className="absolute inset-0 bg-[radial-gradient(rgba(0,255,0,0.03)_1px,transparent_1px)] bg-[size:10px_10px] pointer-events-none"></div>
                    </div>
                </DemoContainer>

                {/* LO-58: Popover / Tooltip */}
                <DemoContainer className="h-[400px] flex flex-col items-center justify-center relative bg-slate-50">
                    <ComponentLabel id="LO-58" name="Contextual Popover" />
                    <div className="relative group">
                         <div className="w-12 h-12 rounded-full bg-slate-900 border-4 border-white shadow-xl flex items-center justify-center text-white cursor-pointer hover:scale-105 transition-transform">
                             <User size={20}/>
                         </div>
                         <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-64 bg-white rounded-2xl p-5 shadow-2xl border border-slate-200 z-50 animate-in zoom-in-95 duration-200">
                             <div className="flex items-center gap-3 mb-4">
                                 <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500"><Settings size={18}/></div>
                                 <div className="min-w-0">
                                     <p className="text-sm font-black text-slate-900">System Identity</p>
                                     <p className="text-[10px] text-slate-400 font-bold uppercase">UID: 4920-X-12</p>
                                 </div>
                             </div>
                             <div className="space-y-2 border-t border-slate-50 pt-4">
                                 <div className="flex justify-between text-[10px] font-bold"><span className="text-slate-400 uppercase">Access</span> <span className="text-green-600">Admin</span></div>
                                 <div className="flex justify-between text-[10px] font-bold"><span className="text-slate-400 uppercase">Session</span> <span className="text-slate-900">12m Left</span></div>
                             </div>
                             {/* Arrow */}
                             <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[10px] border-t-white"></div>
                         </div>
                    </div>
                </DemoContainer>
            </div>
        </div>

        {/* --- 4. CHROME & BARS (51-65) --- */}
        <div className="space-y-6">
            <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">UI Chrome & Action Bars</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {/* LO-61: Breadcrumb Header */}
                <DemoContainer className="h-[400px] flex flex-col">
                    <ComponentLabel id="LO-61" name="Contextual Breadcrumb Header" />
                    <div className="w-full bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
                        <nav className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">
                            <Home size={12}/> <span>Home</span>
                            <ChevronRight size={12} className="text-slate-200"/>
                            <span className="hover:text-nexus-600 transition-colors cursor-pointer">Strategy</span>
                            <ChevronRight size={12} className="text-slate-200"/>
                            <span className="text-slate-900">Investment Board</span>
                        </nav>
                        <div className="flex justify-between items-end gap-6">
                             <div>
                                 <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Portfolio Realignment</h1>
                                 <p className="text-sm text-slate-500 font-medium mt-2">Executive oversight for Q4 fiscal priorities.</p>
                             </div>
                             <div className="flex gap-2">
                                 <button className="p-3 border border-slate-200 rounded-xl hover:bg-slate-50 shadow-sm transition-all"><Share2 size={18} className="text-slate-400"/></button>
                                 <Button icon={Plus}>Update Baseline</Button>
                             </div>
                        </div>
                    </div>
                </DemoContainer>

                {/* LO-64: Toast Stack */}
                <DemoContainer className="h-[400px] flex flex-col relative overflow-hidden bg-slate-900/5 shadow-inner">
                    <ComponentLabel id="LO-64" name="Global Feedback (Toast Stack)" />
                    <div className="absolute top-4 right-4 space-y-3 w-80">
                         <div className="bg-white border-l-4 border-l-green-500 rounded-xl p-4 shadow-2xl flex items-start gap-4 animate-in slide-in-from-right-10">
                            <CheckCircle size={20} className="text-green-500 mt-0.5 shrink-0"/>
                            <div>
                                <h5 className="text-xs font-black text-slate-900 uppercase">Baseline Locked</h5>
                                <p className="text-[10px] text-slate-500 mt-1">Snapshot committed to warehouse.</p>
                            </div>
                         </div>
                         <div className="bg-white border-l-4 border-l-red-500 rounded-xl p-4 shadow-2xl flex items-start gap-4 animate-in slide-in-from-right-14 delay-75">
                            <AlertTriangle size={20} className="text-red-500 mt-0.5 shrink-0"/>
                            <div>
                                <h5 className="text-xs font-black text-slate-900 uppercase">Logic Breach</h5>
                                <p className="text-[10px] text-slate-500 mt-1">Critical path link is now circular.</p>
                            </div>
                         </div>
                    </div>
                    <div className="flex-1 flex items-center justify-center opacity-10">
                        <Bell size={120} className="text-slate-400" />
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="LO-57" name="Sticky Action Bar" />
                    <div className="h-32 w-full bg-white border border-slate-200 rounded-xl flex flex-col relative overflow-hidden">
                        <div className="flex-1 p-4"></div>
                        <div className="absolute bottom-0 left-0 right-0 h-12 bg-slate-900 flex items-center justify-between px-6 shadow-2xl border-t border-slate-800">
                             <div className="flex gap-3 items-center">
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Unsaved Buffers</span>
                                <div className="h-1.5 w-12 bg-slate-700 rounded-full overflow-hidden"><div className="h-full bg-nexus-400 w-[40%]"></div></div>
                             </div>
                             <div className="flex gap-2">
                                <button className="text-[9px] font-black uppercase text-slate-400 hover:text-white transition-colors">Discard</button>
                                <button className="px-3 py-1.5 bg-nexus-600 text-white rounded text-[10px] font-black uppercase tracking-widest hover:bg-nexus-500 transition-colors">Commit All</button>
                             </div>
                        </div>
                    </div>
                </DemoContainer>
            </div>
        </div>

        {/* --- 5. STATE & FEEDBACK (66-70) --- */}
        <div className="space-y-6">
            <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Skeleton & State Masks</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* LO-66: Skeleton Card */}
                <DemoContainer>
                    <ComponentLabel id="LO-66" name="Loading State (Card)" />
                    <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm w-full animate-pulse">
                         <div className="flex justify-between items-start mb-8">
                             <div className="flex items-center gap-4">
                                 <div className="w-12 h-12 rounded-2xl bg-slate-100"></div>
                                 <div className="space-y-2">
                                     <div className="h-4 w-32 bg-slate-100 rounded-md"></div>
                                     <div className="h-3 w-20 bg-slate-50 rounded-md"></div>
                                 </div>
                             </div>
                             <div className="w-16 h-6 bg-slate-100 rounded-full"></div>
                         </div>
                         <div className="space-y-4">
                             <div className="h-2 w-full bg-slate-50 rounded-full"></div>
                             <div className="h-2 w-full bg-slate-50 rounded-full"></div>
                             <div className="h-2 w-3/4 bg-slate-50 rounded-full"></div>
                         </div>
                         <div className="mt-8 pt-6 border-t border-slate-50 flex gap-3">
                             <div className="h-10 flex-1 bg-slate-100 rounded-xl"></div>
                             <div className="h-10 w-24 bg-slate-50 rounded-xl"></div>
                         </div>
                    </div>
                </DemoContainer>

                {/* LO-67: Skeleton List */}
                <DemoContainer>
                    <ComponentLabel id="LO-67" name="Loading State (List)" />
                    <div className="w-full bg-white rounded-xl border border-slate-100 overflow-hidden shadow-sm">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="p-4 border-b border-slate-50 flex items-center gap-4 animate-pulse">
                                <div className="w-8 h-8 rounded-lg bg-slate-100 shrink-0"></div>
                                <div className="flex-1 space-y-2">
                                    <div className="h-3 w-1/2 bg-slate-100 rounded"></div>
                                    <div className="h-2 w-1/4 bg-slate-50 rounded"></div>
                                </div>
                                <div className="w-12 h-6 bg-slate-100 rounded-full"></div>
                            </div>
                        ))}
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="LO-68" name="System Busy (Glass)" />
                    <div className="h-32 w-full bg-slate-100 rounded-xl border border-slate-200 relative overflow-hidden flex items-center justify-center">
                        <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center gap-2">
                             <RefreshCw className="text-nexus-600 animate-spin" size={24}/>
                             <span className="text-[10px] font-black uppercase text-nexus-700 tracking-widest">Re-Indexing Ledger</span>
                        </div>
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="LO-70" name="Isolated Partition (Empty)" />
                    <div className="h-32">
                         <EmptyPatternDemo label="Partition Restricted" />
                    </div>
                </DemoContainer>
            </div>
        </div>
    </div>
  );
};