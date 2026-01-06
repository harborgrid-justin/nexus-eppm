
import React from 'react';
// Import the new components
import { AiPredictionLab } from '../analytics/AiPredictionLab';
import { IoTStream } from '../iot/IoTStream'; 
import { ActivityFeed } from '../collaboration/ActivityFeed';
import { TeamCalendar } from '../collaboration/TeamCalendar';
import { KnowledgeBaseArticle } from '../knowledge/KnowledgeBaseArticle';
import { DeploymentPipeline } from '../devops/DeploymentPipeline';
import { ServerHealthMonitor } from '../devops/ServerHealthMonitor';

// Import newly created templates
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

// Exports wrapping real components
export const AiPredictionLabTmpl: React.FC = () => <AiPredictionLab />;
export const RealTimeTelemetryTmpl: React.FC = () => <IoTStream />;
export const ActivityFeedTmpl: React.FC = () => <ActivityFeed />;
export const TeamCalendarTmpl: React.FC = () => <TeamCalendar />;
export const KnowledgeBaseArticleTmpl: React.FC = () => <KnowledgeBaseArticle />;
export const DeploymentPipelineTmpl: React.FC = () => <DeploymentPipeline />;
export const ServerHealthMonitorTmpl: React.FC = () => <ServerHealthMonitor />;

// Financial
export const InvoiceProcessingTmpl = InvoiceProcessing;
export const CashFlowModelingTmpl = CashFlowModeling;
export const PricingTableTmpl = PricingTable;
export const InvoiceGeneratorTmpl = InvoiceGenerator;
export const TransactionHistoryTmpl = TransactionHistory;
export const BudgetAllocationTmpl = BudgetAllocation;
export const ExpenseApprovalTmpl = ExpenseApproval;

// Ops
export const DailyLogEntryTmpl = DailyLogEntry;
export const InventoryGridTmpl = InventoryGrid;
export const EquipmentTrackerTmpl = EquipmentTracker;
export const SystemHealthTmpl = SystemHealth;

// Tech / Analytics
export const SentimentAnalysisTmpl = SentimentAnalysis;
export const SupplyChainMapTmpl = SupplyChainMap;
export const HeatmapGridTmpl = HeatmapGrid;
export const FeatureFlagManagerTmpl = FeatureFlagManager;
export const ApiUsageAnalyticsTmpl = ApiUsageAnalytics;
export const LogExplorerTmpl = LogExplorer;
export const MultiStepConfigTmpl = MultiStepConfig;
export const InlineEditingGridTmpl = InlineEditingGrid;

// UX
export const FileExplorerTmpl = FileExplorer;
export const MobilePreviewTmpl = MobilePreview;
export const KioskModeTmpl = KioskMode;
export const CommandCenterTmpl = CommandCenter;

// Remaining Placeholders
export const SettingsMasterTmpl: React.FC = () => <div className="p-12 text-center text-slate-400">Settings Master Template</div>;
export const BulkActionModalTmpl: React.FC = () => <div className="p-12 text-center text-slate-400">Bulk Action Modal Template</div>;
export const ProfileEditorTmpl: React.FC = () => <div className="p-12 text-center text-slate-400">Profile Editor Template</div>;
export const MaintenanceOverlayTmpl: React.FC = () => <div className="p-12 text-center text-slate-400">Maintenance Overlay Template</div>;
export const MobileAppShellTmpl: React.FC = () => <div className="p-12 text-center text-slate-400">Mobile Shell Template</div>;
export const TabletDashTmpl: React.FC = () => <div className="p-12 text-center text-slate-400">Tablet Dashboard Template</div>;
export const DocApprovalTmpl: React.FC = () => <div className="p-12 text-center text-slate-400">Doc Approval Template</div>;
export const EmptyDashboardTmpl: React.FC = () => <div className="p-12 text-center text-slate-400">Empty Dashboard Template</div>;
export const ApiPlaygroundTmpl: React.FC = () => <div className="p-12 text-center text-slate-400">API Playground Template</div>;
export const OnboardingChecklistTmpl: React.FC = () => <div className="p-12 text-center text-slate-400">Onboarding Checklist Template</div>;
export const DataMigrationTmpl: React.FC = () => <div className="p-12 text-center text-slate-400">Data Migration Template</div>;
export const WizardStepVerticalTmpl: React.FC = () => <div className="p-12 text-center text-slate-400">Wizard Step Vertical Template</div>;
