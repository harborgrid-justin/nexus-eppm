
import React from 'react';
import { 
    Box, FileText, Download, TrendingUp, AlertTriangle, CheckCircle, 
    MoreHorizontal, GripVertical, Plus, CreditCard, User, Mail, Phone,
    Calendar, ArrowRight, Shield
} from 'lucide-react';
import { UserAvatar } from '../../common/UserAvatar';
import { DemoContainer, ComponentLabel } from '../DesignHelpers';
import { Badge } from '../../ui/Badge';
import { ProgressBar } from '../../common/ProgressBar';

export const DesignCardsBasic = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {/* Basic Content */}
        <DemoContainer>
            <ComponentLabel id="CD-01" name="Standard Card" />
            <div className="border rounded-lg shadow-sm p-4 bg-white font-bold text-sm text-slate-900">
                <h4 className="mb-2 text-base">Card Title</h4>
                <p className="text-slate-500 font-normal">Basic container for grouping related content.</p>
            </div>
        </DemoContainer>

        <DemoContainer>
            <ComponentLabel id="CD-02" name="User Profile (Mini)" />
            <div className="flex items-center gap-3 p-3 border rounded-lg bg-white shadow-sm">
                <UserAvatar name="Sarah J." size="md"/>
                <div>
                    <div className="font-bold text-sm text-slate-800">Sarah J.</div>
                    <div className="text-xs text-slate-500">Legal Counsel</div>
                </div>
            </div>
        </DemoContainer>

        <DemoContainer>
            <ComponentLabel id="CD-03" name="File Asset" />
            <div className="flex items-center border rounded-lg p-2 gap-2 bg-slate-50 hover:bg-white hover:shadow-sm transition-all cursor-pointer">
                <div className="bg-red-100 p-2 rounded-md"><FileText size={16} className="text-red-600"/></div>
                <div className="overflow-hidden flex-1">
                    <div className="text-xs font-bold truncate text-slate-700">contract_v2.pdf</div>
                    <div className="text-[10px] text-slate-400">1.2 MB</div>
                </div>
                <Download size={14} className="text-slate-400 hover:text-slate-600"/>
            </div>
        </DemoContainer>

        <DemoContainer>
            <ComponentLabel id="CD-04" name="Metric Stat (Trend)" />
            <div className="p-4 border rounded-xl bg-white shadow-sm">
                <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold text-slate-500 uppercase">Revenue</span>
                    <div className="flex items-center text-green-600 text-[10px] font-bold bg-green-50 px-1.5 py-0.5 rounded">
                        <TrendingUp size={10} className="mr-1"/> +12%
                    </div>
                </div>
                <div className="text-2xl font-black text-slate-900">$1.2M</div>
            </div>
        </DemoContainer>

        {/* Task & Workflow */}
        <DemoContainer>
            <ComponentLabel id="CD-05" name="Kanban Task" />
            <div className="p-3 bg-white border border-slate-200 rounded-lg shadow-sm border-l-4 border-l-orange-500 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex justify-between mb-2">
                    <span className="text-[10px] font-mono text-slate-400">TSK-102</span>
                    <MoreHorizontal size={14} className="text-slate-400"/>
                </div>
                <p className="text-sm font-semibold text-slate-800 mb-3 leading-tight">Update safety protocols for Site B</p>
                <div className="flex justify-between items-center">
                    <Badge variant="warning">High</Badge>
                    <UserAvatar name="Mike Ross" size="sm"/>
                </div>
            </div>
        </DemoContainer>

        <DemoContainer>
            <ComponentLabel id="CD-06" name="Notification Item" />
            <div className="flex gap-3 p-3 bg-blue-50 border border-blue-100 rounded-lg">
                <div className="mt-0.5 text-blue-600"><AlertTriangle size={16}/></div>
                <div>
                    <p className="text-xs font-bold text-blue-900">Budget Threshold</p>
                    <p className="text-[10px] text-blue-700 leading-relaxed mt-0.5">Project P-102 has exceeded 80% of contingency.</p>
                </div>
            </div>
        </DemoContainer>

        <DemoContainer>
            <ComponentLabel id="CD-07" name="Selection Tile" />
            <label className="flex items-start gap-3 p-3 border-2 border-nexus-500 bg-nexus-50 rounded-lg cursor-pointer relative">
                <div className="absolute top-2 right-2 text-nexus-600"><CheckCircle size={16}/></div>
                <div className="p-2 bg-white rounded-md shadow-sm text-nexus-600"><CreditCard size={18}/></div>
                <div>
                    <span className="block text-sm font-bold text-nexus-800">Enterprise Plan</span>
                    <span className="text-[10px] text-nexus-600">Active Subscription</span>
                </div>
            </label>
        </DemoContainer>

        <DemoContainer>
            <ComponentLabel id="CD-08" name="Progress Card" />
            <div className="p-4 bg-white border rounded-xl shadow-sm">
                <div className="flex justify-between items-end mb-2">
                    <span className="text-xs font-bold text-slate-700">Sprint Goal</span>
                    <span className="text-xs font-mono text-slate-500">85%</span>
                </div>
                <ProgressBar value={85} size="sm" colorClass="bg-indigo-500"/>
                <p className="text-[10px] text-slate-400 mt-2 text-right">3 days remaining</p>
            </div>
        </DemoContainer>

        {/* Interactive & Complex */}
        <DemoContainer>
            <ComponentLabel id="CD-09" name="Draggable Row" />
            <div className="flex items-center gap-3 p-2 bg-white border border-slate-200 rounded shadow-sm hover:border-nexus-300 group cursor-move">
                <div className="text-slate-300 group-hover:text-slate-500"><GripVertical size={16}/></div>
                <div className="flex-1">
                    <p className="text-xs font-bold text-slate-800">Phase 1: Mobilization</p>
                    <p className="text-[10px] text-slate-500">Jan 01 - Feb 15</p>
                </div>
                <Badge variant="success">Done</Badge>
            </div>
        </DemoContainer>

        <DemoContainer>
            <ComponentLabel id="CD-10" name="Action / Add Card" />
            <button className="w-full h-24 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center text-slate-400 hover:border-nexus-500 hover:text-nexus-600 hover:bg-nexus-50 transition-all gap-2 group">
                <div className="p-2 bg-slate-100 rounded-full group-hover:bg-white group-hover:shadow-sm transition-colors"><Plus size={18}/></div>
                <span className="text-xs font-bold uppercase tracking-wide">Add Widget</span>
            </button>
        </DemoContainer>

        <DemoContainer>
            <ComponentLabel id="CD-11" name="Contact Card" />
            <div className="p-4 bg-white border rounded-xl shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity"><ArrowRight size={16} className="text-slate-400"/></div>
                <div className="flex items-center gap-3 mb-3">
                    <UserAvatar name="David K" size="md" className="bg-slate-800 text-white"/>
                    <div>
                        <p className="text-sm font-bold text-slate-900">David Kim</p>
                        <p className="text-xs text-slate-500">Product Lead</p>
                    </div>
                </div>
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-[10px] text-slate-600 bg-slate-50 p-1.5 rounded"><Mail size={10}/> david.k@nexus.com</div>
                    <div className="flex items-center gap-2 text-[10px] text-slate-600 bg-slate-50 p-1.5 rounded"><Phone size={10}/> +1 (555) 012-3456</div>
                </div>
            </div>
        </DemoContainer>

        <DemoContainer>
            <ComponentLabel id="CD-12" name="Empty State Slot" />
            <div className="flex flex-col items-center justify-center p-6 text-center bg-slate-50/50 rounded-xl border border-slate-200 h-full">
                <Box size={24} className="text-slate-300 mb-2"/>
                <p className="text-xs font-medium text-slate-500">No items found</p>
            </div>
        </DemoContainer>

        <DemoContainer>
            <ComponentLabel id="CD-13" name="Project Summary" />
            <div className="bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="h-16 bg-gradient-to-r from-blue-600 to-indigo-700 p-4 flex justify-between items-start">
                    <span className="text-white/80 text-[10px] font-bold uppercase tracking-widest border border-white/20 px-2 py-0.5 rounded">Active</span>
                </div>
                <div className="p-4">
                    <h4 className="font-bold text-slate-900 mb-1">Project Alpha</h4>
                    <p className="text-xs text-slate-500 mb-3">Next Milestone: <span className="text-slate-800 font-medium">Design Review</span></p>
                    <div className="flex -space-x-2 mb-3">
                        <UserAvatar name="A" size="sm" className="w-6 h-6 text-[9px] border-2 border-white"/>
                        <UserAvatar name="B" size="sm" className="w-6 h-6 text-[9px] border-2 border-white"/>
                        <div className="w-6 h-6 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[9px] text-slate-500 font-bold">+3</div>
                    </div>
                    <ProgressBar value={60} size="sm" colorClass="bg-blue-600"/>
                </div>
            </div>
        </DemoContainer>

        <DemoContainer>
            <ComponentLabel id="CD-14" name="Timeline Event" />
            <div className="flex gap-4 p-3 bg-white">
                <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 z-10"><Calendar size={14}/></div>
                    <div className="w-0.5 bg-slate-100 h-full -mb-3"></div>
                </div>
                <div className="pb-4">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Oct 12, 10:00 AM</span>
                    <h5 className="text-sm font-bold text-slate-800">Sprint Planning</h5>
                    <p className="text-xs text-slate-500 mt-1">Team sync to define backlog priorities.</p>
                </div>
            </div>
        </DemoContainer>

        <DemoContainer>
            <ComponentLabel id="CD-15" name="Security Banner" />
            <div className="bg-slate-900 text-white p-4 rounded-xl shadow-lg relative overflow-hidden">
                <Shield size={64} className="absolute -right-4 -bottom-6 text-white/5 rotate-12"/>
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">System Secure</span>
                </div>
                <p className="text-sm font-medium">All compliance checks passed.</p>
                <div className="mt-3 pt-3 border-t border-white/10 flex justify-between text-[10px] text-slate-400">
                    <span>SOC2 Ready</span>
                    <span>Encrypted</span>
                </div>
            </div>
        </DemoContainer>
    </div>
);
