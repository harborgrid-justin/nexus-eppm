
import { useMemo, useState, useTransition } from 'react';
import { 
    LayoutDashboard, History, Grid, FileCode, UploadCloud, 
    Server, Map, GitMerge, Network, Download 
} from 'lucide-react';
import { NavGroup } from '../../components/common/ModuleNavigation';

export const useDataExchangeLogic = () => {
    const [activeGroup, setActiveGroup] = useState('operations');
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isPending, startTransition] = useTransition();

    const navGroups: NavGroup[] = useMemo(() => [
        { id: 'operations', label: 'Operations', items: [
            { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
            { id: 'history', label: 'Job Logs', icon: History },
        ]},
        { id: 'import_tools', label: 'Ingestion Tools', items: [
            { id: 'excel', label: 'Excel Sync', icon: Grid },
            { id: 'xer', label: 'Schedule Parser', icon: FileCode },
            { id: 'import', label: 'Data Import', icon: UploadCloud },
        ]},
        { id: 'configuration', label: 'Configuration', items: [
            { id: 'erp', label: 'ERP Gateways', icon: Server },
            { id: 'schema', label: 'Schema Map', icon: Map },
            { id: 'designer', label: 'Integration Designer', icon: GitMerge },
            { id: 'connectors', label: 'Connectors', icon: Network },
        ]},
        { id: 'exports', label: 'Outbound', items: [
            { id: 'export', label: 'Export', icon: Download },
        ]}
    ], []);

    const handleGroupChange = (groupId: string) => {
        const newGroup = navGroups.find(g => g.id === groupId);
        if (newGroup?.items.length) {
            startTransition(() => {
                setActiveGroup(groupId);
                setActiveTab(newGroup.items[0].id);
            });
        }
    };

    const handleItemChange = (itemId: string) => {
        startTransition(() => {
            setActiveTab(itemId);
        });
    };

    return {
        activeGroup, activeTab, isPending, navGroups,
        handleGroupChange, handleItemChange
    };
};
