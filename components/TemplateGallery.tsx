
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { 
  Layout, LayoutDashboard, List, FormInput, 
  MonitorPlay, Globe, Shield, ChevronRight, PieChart, 
  Briefcase, HardHat, Users, Settings, Box, Cloud, Grid
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { PageHeader } from './common/PageHeader';
import * as Templates from './templates';

const CATEGORIES = [
  { 
    id: 'dashboards', 
    label: 'Dashboards', 
    icon: LayoutDashboard,
    items: [
      { id: 'ExecutiveDashboardTmpl', label: '1. Executive Portfolio', component: Templates.ExecutiveDashboardTmpl },
      { id: 'ProjectHealthTmpl', label: '2. Project Health', component: Templates.ProjectHealthTmpl },
      { id: 'FinancialControllerTmpl', label: '3. Financial Controller', component: Templates.FinancialControllerTmpl },
      { id: 'ResourceCenterTmpl', label: '4. Resource Center', component: Templates.ResourceCenterTmpl },
      { id: 'PersonalWorkspaceTmpl', label: '5. Personal Workspace', component: Templates.PersonalWorkspaceTmpl },
    ]
  },
  { 
    id: 'lists', 
    label: 'Lists & Grids', 
    icon: List,
    items: [
      { id: 'StandardGridTmpl', label: '6. Standard Data Grid', component: Templates.StandardGridTmpl },
      { id: 'TreeHierarchyTmpl', label: '7. Tree Hierarchy', component: Templates.TreeHierarchyTmpl },
      { id: 'KanbanBoardTmpl', label: '8. Kanban Board', component: Templates.KanbanBoardTmpl },
      { id: 'MasterDetailTmpl', label: '9. Master-Detail', component: Templates.MasterDetailTmpl },
      { id: 'SplitPaneTmpl', label: '10. Split Pane (Map)', component: Templates.SplitPaneTmpl },
    ]
  },
  { 
    id: 'forms', 
    label: 'Data Entry', 
    icon: FormInput,
    items: [
      { id: 'SimpleFormTmpl', label: '11. Simple Form', component: Templates.SimpleFormTmpl },
      { id: 'ComplexFormTmpl', label: '12. Complex Entity', component: Templates.ComplexFormTmpl },
      { id: 'WizardTmpl', label: '13. Stepper Wizard', component: Templates.WizardTmpl },
      { id: 'BulkEditTmpl', label: '14. Bulk Editor', component: Templates.BulkEditTmpl },
      { id: 'SettingsConfigTmpl', label: '15. Settings Config', component: Templates.SettingsConfigTmpl },
      { id: 'MultiStepConfigTmpl', label: '71. Multi-Step Config', component: Templates.MultiStepConfigTmpl },
      { id: 'SettingsMasterTmpl', label: '72. Settings Master', component: Templates.SettingsMasterTmpl },
      { id: 'InlineEditingGridTmpl', label: '73. Inline Editing', component: Templates.InlineEditingGridTmpl },
      { id: 'BulkActionModalTmpl', label: '74. Bulk Action Modal', component: Templates.BulkActionModalTmpl },
      { id: 'ProfileEditorTmpl', label: '75. Profile Editor', component: Templates.ProfileEditorTmpl },
    ]
  },
  { 
    id: 'visuals', 
    label: 'Visualizations', 
    icon: MonitorPlay,
    items: [
      { id: 'GanttTimelineTmpl', label: '16. Gantt Timeline', component: Templates.GanttTimelineTmpl },
      { id: 'StrategicRoadmapTmpl', label: '17. Strategic Roadmap', component: Templates.StrategicRoadmapTmpl },
      { id: 'NetworkDiagramTmpl', label: '18. Network Diagram', component: Templates.NetworkDiagramTmpl },
      { id: 'GeospatialMapTmpl', label: '19. Geospatial Map', component: Templates.GeospatialMapTmpl },
      { id: 'AnalyticsReportTmpl', label: '20. A4 Analytics Report', component: Templates.AnalyticsReportTmpl },
    ]
  },
  { 
    id: 'domain', 
    label: 'Domain Specific', 
    icon: Globe,
    items: [
      { id: 'RiskMatrixTmpl', label: '21. Risk Matrix', component: Templates.RiskMatrixTmpl },
      { id: 'DocumentViewerTmpl', label: '22. Document Viewer', component: Templates.DocumentViewerTmpl },
      { id: 'ComparisonTmpl', label: '23. Baseline Compare', component: Templates.ComparisonTmpl },
      { id: 'CalendarScheduleTmpl', label: '24. Calendar Schedule', component: Templates.CalendarScheduleTmpl },
      { id: 'ChatTmpl', label: '25. Collaboration', component: Templates.ChatTmpl },
    ]
  },
  { 
    id: 'system', 
    label: 'System Pages', 
    icon: Shield,
    items: [
      { id: 'LoginScreenTmpl', label: '26. Login Screen', component: Templates.LoginScreenTmpl },
      { id: 'Error404Tmpl', label: '27. Error 404', component: Templates.Error404Tmpl },
      { id: 'EmptyStateTmpl', label: '28. Empty State', component: Templates.EmptyStateTmpl },
      { id: 'MaintenanceTmpl', label: '29. Maintenance Mode', component: Templates.MaintenanceTmpl },
      { id: 'AuditLogTmpl', label: '30. Audit Log', component: Templates.AuditLogTmpl },
    ]
  },
  {
      id: 'analytics',
      label: 'AI & Analytics',
      icon: PieChart,
      items: [
          { id: 'PredictiveForecastTmpl', label: '31. Predictive Forecast', component: Templates.PredictiveForecastTmpl },
          { id: 'PortfolioOptimizerTmpl', label: '32. Portfolio Optimizer', component: Templates.PortfolioOptimizerTmpl },
          { id: 'VarianceDeepDiveTmpl', label: '33. Variance Deep Dive', component: Templates.VarianceDeepDiveTmpl },
          { id: 'TrendAnalysisTmpl', label: '34. Trend Analysis', component: Templates.TrendAnalysisTmpl },
          { id: 'HealthScorecardTmpl', label: '35. Health Scorecard', component: Templates.HealthScorecardTmpl },
          { id: 'AiPredictionLabTmpl', label: '61. AI Prediction Lab', component: Templates.AiPredictionLabTmpl },
          { id: 'RealTimeTelemetryTmpl', label: '62. IoT Telemetry', component: Templates.RealTimeTelemetryTmpl },
          { id: 'SentimentAnalysisTmpl', label: '63. Sentiment Analysis', component: Templates.SentimentAnalysisTmpl },
          { id: 'SupplyChainMapTmpl', label: '64. Supply Chain Map', component: Templates.SupplyChainMapTmpl },
          { id: 'HeatmapGridTmpl', label: '65. Heatmap Grid', component: Templates.HeatmapGridTmpl },
      ]
  },
  {
      id: 'finance',
      label: 'Financial & Commerce',
      icon: Briefcase,
      items: [
          { id: 'InvoiceProcessingTmpl', label: '36. Invoice Processing', component: Templates.InvoiceProcessingTmpl },
          { id: 'CashFlowModelingTmpl', label: '37. Cash Flow Modeling', component: Templates.CashFlowModelingTmpl },
          { id: 'PricingTableTmpl', label: '81. Pricing Table', component: Templates.PricingTableTmpl },
          { id: 'InvoiceGeneratorTmpl', label: '82. Invoice Generator', component: Templates.InvoiceGeneratorTmpl },
          { id: 'TransactionHistoryTmpl', label: '83. Transaction History', component: Templates.TransactionHistoryTmpl },
          { id: 'BudgetAllocationTmpl', label: '84. Budget Allocation', component: Templates.BudgetAllocationTmpl },
          { id: 'ExpenseApprovalTmpl', label: '85. Expense Approval', component: Templates.ExpenseApprovalTmpl },
      ]
  },
  {
      id: 'operations',
      label: 'Field Operations',
      icon: HardHat,
      items: [
          { id: 'DailyLogEntryTmpl', label: '38. Daily Log Entry', component: Templates.DailyLogEntryTmpl },
          { id: 'InventoryGridTmpl', label: '39. Inventory Grid', component: Templates.InventoryGridTmpl },
          { id: 'EquipmentTrackerTmpl', label: '40. Equipment Tracker', component: Templates.EquipmentTrackerTmpl },
      ]
  },
  {
      id: 'collab',
      label: 'Team & Social',
      icon: Users,
      items: [
          { id: 'TeamDirectoryTmpl', label: '41. Team Directory', component: Templates.TeamDirectoryTmpl },
          { id: 'ProjectWikiTmpl', label: '42. Project Wiki', component: Templates.ProjectWikiTmpl },
          { id: 'DiscussionThreadTmpl', label: '43. Discussion Thread', component: Templates.DiscussionThreadTmpl },
          { id: 'NotificationCenterTmpl', label: '44. Notification Center', component: Templates.NotificationCenterTmpl },
          { id: 'MeetingMinutesTmpl', label: '45. Meeting Minutes', component: Templates.MeetingMinutesTmpl },
          { id: 'ActivityFeedTmpl', label: '66. Activity Feed', component: Templates.ActivityFeedTmpl },
          { id: 'TeamCalendarTmpl', label: '67. Team Calendar', component: Templates.TeamCalendarTmpl },
          { id: 'KanbanBoardTmpl', label: '68. Kanban Board', component: Templates.KanbanBoardTmpl },
          { id: 'DocApprovalTmpl', label: '69. Doc Approval', component: Templates.DocApprovalTmpl },
          { id: 'KnowledgeBaseArticleTmpl', label: '70. KB Article', component: Templates.KnowledgeBaseArticleTmpl },
      ]
  },
  {
      id: 'devops',
      label: 'Infrastructure & DevOps',
      icon: Cloud,
      items: [
          { id: 'ServerHealthMonitorTmpl', label: '76. Server Health', component: Templates.ServerHealthMonitorTmpl },
          { id: 'DeploymentPipelineTmpl', label: '77. CI/CD Pipeline', component: Templates.DeploymentPipelineTmpl },
          { id: 'ApiUsageAnalyticsTmpl', label: '78. API Analytics', component: Templates.ApiUsageAnalyticsTmpl },
          { id: 'LogExplorerTmpl', label: '79. Log Explorer', component: Templates.LogExplorerTmpl },
          { id: 'FeatureFlagManagerTmpl', label: '80. Feature Flags', component: Templates.FeatureFlagManagerTmpl },
      ]
  },
  {
      id: 'config',
      label: 'Admin Config',
      icon: Settings,
      items: [
          { id: 'WorkflowDesignerTmpl', label: '46. Workflow Designer', component: Templates.WorkflowDesignerTmpl },
          { id: 'IntegrationStatusTmpl', label: '47. Integration Status', component: Templates.IntegrationStatusTmpl },
          { id: 'AuditLogViewerTmpl', label: '48. Audit Viewer (Dense)', component: Templates.AuditLogViewerTmpl },
          { id: 'UserProvisioningTmpl', label: '49. User Provisioning', component: Templates.UserProvisioningTmpl },
          { id: 'CustomFieldBuilderTmpl', label: '50. Custom Field Builder', component: Templates.CustomFieldBuilderTmpl },
      ]
  },
  {
      id: 'utility',
      label: 'Utility & Tools',
      icon: Box,
      items: [
          { id: 'FileExplorerTmpl', label: '51. File Explorer', component: Templates.FileExplorerTmpl },
          { id: 'ComparisonTmpl', label: '52. Comparison Diff', component: Templates.ComparisonTmpl },
          { id: 'WizardStepVerticalTmpl', label: '53. Vertical Wizard', component: Templates.WizardStepVerticalTmpl },
          { id: 'MaintenanceTmpl', label: '54. System Down Page', component: Templates.MaintenanceTmpl },
          { id: 'EmptyDashboardTmpl', label: '55. Dashboard Empty', component: Templates.EmptyDashboardTmpl },
          { id: 'SystemHealthTmpl', label: '56. System Health', component: Templates.SystemHealthTmpl },
          { id: 'ApiPlaygroundTmpl', label: '57. API Playground', component: Templates.ApiPlaygroundTmpl },
          { id: 'OnboardingChecklistTmpl', label: '58. Onboarding Checklist', component: Templates.OnboardingChecklistTmpl },
          { id: 'MobilePreviewTmpl', label: '59. Mobile Preview', component: Templates.MobilePreviewTmpl },
          { id: 'DataMigrationTmpl', label: '60. Data Migration', component: Templates.DataMigrationTmpl },
          { id: 'MobileAppShellTmpl', label: '86. Mobile Shell', component: Templates.MobileAppShellTmpl },
          { id: 'TabletDashTmpl', label: '87. Tablet Dashboard', component: Templates.TabletDashTmpl },
          { id: 'KioskModeTmpl', label: '88. Kiosk Mode', component: Templates.KioskModeTmpl },
          { id: 'CommandCenterTmpl', label: '89. Command Center', component: Templates.CommandCenterTmpl },
          { id: 'MaintenanceOverlayTmpl', label: '90. Maint Overlay', component: Templates.MaintenanceOverlayTmpl },
      ]
  }
];

const TemplateGallery: React.FC = () => {
  const theme = useTheme();
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('ExecutiveDashboardTmpl');
  const [activeCategory, setActiveCategory] = useState<string>('dashboards');

  // --- Resizable Sidebar Logic ---
  const [sidebarWidth, setSidebarWidth] = useState(260);
  const [isResizing, setIsResizing] = useState(false);

  const startResizing = useCallback(() => setIsResizing(true), []);
  const stopResizing = useCallback(() => setIsResizing(false), []);

  const resize = useCallback((e: MouseEvent) => {
    if (isResizing) {
      const newWidth = e.clientX;
      if (newWidth >= 200 && newWidth <= 480) {
        setSidebarWidth(newWidth);
      }
    }
  }, [isResizing]);

  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', resize);
      window.addEventListener('mouseup', stopResizing);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    } else {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }
    return () => {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
    };
  }, [isResizing, resize, stopResizing]);


  const allItems = CATEGORIES.flatMap(c => c.items);
  const SelectedComponent = allItems.find(i => i.id === selectedTemplateId)?.component || Templates.ExecutiveDashboardTmpl;
  const selectedLabel = allItems.find(i => i.id === selectedTemplateId)?.label;

  return (
    <div className={`${theme.layout.pageContainer} ${theme.layout.pagePadding} ${theme.layout.sectionSpacing} flex flex-col h-full`}>
      <PageHeader 
        title="Template Gallery" 
        subtitle="Catalog of 90+ enterprise-grade UI patterns and layouts."
        icon={Grid}
      />
      
      <div className={theme.layout.panelContainer}>
        <div className={`flex h-full ${theme.colors.background} overflow-hidden`}>
          {/* Sidebar Navigation */}
          <div 
            className={`relative ${theme.colors.surface} border-r ${theme.colors.border} flex flex-col h-full flex-shrink-0 z-10`}
            style={{ width: sidebarWidth }}
          >
            {/* Resize Handle */}
            <div 
              className="absolute top-0 bottom-0 right-0 w-1 cursor-col-resize hover:bg-nexus-500 z-50 transition-colors"
              onMouseDown={startResizing}
            ></div>

            <div className={`p-4 border-b ${theme.colors.border}`}>
              <h2 className={`font-bold ${theme.colors.text.primary} flex items-center gap-2 truncate`}>
                <Layout className="text-nexus-600 flex-shrink-0" /> Categories
              </h2>
            </div>
            
            <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-thin">
              {CATEGORIES.map(category => (
                <div key={category.id} className="mb-2">
                  <button 
                    onClick={() => setActiveCategory(activeCategory === category.id ? '' : category.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs font-bold ${theme.colors.text.secondary} uppercase tracking-wider hover:bg-slate-50 rounded-lg transition-colors truncate`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <category.icon size={14} className="flex-shrink-0" /> <span className="truncate">{category.label}</span>
                    </div>
                    <ChevronRight size={14} className={`transition-transform flex-shrink-0 ${activeCategory === category.id ? 'rotate-90' : ''}`}/>
                  </button>
                  
                  {activeCategory === category.id && (
                    <div className={`mt-1 ml-2 pl-2 border-l-2 ${theme.colors.border} space-y-1`}>
                      {category.items.map(item => (
                        <button
                          key={item.id}
                          onClick={() => setSelectedTemplateId(item.id)}
                          className={`w-full text-left px-3 py-2 rounded-md text-sm transition-all truncate ${
                            selectedTemplateId === item.id 
                            ? `${theme.colors.accentBg.replace('bg-', 'bg-').replace('600', '50')} ${theme.colors.accentText} font-medium` 
                            : `${theme.colors.text.secondary} hover:bg-slate-50 hover:${theme.colors.text.primary}`
                          }`}
                          title={item.label}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Main Preview Area */}
          <div className="flex-1 flex flex-col h-full min-w-0">
            <div className={`h-12 ${theme.colors.surface} border-b ${theme.colors.border} flex items-center px-6 justify-between flex-shrink-0`}>
              <div className="flex items-center gap-2 overflow-hidden">
                  <span className={`text-xs font-bold ${theme.colors.background} ${theme.colors.text.secondary} px-2 py-1 rounded border ${theme.colors.border} uppercase flex-shrink-0`}>Preview</span>
                  <span className={`font-bold ${theme.colors.text.primary} truncate`}>{selectedLabel}</span>
              </div>
              <div className={`text-xs ${theme.colors.text.tertiary} font-mono hidden sm:block truncate ml-4`}>
                  src/components/templates/{selectedTemplateId}.tsx
              </div>
            </div>

            <div className={`flex-1 p-8 overflow-hidden ${theme.colors.background}/50 relative`}>
              <div className={`absolute inset-4 ${theme.colors.surface} rounded-xl shadow-sm border ${theme.colors.border} overflow-hidden ring-1 ring-slate-900/5`}>
                  {/* Render Selected Template */}
                  <div className="h-full w-full overflow-hidden">
                    <SelectedComponent />
                  </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateGallery;
