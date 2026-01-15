import React, { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { 
    Layers, Briefcase, DollarSign, Shield, Users, HardHat, Settings, LayoutTemplate, PieChart 
} from 'lucide-react';

export type Domain = 'Strategy & Portfolio' | 'Program Mgmt' | 'Project Controls' | 'Financials' | 'Resources & Supply' | 'Field Ops' | 'Configuration' | 'Unifier / BP';

const DOMAIN_MAP: Record<Domain, { icon: React.ElementType, entities: string[] }> = {
    'Strategy & Portfolio': { icon: Layers, entities: [ 'projects', 'programs', 'strategicGoals', 'strategicDrivers', 'portfolioScenarios', 'governanceDecisions', 'esgMetrics', 'portfolioRisks', 'roadmapLanes', 'roadmapItems', 'benefits' ] },
    'Program Mgmt': { icon: PieChart, entities: [ 'programObjectives', 'programOutcomes', 'programDependencies', 'programChangeRequests', 'programRisks', 'programIssues', 'programStakeholders', 'programCommunicationPlan', 'programAllocations', 'programFundingGates', 'programStageGates', 'programTransitionItems', 'integratedChanges', 'governanceRoles', 'governanceEvents', 'tradeoffScenarios', 'programQualityStandards', 'programAssuranceReviews', 'programArchitectureStandards', 'programArchitectureReviews' ] },
    'Project Controls': { icon: Briefcase, entities: [ 'risks', 'issues', 'communicationLogs', 'documents', 'kanbanTasks', 'qualityReports', 'nonConformanceReports' ] },
    'Financials': { icon: DollarSign, entities: [ 'budgetItems', 'expenses', 'changeOrders', 'purchaseOrders', 'invoices', 'contracts', 'solicitations', 'procurementPlans', 'procurementPackages', 'supplierReviews', 'claims', 'makeOrBuyAnalysis', 'fundingSources', 'costBook', 'expenseCategories' ] },
    'Resources & Supply': { icon: Users, entities: [ 'resources', 'resourceRequests', 'users', 'roles', 'skills', 'timesheets', 'vendors' ] },
    'Field Ops': { icon: HardHat, entities: [ 'dailyLogs', 'safetyIncidents', 'punchList' ] },
    'Configuration': { icon: Settings, entities: [ 'eps', 'obs', 'locations', 'calendars', 'activityCodes', 'userDefinedFields', 'standardTemplates', 'workflows', 'dataJobs', 'integrations', 'extensions', 'etlMappings', 'globalChangeRules', 'issueCodes', 'rbs', 'governance.alerts', 'governance.auditLog', 'staging.records', 'systemMonitoring.metrics' ] },
    'Unifier / BP': { icon: LayoutTemplate, entities: [ 'unifier.records', 'unifier.definitions', 'unifier.costSheet.rows' ] }
};

const resolvePath = (object: any, path: string) => {
    return path.split('.').reduce((o, p) => (o ? o[p] : undefined), object);
};

export const useWarehouseExplorerLogic = () => {
    const { state } = useData();
    const [activeDomain, setActiveDomain] = useState<Domain>('Strategy & Portfolio');
    const [activeEntity, setActiveEntity] = useState<string>('projects');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRecord, setSelectedRecord] = useState<any | null>(null);

    const handleDomainChange = (domain: Domain) => {
        setActiveDomain(domain);
        setActiveEntity(DOMAIN_MAP[domain].entities[0]);
        setSearchTerm('');
    };
    
    const rawData = useMemo(() => resolvePath(state, activeEntity), [state, activeEntity]);
    const currentData = Array.isArray(rawData) ? rawData : [];

    const filteredData = useMemo(() => {
        if (!currentData) return [];
        if (!searchTerm) return currentData;
        const lowerTerm = searchTerm.toLowerCase();
        return currentData.filter(item => 
            Object.values(item).some(val => 
                String(val).toLowerCase().includes(lowerTerm)
            )
        );
    }, [currentData, searchTerm]);

    return {
        state,
        activeDomain,
        activeEntity,
        searchTerm,
        setSearchTerm,
        selectedRecord,
        setSelectedRecord,
        handleDomainChange,
        setActiveEntity,
        filteredData,
        DOMAIN_MAP
    };
};