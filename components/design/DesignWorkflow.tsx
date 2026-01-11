
import React from 'react';
import { 
  GitBranch, Play, User, ChevronRight, X, Plus, Clock, Settings, AlertTriangle, 
  FileText, Square, Mail, StopCircle, Terminal, Rewind, Radio 
} from 'lucide-react';
import { SectionHeading, DemoContainer, ComponentLabel } from './DesignHelpers';

export const DesignWorkflow = () => {
  return (
    <div className="space-y-12 animate-fade-in pb-20">
        <SectionHeading title="Automation Engine" icon={GitBranch} count="WF-01 to WF-80" />
        
        {/* Basic Nodes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Existing WF-01 */}
            <DemoContainer>
                <ComponentLabel id="WF-01" name="Flow Start Event" />
                <div className="flex items-center justify-center py-2">
                    <div className="w-12 h-12 rounded-full border-4 border-green-500 bg-green-50 flex items-center justify-center shadow-sm relative group cursor-pointer hover:scale-105 transition-transform hover:shadow-green-100">
                        <Play size={16} className="text-green-600 ml-1 fill-green-600"/>
                        <div className="absolute -bottom-8 text-[10px] font-bold text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-white px-2 py-1 rounded shadow border">Trigger</div>
                    </div>
                </div>
            </DemoContainer>

            {/* Existing WF-02 */}
            <DemoContainer>
                <ComponentLabel id="WF-02" name="User Task Node" />
                <div className="w-full bg-white border-2 border-blue-500 rounded-xl p-3 shadow-sm relative hover:shadow-md transition-shadow cursor-pointer group overflow-hidden">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500"></div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="p-1 bg-blue-100 rounded text-blue-600"><User size={12}/></div>
                        <span className="text-sm font-bold text-slate-800">Review Contract</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-slate-500 pl-1">
                        <span>Legal Team</span>
                        <span className="bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded font-bold border border-blue-100">SLA: 2d</span>
                    </div>
                </div>
            </DemoContainer>
            
            {/* New WF-06 XOR Gateway */}
            <DemoContainer>
                <ComponentLabel id="WF-06" name="Exclusive Gateway (XOR)" />
                <div className="flex items-center justify-center py-2">
                    <div className="w-12 h-12 transform rotate-45 border-4 border-slate-300 bg-white flex items-center justify-center shadow-sm relative group cursor-pointer hover:border-nexus-400 transition-colors">
                        <div className="transform -rotate-45 font-bold text-slate-500 group-hover:text-nexus-600">
                            <X size={20}/>
                        </div>
                         <div className="absolute -bottom-8 transform -rotate-45 translate-y-6 translate-x-6 text-[10px] font-bold text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Decision</div>
                    </div>
                </div>
            </DemoContainer>

            {/* New WF-07 Parallel Gateway */}
            <DemoContainer>
                <ComponentLabel id="WF-07" name="Parallel Gateway (AND)" />
                <div className="flex items-center justify-center py-2">
                    <div className="w-12 h-12 transform rotate-45 border-4 border-slate-300 bg-white flex items-center justify-center shadow-sm relative group cursor-pointer hover:border-nexus-400 transition-colors">
                        <div className="transform -rotate-45 font-bold text-slate-500 group-hover:text-nexus-600">
                            <Plus size={24}/>
                        </div>
                    </div>
                </div>
            </DemoContainer>
        </div>

        {/* Specialized Events & Tasks */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* WF-08 Timer */}
            <DemoContainer>
                <ComponentLabel id="WF-08" name="Timer Event" />
                <div className="flex items-center justify-center py-2">
                    <div className="w-12 h-12 rounded-full border-4 border-amber-300 bg-amber-50 flex items-center justify-center shadow-sm group cursor-pointer">
                        <Clock size={20} className="text-amber-600"/>
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-[8px] flex items-center justify-center font-bold">1h</div>
                    </div>
                </div>
            </DemoContainer>

            {/* Existing WF-09 */}
            <DemoContainer>
                <ComponentLabel id="WF-09" name="Sequence Flow" />
                <div className="h-10 flex items-center justify-center w-full relative px-4">
                    <div className="h-0.5 w-full bg-slate-400 relative">
                            <div className="absolute right-0 -top-2 text-slate-400">
                                <ChevronRight size={18} strokeWidth={3}/>
                            </div>
                    </div>
                </div>
            </DemoContainer>

            {/* WF-10 Service Task */}
            <DemoContainer>
                <ComponentLabel id="WF-10" name="Service Task" />
                <div className="w-full bg-slate-50 border-2 border-slate-300 rounded-lg p-3 flex items-center gap-3 relative border-dashed hover:border-solid hover:border-slate-400 transition-all cursor-pointer">
                    <div className="p-1.5 bg-white border border-slate-200 rounded text-slate-600"><Settings size={14}/></div>
                    <div className="flex-1">
                        <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">System</div>
                        <div className="text-[10px] text-slate-500">API Call: Sync Data</div>
                    </div>
                </div>
            </DemoContainer>

            {/* WF-12 Error Boundary */}
            <DemoContainer>
                <ComponentLabel id="WF-12" name="Error Boundary" />
                <div className="relative p-4 border border-slate-200 rounded-lg bg-white overflow-visible">
                    <div className="text-xs text-slate-400 text-center">Task Context</div>
                    <div className="absolute -bottom-3 -right-3 w-8 h-8 rounded-full border-2 border-red-500 bg-white flex items-center justify-center z-10 shadow-sm cursor-pointer hover:bg-red-50">
                        <AlertTriangle size={14} className="text-red-500"/>
                    </div>
                </div>
            </DemoContainer>
        </div>

        {/* Advanced Constructs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* WF-15 Sub Process */}
            <DemoContainer>
                <ComponentLabel id="WF-15" name="Sub-Process (Collapsed)" />
                <div className="w-full h-20 border-2 border-slate-400 rounded-xl flex items-center justify-center bg-white relative hover:shadow-md transition-shadow cursor-pointer">
                    <span className="font-bold text-slate-700">Audit Review Cycle</span>
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 border border-slate-400 flex items-center justify-center text-slate-500 text-[10px]">+</div>
                </div>
            </DemoContainer>

            {/* WF-20 Conditional Flow */}
            <DemoContainer>
                <ComponentLabel id="WF-20" name="Conditional Flow" />
                <div className="h-12 flex items-center justify-center w-full relative px-4">
                    <div className="absolute left-0 w-3 h-3 bg-nexus-500 transform rotate-45"></div>
                    <div className="h-0.5 w-full bg-slate-400 relative mt-1">
                         <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white px-1 text-[9px] font-mono border border-slate-200 rounded text-slate-500">value &gt; $5k</div>
                         <div className="absolute right-0 -top-2 text-slate-400">
                             <ChevronRight size={18} strokeWidth={3}/>
                         </div>
                    </div>
                </div>
            </DemoContainer>

            {/* WF-25 Data Object */}
            <DemoContainer>
                 <ComponentLabel id="WF-25" name="Data Object Ref" />
                 <div className="flex items-center gap-4 justify-center py-2">
                    <div className="w-12 h-12 border-2 border-slate-300 rounded-lg flex items-center justify-center bg-white"><User size={20} className="text-slate-400"/></div>
                    <div className="h-px w-8 border-t-2 border-dotted border-slate-300"></div>
                    <div className="relative">
                        <FileText size={24} className="text-slate-400"/>
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-nexus-500 rounded-full"></div>
                    </div>
                 </div>
            </DemoContainer>
        </div>

        {/* BPMN Event Types */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
             <DemoContainer>
                <ComponentLabel id="WF-40" name="Message" />
                <div className="flex justify-center py-2">
                    <div className="w-10 h-10 rounded-full border-2 border-slate-400 bg-white flex items-center justify-center border-dashed hover:border-solid hover:border-nexus-500 hover:text-nexus-600 transition-all cursor-pointer">
                        <Mail size={16}/>
                    </div>
                </div>
            </DemoContainer>

            <DemoContainer>
                <ComponentLabel id="WF-50" name="Terminate" />
                <div className="flex justify-center py-2">
                    <div className="w-10 h-10 rounded-full border-4 border-slate-800 bg-slate-800 flex items-center justify-center shadow-lg hover:ring-4 ring-slate-200 transition-all cursor-pointer">
                       <div className="w-3 h-3 bg-white rounded-full"></div>
                    </div>
                </div>
            </DemoContainer>

            <DemoContainer>
                <ComponentLabel id="WF-60" name="Script Task" />
                <div className="flex justify-center py-2">
                    <div className="w-full h-12 border border-slate-300 rounded-lg bg-slate-50 flex items-center px-3 gap-2 hover:bg-slate-100 cursor-pointer">
                        <Terminal size={14} className="text-slate-500"/>
                        <span className="text-[10px] font-mono text-slate-600">run_validation.js</span>
                    </div>
                </div>
            </DemoContainer>

            <DemoContainer>
                <ComponentLabel id="WF-70" name="Compensation" />
                <div className="flex justify-center py-2">
                     <div className="w-10 h-10 rounded-full border-2 border-orange-400 bg-orange-50 flex items-center justify-center text-orange-600 border-double hover:scale-110 transition-transform">
                        <Rewind size={16}/>
                    </div>
                </div>
            </DemoContainer>

            <DemoContainer>
                <ComponentLabel id="WF-80" name="Signal" />
                <div className="flex justify-center py-2">
                     <div className="w-10 h-10 rounded-full border-2 border-purple-400 bg-purple-50 flex items-center justify-center text-purple-600 hover:scale-110 transition-transform cursor-pointer">
                        <Radio size={16}/>
                    </div>
                </div>
            </DemoContainer>
             
             <DemoContainer>
                 <ComponentLabel id="WF-30" name="Swimlane" />
                 <div className="w-full h-16 border border-slate-300 flex overflow-hidden rounded bg-slate-50">
                     <div className="w-6 border-r border-slate-300 flex items-center justify-center bg-slate-100">
                         <span className="text-[8px] font-bold uppercase -rotate-90 whitespace-nowrap text-slate-500">Finance</span>
                     </div>
                     <div className="flex-1 bg-[linear-gradient(45deg,#f1f5f9_25%,transparent_25%,transparent_75%,#f1f5f9_75%,#f1f5f9),linear-gradient(45deg,#f1f5f9_25%,transparent_25%,transparent_75%,#f1f5f9_75%,#f1f5f9)] bg-[length:10px_10px] bg-white opacity-50"></div>
                 </div>
            </DemoContainer>
        </div>
    </div>
  );
};
