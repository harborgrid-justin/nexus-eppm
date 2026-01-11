
import React from 'react';
import { 
  ClipboardList, MoreHorizontal, Clock, CheckCircle2, Circle, AlertCircle, 
  ArrowRight, User, Calendar, Flag, Paperclip, MessageSquare, 
  GitBranch, Link, Lock, Unlock, GripVertical, Milestone, 
  ChevronDown, ChevronRight, Filter, Plus, PieChart, TrendingUp,
  AlertTriangle, DollarSign, Activity, Layers, Target, CheckSquare,
  BarChart2, FileText
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area } from 'recharts';
import { SectionHeading, DemoContainer, ComponentLabel } from './DesignHelpers';
import { UserAvatar } from '../common/UserAvatar';
import { Badge } from '../ui/Badge';
import { ProgressBar } from '../common/ProgressBar';

const DATA_BURN = [
    { d: 'M', v: 40 }, { d: 'T', v: 35 }, { d: 'W', v: 30 }, { d: 'T', v: 28 }, { d: 'F', v: 20 }
];

export const DesignProjectManagement = () => {
  return (
    <div className="space-y-12 animate-fade-in pb-20">
        <SectionHeading title="CPM & Scheduling" icon={ClipboardList} count="PM-01 to PM-70" />
        
        {/* --- TASKS & LIST VIEWS --- */}
        <div className="space-y-6">
            <h4 className="text-lg font-bold text-slate-900 border-b pb-2">Tasks & Work Breakdown</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <DemoContainer>
                    <ComponentLabel id="PM-01" name="Kanban Task Card" />
                    <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-sm hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group relative overflow-hidden">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500 rounded-l-lg"></div>
                        <div className="pl-2">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-[10px] font-mono font-bold text-slate-400">LIT-204</span>
                                <MoreHorizontal className="h-4 w-4 text-slate-300 group-hover:text-slate-500"/>
                            </div>
                            <h5 className="text-sm font-semibold text-slate-800 mb-3 leading-snug">Review Production Set 2 for Privilege</h5>
                            <div className="flex justify-between items-center mt-3">
                                <div className="flex items-center text-[10px] text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded">
                                    <Clock size={10} className="mr-1"/> 2d left
                                </div>
                                <UserAvatar name="Mike Ross" size="sm"/>
                            </div>
                        </div>
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="PM-02" name="Simple Task Row" />
                    <div className="flex items-center gap-3 p-2 bg-white border border-slate-200 rounded hover:bg-slate-50 transition-colors cursor-pointer">
                        <Circle size={18} className="text-slate-300 hover:text-green-500 cursor-pointer"/>
                        <span className="text-sm text-slate-700 flex-1">Draft Project Charter</span>
                        <span className="text-xs text-slate-400">Oct 12</span>
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="PM-03" name="Completed Task Row" />
                    <div className="flex items-center gap-3 p-2 bg-slate-50 border border-slate-100 rounded opacity-70">
                        <CheckCircle2 size={18} className="text-green-500"/>
                        <span className="text-sm text-slate-500 flex-1 line-through">Stakeholder Interview</span>
                        <span className="text-xs text-slate-400">Oct 10</span>
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="PM-04" name="Task with Tags" />
                    <div className="flex items-start gap-3 p-3 bg-white border border-slate-200 rounded shadow-sm">
                        <div className="mt-0.5"><Circle size={16} className="text-slate-300"/></div>
                        <div className="flex-1">
                            <p className="text-sm font-medium text-slate-800 mb-1">Finalize Budget Estimate</p>
                            <div className="flex gap-1">
                                <span className="text-[10px] px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded border border-blue-100">Finance</span>
                                <span className="text-[10px] px-1.5 py-0.5 bg-red-50 text-red-700 rounded border border-red-100">Urgent</span>
                            </div>
                        </div>
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="PM-05" name="Subtask Indent" />
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 p-1.5 font-bold text-sm text-slate-800 border-b border-slate-100">
                            <ChevronDown size={14} className="text-slate-400"/> Phase 1: Initiation
                        </div>
                        <div className="flex items-center gap-2 p-1.5 pl-8 text-sm text-slate-600 bg-slate-50 rounded">
                             <Circle size={14} className="text-slate-300"/> Kickoff Meeting
                        </div>
                        <div className="flex items-center gap-2 p-1.5 pl-8 text-sm text-slate-600 hover:bg-slate-50 rounded">
                             <Circle size={14} className="text-slate-300"/> Define Scope
                        </div>
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="PM-06" name="WBS Node (Tree)" />
                    <div className="flex items-center gap-2 text-sm p-2 bg-white border border-slate-200 rounded">
                        <span className="font-mono text-xs text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">1.2.4</span>
                        <span className="font-medium text-slate-700">Structural Steel</span>
                        <div className="h-px bg-slate-100 flex-1 ml-2"></div>
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="PM-07" name="Draggable Grip" />
                    <div className="flex items-center gap-2 p-2 border border-slate-200 rounded bg-white hover:shadow-sm cursor-move">
                        <GripVertical size={14} className="text-slate-300"/>
                        <span className="text-sm">Draggable Item</span>
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="PM-08" name="Bulk Action Bar" />
                    <div className="bg-slate-900 text-white rounded-lg px-4 py-2 flex items-center justify-between shadow-lg">
                        <span className="text-xs font-bold flex items-center gap-2"><CheckSquare size={14}/> 3 Selected</span>
                        <div className="flex gap-3 text-xs">
                            <button className="hover:text-blue-300">Edit</button>
                            <button className="hover:text-blue-300">Move</button>
                            <button className="text-red-400 hover:text-red-300">Delete</button>
                        </div>
                    </div>
                </DemoContainer>

                 <DemoContainer>
                    <ComponentLabel id="PM-09" name="Inline Edit Input" />
                    <div className="flex items-center gap-2 border-b-2 border-blue-500 pb-1">
                        <input type="text" defaultValue="Update architectural drawings" className="outline-none text-sm w-full font-medium text-slate-900 bg-transparent" autoFocus />
                        <span className="text-[10px] text-slate-400 whitespace-nowrap">Enter to save</span>
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="PM-10" name="Task Metadata Row" />
                    <div className="p-2 border border-slate-200 rounded-lg bg-white">
                        <div className="text-sm font-medium mb-2">Review Specifications</div>
                        <div className="flex items-center gap-4 text-slate-400 text-xs">
                            <span className="flex items-center gap-1 hover:text-blue-500 cursor-pointer"><MessageSquare size={12}/> 3</span>
                            <span className="flex items-center gap-1 hover:text-blue-500 cursor-pointer"><Paperclip size={12}/> 1</span>
                            <span className="flex items-center gap-1 hover:text-blue-500 cursor-pointer"><GitBranch size={12}/> 2</span>
                        </div>
                    </div>
                </DemoContainer>
            </div>
        </div>

        {/* --- AGILE & KANBAN --- */}
        <div className="space-y-6">
            <h4 className="text-lg font-bold text-slate-900 border-b pb-2">Agile & Kanban</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <DemoContainer>
                    <ComponentLabel id="PM-16" name="Compact Kanban Card" />
                    <div className="bg-white border border-slate-200 p-2 rounded shadow-sm hover:border-slate-300 text-xs">
                        <p className="line-clamp-2 mb-2 text-slate-700">Update API endpoints for v2 migration</p>
                        <div className="flex justify-between items-center">
                            <span className="bg-slate-100 text-slate-500 px-1.5 rounded text-[10px] font-mono">DEV-12</span>
                            <div className="w-5 h-5 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center text-[9px] font-bold">JD</div>
                        </div>
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="PM-17" name="Swimlane Header" />
                    <div className="flex items-center gap-2 w-full bg-slate-50 p-2 rounded border border-slate-200">
                        <ChevronDown size={14} className="text-slate-400"/>
                        <span className="text-xs font-bold text-slate-700 uppercase">High Priority</span>
                        <span className="bg-white text-slate-500 text-[10px] px-1.5 py-0.5 rounded-full border border-slate-200">5</span>
                        <div className="h-px bg-slate-200 flex-1 ml-2"></div>
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="PM-18" name="Story Point Badge" />
                    <div className="flex gap-2">
                        <span className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">3</span>
                        <span className="w-6 h-6 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-xs font-bold text-blue-700">5</span>
                        <span className="w-6 h-6 rounded-full bg-orange-100 border border-orange-200 flex items-center justify-center text-xs font-bold text-orange-700">8</span>
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="PM-19" name="Sprint Burndown Mini" />
                     <div className="h-16 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={DATA_BURN}>
                                <Area type="monotone" dataKey="v" stroke="#f59e0b" fill="#fef3c7" strokeWidth={2} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="PM-20" name="Blocked Card Visual" />
                    <div className="bg-red-50 border border-red-200 p-2 rounded shadow-sm relative overflow-hidden">
                        <div className="absolute -right-3 -top-3 bg-red-500 w-8 h-8 rotate-45"></div>
                        <p className="text-xs text-red-900 font-medium relative z-10">Database schema locked</p>
                        <div className="flex items-center gap-1 mt-2 text-[10px] text-red-700 font-bold uppercase">
                            <AlertCircle size={10}/> Blocked
                        </div>
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="PM-21" name="WIP Limit Header" />
                    <div className="flex justify-between items-center bg-white border-b-2 border-orange-400 pb-2">
                        <span className="text-sm font-bold text-slate-800">In Progress</span>
                        <span className="text-xs font-mono text-orange-600 font-bold bg-orange-50 px-2 py-0.5 rounded">4 / 3 (Max)</span>
                    </div>
                </DemoContainer>
            </div>
        </div>

        {/* --- SCHEDULING & GANTT --- */}
        <div className="space-y-6">
            <h4 className="text-lg font-bold text-slate-900 border-b pb-2">Gantt & Scheduling</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <DemoContainer>
                    <ComponentLabel id="PM-26" name="Standard Gantt Bar" />
                    <div className="relative h-8 w-full bg-slate-50 border-l border-r border-slate-200">
                        <div className="absolute top-2 left-4 w-24 h-4 bg-blue-500 rounded-sm shadow-sm group cursor-pointer hover:bg-blue-600">
                            <div className="w-1/2 h-full bg-white/20"></div>
                            <span className="absolute left-full ml-2 text-[10px] text-slate-500 font-medium whitespace-nowrap opacity-0 group-hover:opacity-100">Design Phase</span>
                        </div>
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="PM-27" name="Critical Path Bar" />
                    <div className="relative h-8 w-full bg-slate-50 border-l border-r border-slate-200">
                        <div className="absolute top-2 left-8 w-20 h-4 bg-red-500 rounded-sm shadow-sm ring-1 ring-red-300">
                             <div className="w-full h-full bg-[url('https://www.transparenttextures.com/patterns/diagonal-stripes.png')] opacity-20"></div>
                        </div>
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="PM-28" name="Summary Bracket" />
                    <div className="relative h-8 w-full bg-slate-50 border-l border-r border-slate-200">
                        <div className="absolute top-2 left-2 w-32 h-2 bg-slate-800"></div>
                        <div className="absolute top-2 left-2 w-0 h-4 border-l-4 border-slate-800"></div>
                        <div className="absolute top-2 left-[134px] w-0 h-4 border-l-4 border-slate-800"></div>
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="PM-29" name="Milestone Diamond" />
                    <div className="relative h-8 w-full bg-slate-50 border-l border-r border-slate-200 flex items-center justify-center">
                        <div className="w-4 h-4 bg-black rotate-45 shadow-sm"></div>
                        <span className="text-[10px] text-slate-600 absolute top-6">M1</span>
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="PM-30" name="Baseline Comparison" />
                    <div className="relative h-12 w-full bg-slate-50 border-l border-r border-slate-200">
                        <div className="absolute top-2 left-4 w-24 h-3 bg-yellow-400/50 rounded-sm"></div> {/* Baseline */}
                        <div className="absolute top-5 left-8 w-24 h-3 bg-blue-500 rounded-sm shadow-sm"></div> {/* Actual */}
                        <div className="absolute top-3 left-[130px] text-[9px] text-red-500 font-bold">+4d</div>
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="PM-31" name="Dependency Link" />
                    <div className="relative h-12 w-full bg-slate-50 flex items-center justify-center">
                        <div className="w-8 h-4 bg-blue-500 rounded-sm absolute left-4 top-2"></div>
                        <div className="w-8 h-4 bg-blue-500 rounded-sm absolute right-4 bottom-2"></div>
                        <svg className="absolute inset-0 w-full h-full pointer-events-none">
                            <path d="M 50 18 L 60 18 L 60 38 L 70 38" fill="none" stroke="#94a3b8" strokeWidth="1.5" markerEnd="url(#arrow)"/>
                            <defs>
                                <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#94a3b8" />
                                </marker>
                            </defs>
                        </svg>
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="PM-32" name="Timeline Scale (Day)" />
                    <div className="flex border-b border-slate-200 w-full">
                        {[1,2,3,4,5,6,7].map(d => (
                            <div key={d} className={`flex-1 border-r border-slate-100 text-center py-1 ${d > 5 ? 'bg-slate-50 text-slate-400' : 'bg-white text-slate-600'}`}>
                                <div className="text-[9px] uppercase">{['S','M','T','W','T','F','S'][d-1]}</div>
                                <div className="text-xs font-bold">{d}</div>
                            </div>
                        ))}
                    </div>
                </DemoContainer>
            </div>
        </div>

        {/* --- RESOURCES & CAPACITY --- */}
        <div className="space-y-6">
            <h4 className="text-lg font-bold text-slate-900 border-b pb-2">Resources & Capacity</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <DemoContainer>
                    <ComponentLabel id="PM-41" name="Resource Row" />
                    <div className="flex items-center gap-3 w-full">
                        <UserAvatar name="Alex T." size="sm" className="bg-indigo-100 text-indigo-700"/>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-slate-700">Alex T.</p>
                            <p className="text-[10px] text-slate-400 truncate">Senior Developer • 80%</p>
                        </div>
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="PM-42" name="Allocation Heatmap Cell" />
                    <div className="flex gap-1">
                        <div className="w-8 h-8 bg-green-100 text-green-700 rounded flex items-center justify-center text-xs font-bold">40</div>
                        <div className="w-8 h-8 bg-blue-100 text-blue-700 rounded flex items-center justify-center text-xs font-bold">100</div>
                        <div className="w-8 h-8 bg-red-100 text-red-700 rounded flex items-center justify-center text-xs font-bold border border-red-200">120</div>
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="PM-43" name="Histogram Bar" />
                     <div className="h-16 w-full flex items-end gap-1 px-2 border-b border-slate-200">
                        {[40, 80, 100, 110, 60].map((h, i) => (
                            <div key={i} className={`flex-1 rounded-t-sm ${h > 100 ? 'bg-red-400' : 'bg-blue-400'}`} style={{height: `${h/1.5}%`}}></div>
                        ))}
                     </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="PM-44" name="Role Capacity Pill" />
                    <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-full pl-1 pr-3 py-1 w-fit">
                        <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-[10px] font-bold shadow-sm border border-slate-100">Dev</div>
                        <div className="flex flex-col leading-none">
                             <span className="text-[9px] text-slate-400 uppercase font-bold">Capacity</span>
                             <span className="text-xs font-bold text-slate-700">320 / 400h</span>
                        </div>
                    </div>
                </DemoContainer>
            </div>
        </div>

        {/* --- RISK & GOVERNANCE --- */}
        <div className="space-y-6">
            <h4 className="text-lg font-bold text-slate-900 border-b pb-2">Risk & Governance</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <DemoContainer>
                    <ComponentLabel id="PM-51" name="Matrix Cell (5x5)" />
                    <div className="w-16 h-16 bg-red-500 rounded-lg shadow-sm flex items-center justify-center text-white font-black text-xl relative">
                        15
                        <div className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="PM-52" name="Risk Register Row" />
                    <div className="p-2 border border-slate-200 rounded-lg bg-white w-full">
                        <div className="flex justify-between mb-1">
                            <span className="text-[10px] font-mono text-slate-400">RSK-001</span>
                            <Badge variant="danger">Critical</Badge>
                        </div>
                        <p className="text-xs font-medium text-slate-700 truncate">Supply Chain Disruption</p>
                    </div>
                </DemoContainer>
                
                <DemoContainer>
                    <ComponentLabel id="PM-53" name="Mitigation Action" />
                    <div className="flex items-center gap-2 text-xs w-full bg-slate-50 p-2 rounded border border-slate-200">
                        <input type="checkbox" className="rounded text-blue-600" />
                        <span className="flex-1 text-slate-600 line-through decoration-slate-400">Identify Alt Vendor</span>
                        <UserAvatar name="Sam" size="sm"/>
                    </div>
                </DemoContainer>

                 <DemoContainer>
                    <ComponentLabel id="PM-54" name="Impact Cost Badge" />
                    <div className="inline-flex items-center gap-1 bg-red-50 text-red-700 px-2 py-1 rounded text-xs font-mono font-bold border border-red-100">
                        <DollarSign size={10}/> $50k
                    </div>
                </DemoContainer>
            </div>
        </div>

        {/* --- FINANCIALS --- */}
        <div className="space-y-6">
            <h4 className="text-lg font-bold text-slate-900 border-b pb-2">Project Financials</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <DemoContainer>
                    <ComponentLabel id="PM-61" name="Cost Variance Pill" />
                     <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-full px-3 py-1 shadow-sm w-fit">
                        <span className="text-xs text-slate-500 font-medium">CV</span>
                        <span className="text-sm font-bold text-red-600">-$12,400</span>
                        <TrendingUp size={12} className="text-red-500 rotate-180"/>
                     </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="PM-62" name="Budget Bar (Mini)" />
                    <div className="w-full space-y-1">
                        <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase">
                            <span>Consumed</span>
                            <span>85%</span>
                        </div>
                        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                            <div className="h-full w-[85%] bg-blue-600"></div>
                            <div className="h-full w-[10%] bg-red-500" title="Overrun"></div>
                        </div>
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="PM-63" name="Invoice Status" />
                     <div className="flex items-center justify-between w-full p-2 border border-slate-200 rounded-lg bg-white">
                         <div className="flex items-center gap-2">
                             <FileText size={16} className="text-slate-400"/>
                             <div>
                                 <p className="text-xs font-bold text-slate-700">INV-2024-01</p>
                                 <p className="text-[9px] text-slate-400">Due Oct 15</p>
                             </div>
                         </div>
                         <Badge variant="warning">Pending</Badge>
                     </div>
                </DemoContainer>
                
                 <DemoContainer>
                    <ComponentLabel id="PM-64" name="EVM Metric" />
                    <div className="text-center w-full">
                         <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Schedule Perf. Index</p>
                         <p className="text-3xl font-black text-green-600 mt-1">1.05</p>
                         <span className="text-[9px] bg-green-50 text-green-700 px-2 py-0.5 rounded-full font-bold">Ahead</span>
                    </div>
                </DemoContainer>
            </div>
        </div>
    </div>
  );
};
