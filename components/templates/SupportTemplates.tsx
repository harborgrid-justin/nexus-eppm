
import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useData } from '../../context/DataContext';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import { 
    Users, Mail, Phone, MapPin, Search, FileText, Send, Clock, Bell, Calendar, Plus, 
    GitPullRequest, ArrowRight, UserCheck, Activity, CheckCircle, Database, Shield, 
    Lock, AlertTriangle, Filter, Save, Trash2, Edit2, List, Book, Download, ThumbsUp, ThumbsDown
} from 'lucide-react';

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

export const TeamDirectoryTmpl: React.FC = () => {
    const theme = useTheme();
    const { state } = useData();
    const [search, setSearch] = useState('');

    const filteredUsers = state.users.filter(u => 
        u.name.toLowerCase().includes(search.toLowerCase()) || 
        u.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className={`h-full overflow-y-auto ${theme.layout.pagePadding}`}>
            <div className="flex justify-between items-center mb-6">
                <TemplateHeader number="41" title="Team Directory" subtitle="Project stakeholders and resources" />
                <div className="relative w-64">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                    <Input placeholder="Search people..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)}/>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredUsers.map(user => (
                    <Card key={user.id} className="p-6 text-center hover:shadow-md transition-shadow">
                        <div className="w-20 h-20 bg-slate-200 rounded-full mx-auto mb-4 overflow-hidden border-2 border-white shadow-sm">
                            <img src={user.avatar} alt={user.name} />
                        </div>
                        <h3 className="font-bold text-slate-900">{user.name}</h3>
                        <p className="text-xs text-nexus-600 font-bold uppercase tracking-wider mb-4">{user.role}</p>
                        <div className="text-sm text-slate-500 space-y-2 text-left bg-slate-50 p-3 rounded-lg border border-slate-100">
                            <div className="flex items-center gap-2 truncate" title={user.email}><Mail size={14} className="shrink-0"/> {user.email}</div>
                            <div className="flex items-center gap-2"><Phone size={14} className="shrink-0"/> +1 (555) 010-XXXX</div>
                            <div className="flex items-center gap-2"><MapPin size={14} className="shrink-0"/> {user.department || 'HQ'}</div>
                        </div>
                        <Button className="w-full mt-4" variant="secondary" size="sm">View Profile</Button>
                    </Card>
                ))}
                {filteredUsers.length === 0 && (
                    <div className="col-span-full py-12 text-center text-slate-400">No users found.</div>
                )}
            </div>
        </div>
    );
};

