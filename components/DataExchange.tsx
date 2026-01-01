
import React, { useState } from 'react';
import { Database, LayoutDashboard, GitMerge, Network, History, Map, Download, UploadCloud } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { ExchangeDashboard } from './admin/data/ExchangeDashboard';
import { IntegrationDesigner } from './admin/data/IntegrationDesigner';
import { ConnectorConfig } from './admin/data/ConnectorConfig';
import { JobHistory } from './admin/data/JobHistory';
import { SchemaGapAnalysis } from './admin/data/SchemaGapAnalysis';
import { ExportPanel } from './admin/data/ExportPanel';
import { ImportPanel } from './admin/data/ImportPanel';

const DataExchange: React.FC = () => {
    const theme = useTheme();
    const [activeTab, setActiveTab] = useState('dashboard');

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
        <div className={`${theme.layout.pageContainer} ${theme.layout.pagePadding} flex flex-col h-full`}>
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-6 gap-4">
                <div>
                    <h1 className={theme.typography.h1}>
                        <Database className="text-nexus-600" /> Data Exchange Hub
                    </h1>
                    <p className={theme.typography.small}>Enterprise ETL orchestration, connectivity, and schema mapping.</p>
                </div>
                
                {/* Navigation Tabs */}
                <div className={`${theme.colors.surface} border ${theme.colors.border} p-1 rounded-lg flex shadow-sm overflow-x-auto max-w-full scrollbar-hide`}>
                    {[
                        { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
                        { id: 'schema', label: 'Schema Map', icon: Map },
                        { id: 'designer', label: 'Integration Designer', icon: GitMerge },
                        { id: 'connectors', label: 'Connectors', icon: Network },
                        { id: 'import', label: 'Import', icon: UploadCloud },
                        { id: 'export', label: 'Export', icon: Download },
                        { id: 'history', label: 'Logs', icon: History },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-md transition-all whitespace-nowrap ${
                                activeTab === tab.id 
                                ? `${theme.colors.background} text-nexus-700 shadow-sm ring-1 ring-slate-200` 
                                : `${theme.colors.text.secondary} hover:${theme.colors.text.primary} hover:${theme.colors.background}`
                            }`}
                        >
                            <tab.icon size={16} />
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 overflow-hidden min-h-0 relative">
                {renderContent()}
            </div>
        </div>
    );
};

export default DataExchange;
