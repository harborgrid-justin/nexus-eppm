
import { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { Layers, Briefcase, DollarSign, Shield, Users, HardHat, Settings, LayoutTemplate, PieChart } from 'lucide-react';

export type Domain = 'Strategy & Portfolio' | 'Program Mgmt' | 'Project Controls' | 'Financials' | 'Resources & Supply' | 'Field Ops' | 'Configuration' | 'Unifier / BP';

const DOMAIN_MAP: Record<Domain, { icon: any, entities: string[] }> = {
    'Strategy & Portfolio': { icon: Layers, entities: [ 'projects', 'programs', 'strategicGoals', 'portfolioScenarios', 'governanceDecisions', 'esgMetrics', 'portfolioRisks', 'roadmapLanes', 'roadmapItems', 'benefits' ] },
    'Program Mgmt': { icon: PieChart, entities: [ 'programObjectives', 'programOutcomes', 'programRisks', 'programIssues', 'programStakeholders', 'programCommunicationPlan', 'programAllocations' ] },
    'Project Controls': { icon: Briefcase, entities: [ 'risks', 'issues', 'communicationLogs', 'documents' ] },
    'Financials': { icon: DollarSign, entities: [ 'budgetItems', 'expenses', 'changeOrders', 'purchaseOrders', 'invoices', 'contracts' ] },
    'Resources & Supply': { icon: Users, entities: [ 'resources', 'resourceRequests', 'users', 'roles', 'timesheets', 'vendors' ] },
    'Field Ops': { icon: HardHat, entities: [ 'dailyLogs', 'safetyIncidents', 'punchList' ] },
    'Configuration': { icon: Settings, entities: [ 'eps', 'obs', 'locations', 'calendars', 'activityCodes', 'userDefinedFields', 'workflows', 'integrations' ] },
    'Unifier / BP': { icon: LayoutTemplate, entities: [ 'unifier.records', 'unifier.definitions', 'unifier.costSheet.rows' ] }
};

const resolvePath = (object: any, path: string) => path.split('.').reduce((o, p) => (o ? o[p] : undefined), object);

export const useWarehouseExplorerLogic = () => {
    const { state } = useData();
    const [activeDomain, setActiveDomain] = useState<Domain>('Strategy & Portfolio');
    const [activeEntity, setActiveEntity] = useState<string>('projects');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRecord, setSelectedRecord] = useState<any | null>(null);

    const filteredData = useMemo(() => {
        const raw = resolvePath(state, activeEntity);
        const data = Array.isArray(raw) ? raw : [];
        if (!searchTerm) return data;
        const term = searchTerm.toLowerCase();
        return data.filter(item => Object.values(item).some(val => String(val).toLowerCase().includes(term)));
    }, [state, activeEntity, searchTerm]);

    return {
        activeDomain, activeEntity, searchTerm, setSearchTerm, selectedRecord, setSelectedRecord,
        handleDomainChange: (d: Domain) => { setActiveDomain(d); setActiveEntity(DOMAIN_MAP[d].entities[0]); setSearchTerm(''); },
        setActiveEntity, filteredData, DOMAIN_MAP
    };
};
