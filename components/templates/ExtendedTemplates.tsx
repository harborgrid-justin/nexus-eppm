
import React from 'react';
// Import the new components
import { AiPredictionLab } from '../analytics/AiPredictionLab';
import { IoTStream } from '../iot/IoTStream'; 
import { ActivityFeed } from '../collaboration/ActivityFeed';
import { TeamCalendar } from '../collaboration/TeamCalendar';
import { KnowledgeBaseArticle } from '../knowledge/KnowledgeBaseArticle';
import { DeploymentPipeline } from '../devops/DeploymentPipeline';
import { ServerHealthMonitor } from '../devops/ServerHealthMonitor';
import { Card } from '../ui/Card'; // Keep for placeholders

// --- Placeholders for remaining items ---
const TemplateHeader = ({ number, title }: { number: string, title: string }) => (
    <div className="flex items-start gap-4 mb-8">
        <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-mono text-lg font-bold shadow-lg shadow-slate-200 shrink-0">{number}</div>
        <div><h2 className="text-2xl font-bold text-slate-900 tracking-tight">{title}</h2></div>
    </div>
);

// Exports wrapping real components
export const AiPredictionLabTmpl: React.FC = () => <AiPredictionLab />;
export const RealTimeTelemetryTmpl: React.FC = () => <IoTStream />;
export const ActivityFeedTmpl: React.FC = () => <ActivityFeed />;
export const TeamCalendarTmpl: React.FC = () => <TeamCalendar />;
export const KnowledgeBaseArticleTmpl: React.FC = () => <KnowledgeBaseArticle />;
export const DeploymentPipelineTmpl: React.FC = () => <DeploymentPipeline />;
export const ServerHealthMonitorTmpl: React.FC = () => <ServerHealthMonitor />;

// --- Placeholders for remaining undefined templates ---

export const FileExplorerTmpl: React.FC = () => <div className="p-12 text-center text-slate-400">File Explorer Template</div>;
export const MobilePreviewTmpl: React.FC = () => <div className="p-12 text-center text-slate-400">Mobile Preview Template</div>;
export const MobileAppShellTmpl: React.FC = () => <div className="p-12 text-center text-slate-400">Mobile Shell Template</div>;
export const TabletDashTmpl: React.FC = () => <div className="p-12 text-center text-slate-400">Tablet Dashboard Template</div>;
export const KioskModeTmpl: React.FC = () => <div className="p-12 text-center text-slate-400">Kiosk Mode Template</div>;
export const CommandCenterTmpl: React.FC = () => <div className="p-12 text-center text-slate-400">Command Center Template</div>;

// Commerce & Fin
export const InvoiceProcessingTmpl: React.FC = () => <div className="p-12 text-center text-slate-400">Invoice Processing Template</div>;
export const CashFlowModelingTmpl: React.FC = () => <div className="p-12 text-center text-slate-400">Cash Flow Modeling Template</div>;
export const PricingTableTmpl: React.FC = () => <div className="p-12 text-center text-slate-400">Pricing Table Template</div>;
export const InvoiceGeneratorTmpl: React.FC = () => <div className="p-12 text-center text-slate-400">Invoice Generator Template</div>;
export const TransactionHistoryTmpl: React.FC = () => <div className="p-12 text-center text-slate-400">Transaction History Template</div>;
export const BudgetAllocationTmpl: React.FC = () => <div className="p-12 text-center text-slate-400">Budget Allocation Template</div>;
export const ExpenseApprovalTmpl: React.FC = () => <div className="p-12 text-center text-slate-400">Expense Approval Template</div>;

// Ops
export const DailyLogEntryTmpl: React.FC = () => <div className="p-12 text-center text-slate-400">Daily Log Entry Template</div>;
export const InventoryGridTmpl: React.FC = () => <div className="p-12 text-center text-slate-400">Inventory Grid Template</div>;
export const EquipmentTrackerTmpl: React.FC = () => <div className="p-12 text-center text-slate-400">Equipment Tracker Template</div>;
export const SystemHealthTmpl: React.FC = () => <div className="p-12 text-center text-slate-400">System Health Template</div>;

// Analytics
export const SentimentAnalysisTmpl: React.FC = () => <div className="p-12 text-center text-slate-400">Sentiment Analysis Template</div>;
export const SupplyChainMapTmpl: React.FC = () => <div className="p-12 text-center text-slate-400">Supply Chain Map Template</div>;
export const HeatmapGridTmpl: React.FC = () => <div className="p-12 text-center text-slate-400">Heatmap Grid Template</div>;

// Collab
export const DocApprovalTmpl: React.FC = () => <div className="p-12 text-center text-slate-400">Doc Approval Template</div>;

// DevOps
export const ApiUsageAnalyticsTmpl: React.FC = () => <div className="p-12 text-center text-slate-400">API Usage Analytics Template</div>;
export const LogExplorerTmpl: React.FC = () => <div className="p-12 text-center text-slate-400">Log Explorer Template</div>;
export const FeatureFlagManagerTmpl: React.FC = () => <div className="p-12 text-center text-slate-400">Feature Flag Manager Template</div>;

// Config
export const MultiStepConfigTmpl: React.FC = () => <div className="p-12 text-center text-slate-400">Multi-Step Config Template</div>;
export const SettingsMasterTmpl: React.FC = () => <div className="p-12 text-center text-slate-400">Settings Master Template</div>;
export const InlineEditingGridTmpl: React.FC = () => <div className="p-12 text-center text-slate-400">Inline Editing Grid Template</div>;
export const BulkActionModalTmpl: React.FC = () => <div className="p-12 text-center text-slate-400">Bulk Action Modal Template</div>;
export const ProfileEditorTmpl: React.FC = () => <div className="p-12 text-center text-slate-400">Profile Editor Template</div>;
export const MaintenanceOverlayTmpl: React.FC = () => <div className="p-12 text-center text-slate-400">Maintenance Overlay Template</div>;

// Utilities
export const EmptyDashboardTmpl: React.FC = () => <div className="p-12 text-center text-slate-400">Empty Dashboard Template</div>;
export const ApiPlaygroundTmpl: React.FC = () => <div className="p-12 text-center text-slate-400">API Playground Template</div>;
export const OnboardingChecklistTmpl: React.FC = () => <div className="p-12 text-center text-slate-400">Onboarding Checklist Template</div>;
export const DataMigrationTmpl: React.FC = () => <div className="p-12 text-center text-slate-400">Data Migration Template</div>;
export const WizardStepVerticalTmpl: React.FC = () => <div className="p-12 text-center text-slate-400">Wizard Step Vertical Template</div>;
