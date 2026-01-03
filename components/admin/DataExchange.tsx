
import React, { useState, useTransition, useMemo } from 'react';
import { Database, LayoutDashboard, GitMerge, Network, History, Map, Download, UploadCloud } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { ExchangeDashboard } from './data/ExchangeDashboard';
import { IntegrationDesigner } from './data/IntegrationDesigner';
import { ConnectorConfig } from './data/ConnectorConfig';
import { JobHistory } from './data/JobHistory';
import { SchemaGapAnalysis } from './data/SchemaGapAnalysis';
import { ExportPanel } from './data/ExportPanel';
import { ImportPanel } from './data/ImportPanel';
import { PageHeader } from '../common/PageHeader';
import { ModuleNavigation, NavGroup } from '../common/ModuleNavigation';
import { ErrorBoundary } from '../ErrorBoundary';

const DataExchange: React.FC = () => {
    const theme = useTheme();
    const [activeGroup, setActiveGroup] = useState('operations');
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isPending, startTransition] = useTransition();

    const navGroups: NavGroup[] = useMemo(() => [
        { id: 'operations', label: 'Operations', items: [
            { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
            { id: 'history', label: 'Job Logs', icon: History },
        ]},
        { id: 'configuration', label: 'Configuration', items: [
            { id: 'schema', label: 'Schema Map', icon: Map },
            { id: 'designer', label: 'Integration Designer', icon: GitMerge },
            { id: 'connectors', label: 'Connectors', icon: Network },
        ]},
        { id: 'tools', label: 'Tools', items: [
            { id: 'import', label: 'Import', icon: UploadCloud },
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

    const renderContent = () => {
        switch(activeTab) {
            case 'dashboard': return <ExchangeDashboard />;
            case 'designer': return <IntegrationDesigner />;
            case 'connectors': return <ConnectorConfig />;
            case 'schema': return <SchemaGapAnalysis />;
            case 'history': return <JobHistory />;
            case 'export': return <ExportPanel />;
            case 'import': return <ImportPanel />;
            default: return <ExchangeDashboard />;
        }
    };

    return (
        <div className={`${theme.layout.pageContainer} ${theme.layout.pagePadding} ${theme.layout.sectionSpacing} flex flex-col h-full`}>
            <PageHeader 
                title="Data Exchange Hub" 
                subtitle="Enterprise ETL orchestration, connectivity, and schema mapping."
                icon={Database}
            />

            <div className={theme.layout.panelContainer}>
                <div className={`flex-shrink-0 z-10 rounded-t-xl overflow-hidden ${theme.layout.headerBorder} bg-slate-50/50`}>
                    <ModuleNavigation 
                        groups={navGroups}
                        activeGroup={activeGroup}
                        activeItem={activeTab}
                        onGroupChange={handleGroupChange}
                        onItemChange={handleItemChange}
                        className="bg-transparent border-0 shadow-none"
                    />
                </div>
                
                <div className={`flex-1 overflow-hidden relative transition-opacity duration-200 ${isPending ? 'opacity-70' : 'opacity-100'}`}>
                    <ErrorBoundary name="Data Exchange">
                        {renderContent()}
                    </ErrorBoundary>
                </div>
            </div>
        </div>
    );
};

export default DataExchange;
