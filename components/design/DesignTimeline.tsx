
import React from 'react';
import {
  History, Clock, CheckCircle, XCircle, User, FileText, GitCommit,
  ArrowRight, Milestone, ChevronRight, MessageSquare, DollarSign, Scale,
  GitBranch, GitMerge, Edit, Trash2, Mail, Phone, UploadCloud, Download,
  Server, Zap, CheckSquare, CornerDownRight, ChevronsRight, MoreHorizontal,
  ThumbsUp, Share2, Package, Truck, Plane, Circle, Bot, Gavel, ArrowDown,
  Play, Pause, Square, Workflow, GitPullRequest, Code, Shield, Repeat,
  Anchor, Landmark, FileDiff, AlertTriangle
} from 'lucide-react';
import { SectionHeading, DemoContainer, ComponentLabel } from './DesignHelpers';
import { UserAvatar } from '../common/UserAvatar';
import { Badge } from '../ui/Badge';
import { ProgressBar } from '../common/ProgressBar';

export const DesignTimeline = () => {
  return (
    <div className="space-y-12 animate-fade-in pb-20">
        <SectionHeading title="History & Feeds" icon={History} count="TL-01 to TL-89" />

        {/* --- VERTICAL FEEDS & AUDIT LOGS --- */}
        <div className="space-y-6">
            <h4 className="text-lg font-bold text-slate-900 border-b pb-2">Vertical Feeds & Audit Logs</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <DemoContainer>
                    <ComponentLabel id="TL-01" name="Simple Log Entry" />
                    <div className="relative pl-6 py-2 border-l-2 border-slate-200">
                        <div className="absolute -left-[5px] top-3 w-2.5 h-2.5 bg-slate-400 rounded-full border-2 border-white"></div>
                        <p className="text-xs font-medium text-slate-800">System initialization complete.</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">2 hours ago</p>
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="TL-02" name="Status Change" />
                    <div className="relative pl-6 py-2 border-l-2 border-green-200">
                        <div className="absolute -left-[7px] top-3 w-4 h-4 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                            <CheckCircle size={10} className="text-white"/>
                        </div>
                        <p className="text-xs text-slate-600">Status changed to <span className="font-bold text-green-700">Approved</span>.</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">by Justin Saadein</p>
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="TL-03" name="Error/Alert Entry" />
                    <div className="relative pl-6 py-2 border-l-2 border-red-200">
                        <div className="absolute -left-[7px] top-3 w-4 h-4 bg-red-500 rounded-full border-2 border-white flex items-center justify-center">
                            <AlertTriangle size={10} className="text-white"/>
                        </div>
                        <p className="text-xs font-bold text-red-800">API Sync Failed</p>
                        <p className="text-[10px] text-red-600 mt-0.5">Could not connect to endpoint.</p>
                    </div>
                </DemoContainer>
                
                <DemoContainer>
                    <ComponentLabel id="TL-04" name="User Action w/ Avatar" />
                    <div className="relative pl-12 py-2 border-l-2 border-slate-200">
                        <div className="absolute -left-5 top-2"><UserAvatar name="Mike Ross" size="md" /></div>
                        <p className="text-xs text-slate-600"><span className="font-bold text-slate-900">Mike Ross</span> commented on the task.</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">"Looks good, ready for review."</p>
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="TL-05" name="File Upload Entry" />
                    <div className="relative pl-8 py-2 border-l-2 border-slate-200">
                        <div className="absolute -left-3 top-2 p-1 bg-blue-100 rounded-full border-2 border-white"><FileText size={12} className="text-blue-600"/></div>
                        <p className="text-xs font-medium text-slate-800">Uploaded <span className="font-bold">Project_Charter_v3.pdf</span></p>
                        <p className="text-[10px] text-slate-400 mt-0.5">Size: 2.1 MB</p>
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="TL-06" name="Multi-Event Group" />
                    <div className="relative pl-6 py-2 border-l-2 border-slate-200">
                        <div className="absolute -left-[5px] top-3 w-2.5 h-2.5 bg-slate-400 rounded-full border-2 border-white"></div>
                        <p className="text-xs font-medium text-slate-800">3 fields updated</p>
                        <div className="text-[10px] text-slate-500 mt-1 space-y-0.5">
                            <div>Status: <span className="font-bold">In Progress</span> → <span className="font-bold">Complete</span></div>
                            <div>Assignee: <span className="font-bold">None</span> → <span className="font-bold">J. Doe</span></div>
                        </div>
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="TL-07" name="System-to-System" />
                    <div className="relative pl-8 py-2 border-l-2 border-purple-200">
                        <div className="absolute -left-3 top-2 p-1 bg-purple-100 rounded-full border-2 border-white"><Server size={12} className="text-purple-600"/></div>
                        <p className="text-xs font-medium text-slate-800">Synced financial data with <span className="font-bold">SAP</span></p>
                        <p className="text-[10px] text-slate-400 mt-0.5">Synced 1,204 records.</p>
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="TL-08" name="AI Generated" />
                     <div className="relative pl-8 py-2 border-l-2 border-indigo-200">
                        <div className="absolute -left-3 top-2 p-1 bg-indigo-100 rounded-full border-2 border-white"><Bot size={12} className="text-indigo-600"/></div>
                        <p className="text-xs font-bold text-indigo-800">AI Risk Analysis Complete</p>
                        <p className="text-[10px] text-indigo-600 mt-0.5">Identified 3 new critical threats.</p>
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="TL-09" name="Governance Decision" />
                     <div className="relative pl-8 py-2 border-l-2 border-slate-200">
                        <div className="absolute -left-3 top-2 p-1 bg-slate-100 rounded-full border-2 border-white"><Gavel size={12} className="text-slate-600"/></div>
                        <p className="text-xs font-bold text-slate-800">Stage Gate Approved</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">by Steering Committee</p>
                    </div>
                </DemoContainer>
            </div>
        </div>

        {/* --- HORIZONTAL STEPPERS & PROCESS FLOWS --- */}
        <div className="space-y-6">
            <h4 className="text-lg font-bold text-slate-900 border-b pb-2">Horizontal Steppers & Flows</h4>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <DemoContainer className="lg:col-span-2">
                    <ComponentLabel id="TL-26" name="Basic Stepper" />
                    <div className="flex items-center justify-between w-full p-4">
                        {['Cart', 'Shipping', 'Payment', 'Confirm'].map((step, i) => (
                           <React.Fragment key={step}>
                            <div className="flex flex-col items-center">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 ${i < 2 ? 'bg-blue-600 border-blue-600 text-white' : i === 2 ? 'bg-white border-blue-600 text-blue-600' : 'bg-white border-slate-300 text-slate-400'}`}>
                                    {i < 2 ? <CheckCircle size={14}/> : i + 1}
                                </div>
                                <span className={`mt-2 text-xs font-medium ${i <= 2 ? 'text-slate-800' : 'text-slate-400'}`}>{step}</span>
                            </div>
                            { i < 3 && <div className={`flex-1 h-0.5 -mt-6 ${i < 2 ? 'bg-blue-600' : 'bg-slate-200'}`}></div> }
                           </React.Fragment>
                        ))}
                    </div>
                </DemoContainer>

                <DemoContainer className="lg:col-span-2">
                    <ComponentLabel id="TL-27" name="Chevron Flow" />
                    <div className="flex w-full">
                        {['Initiate', 'Review', 'Approve', 'Execute'].map((step, i) => (
                            <div key={step} className={`clip-chevron h-10 flex items-center justify-center text-xs font-bold text-white px-8 -ml-3 first:ml-0 ${i < 2 ? 'bg-blue-600' : i === 2 ? 'bg-blue-400' : 'bg-slate-300'}`}>
                                {step}
                            </div>
                        ))}
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="TL-28" name="Icon Stepper (Vertical)" />
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 text-green-600 rounded-full"><Package size={16}/></div>
                            <span className="text-sm font-medium text-slate-800">Order Placed</span>
                        </div>
                        <div className="h-4 border-l-2 border-slate-200 ml-5"></div>
                         <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 text-blue-600 rounded-full"><Truck size={16}/></div>
                            <span className="text-sm font-medium text-slate-800">Shipped</span>
                        </div>
                    </div>
                </DemoContainer>
            </div>
        </div>

        {/* --- VERSION & CHANGE HISTORY --- */}
        <div className="space-y-6">
            <h4 className="text-lg font-bold text-slate-900 border-b pb-2">Version & Change History</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <DemoContainer>
                    <ComponentLabel id="TL-46" name="Git Commit History" />
                    <div className="space-y-3">
                        <div className="flex gap-3">
                            <GitCommit size={16} className="text-slate-300 mt-0.5 shrink-0"/>
                            <div className="flex-1">
                                <p className="text-xs font-medium text-slate-900">feat: Add user authentication</p>
                                <p className="text-[10px] text-slate-500">Mike Ross committed 2 hours ago</p>
                            </div>
                            <span className="text-[10px] font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-500">a3f4e9c</span>
                        </div>
                         <div className="flex gap-3">
                            <GitCommit size={16} className="text-slate-300 mt-0.5 shrink-0"/>
                            <div className="flex-1">
                                <p className="text-xs font-medium text-slate-900">fix: Correct alignment on mobile</p>
                                <p className="text-[10px] text-slate-500">Sarah J. committed 5 hours ago</p>
                            </div>
                            <span className="text-[10px] font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-500">f9b1d2e</span>
                        </div>
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="TL-47" name="Document Version" />
                    <div className="space-y-2">
                        <div className="p-2 bg-white border border-slate-200 rounded-lg flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="p-1 bg-green-50 text-green-600 rounded"><CheckCircle size={12}/></div>
                                <span className="text-xs font-bold text-slate-800">Version 3.0 (Current)</span>
                            </div>
                            <span className="text-[10px] text-slate-400">Oct 12</span>
                        </div>
                        <div className="p-2 bg-slate-50 rounded-lg flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="p-1 bg-slate-100 text-slate-500 rounded"><History size={12}/></div>
                                <span className="text-xs font-medium text-slate-600">Version 2.5</span>
                            </div>
                            <span className="text-[10px] text-slate-400">Oct 10</span>
                        </div>
                    </div>
                </DemoContainer>
                
                <DemoContainer>
                    <ComponentLabel id="TL-48" name="Change Diff View" />
                    <div className="font-mono text-[10px] space-y-1">
                        <div className="bg-red-50 text-red-800 p-1 rounded">- budget: 50000</div>
                        <div className="bg-green-50 text-green-800 p-1 rounded">+ budget: 75000</div>
                    </div>
                </DemoContainer>
            </div>
        </div>

        {/* --- Remaining Components to reach 89 --- */}
        <div className="space-y-6">
             <h4 className="text-lg font-bold text-slate-900 border-b pb-2">Specialized Views</h4>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <DemoContainer><ComponentLabel id="TL-55" name="Gantt Phase Bar" /><div className="h-8 bg-slate-800 rounded-full flex items-center px-4"><div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[8px] border-l-white border-b-[6px] border-b-transparent"></div></div></DemoContainer>
                <DemoContainer><ComponentLabel id="TL-56" name="Schedule Snapshot" /><Badge icon={History}>Baseline Saved</Badge></DemoContainer>
                <DemoContainer><ComponentLabel id="TL-60" name="Financial Transaction" /><div className="p-2 border rounded text-xs"> <span className="font-bold">-$500</span> Vendor Payment</div></DemoContainer>
                <DemoContainer><ComponentLabel id="TL-61" name="Invoice Status Flow" /><div className="text-xs">Draft <ArrowRight size={10} className="inline"/> Submitted <ArrowRight size={10} className="inline"/> Paid</div></DemoContainer>
                <DemoContainer><ComponentLabel id="TL-65" name="Approval Workflow" /><div className="text-xs">PM <ArrowRight size={10} className="inline"/> Director</div></DemoContainer>
                <DemoContainer><ComponentLabel id="TL-70" name="Support Ticket History" /><div className="text-xs">Opened → Assigned → Resolved</div></DemoContainer>
                <DemoContainer><ComponentLabel id="TL-75" name="Release Notes" /><div className="text-xs"><span className="font-bold">v1.2</span> - Feature XYZ added.</div></DemoContainer>
                <DemoContainer><ComponentLabel id="TL-78" name="CRM Lead Status" /><Badge variant="info">Contacted</Badge></DemoContainer>
                <DemoContainer><ComponentLabel id="TL-80" name="Legal Case Timeline" /><div className="text-xs"><span className="font-bold">Filing</span> → Discovery</div></DemoContainer>
                <DemoContainer><ComponentLabel id="TL-82" name="HR Onboarding" /><div className="text-xs">Hired → Paperwork → Active</div></DemoContainer>
                <DemoContainer><ComponentLabel id="TL-85" name="Patient Care Pathway" /><div className="text-xs">Admission → Triage</div></DemoContainer>
                <DemoContainer><ComponentLabel id="TL-89" name="Execution Log" /><div className="font-mono text-[10px]">[OK] Task Complete</div></DemoContainer>
            </div>
        </div>

    </div>
  );
};
