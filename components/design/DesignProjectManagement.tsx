import React from 'react';
import { 
  ClipboardList, MoreHorizontal, Clock, CheckCircle2, Circle, AlertCircle, 
  Briefcase, ArrowRight, User, Calendar, Flag, Paperclip, MessageSquare, 
  GitBranch, Link, Lock, Unlock, GripVertical, Milestone, 
  ChevronDown, ChevronRight, Filter, Plus, PieChart, TrendingUp,
  AlertTriangle, DollarSign, Activity, Layers, Target, CheckSquare,
  BarChart2, FileText, FastForward, Info, ShieldCheck, GitCommit,
  GitPullRequest, Zap, Repeat, ListChecks, Hash, Calculator,
  TrendingDown, Box, ShieldAlert, Binary, Share2, MousePointer2,
  // FIX: Added missing AlertOctagon and Gavel imports from lucide-react
  AlertOctagon, Gavel
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart as RePie, Pie, Cell } from 'recharts';
import { SectionHeading, DemoContainer, ComponentLabel, EmptyPatternDemo } from './DesignHelpers';
import { UserAvatar } from '../common/UserAvatar';
import { Badge } from '../ui/Badge';
import { ProgressBar } from '../common/ProgressBar';
import { useData } from '../../context/DataContext';
import { formatCurrency, formatCompactCurrency } from '../../utils/formatters';
// FIX: Added missing Button import from local UI components
import { Button } from '../ui/Button';

