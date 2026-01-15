import { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { 
    Briefcase, LayoutTemplate, HardHat, DollarSign, Users, 
    Shield, Target, Layers, Truck, Scale, Leaf, Settings, Book 
} from 'lucide-react';

interface TreeNode {
    children?: TreeNode[];
    [key: string]: any;
}

const countTreeNodes = (nodes: TreeNode[]): number => {
    if (!nodes) return 0;
    return nodes.reduce((acc, node) => acc + 1 + (node.children ? countTreeNodes(node.children) : 0), 0);
};

export const useSchemaGapAnalysisLogic = () => {
    const { state } = useData();
    const [searchTerm, setSearchTerm] = useState('');
    const [generating, setGenerating] = useState<string | null>(null);

    const dataModel = useMemo(() => {
        // Safe access to state arrays
        const projects = state.projects || [];
        const commLogs = state.communicationLogs || [];
        const documents = state.documents || [];
        const budgetItems = state.budgetItems || [];
        const expenses = state.expenses || [];
        const fundingSources = state.fundingSources || [];
        const changeOrders = state.changeOrders || [];
        const purchaseOrders = state.purchaseOrders || [];
        const invoices = state.invoices || [];
        const costReports = state.costReports || [];
        const costAlerts = state.costAlerts || [];
        const costMeetings = state.costMeetings || [];
        const resources = state.resources || [];
        const roles = state.roles || [];
        const skills = state.skills || [];
        const timesheets = state.timesheets || [];
        const obs = state.obs || [];
        const eps = state.eps || [];
        const locations = state.locations || [];
        const calendars = state.calendars || [];
        const risks = state.risks || [];
        const issues = state.issues || [];
        const rbs = state.rbs || [];
        const qualityStandards = state.qualityStandards || [];
        const ncrs = state.nonConformanceReports || [];
        const qualityReports = state.qualityReports || [];
        const stakeholders = state.stakeholders || [];
        const programs = state.programs || [];
        const strategicGoals = state.strategicGoals || [];
        const strategicDrivers = state.strategicDrivers || [];
        const scenarios = state.portfolioScenarios || [];
        const benefits = state.benefits || [];
        const govDecisions = state.governanceDecisions || [];
        const esg = state.esgMetrics || [];
        const portRisks = state.portfolioRisks || [];
        const progObjs = state.programObjectives || [];
        const progOutcomes = state.programOutcomes || [];
        const progDeps = state.programDependencies || [];
        const progCRs = state.programChangeRequests || [];
        const progRisks = state.programRisks || [];
        const progIssues = state.programIssues || [];
        const progSHs = state.programStakeholders || [];
        const progComm = state.programCommunicationPlan || [];
        const progGates = state.programStageGates || [];
        const progTrans = state.programTransitionItems || [];
        const intChanges = state.integratedChanges || [];
        const govRoles = state.governanceRoles || [];
        const govEvents = state.governanceEvents || [];
        const progAlloc = state.programAllocations || [];
        const progFundingGates = state.programFundingGates || [];
        const archReviews = state.programArchitectureReviews || [];
        const archStds = state.programArchitectureStandards || [];
        const tradeoffScenarios = state.tradeoffScenarios || [];
        const progQualStds = state.programQualityStandards || [];
        const assurReviews = state.programAssuranceReviews || [];
        const vendors = state.vendors || [];
        const contracts = state.contracts || [];
        const solicitations = state.solicitations || [];
        const procPlans = state.procurementPlans || [];
        const procPkgs = state.procurementPackages || [];
        const supReviews = state.supplierReviews || [];
        const claims = state.claims || [];
        const makeBuy = state.makeOrBuyAnalysis || [];
        const actCodes = state.activityCodes || [];
        const udfs = state.userDefinedFields || [];
        const workflows = state.workflows || [];
        const dataJobs = state.dataJobs || [];
        const alerts = state.governance?.alerts || [];
        const extensions = state.extensions || [];
        const integrations = state.integrations || [];
        const auditLog = state.governance?.auditLog || [];
        const expCats = state.expenseCategories || [];
        const issueCodes = state.issueCodes || [];
        const schedRules = state.governance?.scheduling ? Object.keys(state.governance.scheduling) : [];
        const resDefaults = state.governance?.resourceDefaults ? Object.keys(state.governance.resourceDefaults) : [];
        const secPolicy = state.governance?.security ? Object.keys(state.governance.security) : [];
        const exchangeRates = state.governance?.exchangeRates ? Object.keys(state.governance.exchangeRates) : [];
        const gcRules = state.globalChangeRules || [];
        const costBook = state.costBook || [];
        const templates = state.standardTemplates || [];
        
        // Unifier
        const bpDefs = state.unifier?.definitions || [];
        const bpRecords = state.unifier?.records || [];
        const costSheetCols = state.unifier?.costSheet?.columns || [];
        const costSheetRows = state.unifier?.costSheet?.rows || [];

        return [
        {
            name: 'Core Project Control',
            icon: Briefcase,
            description: 'Work breakdown, scheduling logic, and execution artifacts.',
            entities: [
                { name: 'Project', status: projects.length > 0 ? 'Live' : 'Gap', records: projects.length },
                { name: 'WBS Node', status: projects.some(p => p.wbs?.length) ? 'Live' : 'Gap', records: projects.reduce((acc, p) => acc + countTreeNodes(p.wbs || []), 0) },
                { name: 'Task', status: projects.some(p => p.tasks?.length) ? 'Live' : 'Gap', records: projects.reduce((acc, p) => acc + (p.tasks?.length || 0), 0) },
                { name: 'Activity Step', status: projects.some(p => p.tasks?.some(t => t.steps?.length)) ? 'Live' : 'Gap', records: projects.reduce((acc, p) => acc + (p.tasks?.reduce((tAcc, t) => tAcc + (t.steps?.length || 0), 0) || 0), 0) },
                { name: 'Dependency (Logic)', status: projects.some(p => p.tasks?.some(t => t.dependencies?.length)) ? 'Live' : 'Gap', records: projects.reduce((acc, p) => acc + (p.tasks?.reduce((tAcc, t) => tAcc + (t.dependencies?.length || 0), 0) || 0), 0) },
                { name: 'Constraint', status: projects.some(p => p.tasks?.some(t => t.primaryConstraint)) ? 'Live' : 'Gap', records: projects.reduce((acc, p) => acc + (p.tasks?.filter(t => !!t.primaryConstraint).length || 0), 0) },
                { name: 'Baseline', status: projects.some(p => p.baselines?.length) ? 'Live' : 'Gap', records: projects.reduce((acc, p) => acc + (p.baselines?.length || 0), 0) },
                { name: 'Baseline Snapshot', status: projects.some(p => p.baselines?.length) ? 'Live' : 'Gap', records: projects.reduce((acc, p) => acc + (p.baselines || []).reduce((bAcc, b) => bAcc + Object.keys(b.taskBaselines || {}).length, 0), 0) },
                { name: 'Notebook Topic', status: projects.some(p => p.notebooks?.length) ? 'Live' : 'Gap', records: projects.reduce((acc, p) => acc + (p.notebooks?.length || 0) + (p.tasks?.reduce((tAcc, t) => tAcc + (t.notebooks?.length || 0), 0) || 0), 0) },
                { name: 'Communication Log', status: commLogs.length > 0 ? 'Live' : 'Gap', records: commLogs.length },
                { name: 'Assumption', status: projects.some(p => p.assumptions?.length) ? 'Live' : 'Gap', records: projects.reduce((acc, p) => acc + (p.assumptions?.length || 0), 0) },
                { name: 'Requirement (RTM)', status: projects.some(p => p.requirements?.length) ? 'Live' : 'Gap', records: projects.reduce((acc, p) => acc + (p.requirements?.length || 0), 0) },
                { name: 'Lesson Learned', status: projects.some(p => p.lessonsLearned?.length) ? 'Live' : 'Gap', records: projects.reduce((acc, p) => acc + (p.lessonsLearned?.length || 0), 0) },
                { name: 'Team Charter', status: projects.some(p => p.teamCharter) ? 'Live' : 'Gap', records: projects.filter(p => !!p.teamCharter).length },
                { name: 'Project Stakeholder', status: stakeholders.length > 0 ? 'Live' : 'Gap', records: stakeholders.length },
            ]
        },
        {
            name: 'Financial Control (Unifier)',
            icon: DollarSign,
            description: 'Business processes, cost sheets, and cash flow governance.',
            entities: [
                { name: 'Cost Code (CBS)', status: costSheetRows.length > 0 ? 'Live' : 'Gap', records: costSheetRows.length },
                { name: 'Business Process (BP)', status: bpDefs.length > 0 ? 'Live' : 'Gap', records: bpDefs.length },
                { name: 'Workflow Logic', status: bpDefs.some(d => d.workflow?.length) ? 'Live' : 'Gap', records: bpDefs.reduce((acc, d) => acc + (d.workflow?.length || 0), 0) },
                { name: 'Process Record', status: bpRecords.length > 0 ? 'Live' : 'Gap', records: bpRecords.length },
                { name: 'Budget Line Item', status: budgetItems.length > 0 ? 'Live' : 'Gap', records: budgetItems.length },
                { name: 'Budget Transaction', status: budgetItems.some(b => !!b.actual) ? 'Live' : 'Gap', records: budgetItems.filter(b => !!b.actual).length },
                { name: 'Expense Record', status: expenses.length > 0 ? 'Live' : 'Gap', records: expenses.length },
                { name: 'Change Order (PCR)', status: changeOrders.length > 0 ? 'Live' : 'Gap', records: changeOrders.length },
                { name: 'Purchase Order (PO)', status: purchaseOrders.length > 0 ? 'Live' : 'Gap', records: purchaseOrders.length },
                { name: 'Invoice Artifact', status: invoices.length > 0 ? 'Live' : 'Gap', records: invoices.length },
                { name: 'Funding Source', status: fundingSources.length > 0 ? 'Live' : 'Gap', records: fundingSources.length },
                { name: 'Cost Book Reference', status: costBook.length > 0 ? 'Live' : 'Gap', records: costBook.length },
                { name: 'Cost Report', status: costReports.length > 0 ? 'Live' : 'Gap', records: costReports.length },
                { name: 'Fiscal Meeting', status: costMeetings.length > 0 ? 'Live' : 'Gap', records: costMeetings.length },
                { name: 'Financial Alert', status: costAlerts.length > 0 ? 'Live' : 'Gap', records: costAlerts.length },
            ]
        },
        {
            name: 'Strategic Portfolio Layer',
            icon: Target,
            description: 'Programs, strategic goals, and investment scenarios.',
            entities: [
                { name: 'Program', status: programs.length > 0 ? 'Live' : 'Gap', records: programs.length },
                { name: 'Strategic Mandate', status: strategicGoals.length > 0 ? 'Live' : 'Gap', records: strategicGoals.length },
                { name: 'Strategic Driver', status: strategicDrivers.length > 0 ? 'Live' : 'Gap', records: strategicDrivers.length },
                { name: 'What-If Scenario', status: scenarios.length > 0 ? 'Live' : 'Gap', records: scenarios.length },
                { name: 'Benefit Target', status: benefits.length > 0 ? 'Live' : 'Gap', records: benefits.length },
                { name: 'ESG Metric', status: esg.length > 0 ? 'Live' : 'Gap', records: esg.length },
                { name: 'Portfolio Risk', status: portRisks.length > 0 ? 'Live' : 'Gap', records: portRisks.length },
                { name: 'Governance Decision', status: govDecisions.length > 0 ? 'Live' : 'Gap', records: govDecisions.length },
                { name: 'Program Objective', status: progObjs.length > 0 ? 'Live' : 'Gap', records: progObjs.length },
                { name: 'Program Outcome', status: progOutcomes.length > 0 ? 'Live' : 'Gap', records: progOutcomes.length },
                { name: 'Inter-Project Logic', status: progDeps.length > 0 ? 'Live' : 'Gap', records: progDeps.length },
                { name: 'Program Change (PCR)', status: progCRs.length > 0 ? 'Live' : 'Gap', records: progCRs.length },
                { name: 'Integrated Change (OCM)', status: intChanges.length > 0 ? 'Live' : 'Gap', records: intChanges.length },
                { name: 'Program Risk', status: progRisks.length > 0 ? 'Live' : 'Gap', records: progRisks.length },
                { name: 'Program Issue', status: progIssues.length > 0 ? 'Live' : 'Gap', records: progIssues.length },
                { name: 'Strategic Communication', status: progComm.length > 0 ? 'Live' : 'Gap', records: progComm.length },
                { name: 'Program Allotment', status: progAlloc.length > 0 ? 'Live' : 'Gap', records: progAlloc.length },
                { name: 'Funding Gate', status: progFundingGates.length > 0 ? 'Live' : 'Gap', records: progFundingGates.length },
                { name: 'Stage Gate Milestone', status: progGates.length > 0 ? 'Live' : 'Gap', records: progGates.length },
                { name: 'Architecture Standard', status: archStds.length > 0 ? 'Live' : 'Gap', records: archStds.length },
                { name: 'Transition Handover', status: progTrans.length > 0 ? 'Live' : 'Gap', records: progTrans.length },
                { name: 'Trade-off Scenario', status: tradeoffScenarios.length > 0 ? 'Live' : 'Gap', records: tradeoffScenarios.length },
            ]
        },
        {
            name: 'Risk & Quality Governance',
            icon: Shield,
            description: 'NCRs, inspections, and probabilistic risk analysis.',
            entities: [
                { name: 'Risk Identifier', status: risks.length > 0 ? 'Live' : 'Gap', records: risks.length },
                { name: 'Risk Response Step', status: risks.some(r => r.responseActions?.length) ? 'Live' : 'Gap', records: risks.reduce((acc, r) => acc + (r.responseActions?.length || 0), 0) },
                { name: 'Issue / Impediment', status: issues.length > 0 ? 'Live' : 'Gap', records: issues.length },
                { name: 'RBS Node', status: rbs.length > 0 ? 'Live' : 'Gap', records: countTreeNodes(rbs) },
                { name: 'Quality Standard', status: qualityStandards.length > 0 ? 'Live' : 'Gap', records: qualityStandards.length },
                { name: 'Non-Conformance (NCR)', status: ncrs.length > 0 ? 'Live' : 'Gap', records: ncrs.length },
                { name: 'Inspection Report', status: qualityReports.length > 0 ? 'Live' : 'Gap', records: qualityReports.length },
                { name: 'Material Receipt', status: state.materialReceipts?.length > 0 ? 'Live' : 'Gap', records: state.materialReceipts?.length || 0 },
                { name: 'Site Safety Incident', status: state.safetyIncidents?.length > 0 ? 'Live' : 'Gap', records: state.safetyIncidents?.length || 0 },
            ]
        },
        {
            name: 'Resource & Procurement',
            icon: Users,
            description: 'Human capital, supply chain, and workforce management.',
            entities: [
                { name: 'Enterprise Resource', status: resources.length > 0 ? 'Live' : 'Gap', records: resources.length },
                { name: 'Resource Request', status: state.resourceRequests?.length > 0 ? 'Live' : 'Gap', records: state.resourceRequests?.length || 0 },
                { name: 'Competency / Skill', status: skills.length > 0 ? 'Live' : 'Gap', records: skills.length },
                { name: 'Enterprise Role', status: roles.length > 0 ? 'Live' : 'Gap', records: roles.length },
                { name: 'Timesheet Record', status: timesheets.length > 0 ? 'Live' : 'Gap', records: timesheets.length },
                { name: 'System User', status: state.users?.length > 0 ? 'Live' : 'Gap', records: state.users?.length || 0 },
                { name: 'Vendor / Partner', status: vendors.length > 0 ? 'Live' : 'Gap', records: vendors.length },
                { name: 'Contract Agreement', status: contracts.length > 0 ? 'Live' : 'Gap', records: contracts.length },
                { name: 'Bid Solicitation', status: solicitations.length > 0 ? 'Live' : 'Gap', records: solicitations.length },
                { name: 'Procurement Package', status: procPkgs.length > 0 ? 'Live' : 'Gap', records: procPkgs.length },
                { name: 'Procurement Plan', status: procPlans.length > 0 ? 'Live' : 'Gap', records: procPlans.length },
                { name: 'Performance Review', status: supReviews.length > 0 ? 'Live' : 'Gap', records: supReviews.length },
                { name: 'Supply Chain Claim', status: claims.length > 0 ? 'Live' : 'Gap', records: claims.length },
                { name: 'Make-or-Buy Case', status: makeBuy.length > 0 ? 'Live' : 'Gap', records: makeBuy.length },
            ]
        },
        {
            name: 'System Architecture',
            icon: Settings,
            description: 'Metadata, schemas, and administration controls.',
            entities: [
                { name: 'EPS Node', status: eps.length > 1 ? 'Live' : 'Gap', records: eps.length },
                { name: 'OBS Node', status: obs.length > 1 ? 'Live' : 'Gap', records: obs.length },
                { name: 'Global Location', status: locations.length > 0 ? 'Live' : 'Gap', records: locations.length },
                { name: 'Work Calendar', status: calendars.length > 0 ? 'Live' : 'Gap', records: calendars.length },
                { name: 'Activity Code', status: actCodes.length > 0 ? 'Live' : 'Gap', records: actCodes.length },
                { name: 'User Defined Field', status: udfs.length > 0 ? 'Live' : 'Gap', records: udfs.length },
                { name: 'Automation Workflow', status: workflows.length > 0 ? 'Live' : 'Gap', records: workflows.length },
                { name: 'Data Sync Job', status: dataJobs.length > 0 ? 'Live' : 'Gap', records: dataJobs.length },
                { name: 'Audit Log Entry', status: auditLog.length > 0 ? 'Live' : 'Gap', records: auditLog.length },
                { name: 'Handshake Alert', status: alerts.length > 0 ? 'Live' : 'Gap', records: alerts.length },
                { name: 'System Integration', status: integrations.length > 0 ? 'Live' : 'Gap', records: integrations.length },
                { name: 'Platform Extension', status: extensions.length > 0 ? 'Live' : 'Gap', records: extensions.length },
                { name: 'Report Definition', status: state.reportDefinitions?.length > 0 ? 'Live' : 'Gap', records: state.reportDefinitions?.length || 0 },
            ]
        }
        ];
    }, [state]);

    const handleGenerateEndpoint = (entityName: string) => {
        setGenerating(entityName);
        setTimeout(() => {
            setGenerating(null);
            alert(`REST and GraphQL endpoints generated for ${entityName}. Schema definitions updated.`);
        }, 1500);
    };

    return {
        dataModel,
        searchTerm,
        setSearchTerm,
        generating,
        handleGenerateEndpoint
    };
};