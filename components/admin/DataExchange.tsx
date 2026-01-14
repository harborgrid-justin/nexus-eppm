
import React from 'react';
import { PageHeader } from '../common/PageHeader';
import { ModuleNavigation } from '../common/ModuleNavigation';
import { ErrorBoundary } from '../ErrorBoundary';
import { useDataExchangeLogic } from '../../hooks/domain/useDataExchangeLogic';
import { Database, Loader2 } from 'lucide-react';
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
import { useTheme } from '../../context/ThemeContext';

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
        <div className={`${theme.layout.pagePadding} ${theme.layout.sectionSpacing} flex flex-col h-full w-full max-w-[var(--spacing-container)] mx-auto`}>
            <PageHeader 
                title="Data Exchange Hub" 
                subtitle="Enterprise ETL orchestration, legacy parsing, and ERP connectivity."
                icon={Database}
            />

            <div className={`flex flex-col h-full ${theme.colors.surface} rounded-xl border ${theme.colors.border} shadow-sm overflow-hidden`}>
                <div className={`flex-shrink-0 z-10 rounded-t-xl overflow-hidden border-b ${theme.colors.border} bg-slate-50/50`}>
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
                    {isPending && <div className="absolute inset-0 flex items-center justify-center z-20"><Loader2 className="animate-spin text-nexus-500" /></div>}
                    <ErrorBoundary name="Data Exchange">
                        {renderContent()}
                    </ErrorBoundary>
                </div>
            </div>
        </div>
    );
};

export default DataExchange;