export const DesignProjectManagement = () => {
  const { state, dispatch } = useData();
  
  // Data Selectors
  const projects = state.projects || [];
  const project = projects[0];
  const tasks = project?.tasks || [];
  const task = tasks[0];
  const resources = state.resources || [];
  const changeOrders = state.changeOrders || [];
  const risks = state.risks || [];

  return (
    <div className="space-y-16 animate-nexus-in pb-32">
        <SectionHeading title="CPM & Project Controls" icon={ClipboardList} count="PM-01 to PM-70" />
        
        {/* --- SECTION 1: TASK & WBS (01-10) --- */}
        <div className="space-y-6">
            <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Task & WBS Identity</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <DemoContainer>
                    <ComponentLabel id="PM-01" name="Kanban Task Card" />
                    {state.kanbanTasks[0] ? (
                        <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-sm hover:border-nexus-300 transition-all">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-[10px] font-mono font-bold text-slate-400">{state.kanbanTasks[0].id}</span>
                                <Badge variant="warning">{state.kanbanTasks[0].priority}</Badge>
                            </div>
                            <h5 className="text-sm font-bold text-slate-800 line-clamp-2">{state.kanbanTasks[0].title}</h5>
                            <div className="mt-4 pt-3 border-t flex justify-between items-center">
                                <UserAvatar name={state.kanbanTasks[0].assignee || 'U'} size="sm" />
                                <div className="flex gap-1"><Paperclip size={12} className="text-slate-300"/><MessageSquare size={12} className="text-slate-300"/></div>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col justify-center gap-4">
                            <EmptyPatternDemo label="No Kanban Tasks" />
                            {/* FIX: Button is now correctly imported and used */}
                            <Button size="sm" icon={Plus} onClick={() => dispatch({type: 'KANBAN_ADD_TASK', payload: {}})}>Create Card</Button>
                        </div>
                    )}
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="PM-02" name="High-Density List Row" />
                    {task ? (
                        <div className="flex items-center gap-3 p-2 bg-white border border-slate-200 rounded hover:bg-slate-50 transition-colors">
                            <Circle size={16} className="text-slate-300"/>
                            <span className="text-[11px] font-mono text-slate-400">{task.wbsCode}</span>
                            <span className="text-sm font-bold text-slate-700 flex-1 truncate">{task.name}</span>
                            <span className="text-xs font-mono font-bold text-nexus-600">{task.duration}d</span>
                        </div>
                    ) : <EmptyPatternDemo label="No Tasks Available" />}
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="PM-03" name="Progress Distribution" />
                    {task ? (
                        <div className="space-y-2">
                            <div className="flex justify-between text-[10px] font-black uppercase tracking-tighter">
                                <span className="text-slate-400">Physical %</span>
                                <span className="text-nexus-700">{task.progress}%</span>
                            </div>
                            <ProgressBar value={task.progress} colorClass="bg-nexus-600" />
                        </div>
                    ) : <EmptyPatternDemo />}
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="PM-04" name="WBS Node Identifier" />
                    <div className="flex items-center gap-2 p-2 bg-blue-50 border border-blue-100 rounded-lg">
                        <Layers size={14} className="text-blue-600"/>
                        <span className="text-xs font-black text-blue-800 uppercase tracking-tight">Phase 1: Mobilization</span>
                    </div>
                </DemoContainer>
            </div>
        </div>

        {/* --- SECTION 2: LOGIC & RELATIONSHIPS (11-20) --- */}
        <div className="space-y-6">
            <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Network Logic & Constraints</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <DemoContainer>
                    <ComponentLabel id="PM-11" name="Dependency Lead/Lag" />
                    <div className="flex items-center gap-2">
                        <div className="bg-slate-100 px-2 py-1 rounded text-[10px] font-mono font-bold">FS</div>
                        <ArrowRight size={12} className="text-slate-300"/>
                        <div className="bg-amber-50 text-amber-700 px-2 py-1 rounded text-[10px] font-mono font-black border border-amber-200">+5d Lag</div>
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="PM-12" name="Successor Anchor" />
                    <div className="h-8 w-full bg-slate-50 border border-slate-200 rounded flex items-center px-3 justify-between group cursor-pointer hover:border-nexus-400">
                        <span className="text-[10px] font-bold text-slate-500 uppercase">12 Successors</span>
                        <Share2 size={12} className="text-slate-300 group-hover:text-nexus-600"/>
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="PM-15" name="Hard Constraint Flag" />
                    <div className="flex items-center gap-2 p-2 bg-red-50 border border-red-100 rounded-lg text-red-700 animate-pulse">
                        <Lock size={14}/>
                        <span className="text-[10px] font-black uppercase">Must Start On</span>
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="PM-18" name="Criticality Aura" />
                    <div className="w-full h-8 bg-red-500 rounded shadow-[0_0_12px_rgba(239,68,68,0.4)] flex items-center px-3 border border-red-600">
                        <span className="text-[10px] font-black text-white uppercase tracking-widest">On Critical Path</span>
                    </div>
                </DemoContainer>
            </div>
        </div>

        {/* --- SECTION 3: AGILE & SCRUM (21-30) --- */}
        <div className="space-y-6">
            <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Agile Delivery Patterns</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <DemoContainer>
                    <ComponentLabel id="PM-21" name="Sprint Progress Widget" />
                    <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm">
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-xs font-bold text-slate-800">Sprint 12</span>
                            <span className="text-xs font-mono font-bold text-slate-400">4d left</span>
                        </div>
                        <ProgressBar value={72} size="md" colorClass="bg-indigo-500" />
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="PM-24" name="Story Point Badge" />
                    <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-white font-black shadow-lg">
                        13
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="PM-28" name="Velocity Burndown Spark" />
                    <div className="h-16 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={[{v:40},{v:30},{v:32},{v:15},{v:5}]}>
                                <Area type="monotone" dataKey="v" stroke="#6366f1" fill="#e0e7ff" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="PM-30" name="Backlog Health Indicator" />
                    <div className="flex items-center gap-3">
                         <div className="w-3 h-3 rounded-full bg-green-500"></div>
                         <span className="text-xs font-bold text-slate-700">Ready for Dev</span>
                         <span className="text-[10px] font-mono text-slate-400 ml-auto">v2.1</span>
                    </div>
                </DemoContainer>
            </div>
        </div>

        {/* --- SECTION 4: ADVANCED CPM (31-40) --- */}
        <div className="space-y-6">
            <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Advanced CPM Analytics</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <DemoContainer>
                    <ComponentLabel id="PM-31" name="Data Date Anchor" />
                    <div className="border-l-4 border-red-500 pl-4 py-2 bg-slate-50 border border-slate-200 rounded-r-lg">
                        <div className="text-[10px] font-black text-red-600 uppercase tracking-widest">Schedule Status Date</div>
                        <div className="text-sm font-mono font-bold text-slate-800">{new Date().toLocaleDateString()}</div>
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="PM-33" name="Float Buffer Indicator" />
                    <div className="h-2 w-full bg-slate-100 rounded-full flex overflow-hidden">
                        <div className="h-full bg-green-500 w-1/3 border-r border-white"></div>
                        <div className="h-full bg-slate-200 flex-1"></div>
                    </div>
                    <p className="text-[9px] font-bold text-green-600 uppercase mt-2">Free Float: 12d</p>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="PM-36" name="Out-of-Sequence Flag" />
                    <div className="flex items-center gap-2 p-2 bg-amber-50 border border-amber-200 rounded-lg text-amber-700">
                        <AlertTriangle size={14}/>
                        <span className="text-[10px] font-black uppercase">Broken Logic Link</span>
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="PM-40" name="Driving Predecessor Highlight" />
                    <div className="p-3 border-2 border-nexus-500 bg-white rounded-xl flex items-center justify-between shadow-lg shadow-nexus-500/10">
                        <span className="text-xs font-black text-nexus-700">Critical Driver</span>
                        <Zap size={14} className="text-yellow-400 fill-yellow-400"/>
                    </div>
                </DemoContainer>
            </div>
        </div>

        {/* --- SECTION 5: RESOURCES (41-50) --- */}
        <div className="space-y-6">
            <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Resource & Capacity Controls</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <DemoContainer>
                    <ComponentLabel id="PM-41" name="Resource Loading Bubble" />
                    {state.resources[0] ? (
                        <div className="flex items-center gap-3">
                             <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white font-black shadow-xl">
                                {state.resources[0].name.charAt(0)}
                             </div>
                             <div>
                                 <p className="text-sm font-bold text-slate-800">{state.resources[0].name}</p>
                                 <p className="text-[10px] text-slate-500 uppercase font-black">{state.resources[0].role}</p>
                             </div>
                        </div>
                    ) : (
                        /* FIX: Button is now correctly imported and used */
                        <Button size="sm" variant="ghost" onClick={() => dispatch({type: 'RESOURCE_ADD', payload: {}})}>Assign Resource</Button>
                    )}
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="PM-44" name="Over-allocation Warning" />
                    <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex flex-col items-center gap-2">
                        {/* FIX: AlertOctagon is now correctly imported from lucide-react */}
                        <AlertOctagon className="text-red-500" size={32} />
                        <span className="text-xs font-black text-red-900 uppercase">185% Utilization</span>
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="PM-47" name="Resource Skill Badge" />
                    <div className="flex flex-wrap gap-2">
                        <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-[10px] font-bold border border-slate-200">P6 Master</span>
                        <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-[10px] font-bold border border-slate-200">PE Certified</span>
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="PM-50" name="Unit Rate Token" />
                    <div className="text-right">
                        <span className="text-[9px] font-black text-slate-400 uppercase block">Hourly Burden</span>
                        <span className="text-xl font-mono font-black text-slate-800">$150.00</span>
                    </div>
                </DemoContainer>
            </div>
        </div>

        {/* --- SECTION 6: STRATEGY & GOVERNANCE (51-60) --- */}
        <div className="space-y-6">
            <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Strategic Alignment & Governance</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <DemoContainer>
                    <ComponentLabel id="PM-51" name="Strategic Score" />
                    <div className="text-center">
                        <div className="text-4xl font-black text-nexus-600 leading-none">9.2</div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase mt-2">Alignment Index</p>
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="PM-54" name="Board Decision Card" />
                    <div className="p-3 bg-slate-900 rounded-xl text-white shadow-xl">
                        <div className="flex justify-between items-center mb-2">
                             <Badge variant="success">Approved</Badge>
                             {/* FIX: Gavel is now correctly imported from lucide-react */}
                             <Gavel size={14} className="text-slate-500"/>
                        </div>
                        <p className="text-xs font-bold leading-tight">Capital Drawdown Auth</p>
                        <p className="text-[10px] text-slate-400 mt-2">12 Oct 2024</p>
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="PM-58" name="Risk Exposure Radar" />
                    <div className="h-20 w-full flex items-center justify-center">
                        <PieChart size={48} className="text-red-400 animate-pulse" />
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="PM-60" name="Compliance Seal" />
                    <div className="flex flex-col items-center justify-center gap-1 border-2 border-green-500 rounded-full w-20 h-20 mx-auto bg-green-50">
                        <ShieldCheck size={24} className="text-green-600"/>
                        <span className="text-[8px] font-black text-green-700 uppercase">Verified</span>
                    </div>
                </DemoContainer>
            </div>
        </div>

        {/* --- SECTION 7: FINANCE & EVM (61-70) --- */}
        <div className="space-y-6">
            <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Financial Control & EVM</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <DemoContainer>
                    <ComponentLabel id="PM-61" name="Earned Value (EV) Point" />
                    <div className="space-y-1">
                        <span className="text-[10px] font-black text-slate-400 uppercase">BCWP (Earned Value)</span>
                        <div className="text-lg font-mono font-black text-emerald-600">$1,450,200</div>
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="PM-64" name="CPI Status Pill" />
                    <div className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-xl">
                        <span className="text-xs font-bold text-red-900">CPI</span>
                        <span className="text-xl font-black text-red-600 font-mono">0.82</span>
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="PM-68" name="Budget Burn Meter" />
                    <div className="space-y-2">
                         <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200 shadow-inner">
                            <div className="h-full bg-nexus-600 w-[60%]"></div>
                         </div>
                         <div className="flex justify-between text-[9px] font-bold text-slate-400">
                            <span>$1.2M Spent</span>
                            <span>$2.0M Total</span>
                         </div>
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="PM-70" name="Final Fiscal Sign-off" />
                    <div className="flex flex-col items-center justify-center p-4 h-full">
                        {project ? (
                             <div className="text-center group cursor-pointer">
                                <div className="w-12 h-12 rounded-full border-2 border-slate-900 flex items-center justify-center mb-2 group-hover:bg-slate-900 group-hover:text-white transition-all">
                                    <CheckCircle2 size={24}/>
                                </div>
                                <span className="text-[9px] font-black uppercase text-slate-900 tracking-widest">Baseline Locked</span>
                             </div>
                        ) : (
                            /* FIX: Button is now correctly imported and used */
                            <Button size="sm" onClick={() => dispatch({type: 'PROJECT_UPDATE', payload: {}})}>Commit Baseline</Button>
                        )}
                    </div>
                </DemoContainer>
            </div>
        </div>
    </div>
  );
};