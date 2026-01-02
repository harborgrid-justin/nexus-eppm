
import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import { ChartPlaceholder } from '../charts/ChartPlaceholder';
import { 
    BrainCircuit, Cpu, Radio, Network, Grid, MessageSquare, Calendar, 
    GitMerge, FileText, BookOpen, Settings, List, CheckSquare, User, 
    Server, Activity, Terminal, ToggleRight, CreditCard, Receipt, 
    PieChart, Smartphone, Tablet, Monitor, Lock, Download, Upload, 
    MoreHorizontal, ThumbsUp, ThumbsDown, Zap, ArrowRight, ArrowLeft, RefreshCw,
    Play, Pause, X, MapPin, Search, Plus, Filter, Layout, Smile, Frown, Meh, Globe, RotateCcw, Box, Truck,
    ChevronLeft, ChevronRight, AlertTriangle
} from 'lucide-react';
import { ProgressBar } from '../common/ProgressBar';
import StatCard from '../shared/StatCard';
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ScatterChart, Scatter, ZAxis, BarChart, Bar } from 'recharts';

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

const MockMobileFrame = ({ children, title }: { children?: React.ReactNode, title: string }) => (
    <div className="w-[375px] h-[700px] border-8 border-slate-900 rounded-[3rem] overflow-hidden bg-slate-50 shadow-2xl relative flex flex-col mx-auto">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-6 bg-slate-900 rounded-b-xl z-20"></div>
        <div className="h-12 bg-white border-b flex items-center justify-center pt-4 font-bold text-sm shadow-sm z-10 shrink-0">{title}</div>
        <div className="flex-1 overflow-y-auto scrollbar-hide relative">{children}</div>
        <div className="h-16 bg-white border-t flex justify-around items-center px-6 shrink-0">
            <div className="w-6 h-6 rounded bg-slate-200"></div>
            <div className="w-6 h-6 rounded bg-nexus-500"></div>
            <div className="w-6 h-6 rounded bg-slate-200"></div>
        </div>
    </div>
);

