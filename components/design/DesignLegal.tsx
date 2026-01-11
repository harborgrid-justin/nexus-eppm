import React from 'react';
import { 
  Scale, ShieldCheck, FileText, Clock, AlertTriangle, 
  CheckCircle2, Fingerprint, Gavel, Globe, Info, 
  Lock, MoreHorizontal, Search, Trash2, UserCheck, 
  FileSignature, Landmark, HardHat, Eye, 
  AlertCircle, History, ExternalLink, Zap,
  ChevronDown, Activity, ChevronRight, BookOpen,
  QrCode, Scan, Stamp, Scroll, PenTool, ShieldAlert,
  GripVertical, FileDigit, FileSearch,
  BadgeCheck, User
} from 'lucide-react';
import { SectionHeading, DemoContainer, ComponentLabel } from './DesignHelpers';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { ProgressBar } from '../common/ProgressBar';

export const DesignLegal = () => {
  return (
    <div className="space-y-12 animate-nexus-in pb-20">
        <SectionHeading title="Regulatory & Compliance" icon={Scale} count="LG-01 to LG-50" />
        
        {/* --- 1. CORE DOCUMENT STRUCTURES (06-15) --- */}
        <div className="space-y-6">
            <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Core Document Structures</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <DemoContainer>
                    <ComponentLabel id="LG-06" name="Bates Numbering" />
                    <div className="flex flex-col items-end w-full">
                        <div className="h-20 w-full bg-slate-50 border border-slate-200 rounded flex items-center justify-center text-[10px] text-slate-300 italic">Page Content...</div>
                        <div className="mt-2 font-mono text-[10px] text-slate-500 font-bold bg-white px-2 py-1 border border-slate-300 rounded shadow-sm">
                            NEX-PROD-0004921
                        </div>
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="LG-07" name="Compliance Audit Badge" />
                    <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 border border-green-200 rounded-xl w-fit shadow-sm">
                        <ShieldCheck size={16} />
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase tracking-tighter">Audit Verified</span>
                            <span className="text-[8px] font-medium opacity-70">TS: 2024.10.12</span>
                        </div>
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="LG-08" name="Case Status Header" />
                    <div className="bg-slate-900 text-white p-3 rounded-xl shadow-lg border border-slate-800 w-full">
                        <div className="flex justify-between items-center mb-2">
                             <span className="text-[9px] font-bold text-nexus-400 uppercase tracking-widest">Litigation</span>
                             <Badge variant="danger" className="scale-75 origin-right">High Risk</Badge>
                        </div>
                        <h5 className="font-bold text-sm truncate">State v. Enterprise</h5>
                        <p className="text-[10px] text-slate-400 mt-1 font-mono">24-CV-1029</p>
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="LG-09" name="Evidence Inventory Scan" />
                    <div className="bg-white p-2 border-2 border-slate-900 rounded flex flex-col items-center gap-1 shadow-sm">
                        <Scan size={40} strokeWidth={1} />
                        <span className="text-[9px] font-mono font-black tracking-[0.3em]">ITEM-4921-X</span>
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="LG-10" name="Watermark Overlay" />
                    <div className="relative h-24 w-full bg-white border border-slate-200 rounded overflow-hidden flex items-center justify-center">
                        <span className="absolute text-slate-100 text-3xl font-black -rotate-12 select-none tracking-widest uppercase">Privileged</span>
                        <div className="text-[8px] text-slate-400 text-center px-4 leading-tight opacity-50">Document body text content and legal assertions.</div>
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="LG-11" name="Redaction Mask" />
                    <div className="text-xs text-slate-700 bg-white p-3 rounded border border-slate-200">
                        Subject <span className="bg-slate-900 text-slate-900 rounded-sm px-1 cursor-help" title="Sensitive Data">REDACTED</span> was present...
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="LG-12" name="Bates Search Tool" />
                    <div className="relative">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input className="w-full pl-9 pr-3 py-2 border rounded-lg text-xs font-mono" placeholder="Jump to Bates #..." />
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="LG-13" name="Chain of Custody" />
                    <div className="space-y-2">
                        <div className="flex justify-between items-center text-[9px] font-bold text-slate-400"><span>CUSTODIAN</span> <span>TIMESTAMP</span></div>
                        <div className="flex justify-between items-center p-2 bg-slate-50 border rounded text-[10px]">
                            <span className="font-bold">M. Ross</span> <span className="font-mono">10/12 14:02</span>
                        </div>
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="LG-14" name="Exhibit Identifier" />
                    <div className="bg-blue-900 text-white p-3 rounded-lg flex flex-col items-center justify-center gap-1 shadow-md">
                        <span className="text-[10px] font-black uppercase opacity-60">Exhibit</span>
                        <span className="text-2xl font-black">A-04</span>
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="LG-15" name="Signature Pad" />
                    <div className="border border-slate-300 bg-slate-50 p-3 rounded-lg flex flex-col items-center justify-center gap-2">
                        <div className="h-10 w-full border-b border-slate-400 relative">
                             <PenTool size={16} className="absolute bottom-2 right-2 text-slate-300"/>
                        </div>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Sign Electronically</span>
                    </div>
                </DemoContainer>
            </div>
        </div>

        {/* --- 2. REGULATORY TRACKING (16-30) --- */}
        <div className="space-y-6">
            <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Regulatory & Permit Tracking</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <DemoContainer>
                    <ComponentLabel id="LG-16" name="Permit Status" />
                    <div className="flex items-center justify-between p-3 border rounded-xl bg-white group hover:border-nexus-400 transition-all cursor-pointer">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-slate-50 rounded-lg text-slate-400 group-hover:text-nexus-600 transition-colors"><HardHat size={18}/></div>
                            <div className="min-w-0">
                                <p className="text-sm font-bold text-slate-800 truncate">EPA Permit</p>
                                <p className="text-[10px] text-slate-500 font-mono">Exp: 2025</p>
                            </div>
                        </div>
                        <Badge variant="success">Valid</Badge>
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="LG-17" name="Violation Alert" />
                    <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded-r-xl flex gap-3 shadow-sm animate-pulse">
                        <AlertTriangle className="text-red-600 shrink-0" size={18} />
                        <div className="min-w-0">
                            <p className="text-[10px] font-black text-red-900 uppercase">Violation</p>
                            <p className="text-[9px] text-red-700 leading-tight">Threshold exceeded in S4.</p>
                        </div>
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="LG-18" name="Statutory Deadline" />
                    <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                        <div className="text-center border-r border-slate-200 pr-3">
                            <p className="text-xl font-black text-red-600 font-mono leading-none">08</p>
                            <p className="text-[8px] font-black text-slate-400 uppercase mt-1">Days</p>
                        </div>
                        <div className="flex-1 min-w-0">
                             <p className="text-xs font-bold text-slate-700 truncate">SEC 10-K</p>
                             <p className="text-[9px] text-slate-500">FY24-Q3 Window</p>
                        </div>
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="LG-19" name="Jurisdiction Pill" />
                    <div className="flex items-center justify-between bg-white border border-slate-200 rounded-lg p-2 shadow-inner">
                        <div className="flex items-center gap-2">
                             <Globe size={14} className="text-blue-500"/>
                             <span className="text-xs font-bold text-slate-700">Federal (US)</span>
                        </div>
                        <button className="text-slate-400 hover:text-nexus-600 transition-colors"><ChevronDown size={14}/></button>
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="LG-20" name="Notary Acknowledgment" />
                    <div className="border border-slate-300 p-3 rounded bg-slate-50 relative overflow-hidden">
                        <div className="absolute -right-2 -bottom-2 opacity-5 rotate-12"><Stamp size={60}/></div>
                        <p className="text-[9px] text-slate-600 leading-tight italic">Subscribed and sworn to before me this 12th day...</p>
                        <div className="mt-4 h-px bg-slate-300 w-1/2"></div>
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="LG-21" name="Privacy Consent" />
                    <div className="space-y-1.5">
                        <div className="flex justify-between text-[10px] font-bold">
                            <span className="text-slate-700">GDPR Opt-in</span>
                            <span className="text-green-600">92%</span>
                        </div>
                        <ProgressBar value={92} size="sm" colorClass="bg-green-500"/>
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="LG-22" name="Retention Policy" />
                    <div className="flex items-center gap-2 text-[10px] text-slate-500 bg-white border px-2 py-1 rounded">
                        <History size={12}/> Destroy: 2030-12-31
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="LG-23" name="Access Control Group" />
                    <div className="flex -space-x-1">
                        <div className="w-6 h-6 rounded-full bg-slate-800 border-2 border-white flex items-center justify-center text-[8px] font-bold text-white">PM</div>
                        <div className="w-6 h-6 rounded-full bg-slate-400 border-2 border-white flex items-center justify-center text-[8px] font-bold text-white">LG</div>
                        <div className="w-6 h-6 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-[8px] font-bold text-slate-500">+1</div>
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="LG-24" name="Legal Hold Indicator" />
                    <div className="p-2 bg-indigo-50 border border-indigo-200 rounded-lg flex items-center gap-2">
                        <Lock size={14} className="text-indigo-600"/>
                        <span className="text-[10px] font-black text-indigo-700 uppercase">Litigation Hold Active</span>
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="LG-25" name="Document Versioning" />
                    <div className="flex items-center gap-2 text-[10px] font-mono bg-slate-100 px-2 py-1 rounded border">
                        <FileDigit size={12}/> v3.1.2-FINAL
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="LG-26" name="Court Docket Ref" />
                    <div className="text-[10px] font-bold text-slate-700 bg-slate-50 p-2 rounded border border-slate-200 flex justify-between">
                        <span>DOCKET NO.</span> <span className="font-mono">1:23-cv-0429</span>
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="LG-27" name="Privacy Impact Check" />
                    <div className="flex gap-1">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <div className="w-2 h-2 rounded-full bg-slate-200"></div>
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="LG-28" name="Regulatory Feed" />
                    <div className="flex gap-2 p-1 border rounded bg-white">
                        <div className="w-1 bg-blue-500 rounded"></div>
                        <span className="text-[9px] font-medium leading-none">New SEC guidance issued regarding ESG disclosure...</span>
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="LG-29" name="Compliance Roadmap" />
                    <div className="h-6 w-full bg-slate-100 rounded-full flex items-center px-1 overflow-hidden">
                        <div className="h-4 w-1/2 bg-blue-600 rounded-full"></div>
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="LG-30" name="Certification Seal" />
                    <div className="w-12 h-12 rounded-full border-4 border-nexus-200 flex items-center justify-center text-nexus-600 shadow-inner">
                        <BadgeCheck size={24}/>
                    </div>
                </DemoContainer>
            </div>
        </div>

        {/* --- 3. AUDIT & ETHICS (31-40) --- */}
        <div className="space-y-6">
            <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Audit Trails & Ethics</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 <DemoContainer>
                    <ComponentLabel id="LG-31" name="Immutable Audit Entry" />
                    <div className="flex gap-3 p-2 hover:bg-slate-50 transition-colors border-b border-slate-100">
                        <div className="flex flex-col items-center">
                            <div className="w-2 h-2 rounded-full bg-nexus-600 mt-1"></div>
                            <div className="w-px flex-1 bg-slate-100 mt-1"></div>
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between text-[10px]">
                                <span className="font-bold text-slate-900">Baseline Locked</span>
                                <span className="text-slate-400 font-mono">14:02</span>
                            </div>
                            <p className="text-[10px] text-slate-500 mt-0.5 font-mono truncate">SHA256: 4921x...f2e</p>
                        </div>
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="LG-32" name="Conflict Disclosure" />
                    <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-sm flex items-center gap-4 group hover:border-nexus-300 transition-all">
                        <div className="w-8 h-8 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 group-hover:bg-nexus-50 group-hover:text-nexus-600 transition-colors"><UserCheck size={16}/></div>
                        <div className="flex-1 min-w-0">
                            <h5 className="text-xs font-bold text-slate-800">Disclosure Log</h5>
                            <p className="text-[10px] text-slate-500 truncate">M. Ross • Annual</p>
                        </div>
                        <Badge variant="success">Clear</Badge>
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="LG-33" name="Policy Exception" />
                    <div className="border border-amber-200 rounded-xl overflow-hidden shadow-sm bg-white">
                        <div className="bg-amber-50 px-3 py-1.5 border-b border-amber-100 flex justify-between items-center">
                            <span className="text-[9px] font-black text-amber-800 uppercase">Exception</span>
                            <AlertCircle size={12} className="text-amber-600" />
                        </div>
                        <div className="p-3 space-y-1">
                             <p className="text-[11px] font-bold text-slate-800">Procurement Waiver #492</p>
                             <p className="text-[9px] text-slate-500 leading-tight">Emergency bypassing of standard RFQ.</p>
                        </div>
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="LG-34" name="Sanction Screen" />
                    <div className="bg-slate-900 p-3 rounded-xl shadow-lg flex items-center justify-between">
                         <div className="flex items-center gap-2">
                             <Fingerprint size={20} className="text-green-500 animate-pulse"/>
                             <div>
                                 <p className="text-[10px] font-bold text-white">Global Check</p>
                                 <p className="text-[9px] text-slate-400">Acme Global Log.</p>
                             </div>
                         </div>
                         <span className="text-green-400 font-black text-[10px] uppercase">CLEARED</span>
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="LG-35" name="Ethics Hotline Button" />
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center space-y-2">
                        <p className="text-[10px] font-bold text-slate-700">Report a concern?</p>
                        <button className="w-full py-1.5 bg-white border rounded text-[10px] font-black uppercase flex items-center justify-center gap-2 hover:bg-slate-50">
                            <Info size={12}/> Anonymous Portal
                        </button>
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="LG-36" name="Document Discovery Log" />
                    <div className="bg-white border rounded p-2 flex flex-col gap-1.5 shadow-sm">
                        <div className="flex justify-between text-[10px] font-bold">
                            <span className="text-slate-800">Review Queue</span>
                            <span className="text-blue-600">42%</span>
                        </div>
                        <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                             <div className="bg-blue-600 h-full w-[42%]"></div>
                        </div>
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="LG-37" name="Legal Discovery Query" />
                    <div className="relative">
                        <FileSearch size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input className="w-full pl-9 pr-3 py-1.5 border rounded text-xs italic" placeholder="Find relevant metadata..." />
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="LG-38" name="Audit Sampling Logic" />
                    <div className="bg-slate-50 border border-slate-200 rounded p-2 text-[9px] font-mono text-slate-600">
                        SELECT * FROM transactions <br/> WHERE risk_score > 15 <br/> LIMIT 5% RANDOM;
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="LG-39" name="Ethics Training Status" />
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full border-4 border-green-100 flex items-center justify-center text-[10px] font-black text-green-700">100%</div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase">Training Complete</span>
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="LG-40" name="Data Residency Map" />
                    <div className="bg-slate-900 rounded p-2 flex flex-col gap-2 relative overflow-hidden">
                        <div className="absolute top-1 left-1 opacity-20"><Globe size={30}/></div>
                        <div className="flex justify-between relative z-10">
                            <span className="text-[8px] font-bold text-white uppercase">Primary Store</span>
                            <span className="text-[8px] font-mono text-green-400">AWS_EU_WEST_1</span>
                        </div>
                    </div>
                </DemoContainer>
            </div>
        </div>

        {/* --- 4. CORPORATE GOVERNANCE (41-50) --- */}
        <div className="space-y-6">
            <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Corporate & Governance Actions</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                 <DemoContainer>
                    <ComponentLabel id="LG-41" name="Board Resolution Card" />
                    <div className="bg-white border-2 border-slate-900 rounded-xl p-4 shadow-xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity"><Gavel size={40}/></div>
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-[9px] font-black text-slate-400 uppercase">Res 24-001</span>
                            <Badge variant="success" className="scale-75">Enacted</Badge>
                        </div>
                        <h4 className="font-bold text-slate-900 text-xs truncate">Portfolio Realignment</h4>
                        <p className="text-[9px] text-slate-500 leading-tight mt-1">Approval to reallocate 15% budget.</p>
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="LG-42" name="Legal Seal" />
                    <div className="flex flex-col items-center justify-center p-3 border-2 border-slate-300 rounded-full w-24 h-24 mx-auto bg-white shadow-inner relative">
                        <div className="border border-slate-100 rounded-full w-full h-full flex flex-col items-center justify-center">
                            <Scroll size={20} className="text-slate-400 mb-1"/>
                            <span className="text-[6px] font-black uppercase text-center text-slate-400">Official <br/>Record</span>
                        </div>
                        <div className="absolute -bottom-1 -right-1 bg-red-600 text-white rounded-full p-1 border-2 border-white shadow-md"><Lock size={10}/></div>
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="LG-43" name="SOP Reference Link" />
                    <div className="p-3 border rounded-xl bg-white flex items-center justify-between group hover:bg-slate-50 transition-all cursor-pointer">
                        <div className="flex items-center gap-2">
                             <div className="p-1.5 bg-slate-100 rounded text-slate-500"><BookOpen size={14}/></div>
                             <div className="min-w-0">
                                 <p className="text-xs font-bold text-slate-800 truncate">SOP-ENG-492</p>
                                 <p className="text-[8px] text-slate-500 uppercase">Review Standard</p>
                             </div>
                        </div>
                        <ExternalLink size={12} className="text-slate-300 group-hover:text-nexus-600"/>
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="LG-44" name="IP/Patent Info" />
                    <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-blue-300 transition-colors">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-[9px] font-black text-slate-400 uppercase">IP Ledger</span>
                            <Zap size={10} className="text-yellow-500" />
                        </div>
                        <h5 className="font-bold text-[11px] text-slate-800 truncate">Nexus Core Engine</h5>
                        <p className="text-[9px] text-slate-500 mt-0.5">Status: <span className="text-green-600 font-bold uppercase">Pending</span></p>
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="LG-45" name="Legal Hold Notification" />
                    <div className="p-3 bg-indigo-900 text-white rounded-xl shadow-lg relative overflow-hidden">
                        <div className="absolute inset-0 bg-white/5 pointer-events-none"></div>
                        <div className="flex items-center gap-2 mb-1 relative z-10">
                            <ShieldAlert className="text-nexus-400" size={14}/>
                            <h4 className="font-black text-[9px] uppercase tracking-widest">Hold Active</h4>
                        </div>
                        <p className="text-[9px] text-indigo-100 leading-tight relative z-10">Do not destroy records relating to Matter #4920.</p>
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="LG-46" name="Voting Outcome" />
                    <div className="flex items-center gap-3">
                         <div className="text-center bg-green-50 p-2 rounded border border-green-100">
                             <p className="text-[8px] font-bold text-green-700">YES</p>
                             <p className="text-lg font-black text-green-900">12</p>
                         </div>
                         <div className="text-center bg-red-50 p-2 rounded border border-red-100">
                             <p className="text-[8px] font-bold text-red-700">NO</p>
                             <p className="text-lg font-black text-red-900">0</p>
                         </div>
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="LG-47" name="Proxy Authorizer" />
                    <div className="flex items-center gap-2 p-2 border border-slate-200 rounded-lg bg-white">
                        <div className="w-8 h-8 rounded bg-slate-900 flex items-center justify-center text-white"><User size={16}/></div>
                        <div className="flex-1">
                            <p className="text-xs font-bold">J. Saadein</p>
                            <p className="text-[9px] text-slate-500">Acting Proxy for CFO</p>
                        </div>
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="LG-48" name="Regulation Mapping" />
                    <div className="flex flex-col gap-1">
                         <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Linked Standard</span>
                         <div className="flex items-center gap-2 text-[10px] text-blue-700 bg-blue-50 px-2 py-1 rounded border border-blue-100">
                             <Landmark size={12}/> 29 CFR 1926.501
                         </div>
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="LG-49" name="Risk Impact Severity" />
                    <div className="flex gap-1 h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full w-1/3 bg-green-500"></div>
                        <div className="h-full w-1/3 bg-yellow-500"></div>
                        <div className="h-full w-1/3 bg-red-500 opacity-30"></div>
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="LG-50" name="Final Sign-off Seal" />
                    <div className="flex flex-col items-center justify-center py-2 border-2 border-slate-200 rounded-xl bg-white relative group cursor-pointer hover:border-green-500 transition-colors">
                        <div className="w-12 h-12 rounded-full border-2 border-green-100 flex items-center justify-center text-green-600 mb-1 transition-transform group-hover:scale-110">
                            <CheckCircle2 size={24} />
                        </div>
                        <span className="text-[8px] font-black uppercase tracking-widest text-green-700 text-center">Authorized Closure</span>
                    </div>
                </DemoContainer>
            </div>
        </div>
    </div>
  );
};
