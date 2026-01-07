
import React, { useState, useMemo } from 'react';
import { 
    CreditCard, Bell, Lock, Globe, User, Save, CheckCircle, AlertTriangle, 
    X, Download, Trash2, Edit2, Smartphone, Tablet, Wifi, Battery, Signal, 
    FileText, Check, ChevronRight, Play, Database, Server, Code, UploadCloud,
    LayoutTemplate, Settings, RefreshCw, Shield, Map, Monitor, Search, Plus, ArrowRight
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import { ProgressBar } from '../common/ProgressBar';

// Import existing real components for wrapping
import { AiPredictionLab } from '../analytics/AiPredictionLab';
import { IoTStream } from '../iot/IoTStream'; 
import { ActivityFeed } from '../collaboration/ActivityFeed';
import { TeamCalendar } from '../collaboration/TeamCalendar';
import { KnowledgeBaseArticle } from '../knowledge/KnowledgeBaseArticle';
import { DeploymentPipeline } from '../devops/DeploymentPipeline';
import { ServerHealthMonitor } from '../devops/ServerHealthMonitor';

import { 
    InvoiceProcessingTmpl as InvoiceProcessing, 
    CashFlowModelingTmpl as CashFlowModeling,
    PricingTableTmpl as PricingTable,
    InvoiceGeneratorTmpl as InvoiceGenerator,
    TransactionHistoryTmpl as TransactionHistory,
    BudgetAllocationTmpl as BudgetAllocation,
    ExpenseApprovalTmpl as ExpenseApproval
} from './FinancialTemplates';

import {
    DailyLogEntryTmpl as DailyLogEntry,
    InventoryGridTmpl as InventoryGrid,
    EquipmentTrackerTmpl as EquipmentTracker,
    SystemHealthTmpl as SystemHealth
} from './OperationalTemplates';

import {
    SentimentAnalysisTmpl as SentimentAnalysis,
    SupplyChainMapTmpl as SupplyChainMap,
    HeatmapGridTmpl as HeatmapGrid,
    FeatureFlagManagerTmpl as FeatureFlagManager,
    ApiUsageAnalyticsTmpl as ApiUsageAnalytics,
    LogExplorerTmpl as LogExplorer,
    MultiStepConfigTmpl as MultiStepConfig,
    InlineEditingGridTmpl as InlineEditingGrid
} from './TechTemplates';

import {
    FileExplorerTmpl as FileExplorer,
    MobilePreviewTmpl as MobilePreview,
    KioskModeTmpl as KioskMode,
    CommandCenterTmpl as CommandCenter
} from './UXTemplates';

// --- WRAPPERS ---
export const AiPredictionLabTmpl: React.FC = () => <AiPredictionLab />;
export const RealTimeTelemetryTmpl: React.FC = () => <IoTStream />;
export const ActivityFeedTmpl: React.FC = () => <ActivityFeed />;
export const TeamCalendarTmpl: React.FC = () => <TeamCalendar />;
export const KnowledgeBaseArticleTmpl: React.FC = () => <KnowledgeBaseArticle />;
export const DeploymentPipelineTmpl: React.FC = () => <DeploymentPipeline />;
export const ServerHealthMonitorTmpl: React.FC = () => <ServerHealthMonitor />;

// --- RE-EXPORTS ---
export const InvoiceProcessingTmpl = InvoiceProcessing;
export const CashFlowModelingTmpl = CashFlowModeling;
export const PricingTableTmpl = PricingTable;
export const InvoiceGeneratorTmpl = InvoiceGenerator;
export const TransactionHistoryTmpl = TransactionHistory;
export const BudgetAllocationTmpl = BudgetAllocation;
export const ExpenseApprovalTmpl = ExpenseApproval;

export const DailyLogEntryTmpl = DailyLogEntry;
export const InventoryGridTmpl = InventoryGrid;
export const EquipmentTrackerTmpl = EquipmentTracker;
export const SystemHealthTmpl = SystemHealth;

export const SentimentAnalysisTmpl = SentimentAnalysis;
export const SupplyChainMapTmpl = SupplyChainMap;
export const HeatmapGridTmpl = HeatmapGrid;
export const FeatureFlagManagerTmpl = FeatureFlagManager;
export const ApiUsageAnalyticsTmpl = ApiUsageAnalytics;
export const LogExplorerTmpl = LogExplorer;
export const MultiStepConfigTmpl = MultiStepConfig;
export const InlineEditingGridTmpl = InlineEditingGrid;

export const FileExplorerTmpl = FileExplorer;
export const MobilePreviewTmpl = MobilePreview;
export const KioskModeTmpl = KioskMode;
export const CommandCenterTmpl = CommandCenter;

// --- NEW IMPLEMENTATIONS ---

export const SettingsMasterTmpl: React.FC = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('profile');
    
    return (
        <div className="flex h-full bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="w-64 bg-slate-50 border-r border-slate-200 p-4">
                <div className="font-bold text-xs text-slate-400 uppercase tracking-wider mb-4 px-2">Settings</div>
                <div className="space-y-1">
                    {[
                        { id: 'profile', icon: User, label: 'Public Profile' },
                        { id: 'account', icon: Lock, label: 'Account Security' },
                        { id: 'notif', icon: Bell, label: 'Notifications' },
                        { id: 'billing', icon: CreditCard, label: 'Billing & Plans' },
                        { id: 'integrations', icon: Globe, label: 'Integrations' }
                    ].map(item => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === item.id ? 'bg-white shadow-sm text-nexus-600' : 'text-slate-600 hover:bg-slate-100'}`}
                        >
                            <item.icon size={16}/> {item.label}
                        </button>
                    ))}
                </div>
            </div>
            <div className="flex-1 p-8 overflow-y-auto">
                <div className="max-w-2xl">
                    <h3 className="text-xl font-bold text-slate-900 mb-1">Public Profile</h3>
                    <p className="text-sm text-slate-500 mb-8">Manage how your information appears to other team members.</p>
                    <div className="space-y-6">
                        <div className="flex items-center gap-6">
                            <div className="w-20 h-20 rounded-full bg-slate-200 border-2 border-white shadow-md flex items-center justify-center text-slate-400 overflow-hidden">
                                {user?.avatar ? <img src={user.avatar} alt="Profile" className="w-full h-full object-cover"/> : <User size={40}/>}
                            </div>
                            <div className="space-y-2">
                                <Button size="sm" variant="secondary">Upload New</Button>
                                <p className="text-xs text-slate-500">JPG or PNG. Max 2MB.</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <Input label="Full Name" defaultValue={user?.name || ''} />
                            <Input label="Email" defaultValue={user?.email || ''} disabled />
                        </div>
                        <Input label="Role / Department" defaultValue={`${user?.role || ''} - ${user?.department || ''}`} />
                        <div className="pt-6 border-t border-slate-100 flex justify-end gap-3">
                            <Button variant="ghost">Cancel</Button>
                            <Button>Save Changes</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const BulkActionModalTmpl: React.FC = () => {
    return (
        <div className="p-8 flex items-center justify-center bg-slate-100 h-full">
            <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-[500px] overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                    <h3 className="text-lg font-bold text-slate-900">Bulk Update: 24 Items</h3>
                    <p className="text-sm text-slate-500">Apply changes to selected project records.</p>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase">Change Status To</label>
                        <select className="w-full mt-1 p-2 border border-slate-300 rounded-lg text-sm bg-white"><option>Active</option><option>Archived</option></select>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase">Assign Owner</label>
                        <select className="w-full mt-1 p-2 border border-slate-300 rounded-lg text-sm bg-white"><option>Unassigned</option><option>Mike Ross</option></select>
                    </div>
                    <div className="p-3 bg-amber-50 text-amber-800 text-xs rounded-lg border border-amber-100 flex gap-2">
                        <AlertTriangle size={16} className="shrink-0"/>
                        This action will trigger 24 email notifications.
                    </div>
                </div>
                <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
                    <Button variant="secondary">Cancel</Button>
                    <Button>Update Records</Button>
                </div>
            </div>
        </div>
    );
};

export const ProfileEditorTmpl: React.FC = () => <SettingsMasterTmpl />; // Alias for demo

export const MaintenanceOverlayTmpl: React.FC = () => (
    <div className="h-full bg-slate-900 flex flex-col items-center justify-center text-center p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagonal-stripes.png')] opacity-10"></div>
        <div className="w-24 h-24 bg-nexus-600 rounded-3xl flex items-center justify-center mb-8 shadow-2xl shadow-nexus-500/20 z-10 animate-pulse">
            <RefreshCw size={48} className="text-white animate-spin"/>
        </div>
        <h1 className="text-4xl font-black text-white mb-4 z-10">System Update In Progress</h1>
        <p className="text-slate-400 max-w-md text-lg z-10">We are deploying a critical security patch. The platform will be available in approximately 15 minutes.</p>
        <div className="mt-8 px-6 py-2 bg-black/30 rounded-full border border-white/10 text-xs font-mono text-nexus-300 z-10">
            Build: v2.5.0-rc4 • Status: MIGRATING_DB
        </div>
    </div>
);

export const MobileAppShellTmpl: React.FC = () => {
    const { user } = useAuth();
    const { state } = useData();

    // Fetch actual tasks assigned to current user
    const myTasks = useMemo(() => {
        if (!user) return [];
        return state.projects.flatMap(p => 
            p.tasks
             .filter(t => t.assignments.some(a => a.resourceId === user.id))
             .map(t => ({...t, projectName: p.name}))
        ).slice(0, 5);
    }, [user, state.projects]);

    return (
        <div className="flex justify-center h-full bg-slate-100 p-8">
            <div className="w-[375px] h-[700px] bg-white rounded-3xl border-8 border-slate-800 shadow-2xl overflow-hidden flex flex-col relative">
                <div className="h-14 bg-slate-900 text-white flex items-center justify-between px-4">
                    <div className="w-6"><LayoutTemplate size={20}/></div>
                    <span className="font-bold text-sm">Nexus Mobile</span>
                    <div className="w-6"><Bell size={20}/></div>
                </div>
                <div className="flex-1 overflow-y-auto bg-slate-50 p-4 space-y-4">
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                        <h3 className="font-bold text-lg mb-2">My Tasks</h3>
                        <div className="space-y-3">
                            {myTasks.length > 0 ? myTasks.map((t, i) => (
                                <div key={i} className="flex items-center gap-3 border-b border-slate-50 pb-2">
                                    <div className={`w-5 h-5 rounded-full border-2 ${t.status === 'Completed' ? 'bg-green-500 border-green-500' : 'border-slate-300'}`}></div>
                                    <div className="flex-1">
                                        <div className="text-sm font-medium">{t.name}</div>
                                        <div className="text-[10px] text-slate-400">Due {t.endDate} • {t.projectName}</div>
                                    </div>
                                </div>
                            )) : (
                                <p className="text-xs text-slate-400 italic text-center py-2">No active tasks assigned.</p>
                            )}
                        </div>
                    </div>
                    <div className="bg-blue-600 p-4 rounded-xl text-white shadow-md">
                        <div className="text-xs opacity-80 uppercase font-bold">Today's Focus</div>
                        <div className="text-3xl font-black mt-1">3 Pending</div>
                        <div className="w-full bg-white/20 h-1.5 rounded-full mt-3"><div className="w-[60%] bg-white h-full rounded-full"></div></div>
                    </div>
                </div>
                <div className="h-16 bg-white border-t border-slate-200 flex justify-around items-center text-slate-400">
                    <div className="text-nexus-600 flex flex-col items-center"><LayoutTemplate size={20}/><span className="text-[9px] font-bold mt-1">Home</span></div>
                    <div className="flex flex-col items-center"><Search size={20}/><span className="text-[9px] font-bold mt-1">Search</span></div>
                    <div className="flex flex-col items-center"><User size={20}/><span className="text-[9px] font-bold mt-1">Profile</span></div>
                </div>
            </div>
        </div>
    );
};

export const TabletDashTmpl: React.FC = () => (
    <div className="flex justify-center h-full bg-slate-200 p-8 items-center">
        <div className="w-[900px] h-[600px] bg-slate-50 rounded-xl border-[12px] border-slate-800 shadow-2xl overflow-hidden flex">
            <div className="w-16 bg-slate-900 flex flex-col items-center py-6 gap-6 text-slate-500">
                <div className="text-white"><LayoutTemplate size={24}/></div>
                <LayoutTemplate size={24}/>
                <Settings size={24}/>
            </div>
            <div className="flex-1 p-6 grid grid-cols-2 gap-6 overflow-y-auto">
                 <div className="col-span-2 bg-white p-6 rounded-xl shadow-sm h-48 border border-slate-200">
                     <h3 className="font-bold text-slate-800 mb-2">Portfolio Overview</h3>
                     <div className="flex items-end gap-2 h-24">
                         {[40, 60, 45, 80, 55, 70, 65, 85].map((h, i) => (
                             <div key={i} className="flex-1 bg-blue-500 rounded-t" style={{height: `${h}%`}}></div>
                         ))}
                     </div>
                 </div>
                 <div className="bg-white p-6 rounded-xl shadow-sm h-64 border border-slate-200"></div>
                 <div className="bg-white p-6 rounded-xl shadow-sm h-64 border border-slate-200"></div>
            </div>
        </div>
    </div>
);

export const DocApprovalTmpl: React.FC = () => (
    <div className="h-full flex bg-slate-50">
        <div className="flex-1 p-8 flex items-center justify-center bg-slate-200/50">
            <div className="w-[500px] h-[700px] bg-white shadow-2xl border border-slate-200 flex flex-col items-center justify-center text-slate-300">
                <FileText size={64} className="mb-4"/>
                <p>PDF PREVIEW RENDER</p>
            </div>
        </div>
        <div className="w-80 bg-white border-l border-slate-200 p-6 flex flex-col">
            <div className="mb-6">
                <h3 className="font-bold text-slate-900 text-lg">Contract #9921</h3>
                <p className="text-sm text-slate-500">Submitted by Mike Ross</p>
                <Badge variant="warning" className="mt-2">Pending Approval</Badge>
            </div>
            <div className="flex-1 space-y-4 overflow-y-auto mb-6">
                <div className="p-3 bg-slate-50 rounded-lg text-sm text-slate-700">
                    <span className="font-bold block text-xs text-slate-500 mb-1">Jessica Pearson</span>
                    Please verify clause 4.2 regarding liability limits.
                </div>
            </div>
            <div className="space-y-3 pt-6 border-t border-slate-100">
                <Button className="w-full" icon={Check} variant="primary">Approve Document</Button>
                <Button className="w-full" icon={X} variant="danger">Reject & Return</Button>
            </div>
        </div>
    </div>
);

export const EmptyDashboardTmpl: React.FC = () => (
    <div className="h-full flex flex-col items-center justify-center bg-slate-50 p-6">
        <div className="w-32 h-32 bg-slate-100 rounded-full flex items-center justify-center mb-6">
            <LayoutTemplate size={48} className="text-slate-300"/>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">No Dashboards Created</h2>
        <p className="text-slate-500 max-w-md text-center mb-8">You haven't configured any executive dashboards yet. Start by selecting a template or building from scratch.</p>
        <div className="flex gap-4">
            <Button variant="outline">Browse Templates</Button>
            <Button icon={Plus}>Create Dashboard</Button>
        </div>
    </div>
);

export const ApiPlaygroundTmpl: React.FC = () => (
    <div className="h-full flex flex-col bg-slate-50">
        <div className="p-4 bg-white border-b border-slate-200 flex gap-4">
            <select className="bg-slate-100 border-none rounded font-bold text-sm px-3"><option>GET</option><option>POST</option></select>
            <input className="flex-1 bg-slate-50 border border-slate-200 rounded px-3 text-sm font-mono text-slate-600" defaultValue="https://api.nexus.com/v1/projects/{id}/tasks" />
            <Button size="sm" icon={Play}>Send</Button>
        </div>
        <div className="flex-1 flex overflow-hidden">
            <div className="w-1/2 p-4 border-r border-slate-200 flex flex-col">
                <div className="font-bold text-xs text-slate-500 uppercase tracking-widest mb-2">Request Body (JSON)</div>
                <textarea className="flex-1 w-full bg-white border border-slate-200 rounded-lg p-4 font-mono text-xs text-slate-700 resize-none outline-none focus:border-nexus-500" defaultValue='{ "status": "Active" }'></textarea>
            </div>
            <div className="w-1/2 p-4 flex flex-col bg-slate-900">
                <div className="font-bold text-xs text-slate-500 uppercase tracking-widest mb-2 flex justify-between">
                    <span>Response</span>
                    <span className="text-green-500">200 OK</span>
                </div>
                <pre className="flex-1 w-full text-green-400 font-mono text-xs overflow-auto">
{`{
  "data": {
    "id": "P-102",
    "tasks": 42,
    "updated": true
  },
  "meta": {
    "latency": "24ms"
  }
}`}
                </pre>
            </div>
        </div>
    </div>
);

export const OnboardingChecklistTmpl: React.FC = () => (
    <div className="h-full flex items-center justify-center bg-slate-100 p-6">
        <Card className="max-w-xl w-full p-8">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900">Getting Started</h2>
                <p className="text-slate-500 mt-1">Complete these steps to activate your workspace.</p>
                <div className="mt-4">
                     <div className="flex justify-between text-xs font-bold mb-2">
                         <span className="text-nexus-600">3 of 5 Completed</span>
                         <span className="text-slate-400">60%</span>
                     </div>
                     <ProgressBar value={60} colorClass="bg-nexus-600"/>
                </div>
            </div>
            <div className="space-y-2">
                {[
                    { label: 'Create Organization Profile', done: true },
                    { label: 'Invite Team Members', done: true },
                    { label: 'Configure Project defaults', done: true },
                    { label: 'Set up Financial Calendar', done: false },
                    { label: 'Upload Logo', done: false }
                ].map((step, i) => (
                    <div key={i} className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${step.done ? 'bg-green-50 border-green-200' : 'bg-white border-slate-200'}`}>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${step.done ? 'bg-green-500 text-white' : 'border-2 border-slate-300'}`}>
                            {step.done && <Check size={14}/>}
                        </div>
                        <span className={`font-medium ${step.done ? 'text-slate-800 line-through decoration-slate-400 opacity-70' : 'text-slate-900'}`}>{step.label}</span>
                        {!step.done && <Button size="sm" variant="ghost" className="ml-auto" icon={ChevronRight}>Start</Button>}
                    </div>
                ))}
            </div>
        </Card>
    </div>
);

export const DataMigrationTmpl: React.FC = () => (
    <div className="h-full p-8 flex flex-col bg-slate-50">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Data Migration Wizard</h2>
        <div className="grid grid-cols-3 gap-8 flex-1">
            <div className="col-span-1 space-y-6">
                <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm border-l-4 border-l-nexus-600">
                    <h4 className="font-bold text-slate-800">1. Source</h4>
                    <p className="text-sm text-slate-500 mt-1">Oracle Primavera P6 (XML)</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm opacity-60">
                    <h4 className="font-bold text-slate-800">2. Mapping</h4>
                    <p className="text-sm text-slate-500 mt-1">Map EPS/OBS fields</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm opacity-60">
                    <h4 className="font-bold text-slate-800">3. Validation</h4>
                    <p className="text-sm text-slate-500 mt-1">Check for integrity errors</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm opacity-60">
                    <h4 className="font-bold text-slate-800">4. Import</h4>
                    <p className="text-sm text-slate-500 mt-1">Commit to database</p>
                </div>
            </div>
            <div className="col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-8 flex flex-col items-center justify-center text-center">
                 <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                     <UploadCloud size={40} className="text-blue-500"/>
                 </div>
                 <h3 className="text-xl font-bold text-slate-900">Upload Source File</h3>
                 <p className="text-slate-500 mt-2 mb-8 max-w-sm">Drag and drop your .XML or .XER file here to begin the schema introspection.</p>
                 <Button size="lg" icon={FileText}>Select File</Button>
            </div>
        </div>
    </div>
);

export const WizardStepVerticalTmpl: React.FC = () => (
    <div className="h-full flex bg-slate-50">
        <div className="w-80 bg-white border-r border-slate-200 p-8">
            <h3 className="font-bold text-lg mb-8">New Contract</h3>
            <div className="space-y-0 relative">
                <div className="absolute left-[15px] top-4 bottom-4 w-0.5 bg-slate-100 -z-10"></div>
                {['Vendor Details', 'Scope & Pricing', 'Terms & Legal', 'Review'].map((step, i) => (
                    <div key={i} className="flex gap-4 items-center py-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${i === 1 ? 'bg-nexus-600 border-nexus-600 text-white' : i < 1 ? 'bg-green-500 border-green-500 text-white' : 'bg-white border-slate-200 text-slate-400'}`}>
                            {i < 1 ? <Check size={14}/> : i + 1}
                        </div>
                        <span className={`text-sm font-medium ${i===1 ? 'text-slate-900' : 'text-slate-500'}`}>{step}</span>
                    </div>
                ))}
            </div>
        </div>
        <div className="flex-1 p-12 overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">Scope & Pricing</h2>
            <div className="max-w-2xl space-y-6">
                <Input label="Contract Value" type="number" />
                <div className="grid grid-cols-2 gap-4">
                    <Input label="Start Date" type="date" />
                    <Input label="End Date" type="date" />
                </div>
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Scope Description</label>
                    <textarea className="w-full border border-slate-200 rounded-lg p-3 h-32 focus:ring-2 focus:ring-nexus-500 outline-none"/>
                </div>
                <div className="flex justify-end gap-3 pt-6">
                    <Button variant="ghost">Back</Button>
                    <Button icon={ArrowRight}>Continue</Button>
                </div>
            </div>
        </div>
    </div>
);