export const ProjectWikiTmpl: React.FC = () => {
    const theme = useTheme();
    return (
        <div className={`h-full flex ${theme.colors.background}`}>
            <div className="w-64 border-r border-slate-200 bg-white p-4 flex flex-col">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Book size={16}/> Documentation</h3>
                <div className="space-y-1 flex-1">
                    <div className="px-3 py-2 bg-nexus-50 text-nexus-700 font-bold rounded-lg cursor-pointer">Project Overview</div>
                    <div className="px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-lg cursor-pointer">Technical Specs</div>
                    <div className="px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-lg cursor-pointer">Onboarding Guide</div>
                    <div className="px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-lg cursor-pointer">Meeting Notes</div>
                </div>
            </div>
            <div className={`flex-1 overflow-y-auto ${theme.layout.pagePadding}`}>
                <div className="max-w-4xl mx-auto">
                    <div className="mb-8 border-b border-slate-200 pb-4">
                        <h1 className="text-3xl font-black text-slate-900 mb-2">Project Overview</h1>
                        <p className="text-slate-500">Last updated 2 days ago by Sarah Chen</p>
                    </div>
                    <div className="prose prose-slate max-w-none">
                        <h3>Introduction</h3>
                        <p>This project aims to modernize the legacy infrastructure...</p>
                        <h3>Scope</h3>
                        <ul>
                            <li>Phase 1: Discovery</li>
                            <li>Phase 2: Implementation</li>
                        </ul>
                        <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500 my-4">
                            <strong>Note:</strong> All technical architectural decisions must be approved by the Architecture Review Board.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const DiscussionThreadTmpl: React.FC = () => {
    const theme = useTheme();
    return (
        <div className={`h-full flex flex-col ${theme.layout.pagePadding} max-w-3xl mx-auto`}>
            <TemplateHeader number="43" title="Design Review Thread" subtitle="#project-alpha-design" />
            <div className="flex-1 overflow-y-auto space-y-6 mb-6">
                {[1, 2, 3].map(i => (
                    <div key={i} className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-slate-200 flex-shrink-0 overflow-hidden"><img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} alt="User" /></div>
                        <div className="flex-1">
                            <div className="flex items-baseline gap-2 mb-1">
                                <span className="font-bold text-slate-900">Team Member {i}</span>
                                <span className="text-xs text-slate-400">2h ago</span>
                            </div>
                            <div className="bg-white p-4 rounded-xl rounded-tl-none border border-slate-200 shadow-sm text-sm text-slate-700 leading-relaxed">
                                Looking at the latest specs, I think we need to adjust the load bearing calculations for Zone B. The soil report came back with higher clay content.
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex gap-4 items-end">
                <textarea className="flex-1 p-3 bg-slate-50 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-nexus-500 outline-none resize-none h-24" placeholder="Write a comment..." />
                <Button icon={Send}>Post</Button>
            </div>
        </div>
    );
};

export const NotificationCenterTmpl: React.FC = () => {
    const theme = useTheme();
    return (
        <div className={`h-full overflow-y-auto ${theme.layout.pagePadding}`}>
            <TemplateHeader number="44" title="Alert Center" subtitle="System notifications and triggers" />
            <Card className="divide-y divide-slate-100">
                {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="p-4 flex items-start gap-4 hover:bg-slate-50 transition-colors cursor-pointer">
                        <div className={`p-2 rounded-lg ${i % 2 === 0 ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                            {i % 2 === 0 ? <AlertTriangle size={20} /> : <Bell size={20} />}
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between mb-1">
                                <h4 className="font-bold text-slate-800 text-sm">{i % 2 === 0 ? 'Budget Threshold Breach' : 'New Assignment'}</h4>
                                <span className="text-xs text-slate-400">10m ago</span>
                            </div>
                            <p className="text-sm text-slate-600">Project P-102 has exceeded 80% of contingency reserve.</p>
                        </div>
                        <div className="w-2 h-2 bg-nexus-500 rounded-full mt-2"></div>
                    </div>
                ))}
            </Card>
        </div>
    );
};

export const MeetingMinutesTmpl: React.FC = () => {
    const theme = useTheme();
    return (
        <div className={`h-full overflow-y-auto ${theme.layout.pagePadding}`}>
            <div className="max-w-4xl mx-auto">
                <TemplateHeader number="45" title="Meeting Minutes" subtitle="Capture decisions and actions" />
                <Card className="p-8 space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <Input label="Meeting Title" defaultValue="Weekly Steering Committee" />
                        <Input label="Date" type="date" />
                        <div className="col-span-2">
                             <label className={theme.typography.label + " block mb-2"}>Attendees</label>
                             <div className="flex gap-2 flex-wrap">
                                 {['Justin S.', 'Mike R.', 'Jessica P.'].map(u => (
                                     <span key={u} className="bg-slate-100 px-3 py-1 rounded-full text-sm font-bold text-slate-600 border border-slate-200">{u}</span>
                                 ))}
                                 <button className="text-nexus-600 text-sm font-bold flex items-center gap-1 hover:bg-nexus-50 px-3 py-1 rounded-full"><Plus size={14}/> Add</button>
                             </div>
                        </div>
                    </div>
                    
                    <div>
                        <label className={theme.typography.label + " block mb-2"}>Key Decisions</label>
                        <textarea className="w-full p-4 border border-slate-200 rounded-lg bg-slate-50 text-sm h-32 focus:bg-white transition-colors outline-none focus:ring-2 focus:ring-nexus-500" placeholder="Record decisions..." />
                    </div>

                    <div>
                        <label className={theme.typography.label + " block mb-2"}>Action Items</label>
                        <div className="space-y-2">
                            {[1, 2].map(i => (
                                <div key={i} className="flex gap-2 items-center">
                                    <input type="checkbox" className="w-5 h-5 rounded border-slate-300 text-nexus-600 focus:ring-nexus-500" />
                                    <Input className="flex-1" defaultValue={`Action item ${i}`} />
                                    <select className="p-2 border border-slate-200 rounded-lg text-sm bg-white"><option>Mike Ross</option></select>
                                    <Input type="date" className="w-40" />
                                </div>
                            ))}
                            <Button variant="ghost" size="sm" icon={Plus}>Add Item</Button>
                        </div>
                    </div>
                    
                    <div className="pt-6 border-t border-slate-200 flex justify-end gap-3">
                        <Button variant="secondary">Save Draft</Button>
                        <Button icon={Send}>Distribute Minutes</Button>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export const WorkflowDesignerTmpl: React.FC = () => {
    const theme = useTheme();
    return (
        <div className="h-full flex flex-col bg-slate-50">
            <div className="p-4 bg-white border-b border-slate-200 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <GitPullRequest className="text-nexus-600" />
                    <h2 className="font-bold text-slate-900">Change Order Approval Workflow</h2>
                </div>
                <div className="flex gap-2">
                    <Button variant="secondary" size="sm">Test Run</Button>
                    <Button size="sm">Publish</Button>
                </div>
            </div>
            <div className="flex-1 relative overflow-auto p-10 flex items-center justify-center">
                {/* Visual Workflow Canvas Mockup */}
                <div className="flex items-center gap-8">
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 rounded-full bg-green-100 border-2 border-green-500 flex items-center justify-center font-bold text-green-700">S</div>
                        <span className="text-xs font-bold text-slate-500 uppercase">Start</span>
                    </div>
                    <ArrowRight className="text-slate-300" size={32}/>
                    <div className="w-64 p-4 bg-white rounded-xl border-2 border-blue-500 shadow-md">
                        <div className="flex justify-between mb-2"><Badge variant="info">Review</Badge> <UserCheck size={16} className="text-blue-500"/></div>
                        <h4 className="font-bold text-slate-900">PM Review</h4>
                        <p className="text-xs text-slate-500 mt-1">Assignee: Project Manager</p>
                    </div>
                    <ArrowRight className="text-slate-300" size={32}/>
                    <div className="w-64 p-4 bg-white rounded-xl border-2 border-slate-200 shadow-sm opacity-60">
                        <div className="flex justify-between mb-2"><Badge variant="warning">Approval</Badge> <UserCheck size={16} className="text-slate-400"/></div>
                        <h4 className="font-bold text-slate-900">Finance Approval</h4>
                        <p className="text-xs text-slate-500 mt-1">Assignee: Controller</p>
                    </div>
                     <ArrowRight className="text-slate-300" size={32}/>
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 rounded-full bg-slate-200 border-2 border-slate-400 flex items-center justify-center font-bold text-slate-500">E</div>
                        <span className="text-xs font-bold text-slate-500 uppercase">End</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const IntegrationStatusTmpl: React.FC = () => {
    const theme = useTheme();
    const { state } = useData();
    
    return (
        <div className={`h-full overflow-y-auto ${theme.layout.pagePadding}`}>
            <TemplateHeader number="47" title="Integration Health" subtitle="Connector status and sync logs" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {state.integrations.map((conn, i) => (
                    <Card key={i} className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg bg-slate-100 text-slate-600`}><Database size={20}/></div>
                                <div>
                                    <h4 className="font-bold text-slate-900">{conn.name}</h4>
                                    <p className="text-xs text-slate-500 uppercase tracking-wider">{conn.type}</p>
                                </div>
                            </div>
                            <div className={`w-3 h-3 rounded-full ${conn.status === 'Connected' ? 'bg-green-500' : 'bg-red-500'} shadow-sm ring-2 ring-white`}></div>
                        </div>
                        <div className="flex justify-between items-center text-sm pt-4 border-t border-slate-100">
                            <span className="text-slate-500">Last Sync</span>
                            <span className="font-mono font-bold text-slate-700">{conn.lastSync}</span>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export const AuditLogViewerTmpl: React.FC = () => {
    const theme = useTheme();
    return (
        <div className="h-full flex flex-col">
            <div className={`p-6 border-b ${theme.colors.border}`}>
                <TemplateHeader number="48" title="System Audit Log" subtitle="Security and data change events" />
                <div className="flex gap-2">
                    <Input isSearch placeholder="Filter logs..." className="max-w-md" />
                    <Button variant="outline" icon={Filter}>Filter</Button>
                    <Button variant="outline" icon={Download}>Export CSV</Button>
                </div>
            </div>
            <div className="flex-1 overflow-auto">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50 sticky top-0">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Timestamp</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">User</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Action</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Entity</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Details</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-100">
                        {[...Array(20)].map((_, i) => (
                            <tr key={i} className="hover:bg-slate-50 font-mono text-xs">
                                <td className="px-6 py-3 text-slate-500">2024-06-20 14:23:{10+i}</td>
                                <td className="px-6 py-3 font-bold text-slate-700">admin@nexus.com</td>
                                <td className="px-6 py-3"><Badge variant="info">UPDATE</Badge></td>
                                <td className="px-6 py-3 text-slate-600">Project P-100{i}</td>
                                <td className="px-6 py-3 text-slate-500">Changed budget from $1M to $1.2M</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export const UserProvisioningTmpl: React.FC = () => {
    const theme = useTheme();
    return (
        <div className={`h-full overflow-y-auto ${theme.layout.pagePadding} max-w-2xl mx-auto`}>
            <TemplateHeader number="49" title="User Provisioning" subtitle="Create or edit system access" />
            <Card className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                    <Input label="First Name" placeholder="Jane" />
                    <Input label="Last Name" placeholder="Doe" />
                </div>
                <Input label="Email Address" type="email" placeholder="jane.doe@company.com" />
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Role</label>
                        <select className="w-full p-2.5 border border-slate-300 rounded-lg text-sm bg-white"><option>Project Manager</option><option>Administrator</option></select>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Department</label>
                        <select className="w-full p-2.5 border border-slate-300 rounded-lg text-sm bg-white"><option>Engineering</option><option>Finance</option></select>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Access Groups</label>
                    <div className="space-y-2 border border-slate-200 p-4 rounded-lg bg-slate-50">
                        {['North America Region', 'Capital Projects', 'Sensitive Financials'].map(g => (
                            <label key={g} className="flex items-center gap-2 text-sm text-slate-700">
                                <input type="checkbox" className="rounded text-nexus-600 focus:ring-nexus-500" /> {g}
                            </label>
                        ))}
                    </div>
                </div>
                <div className="flex justify-end gap-3 pt-4">
                    <Button variant="ghost">Cancel</Button>
                    <Button icon={UserCheck}>Provision Account</Button>
                </div>
            </Card>
        </div>
    );
};

export const CustomFieldBuilderTmpl: React.FC = () => {
    const theme = useTheme();
    return (
        <div className="h-full flex flex-col bg-slate-50">
             <div className={`p-6 border-b border-slate-200 bg-white`}>
                <TemplateHeader number="50" title="Custom Field Builder" subtitle="Extend data model entities" />
             </div>
             <div className="flex-1 flex overflow-hidden p-6 gap-6">
                 <div className="w-64 space-y-4">
                     <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Field Types</h4>
                     <div className="space-y-2">
                         {['Text', 'Number', 'Date', 'Dropdown', 'Boolean', 'User Lookup'].map(t => (
                             <div key={t} className="p-3 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 shadow-sm cursor-grab active:cursor-grabbing hover:border-nexus-300 hover:text-nexus-600 transition-colors">
                                 {t}
                             </div>
                         ))}
                     </div>
                 </div>
                 <div className="flex-1 bg-slate-100 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center p-8">
                     <p className="text-slate-400 font-medium mb-4">Drag field types here to build the form layout</p>
                     <div className="w-full max-w-lg space-y-4">
                         <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex items-center justify-between group">
                             <div>
                                 <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Field Label</label>
                                 <div className="h-8 bg-slate-100 rounded w-64"></div>
                             </div>
                             <div className="opacity-0 group-hover:opacity-100 flex gap-2">
                                 <button className="p-1 text-slate-400 hover:text-nexus-600"><Edit2 size={16}/></button>
                                 <button className="p-1 text-slate-400 hover:text-red-600"><Trash2 size={16}/></button>
                             </div>
                         </div>
                     </div>
                 </div>
                 <div className="w-72 bg-white border-l border-slate-200 p-4 shadow-lg flex flex-col">
                     <h4 className="font-bold text-slate-800 mb-4">Properties</h4>
                     <div className="space-y-4">
                         <Input label="Label" defaultValue="Cost Center"/>
                         <Input label="API Key" defaultValue="custom_cost_center"/>
                         <label className="flex items-center gap-2 text-sm"><input type="checkbox"/> Required</label>
                         <label className="flex items-center gap-2 text-sm"><input type="checkbox"/> Searchable</label>
                     </div>
                     <div className="mt-auto">
                         <Button className="w-full" icon={Save}>Save Layout</Button>
                     </div>
                 </div>
             </div>
        </div>
    );
};
