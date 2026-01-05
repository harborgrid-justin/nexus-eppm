
import React, { useMemo } from 'react';
import { Database, LayoutDashboard, GitMerge, Network, History, Map, Download, UploadCloud, FileCode, Grid, Server } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { ExchangeDashboard } from './data/ExchangeDashboard';
import { IntegrationDesigner } from './data/IntegrationDesigner';
import { ConnectorConfig } from './data/ConnectorConfig';
import { JobHistory } from './data/JobHistory';
import { SchemaGapAnalysis } from './data/SchemaGapAnalysis';
import { ExportPanel } from './data/ExportPanel';
import { ImportPanel } from './data/ImportPanel';
import { ExcelSync } from './data/ExcelSync';
import { XerParser } from './data/XerParser';
import { ErpConnector } from './data/ErpConnector';
import { PageHeader } from '../common/PageHeader';
import { ModuleNavigation } from '../common/ModuleNavigation';
import { ErrorBoundary } from '../ErrorBoundary';
import { useDataExchangeLogic } from '../../hooks/domain/useDataExchangeLogic';

const DataExchange: React.FC = () => {
    const theme = useTheme();
    const {
        activeGroup,
        activeTab,
        isPending,
        navGroups,
        handleGroupChange,
        handleItemChange
    } = useDataExchangeLogic();
    
    const renderContent = () => {
        switch(activeTab) {
            case 'dashboard': return <ExchangeDashboard />;
            case 'excel': return <ExcelSync />;
            case 'xer': return <XerParser />;
            case 'erp': return <ErpConnector />;
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
                subtitle="Enterprise ETL orchestration, legacy parsing, and ERP connectivity."
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
