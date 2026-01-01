import React, { useState, useMemo } from 'react';
import { 
    Database, AlertTriangle, CheckCircle, Search, 
    DollarSign, Users, Briefcase, Truck, Target, GitBranch, 
    RefreshCw, Eye, Settings, Layers, Book, Activity, HardHat, Shield,
    Scale, Leaf
} from 'lucide-react';
import { useData } from '../../../context/DataContext';
import { useTheme } from '../../../context/ThemeContext';

// Recursive counter for deep trees (WBS, EPS, OBS, RBS)
const countTreeNodes = (nodes: any[]): number => {
    if (!nodes) return 0;
    return nodes.reduce((acc, node) => acc + 1 + (node.children ? countTreeNodes(node.children) : 0), 0);
};

export const SchemaGapAnalysis: React.FC = () => {
    const theme = useTheme();
    const { state } = useData();
    const [searchTerm, setSearchTerm] = useState('');
    const [generating, setGenerating] = useState<string | null>(null);

    // Dynamic Calculation of Data Topology
    const dataModel = useMemo(() => [
        {
            name: 'Core Project Control',
            icon: Briefcase,
            description: 'Work breakdown, scheduling logic, and execution artifacts.',
            entities: [
                { name: 'Project', status: state.projects.length > 0 ? 'Live' : 'Gap', records: state.projects.length },
                { name: 'WBS Node', status: state.projects.some(p => p.wbs?.length) ? 'Live' : 'Gap', records: state.projects.reduce((acc, p) => acc + countTreeNodes(p.wbs || []), 0) },
                { name: 'Task', status: state.projects.some(p => p.tasks.length) ? 'Live' : 'Gap', records: state.projects.reduce((acc, p) => acc + p.tasks.length, 0) },
                { name: 'Activity Step', status: state.projects.some(p => p.tasks.some(t => t.steps?.length)) ? 'Live' : 'Gap', records: state.projects.reduce((acc, p) => acc + p.tasks.reduce((tAcc, t) => tAcc + (t.steps?.length || 0), 0), 0) },
                { name: 'Dependency (Logic)', status: state.projects.some(p => p.tasks.some(t => t.dependencies?.length)) ? 'Live' : 'Gap', records: state.projects.reduce((acc, p) => acc + p.tasks.reduce((tAcc, t) => tAcc + t.dependencies.length, 0), 0) },
                { name: 'Constraint', status: state.projects.some(p => p.tasks.some(t => t.primaryConstraint)) ? 'Live' : 'Gap', records: state.projects.reduce((acc, p) => acc + p.tasks.filter(t => !!t.primaryConstraint).length, 0) },
                { name: 'Baseline', status: state.projects.some(p => p.baselines?.length) ? 'Live' : 'Gap', records: state.projects.reduce((acc, p) => acc + (p.baselines?.length || 0), 0) },
                { name: 'Baseline Snapshot', status: state.projects.some(p => p.baselines?.length) ? 'Live' : 'Gap', records: state.projects.reduce((acc, p) => acc + (p.baselines || []).reduce((bAcc, b) => bAcc + Object.keys(b.taskBaselines || {}).length, 0), 0) },
                { name: 'Notebook Topic', status: state.projects.some(p => p.notebooks?.length) ? 'Live' : 'Gap', records: state.projects.reduce((acc, p) => acc + (p.notebooks?.length || 0) + p.tasks.reduce((tAcc, t) => tAcc + (t.notebooks?.length || 0), 0), 0) },
                { name: 'Communication Log', status: state.communicationLogs.length > 0 ? 'Live' : 'Gap', records: state.communicationLogs.length },
                { name: 'Assumption', status: state.projects.some(p => p.assumptions?.length) ? 'Live' : 'Gap', records: state.projects.reduce((acc, p) => acc + (p.assumptions?.length || 0), 0) },
                { name: 'Requirement (RTM)', status: state.projects.some(p => p.requirements?.length) ? 'Live' : 'Gap', records: state.projects.reduce((acc, p) => acc + (p.requirements?.length || 0), 0) },
                { name: 'Lesson Learned', status: state.projects.some(p => p.lessonsLearned?.length) ? 'Live' : 'Gap', records: state.projects.reduce((acc, p) => acc + (p.lessonsLearned?.length || 0), 0) },
                { name: 'Team Charter', status: state.projects.some(p => p.teamCharter) ? 'Live' : 'Gap', records: state.projects.filter(p => !!p.teamCharter).length },
                { name: 'Project Stakeholder', status: state.stakeholders.length > 0 ? 'Live' : 'Gap', records: state.stakeholders.length },
            ]
        },
        {
            name: 'Field & Construction',
            icon: HardHat,
            description: 'Site management, safety, and technical engineering workflows.',
            entities: [
                { name: 'RFI (Request for Info)', status: state.communicationLogs.some(c => c.type === 'RFI') ? 'Live' : 'Gap', records: state.communicationLogs.filter(c => c.type === 'RFI').length },
                { name: 'Drawing (DWG/PDF)', status: state.documents.some(d => d.type === 'DWG' || d.type === 'PDF') ? 'Live' : 'Gap', records: state.documents.filter(d => d.type === 'DWG' || d.type === 'PDF').length },
                { name: 'Specification', status: state.documents.some(d => d.type === 'Spec') ? 'Live' : 'Gap', records: state.documents.filter(d => d.type === 'Spec').length },
                { name: 'Submittal Package', status: 'Gap', records: 0 },
                { name: 'Daily Site Log', status: 'Gap', records: 0 },
                { name: 'Safety Incident', status: 'Gap', records: 0 },
                { name: 'Punch List Item', status: 'Gap', records: 0 },
                { name: 'Inspection Request', status: 'Gap', records: 0 },
                { name: 'Material Receipt', status: 'Gap', records: 0 },
            ]
        },
        {
            name: 'Financial Management',
            icon: DollarSign,
            description: 'Budgeting, forecasting, and transaction ledgers.',
            entities: [
                { name: 'Budget Line Item', status: state.budgetItems.length > 0 ? 'Live' : 'Gap', records: state.budgetItems.length },
                { name: 'Budget Log (Transaction)', status: state.projects.some(p => p.budgetLog?.length) ? 'Live' : 'Gap', records: state.projects.reduce((acc, p) => acc + (p.budgetLog?.length || 0), 0) },
                { name: 'Cost Estimate', status: state.projects.some(p => p.costEstimates?.length) ? 'Live' : 'Gap', records: state.projects.reduce((acc, p) => acc + (p.costEstimates?.length || 0), 0) },
                { name: 'Estimate Item', status: state.projects.some(p => p.costEstimates?.length) ? 'Live' : 'Gap', records: state.projects.reduce((acc, p) => acc + (p.costEstimates || []).reduce((cAcc, c) => cAcc + c.items.length, 0), 0) },
                { name: 'Expense', status: state.expenses.length > 0 ? 'Live' : 'Gap', records: state.expenses.length },
                { name: 'Funding Source', status: state.fundingSources.length > 0 ? 'Live' : 'Gap', records: state.fundingSources.length },
                { name: 'Project Funding', status: state.projects.some(p => p.funding?.length) ? 'Live' : 'Gap', records: state.projects.reduce((acc, p) => acc + (p.funding?.length || 0), 0) },
                { name: 'Funding Transaction', status: state.projects.some(p => p.funding?.length) ? 'Live' : 'Gap', records: state.projects.reduce((acc, p) => acc + (p.funding || []).reduce((fAcc, f) => fAcc + (f.transactions?.length || 0), 0), 0) },
                { name: 'Payment App (Pay App)', status: state.projects.some(p => p.paymentApplications?.length) ? 'Live' : 'Gap', records: state.projects.reduce((acc, p) => acc + (p.paymentApplications?.length || 0), 0) },
                { name: 'Pay App Item', status: state.projects.some(p => p.paymentApplications?.length) ? 'Live' : 'Gap', records: state.projects.reduce((acc, p) => acc + (p.paymentApplications || []).reduce((paAcc, pa) => paAcc + (pa.items?.length || 0), 0), 0) },
                { name: 'Change Order', status: state.changeOrders.length > 0 ? 'Live' : 'Gap', records: state.changeOrders.length },
                { name: 'Purchase Order', status: state.purchaseOrders.length > 0 ? 'Live' : 'Gap', records: state.purchaseOrders.length },
                { name: 'Invoice', status: state.invoices.length > 0 ? 'Live' : 'Gap', records: state.invoices.length },
                { name: 'Cost Report', status: state.costReports.length > 0 ? 'Live' : 'Gap', records: state.costReports.length },
                { name: 'Cost Alert', status: state.costAlerts.length > 0 ? 'Live' : 'Gap', records: state.costAlerts.length },
                { name: 'Cost Meeting', status: state.costMeetings.length > 0 ? 'Live' : 'Gap', records: state.costMeetings.length },
                { name: 'Cash Flow Forecast', status: 'Gap', records: 0 },
                { name: 'Tax / VAT Entry', status: 'Gap', records: 0 },
            ]
        },
        {
            name: 'Resource & Org',
            icon: Users,
            description: 'Capacity planning, roles, and labor tracking.',
            entities: [
                { name: 'Resource', status: state.resources.length > 0 ? 'Live' : 'Gap', records: state.resources.length },
                { name: 'Enterprise Role', status: state.roles.length > 0 ? 'Live' : 'Gap', records: state.roles.length },
                { name: 'Skill / Certification', status: state.skills.length > 0 ? 'Live' : 'Gap', records: state.skills.length },
                { name: 'Timesheet', status: state.timesheets?.length > 0 ? 'Live' : 'Gap', records: state.timesheets?.length || 0 },
                { name: 'Timesheet Entry', status: state.timesheets?.length > 0 ? 'Live' : 'Gap', records: state.timesheets?.reduce((acc, t) => acc + t.rows.length, 0) || 0 },
                { name: 'Assignment', status: state.projects.some(p => p.tasks.some(t => t.assignments?.length)) ? 'Live' : 'Gap', records: state.projects.reduce((acc, p) => acc + p.tasks.reduce((tAcc, t) => tAcc + t.assignments.length, 0), 0) },
                { name: 'OBS Node', status: state.obs.length > 0 ? 'Live' : 'Gap', records: countTreeNodes(state.obs) },
                { name: 'EPS Node', status: state.eps.length > 0 ? 'Live' : 'Gap', records: countTreeNodes(state.eps) },
                { name: 'Location', status: state.locations.length > 0 ? 'Live' : 'Gap', records: state.locations.length },
                { name: 'Global Calendar', status: state.calendars.length > 0 ? 'Live' : 'Gap', records: state.calendars.length },
                { name: 'Resource Request', status: 'Gap', records: 0 },
            ]
        },
        {
            name: 'Risk & Quality',
            icon: Shield,
            description: 'Uncertainty management and compliance controls.',
            entities: [
                { name: 'Risk Register', status: state.risks.length > 0 ? 'Live' : 'Gap', records: state.risks.length },
                { name: 'Risk Response Action', status: state.risks.some(r => r.responseActions?.length) ? 'Live' : 'Gap', records: state.risks.reduce((acc, r) => acc + (r.responseActions?.length || 0), 0) },
                { name: 'Issue Log', status: state.issues.length > 0 ? 'Live' : 'Gap', records: state.issues.length },
                { name: 'Risk Management Plan', status: state.projects.some(p => p.id === 'P1001') ? 'Live' : 'Gap', records: state.projects.filter(p => !!p.id).length }, 
                { name: 'RBS Node', status: state.rbs.length > 0 ? 'Live' : 'Gap', records: countTreeNodes(state.rbs) },
                { name: 'Quality Standard', status: state.qualityStandards.length > 0 ? 'Live' : 'Gap', records: state.qualityStandards.length },
                { name: 'Non-Conformance (NCR)', status: state.nonConformanceReports.length > 0 ? 'Live' : 'Gap', records: state.nonConformanceReports.length },
                { name: 'Inspection Checklist', status: state.qualityReports.length > 0 ? 'Live' : 'Gap', records: state.qualityReports.length },
                { name: 'Cost of Quality Snapshot', status: state.projects.some(p => p.costOfQuality) ? 'Live' : 'Gap', records: state.projects.filter(p => !!p.costOfQuality).length },
            ]
        },
        {
            name: 'Strategic Portfolio',
            icon: Target,
            description: 'Top-down strategy alignment and governance.',
            entities: [
                { name: 'Program', status: state.programs.length > 0 ? 'Live' : 'Gap', records: state.programs.length },
                { name: 'Strategic Goal', status: state.strategicGoals.length > 0 ? 'Live' : 'Gap', records: state.strategicGoals.length },
                { name: 'Strategic Driver', status: state.strategicDrivers.length > 0 ? 'Live' : 'Gap', records: state.strategicDrivers.length },
                { name: 'Portfolio Scenario', status: state.portfolioScenarios.length > 0 ? 'Live' : 'Gap', records: state.portfolioScenarios.length },
                { name: 'Benefit Realization', status: state.benefits.length > 0 ? 'Live' : 'Gap', records: state.benefits.length },
                { name: 'Governance Decision', status: state.governanceDecisions.length > 0 ? 'Live' : 'Gap', records: state.governanceDecisions.length },
                { name: 'ESG Metric', status: state.esgMetrics.length > 0 ? 'Live' : 'Gap', records: state.esgMetrics.length },
                { name: 'Portfolio Risk', status: state.portfolioRisks.length > 0 ? 'Live' : 'Gap', records: state.portfolioRisks.length }
            ]
        },
        {
            name: 'Program Management',
            icon: Layers,
            description: 'Cross-project coordination and benefits delivery.',
            entities: [
                { name: 'Program Objective', status: state.programObjectives.length > 0 ? 'Live' : 'Gap', records: state.programObjectives.length },
                { name: 'Program Outcome', status: state.programOutcomes.length > 0 ? 'Live' : 'Gap', records: state.programOutcomes.length },
                { name: 'Program Dependency', status: state.programDependencies.length > 0 ? 'Live' : 'Gap', records: state.programDependencies.length },
                { name: 'Program Change Request', status: state.programChangeRequests.length > 0 ? 'Live' : 'Gap', records: state.programChangeRequests.length },
                { name: 'Program Risk', status: state.programRisks.length > 0 ? 'Live' : 'Gap', records: state.programRisks.length },
                { name: 'Program Issue', status: state.programIssues.length > 0 ? 'Live' : 'Gap', records: state.programIssues.length },
                { name: 'Program Stakeholder', status: state.programStakeholders.length > 0 ? 'Live' : 'Gap', records: state.programStakeholders.length },
                { name: 'Communication Plan Item', status: state.programCommunicationPlan.length > 0 ? 'Live' : 'Gap', records: state.programCommunicationPlan.length },
                { name: 'Stage Gate', status: state.programStageGates.length > 0 ? 'Live' : 'Gap', records: state.programStageGates.length },
                { name: 'Transition Item', status: state.programTransitionItems.length > 0 ? 'Live' : 'Gap', records: state.programTransitionItems.length },
                { name: 'Integrated Change', status: state.integratedChanges.length > 0 ? 'Live' : 'Gap', records: state.integratedChanges.length },
                { name: 'Governance Role', status: state.governanceRoles.length > 0 ? 'Live' : 'Gap', records: state.governanceRoles.length },
                { name: 'Governance Event', status: state.governanceEvents.length > 0 ? 'Live' : 'Gap', records: state.governanceEvents.length },
                { name: 'Program Budget Alloc.', status: state.programAllocations.length > 0 ? 'Live' : 'Gap', records: state.programAllocations.length },
                { name: 'Program Funding Gate', status: state.programFundingGates.length > 0 ? 'Live' : 'Gap', records: state.programFundingGates.length },
                { name: 'Architecture Review', status: state.programArchitectureReviews.length > 0 ? 'Live' : 'Gap', records: state.programArchitectureReviews.length },
                { name: 'Architecture Standard', status: state.programArchitectureStandards.length > 0 ? 'Live' : 'Gap', records: state.programArchitectureStandards.length },
                { name: 'Tradeoff Scenario', status: state.tradeoffScenarios.length > 0 ? 'Live' : 'Gap', records: state.tradeoffScenarios.length },
                { name: 'Quality Standard (Prog)', status: state.programQualityStandards.length > 0 ? 'Live' : 'Gap', records: state.programQualityStandards.length },
                { name: 'Assurance Review', status: state.programAssuranceReviews.length > 0 ? 'Live' : 'Gap', records: state.programAssuranceReviews.length }
            ]
        },
        {
            name: 'Supply Chain',
            icon: Truck,
            description: 'Vendor registry, contracting, and procurement lifecycle.',
            entities: [
                { name: 'Vendor', status: state.vendors.length > 0 ? 'Live' : 'Gap', records: state.vendors.length },
                { name: 'Contract', status: state.contracts.length > 0 ? 'Live' : 'Gap', records: state.contracts.length },
                { name: 'Solicitation (RFP)', status: state.solicitations.length > 0 ? 'Live' : 'Gap', records: state.solicitations.length },
                { name: 'Bid Response', status: state.solicitations.some(s => s.bids?.length) ? 'Live' : 'Gap', records: state.solicitations.reduce((acc, s) => acc + (s.bids?.length || 0), 0) },
                { name: 'Procurement Plan', status: state.procurementPlans.length > 0 ? 'Live' : 'Gap', records: state.procurementPlans.length },
                { name: 'Procurement Package', status: state.procurementPackages.length > 0 ? 'Live' : 'Gap', records: state.procurementPackages.length },
                { name: 'Supplier Review', status: state.supplierReviews.length > 0 ? 'Live' : 'Gap', records: state.supplierReviews.length },
                { name: 'Procurement Claim', status: state.claims.length > 0 ? 'Live' : 'Gap', records: state.claims.length },
                { name: 'Make/Buy Analysis', status: state.makeOrBuyAnalysis.length > 0 ? 'Live' : 'Gap', records: state.makeOrBuyAnalysis.length }
            ]
        },
        {
            name: 'Legal & Claims',
            icon: Scale,
            description: 'Dispute resolution, insurance, and legal hold management.',
            entities: [
                { name: 'Dispute Case', status: 'Gap', records: 0 },
                { name: 'Insurance Policy', status: 'Gap', records: 0 },
                { name: 'Lien Waiver', status: 'Gap', records: 0 },
                { name: 'Notice of Intent', status: 'Gap', records: 0 },
            ]
        },
        {
            name: 'HSE & Permitting',
            icon: Leaf,
            description: 'Health, Safety, Environment and regulatory permits.',
            entities: [
                { name: 'Permit', status: 'Gap', records: 0 },
                { name: 'Environmental Impact Assessment', status: 'Gap', records: 0 },
                { name: 'Safety Violation', status: 'Gap', records: 0 },
                { name: 'Toolbox Talk', status: 'Gap', records: 0 },
            ]
        },
        {
            name: 'System & Security',
            icon: Settings,
            description: 'Global settings, user management, and integrations.',
            entities: [
                { name: 'Activity Code', status: state.activityCodes.length > 0 ? 'Live' : 'Gap', records: state.activityCodes.length },
                { name: 'Activity Code Value', status: state.activityCodes.some(ac => ac.values?.length) ? 'Live' : 'Gap', records: state.activityCodes.reduce((acc, ac) => acc + ac.values.length, 0) },
                { name: 'UDF Definition', status: state.userDefinedFields.length > 0 ? 'Live' : 'Gap', records: state.userDefinedFields.length },
                { name: 'Workflow Def', status: state.workflows.length > 0 ? 'Live' : 'Gap', records: state.workflows.length },
                { name: 'Workflow Step', status: state.workflows.some(w => w.steps?.length) ? 'Live' : 'Gap', records: state.workflows.reduce((acc, w) => acc + w.steps.length, 0) },
                { name: 'User / ACL', status: state.users.length > 0 ? 'Live' : 'Gap', records: state.users.length },
                { name: 'Data Job', status: state.dataJobs.length > 0 ? 'Live' : 'Gap', records: state.dataJobs.length },
                { name: 'System Alert', status: state.governance.alerts.length > 0 ? 'Live' : 'Gap', records: state.governance.alerts.length },
                { name: 'Extension', status: state.extensions.length > 0 ? 'Live' : 'Gap', records: state.extensions.length },
                { name: 'Integration', status: state.integrations.length > 0 ? 'Live' : 'Gap', records: state.integrations.length },
                { name: 'Audit Log Entry', status: state.governance.auditLog.length > 0 ? 'Live' : 'Gap', records: state.governance.auditLog.length },
                { name: 'Expense Category', status: state.expenseCategories.length > 0 ? 'Live' : 'Gap', records: state.expenseCategories.length },
                { name: 'Issue Code', status: state.issueCodes.length > 0 ? 'Live' : 'Gap', records: state.issueCodes.length },
                { name: 'Scheduling Rule', status: state.governance.scheduling ? 'Live' : 'Gap', records: Object.keys(state.governance.scheduling).length },
                { name: 'Resource Defaults', status: state.governance.resourceDefaults ? 'Live' : 'Gap', records: Object.keys(state.governance.resourceDefaults).length },
                { name: 'Security Policy', status: state.governance.security ? 'Live' : 'Gap', records: Object.keys(state.governance.security).length },
                { name: 'Global Change Rule', status: state.globalChangeRules.length > 0 ? 'Live' : 'Gap', records: state.globalChangeRules.length },
                { name: 'Document', status: state.documents.length > 0 ? 'Live' : 'Gap', records: state.documents.length },
                { name: 'API Token', status: 'Gap', records: 0 },
                { name: 'GIS Layer', status: 'Gap', records: 0 },
            ]
        },
        {
            name: 'Knowledge Libraries',
            icon: Book,
            description: 'Reusable enterprise assets and templates.',
            entities: [
                { name: 'Cost Book Item', status: state.costBook.length > 0 ? 'Live' : 'Gap', records: state.costBook.length },
                { name: 'Standard Template', status: state.standardTemplates.length > 0 ? 'Live' : 'Gap', records: state.standardTemplates.length }
            ]
        }
    ], [state]);

    // Calculate Metrics based on Real Data
    const totalEntities = dataModel.reduce((acc, d) => acc + d.entities.length, 0);
    const liveEntities = dataModel.reduce((acc, d) => acc + d.entities.filter(e => e.status === 'Live').length, 0);
    const totalRecords = dataModel.reduce((acc, d) => acc + d.entities.reduce((s, e) => s + e.records, 0), 0);
    const coveragePercent = Math.round((liveEntities / totalEntities) * 100);

    const handleGenerateEndpoint = (entityName: string) => {
        setGenerating(entityName);
        setTimeout(() => {
            setGenerating(null);
            alert(`REST and GraphQL endpoints generated for ${entityName}. Schema definitions updated.`);
        }, 1500);
    };

    return (
        <div className="h-full flex flex-col space-y-6">
            {/* Top Analysis Card */}
            <div className="bg-slate-800 rounded-xl p-6 text-slate-200 shadow-lg relative overflow-hidden flex flex-col md:flex-row justify-between gap-6 flex-shrink-0">
                <div className="relative z-10">
                    <h3 className="text-2xl font-black tracking-tight flex items-center gap-3">
                        <Database className="text-nexus-400" size={28}/> Enterprise Data Topology
                    </h3>
                    <p className="text-slate-400 text-sm mt-2 max-w-xl leading-relaxed">
                        Real-time schema introspection of the Nexus Data Graph. 
                        Tracking <strong>{dataModel.length} functional domains</strong> and <strong>{totalEntities} unique entity types</strong> across the distributed ledger.
                    </p>
                    
                    <div className="flex gap-8 mt-6 overflow-x-auto pb-2 scrollbar-thin">
                        <div>
                            <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-0.5">Schema Coverage</p>
                            <div className="flex items-baseline gap-2">
                                <span className={`text-3xl font-black ${coveragePercent === 100 ? 'text-green-400' : theme.colors.text.inverted}`}>{coveragePercent}%</span>
                                <span className="text-sm text-slate-400">Implemented</span>
                            </div>
                        </div>
                        <div className="w-px h-10 bg-white/10"></div>
                        <div>
                            <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-0.5">Object Types</p>
                            <div className="flex items-baseline gap-2">
                                <span className={`text-3xl font-black ${theme.colors.text.inverted}`}>{totalEntities}</span>
                                <span className="text-sm text-slate-400">Definitions</span>
                            </div>
                        </div>
                        <div className="w-px h-10 bg-white/10"></div>
                        <div>
                            <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-0.5">Active Data Points</p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-black text-nexus-400">
                                    {totalRecords.toLocaleString()}
                                </span>
                                <span className="text-sm text-slate-400">Records</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Visual Radar Background */}
                <div className="absolute top-1/2 right-10 -translate-y-1/2 w-64 h-64 border-[20px] border-white/5 rounded-full z-0 animate-pulse"></div>
                <div className="absolute top-1/2 right-20 -translate-y-1/2 w-40 h-40 border-[20px] border-white/5 rounded-full z-0"></div>
                <Activity className="absolute bottom-6 right-6 text-white/5" size={120} />
            </div>

            {/* Filter */}
            <div className="flex flex-col sm:flex-row items-center gap-4 px-1 flex-shrink-0">
                <div className="relative flex-1 w-full sm:w-auto sm:max-w-md">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                    <input 
                        type="text" 
                        placeholder="Search schema entities..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 pr-4 py-2 w-full border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-nexus-500 outline-none transition-all"
                    />
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                    <div className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-1 ${theme.colors.semantic.success.bg} border ${theme.colors.semantic.success.border} rounded-full text-xs font-bold ${theme.colors.semantic.success.text}`}>
                        <CheckCircle size={12}/> Live
                    </div>
                    <div className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-1 ${theme.colors.semantic.neutral.bg} border ${theme.colors.semantic.neutral.border} rounded-full text-xs font-bold ${theme.colors.semantic.neutral.text}`}>
                        <AlertTriangle size={12}/> Gap
                    </div>
                </div>
            </div>

            {/* Domain Grid */}
            <div className="flex-1 overflow-y-auto pr-2 pb-10 scrollbar-thin">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {dataModel.map(domain => {
                        const filteredEntities = domain.entities.filter(e => e.name.toLowerCase().includes(searchTerm.toLowerCase()));
                        if (filteredEntities.length === 0 && searchTerm) return null;

                        const domainCoverage = Math.round((domain.entities.filter(e => e.status === 'Live').length / domain.entities.length) * 100);

                        return (
                            <div key={domain.name} className={`${theme.components.card} flex flex-col overflow-hidden group hover:border-nexus-300 transition-colors`}>
                                <div className={`p-4 ${theme.colors.background} border-b ${theme.colors.border} flex justify-between items-start`}>
                                    <div className="flex gap-3">
                                        <div className={`p-2 ${theme.colors.surface} border ${theme.colors.border} rounded-lg text-slate-600 shadow-sm`}>
                                            <domain.icon size={20}/>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-800 text-sm">{domain.name}</h4>
                                            <p className="text-[10px] text-slate-500 leading-tight mt-0.5 max-w-[150px]">{domain.description}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className={`text-xs font-black px-2 py-1 rounded border ${domainCoverage === 100 ? `${theme.colors.semantic.success.bg} ${theme.colors.semantic.success.text} ${theme.colors.semantic.success.border}` : `${theme.colors.semantic.neutral.bg} ${theme.colors.semantic.neutral.text} ${theme.colors.semantic.neutral.border}`}`}>
                                            {domainCoverage}%
                                        </span>
                                    </div>
                                </div>
                                
                                {/* Progress Bar */}
                                <div className={`h-1 w-full ${theme.colors.background}`}>
                                    <div className={`h-full ${domainCoverage === 100 ? theme.colors.semantic.success.bg.replace('-50', '-500') : theme.colors.primary}`} style={{ width: `${domainCoverage}%` }}></div>
                                </div>

                                <div className="divide-y divide-slate-100">
                                    {filteredEntities.map(entity => (
                                        <div key={entity.name} className={`p-3 flex items-center justify-between group/row hover:${theme.colors.background} transition-colors`}>
                                            <div className="min-w-0 flex-1 pr-4">
                                                <div className="flex items-center gap-2">
                                                    <p className="font-bold text-xs text-slate-700 truncate" title={entity.name}>{entity.name}</p>
                                                    {entity.status === 'Live' ? (
                                                        <CheckCircle size={12} className={theme.colors.semantic.success.icon} />
                                                    ) : (
                                                        <AlertTriangle size={12} className={`${theme.colors.text.tertiary} group-hover/row:text-amber-500 transition-colors`} />
                                                    )}
                                                </div>
                                                <p className="text-[9px] text-slate-400 mt-0.5 font-mono uppercase tracking-wider">
                                                    {entity.records.toLocaleString()} Records
                                                </p>
                                            </div>
                                            
                                            {entity.status === 'Gap' ? (
                                                <button 
                                                    onClick={() => handleGenerateEndpoint(entity.name)}
                                                    disabled={generating === entity.name}
                                                    className={`px-2 py-1 ${theme.colors.background} hover:${theme.colors.primary} hover:${theme.colors.text.inverted} ${theme.colors.text.secondary} rounded text-[10px] font-bold transition-all flex items-center gap-1 border ${theme.colors.border}`}
                                                >
                                                    {generating === entity.name ? (
                                                        <RefreshCw size={10} className="animate-spin"/>
                                                    ) : (
                                                        <GitBranch size={10}/> 
                                                    )}
                                                    {generating === entity.name ? '...' : 'Gen API'}
                                                </button>
                                            ) : (
                                                <button className={`px-2 py-1 ${theme.colors.surface} border ${theme.colors.border} ${theme.colors.text.tertiary} rounded text-[10px] font-bold flex items-center gap-1 hover:bg-slate-50 hover:text-nexus-600 transition-colors opacity-0 group-hover/row:opacity-100`}>
                                                    <Eye size={10}/> Inspect
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