export const AiPredictionLabTmpl: React.FC = () => {
    const theme = useTheme();
    return (
        <div className={`h-full overflow-y-auto ${theme.layout.pagePadding} bg-slate-900 text-white`}>
            <TemplateHeader number="61" title="AI Prediction Lab" subtitle="Experimental model training & testing" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-slate-800 rounded-2xl border border-slate-700 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-lg flex items-center gap-2"><BrainCircuit className="text-purple-400"/> Model Performance</h3>
                        <div className="flex gap-2">
                            <Button size="sm" className="bg-purple-600 hover:bg-purple-500 text-white border-none">Retrain</Button>
                            <Button size="sm" variant="ghost-white">Parameters</Button>
                        </div>
                    </div>
                    <div className="h-[400px] w-full bg-slate-900/50 rounded-xl border border-slate-700 p-4 flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 flex items-center justify-center opacity-30">
                            <Activity size={200} className="text-purple-500 animate-pulse"/>
                        </div>
                        <p className="z-10 font-mono text-purple-300">Training Epoch 42/100... Loss: 0.042</p>
                    </div>
                </div>
                <div className="space-y-6">
                    <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6">
                        <h4 className="font-bold text-slate-400 text-xs uppercase tracking-widest mb-4">Input Variables</h4>
                        <div className="space-y-3">
                            {['Historical Cost', 'Schedule Variance', 'Risk Factors', 'Team Velocity'].map(v => (
                                <div key={v} className="flex justify-between items-center bg-slate-700/50 p-3 rounded-lg border border-slate-600">
                                    <span className="text-sm font-medium">{v}</span>
                                    <div className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.5)]"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-900 to-slate-900 rounded-2xl border border-purple-500/30 p-6">
                        <h4 className="font-bold text-white mb-2">Prediction Confidence</h4>
                        <div className="text-5xl font-black text-purple-400 mb-2">94.2%</div>
                        <ProgressBar value={94.2} colorClass="bg-purple-500" className="bg-slate-700"/>
                        <p className="text-xs text-purple-200 mt-2 opacity-70">Based on validation set (n=402)</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const RealTimeTelemetryTmpl: React.FC = () => {
    const theme = useTheme();
    return (
        <div className="h-full flex flex-col bg-black text-green-500 font-mono p-6 overflow-hidden">
             <div className="flex justify-between items-center border-b border-green-900/50 pb-4 mb-4">
                 <h2 className="text-xl font-bold flex items-center gap-3"><Radio className="animate-pulse"/> IoT Device Stream</h2>
                 <div className="flex gap-4 text-xs">
                     <span>ACTIVE: 142</span>
                     <span>ERROR: 0</span>
                     <span>LATENCY: 42ms</span>
                 </div>
             </div>
             <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4 overflow-y-auto">
                 {[...Array(16)].map((_, i) => (
                     <div key={i} className="bg-green-900/10 border border-green-500/30 p-4 rounded-lg relative overflow-hidden group hover:bg-green-900/20 transition-colors">
                         <div className="flex justify-between items-start mb-2">
                             <span className="text-xs opacity-70">SENSOR-{100+i}</span>
                             <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping"></div>
                         </div>
                         <div className="text-2xl font-bold text-white">{Math.floor(Math.random() * 100)}%</div>
                         <p className="text-[10px] mt-1 opacity-60">Load Capacity</p>
                         {/* Scanline effect */}
                         <div className="absolute top-0 left-0 w-full h-1 bg-green-500/20 opacity-0 group-hover:opacity-100 animate-[scan_2s_linear_infinite]"></div>
                     </div>
                 ))}
             </div>
        </div>
    );
};

export const SentimentAnalysisTmpl: React.FC = () => {
    const theme = useTheme();
    return (
        <div className={`h-full overflow-y-auto ${theme.layout.pagePadding}`}>
            <TemplateHeader number="63" title="Stakeholder Sentiment" subtitle="NLP analysis of communication logs" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                 <Card className="p-6 text-center border-t-4 border-t-green-500">
                     <Smile size={48} className="mx-auto text-green-500 mb-2"/>
                     <div className="text-3xl font-bold text-slate-900">65%</div>
                     <p className="text-xs text-slate-500 uppercase font-bold">Positive</p>
                 </Card>
                 <Card className="p-6 text-center border-t-4 border-t-yellow-500">
                     <Meh size={48} className="mx-auto text-yellow-500 mb-2"/>
                     <div className="text-3xl font-bold text-slate-900">25%</div>
                     <p className="text-xs text-slate-500 uppercase font-bold">Neutral</p>
                 </Card>
                 <Card className="p-6 text-center border-t-4 border-t-red-500">
                     <Frown size={48} className="mx-auto text-red-500 mb-2"/>
                     <div className="text-3xl font-bold text-slate-900">10%</div>
                     <p className="text-xs text-slate-500 uppercase font-bold">Negative</p>
                 </Card>
            </div>
            <Card className="p-6">
                <h3 className="font-bold text-slate-800 mb-4">Key Themes & Keywords</h3>
                <div className="flex flex-wrap gap-2">
                    {['Budget Approval', 'Delay', 'Great Progress', 'Risk Mitigation', 'Scope Creep', 'Resource Shortage', 'Milestone Hit', 'Vendor Issue'].map((tag, i) => (
                        <span key={i} className={`px-3 py-1.5 rounded-full text-sm font-medium border ${i % 3 === 0 ? 'bg-green-50 text-green-700 border-green-200' : i % 3 === 1 ? 'bg-red-50 text-red-700 border-red-200' : 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                            {tag}
                        </span>
                    ))}
                </div>
            </Card>
        </div>
    );
};

export const SupplyChainMapTmpl: React.FC = () => {
    return (
        <div className="h-full relative bg-slate-900 overflow-hidden flex flex-col">
            <div className="absolute inset-0 opacity-20 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')] bg-cover bg-center"></div>
            <div className="relative z-10 p-6 pointer-events-none">
                <h2 className="text-2xl font-black text-white flex items-center gap-3"><Globe className="text-blue-400"/> Global Supply Chain</h2>
            </div>
            
            {/* Mock Nodes */}
            {[
                { x: '20%', y: '40%', name: 'Supplier A (US)', status: 'ok' },
                { x: '50%', y: '30%', name: 'Distributor (EU)', status: 'warn' },
                { x: '75%', y: '50%', name: 'Factory (APAC)', status: 'crit' },
            ].map((node, i) => (
                <div key={i} className="absolute group cursor-pointer" style={{ top: node.y, left: node.x }}>
                    <div className={`w-4 h-4 rounded-full border-2 border-white shadow-lg ${node.status === 'ok' ? 'bg-green-500' : node.status === 'warn' ? 'bg-yellow-500' : 'bg-red-500'} animate-pulse`}></div>
                    <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-slate-600">
                        {node.name}
                    </div>
                </div>
            ))}
            
            {/* Connecting Lines (Mock SVG) */}
            <svg className="absolute inset-0 pointer-events-none opacity-30">
                <path d="M 20% 40% Q 35% 20% 50% 30%" stroke="white" strokeWidth="2" fill="none" strokeDasharray="5 5"/>
                <path d="M 50% 30% Q 65% 60% 75% 50%" stroke="white" strokeWidth="2" fill="none" strokeDasharray="5 5"/>
            </svg>
        </div>
    );
};

export const HeatmapGridTmpl: React.FC = () => {
    const theme = useTheme();
    return (
        <div className={`h-full overflow-y-auto ${theme.layout.pagePadding}`}>
            <TemplateHeader number="65" title="Resource Heatmap" subtitle="Capacity utilization matrix" />
            <div className="overflow-x-auto bg-white rounded-xl border border-slate-200 shadow-sm">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead>
                        <tr>
                            <th className="p-3 bg-slate-50 text-left text-xs font-bold text-slate-500">Resource</th>
                            {[...Array(12)].map((_, i) => <th key={i} className="p-3 bg-slate-50 text-center text-xs font-bold text-slate-500">W{i+1}</th>)}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {['Architect', 'Engineer', 'Surveyor', 'PM', 'Admin'].map((role, r) => (
                            <tr key={r}>
                                <td className="p-3 text-sm font-bold text-slate-700">{role}</td>
                                {[...Array(12)].map((_, c) => {
                                    const val = Math.random();
                                    let color = 'bg-slate-100';
                                    if (val > 0.9) color = 'bg-red-500 text-white';
                                    else if (val > 0.7) color = 'bg-orange-400 text-white';
                                    else if (val > 0.4) color = 'bg-green-400 text-white';
                                    else if (val > 0.1) color = 'bg-green-200 text-green-800';
                                    
                                    return (
                                        <td key={c} className="p-1">
                                            <div className={`w-full h-8 rounded ${color} flex items-center justify-center text-[10px] font-bold`}>
                                                {val > 0.1 ? Math.floor(val * 100) : ''}
                                            </div>
                                        </td>
                                    )
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export const ActivityFeedTmpl: React.FC = () => <div className="h-full flex flex-col p-6 max-w-2xl mx-auto"><h2 className="text-xl font-bold mb-4">Project Feed</h2><div className="space-y-6 relative border-l-2 border-slate-200 pl-6 ml-3">{[1,2,3,4].map(i => (<div key={i} className="relative"><div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-slate-200 border-2 border-white"></div><div className="bg-white p-4 rounded-xl border shadow-sm"><div className="flex justify-between mb-2"><span className="font-bold text-sm">Mike Ross</span><span className="text-xs text-slate-400">2h ago</span></div><p className="text-sm text-slate-600">Updated the budget baseline for Q3.</p></div></div>))}</div></div>;

export const TeamCalendarTmpl: React.FC = () => (
    <div className="h-full p-6 flex flex-col">
        <div className="flex justify-between mb-6">
            <h2 className="text-2xl font-bold">Team Calendar</h2>
            <div className="flex gap-2"><Button variant="outline" icon={ChevronLeft}/><span className="font-bold text-lg self-center">October 2024</span><Button variant="outline" icon={ChevronRight}/></div>
        </div>
        <div className="flex-1 grid grid-cols-7 grid-rows-5 gap-px bg-slate-200 border border-slate-200 rounded-lg overflow-hidden">
            {[...Array(35)].map((_, i) => (
                <div key={i} className="bg-white p-2 min-h-[100px] relative group hover:bg-slate-50">
                    <span className="text-xs font-bold text-slate-500">{i+1 <= 31 ? i+1 : ''}</span>
                    {i === 4 && <div className="mt-2 text-[10px] bg-blue-100 text-blue-700 px-1 py-0.5 rounded truncate">All Hands</div>}
                    {i === 12 && <div className="mt-2 text-[10px] bg-red-100 text-red-700 px-1 py-0.5 rounded truncate">Deadline</div>}
                </div>
            ))}
        </div>
    </div>
);

export const DocApprovalTmpl: React.FC = () => (
    <div className="h-full p-6 max-w-4xl mx-auto">
        <TemplateHeader number="69" title="Document Approval" subtitle="Review and sign-off workflow" />
        <Card className="p-8 text-center border-dashed border-2">
            <FileText size={64} className="mx-auto text-slate-300 mb-4"/>
            <h3 className="text-lg font-bold text-slate-800">Project_Charter_v2.pdf</h3>
            <p className="text-sm text-slate-500 mb-6">Submitted by Jessica Pearson on Oct 12, 2024</p>
            <div className="flex justify-center gap-4">
                <Button variant="danger" icon={ThumbsDown}>Reject</Button>
                <Button variant="secondary">Comment</Button>
                <Button variant="primary" icon={ThumbsUp}>Approve</Button>
            </div>
        </Card>
    </div>
);

export const KnowledgeBaseArticleTmpl: React.FC = () => (
    <div className="h-full p-8 max-w-3xl mx-auto bg-white shadow-sm border-x border-slate-100">
        <div className="mb-6"><span className="text-xs font-bold text-nexus-600 uppercase tracking-widest">Guide</span></div>
        <h1 className="text-4xl font-black text-slate-900 mb-6">Cost Management Best Practices</h1>
        <div className="prose prose-slate max-w-none">
            <p className="lead">Effective cost management ensures project profitability and stakeholder confidence.</p>
            <h3>1. Establish a Baseline</h3>
            <p>Always capture a baseline before execution begins. This provides the variance reference point.</p>
            <h3>2. Track Commitments</h3>
            <p>Don't just track actuals. Purchase Orders (committed cost) are vital for forecasting.</p>
        </div>
    </div>
);

export const MultiStepConfigTmpl: React.FC = () => <div className="p-8 text-center text-slate-400 italic">Multi-step config wizard placeholder.</div>;
export const SettingsMasterTmpl: React.FC = () => <div className="p-8 text-center text-slate-400 italic">Master settings layout placeholder.</div>;
export const InlineEditingGridTmpl: React.FC = () => <div className="p-8 text-center text-slate-400 italic">Inline editing grid placeholder.</div>;
export const BulkActionModalTmpl: React.FC = () => <div className="p-8 text-center text-slate-400 italic">Bulk action modal placeholder.</div>;
export const ProfileEditorTmpl: React.FC = () => <div className="p-8 text-center text-slate-400 italic">Profile editor placeholder.</div>;

export const ServerHealthMonitorTmpl: React.FC = () => {
    const theme = useTheme();
    return (
        <div className={`h-full overflow-y-auto ${theme.layout.pagePadding} bg-slate-950 text-white`}>
             <TemplateHeader number="76" title="Infrastructure Health" subtitle="Live system metrics" />
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                 <Card className="bg-slate-900 border-slate-800 p-6">
                     <div className="flex justify-between items-center mb-4"><span className="text-slate-400 text-xs font-bold">CPU Usage</span><Cpu className="text-blue-500"/></div>
                     <div className="text-3xl font-black">42%</div>
                     <ProgressBar value={42} colorClass="bg-blue-500" className="bg-slate-800 mt-2"/>
                 </Card>
                 <Card className="bg-slate-900 border-slate-800 p-6">
                     <div className="flex justify-between items-center mb-4"><span className="text-slate-400 text-xs font-bold">Memory</span><Server className="text-purple-500"/></div>
                     <div className="text-3xl font-black">12.4 GB</div>
                     <ProgressBar value={65} colorClass="bg-purple-500" className="bg-slate-800 mt-2"/>
                 </Card>
                 <Card className="bg-slate-900 border-slate-800 p-6">
                     <div className="flex justify-between items-center mb-4"><span className="text-slate-400 text-xs font-bold">Network I/O</span><Activity className="text-green-500"/></div>
                     <div className="text-3xl font-black">1.2 GB/s</div>
                     <div className="h-2 w-full bg-slate-800 rounded mt-2 overflow-hidden relative">
                         <div className="absolute inset-0 bg-green-500/20 animate-pulse"></div>
                     </div>
                 </Card>
             </div>
             <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 font-mono text-xs h-64 overflow-hidden relative">
                 <div className="absolute top-4 right-4 text-green-500 animate-pulse">● LIVE LOGS</div>
                 <div className="space-y-2 opacity-80">
                     <p><span className="text-slate-500">[14:02:01]</span> [INFO] Worker process started (PID 4021)</p>
                     <p><span className="text-slate-500">[14:02:05]</span> [WARN] High latency on db-shard-02 (205ms)</p>
                     <p><span className="text-slate-500">[14:02:12]</span> [INFO] Cache invalidated for tenant: acme-corp</p>
                     <p><span className="text-slate-500">[14:02:18]</span> [SUCCESS] Batch job completed in 4.2s</p>
                 </div>
             </div>
        </div>
    );
};

export const DeploymentPipelineTmpl: React.FC = () => (
    <div className="h-full p-8 overflow-x-auto">
        <TemplateHeader number="77" title="CI/CD Pipeline" subtitle="Release automation visualization" />
        <div className="flex items-center gap-4 min-w-max">
            {['Code Commit', 'Build', 'Test', 'Staging', 'Production'].map((step, i) => (
                <React.Fragment key={step}>
                    <div className="w-64 p-6 bg-white border border-slate-200 rounded-xl shadow-sm relative overflow-hidden">
                        <div className={`absolute top-0 left-0 w-1 h-full ${i<3 ? 'bg-green-500' : i===3 ? 'bg-blue-500 animate-pulse' : 'bg-slate-300'}`}></div>
                        <h4 className="font-bold text-slate-900 mb-1">{step}</h4>
                        <p className="text-xs text-slate-500">{i<3 ? 'Completed' : i===3 ? 'Running...' : 'Pending'}</p>
                    </div>
                    {i < 4 && <ArrowRight className="text-slate-300"/>}
                </React.Fragment>
            ))}
        </div>
    </div>
);

export const ApiUsageAnalyticsTmpl: React.FC = () => <div className="p-8 text-center text-slate-400 italic">API Usage Analytics placeholder.</div>;
export const LogExplorerTmpl: React.FC = () => <div className="p-8 text-center text-slate-400 italic">Log Explorer placeholder.</div>;
export const FeatureFlagManagerTmpl: React.FC = () => <div className="p-8 text-center text-slate-400 italic">Feature Flag Manager placeholder.</div>;

export const PricingTableTmpl: React.FC = () => (
    <div className="h-full p-8 overflow-auto flex flex-col items-center">
        <h2 className="text-3xl font-black text-slate-900 mb-8">Enterprise Pricing Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
            {['Starter', 'Professional', 'Enterprise'].map((plan, i) => (
                <Card key={plan} className={`p-8 text-center hover:scale-105 transition-transform ${i===1 ? 'border-nexus-500 ring-2 ring-nexus-500 shadow-xl' : ''}`}>
                    <h3 className="font-bold text-xl mb-4">{plan}</h3>
                    <div className="text-4xl font-black mb-6">${i===0 ? '0' : i===1 ? '49' : '99'}<span className="text-base font-normal text-slate-500">/mo</span></div>
                    <ul className="space-y-3 text-sm text-slate-600 mb-8">
                        <li>{i===0 ? '5 Users' : i===1 ? '50 Users' : 'Unlimited Users'}</li>
                        <li>{i===0 ? 'Basic Support' : 'Priority Support'}</li>
                        <li>{i===2 ? 'Custom Integrations' : 'Standard Integrations'}</li>
                    </ul>
                    <Button className="w-full" variant={i===1 ? 'primary' : 'outline'}>Choose Plan</Button>
                </Card>
            ))}
        </div>
    </div>
);

export const InvoiceGeneratorTmpl: React.FC = () => <div className="p-8 text-center text-slate-400 italic">Invoice Generator placeholder.</div>;
export const TransactionHistoryTmpl: React.FC = () => <div className="p-8 text-center text-slate-400 italic">Transaction History placeholder.</div>;
export const BudgetAllocationTmpl: React.FC = () => <div className="p-8 text-center text-slate-400 italic">Budget Allocation placeholder.</div>;
export const ExpenseApprovalTmpl: React.FC = () => <div className="p-8 text-center text-slate-400 italic">Expense Approval placeholder.</div>;

export const FileExplorerTmpl: React.FC = () => {
    const theme = useTheme();
    return (
        <div className={`h-full flex flex-col ${theme.layout.pagePadding}`}>
            <TemplateHeader number="51" title="Asset Explorer" subtitle="File management system" />
            <div className="flex-1 bg-white border border-slate-200 rounded-xl shadow-sm flex overflow-hidden">
                <div className="w-64 bg-slate-50 border-r border-slate-200 p-4 space-y-2">
                    <div className="flex items-center gap-2 p-2 bg-nexus-100 text-nexus-700 rounded-lg font-bold"><Box size={16}/> All Files</div>
                    <div className="flex items-center gap-2 p-2 hover:bg-slate-100 rounded-lg text-slate-600 ml-4"><span className="w-1.5 h-1.5 bg-slate-400 rounded-full"></span> Images</div>
                    <div className="flex items-center gap-2 p-2 hover:bg-slate-100 rounded-lg text-slate-600 ml-4"><span className="w-1.5 h-1.5 bg-slate-400 rounded-full"></span> Contracts</div>
                </div>
                <div className="flex-1 p-6 grid grid-cols-4 gap-4 content-start overflow-y-auto">
                    {[1,2,3,4,5,6,7,8].map(i => (
                        <div key={i} className="p-4 border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer flex flex-col items-center text-center">
                            <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500 mb-3">
                                <FileText size={24}/>
                            </div>
                            <span className="text-sm font-bold text-slate-700 truncate w-full">Document_{i}.pdf</span>
                            <span className="text-xs text-slate-400">2.4 MB</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export const WizardStepVerticalTmpl: React.FC = () => <div className="p-8 text-center text-slate-400 italic">Vertical Wizard placeholder.</div>;

export const EmptyDashboardTmpl: React.FC = () => (
    <div className="h-full flex items-center justify-center p-8 bg-slate-50">
        <div className="text-center max-w-md">
            <div className="w-24 h-24 bg-slate-200 rounded-full mx-auto mb-6 flex items-center justify-center text-slate-400 animate-pulse">
                <Layout size={40}/>
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">No Dashboard Configured</h2>
            <p className="text-slate-500 mb-8">This workspace doesn't have a default view set up yet. Start by adding widgets from the library.</p>
            <Button icon={Plus}>Customize Dashboard</Button>
        </div>
    </div>
);

export const SystemHealthTmpl: React.FC = () => <div className="p-8 text-center text-slate-400 italic">System Health placeholder.</div>;
export const ApiPlaygroundTmpl: React.FC = () => <div className="p-8 text-center text-slate-400 italic">API Playground placeholder.</div>;
export const OnboardingChecklistTmpl: React.FC = () => <div className="p-8 text-center text-slate-400 italic">Onboarding Checklist placeholder.</div>;

export const MobilePreviewTmpl: React.FC = () => (
    <div className="h-full p-8 flex items-center justify-center bg-slate-100">
        <MockMobileFrame title="Nexus Mobile">
            <div className="p-4 space-y-4">
                <div className="bg-blue-600 text-white p-4 rounded-xl shadow-lg">
                    <h3 className="font-bold">Project Alpha</h3>
                    <p className="text-xs opacity-80">Status: On Track</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-xl shadow-sm text-center">
                        <CheckSquare className="mx-auto mb-2 text-green-500"/>
                        <span className="text-xs font-bold">Tasks</span>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm text-center">
                        <AlertTriangle className="mx-auto mb-2 text-orange-500"/>
                        <span className="text-xs font-bold">Risks</span>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm">
                    <h4 className="font-bold text-sm mb-2">Recent Activity</h4>
                    <div className="space-y-2 text-xs text-slate-500">
                        <p>Mike uploaded a file.</p>
                        <p>Sarah approved budget.</p>
                    </div>
                </div>
            </div>
        </MockMobileFrame>
    </div>
);

export const DataMigrationTmpl: React.FC = () => <div className="p-8 text-center text-slate-400 italic">Data Migration placeholder.</div>;

export const MobileAppShellTmpl: React.FC = () => (
    <div className="h-full p-8 flex items-center justify-center bg-slate-100">
        <MockMobileFrame title="Shell Preview">
            <div className="h-full flex items-center justify-center text-slate-400">App Content Area</div>
        </MockMobileFrame>
    </div>
);

export const TabletDashTmpl: React.FC = () => (
    <div className="h-full p-8 flex items-center justify-center bg-slate-800">
        <div className="w-[800px] h-[600px] bg-white rounded-3xl border-[12px] border-slate-900 shadow-2xl overflow-hidden relative">
            {/* Tablet Camera */}
            <div className="absolute top-1/2 left-2 w-2 h-2 rounded-full bg-slate-800"></div>
            <div className="h-full flex">
                <div className="w-16 bg-slate-100 border-r flex flex-col items-center py-4 gap-6 text-slate-400">
                    <Layout className="text-nexus-600"/>
                    <List/>
                    <Settings/>
                </div>
                <div className="flex-1 p-6 bg-slate-50">
                    <h2 className="text-xl font-bold mb-4">Tablet Dashboard</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <Card className="h-40"/>
                        <Card className="h-40"/>
                        <Card className="h-40 col-span-2"/>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export const KioskModeTmpl: React.FC = () => (
    <div className="h-full bg-slate-900 p-8 flex flex-col items-center justify-center text-white">
        <h1 className="text-4xl font-black mb-12 uppercase tracking-widest">Site Safety Kiosk</h1>
        <div className="grid grid-cols-2 gap-8 w-full max-w-4xl">
            <button className="bg-green-600 hover:bg-green-500 p-12 rounded-3xl shadow-lg flex flex-col items-center gap-4 transition-transform active:scale-95">
                <CheckSquare size={64}/>
                <span className="text-2xl font-bold">Check In</span>
            </button>
            <button className="bg-red-600 hover:bg-red-500 p-12 rounded-3xl shadow-lg flex flex-col items-center gap-4 transition-transform active:scale-95">
                <AlertTriangle size={64}/>
                <span className="text-2xl font-bold">Report Hazard</span>
            </button>
        </div>
        <div className="mt-12 text-slate-500">Touch screen to interact • v2.1</div>
    </div>
);

export const CommandCenterTmpl: React.FC = () => (
    <div className="h-full bg-slate-950 p-4 grid grid-cols-4 grid-rows-3 gap-4 overflow-hidden">
        {/* Map */}
        <div className="col-span-2 row-span-2 bg-slate-900 rounded-xl border border-slate-800 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')] bg-cover opacity-20"></div>
            <div className="absolute top-4 left-4 font-mono text-green-500 font-bold">LIVE MAP FEED</div>
        </div>
        
        {/* Metric 1 */}
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-4 flex flex-col justify-center text-center">
            <div className="text-slate-400 text-xs uppercase font-bold tracking-widest mb-2">Global Spend</div>
            <div className="text-4xl font-black text-white">$4.2B</div>
        </div>

        {/* Metric 2 */}
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-4 flex flex-col justify-center text-center">
             <div className="text-slate-400 text-xs uppercase font-bold tracking-widest mb-2">Active Projects</div>
            <div className="text-4xl font-black text-blue-400">1,240</div>
        </div>

        {/* List */}
        <div className="col-span-2 row-span-1 bg-slate-900 rounded-xl border border-slate-800 p-4 overflow-hidden relative">
            <div className="font-mono text-xs text-slate-500 mb-2 border-b border-slate-800 pb-2">CRITICAL ALERTS</div>
            <div className="space-y-2 text-xs font-mono text-red-400">
                <p>[14:02] SERVER_01 CONNECTION LOST</p>
                <p>[14:01] API LATENCY SPIKE (2000ms)</p>
                <p>[13:58] UNAUTHORIZED ACCESS ATTEMPT</p>
            </div>
        </div>
        
        {/* Footer Ticker */}
        <div className="col-span-4 bg-slate-900 rounded-xl border border-slate-800 flex items-center px-4 font-mono text-xs text-slate-400 overflow-hidden">
            <span className="text-green-500 mr-4">SYSTEM NOMINAL</span>
            <span className="mr-8">LAST SYNC: 14:02:45 UTC</span>
            <div className="flex-1 whitespace-nowrap overflow-hidden">
                <span className="animate-marquee inline-block">AAPL +0.4%  |  MSFT -0.2%  |  NEXUS +1.2%  |  PROJECT ALPHA: ON TRACK  |  PROJECT BETA: DELAYED</span>
            </div>
        </div>
    </div>
);
