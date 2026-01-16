
import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Table, BarChart2, Download, Layers, Activity } from 'lucide-react';
import { Button } from '../ui/Button';
import { usePivotAnalyticsLogic } from '../../hooks/domain/usePivotAnalyticsLogic';
import { EmptyGrid } from '../common/EmptyGrid';
import { useData } from '../../context/DataContext';
import { PivotConfigPanel } from './pivot/PivotConfigPanel';
import { PivotView } from './pivot/PivotView';
import { PageLayout } from '../layout/standard/PageLayout';
import { PanelContainer } from '../layout/standard/PanelContainer';

const PivotAnalytics: React.FC = () => {
    const theme = useTheme();
    const { state } = useData();
    const {
        rowField, setRowField,
        colField, setColField,
        valField, setValField,
        viewMode, setViewMode,
        pivotData
    } = usePivotAnalyticsLogic();

    const hasData = pivotData.rowKeys.length > 0 && pivotData.colKeys.length > 0;

    const availablePivotFields = React.useMemo(() => {
        if (state.projects.length === 0) return ['Category', 'Status', 'Health', 'Manager', 'EPS'];
        const sample = state.projects[0];
        const keys = Object.keys(sample).filter(k => 
            typeof (sample as any)[k] === 'string' && 
            !['id', 'code', 'startDate', 'endDate', 'description', 'businessCase'].includes(k)
        );
        return keys.map(k => k.charAt(0).toUpperCase() + k.slice(1));
    }, [state.projects]);

    const availableAggregateFields = ['Budget', 'Spent', 'Count'];

    const headerActions = (
        <div className="flex gap-4 items-center">
            <div className={`flex ${theme.colors.background} p-1 rounded-lg border ${theme.colors.border} shadow-inner`}>
                <button onClick={() => setViewMode('Table')} className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-md transition-all ${viewMode === 'Table' ? `${theme.colors.surface} shadow-sm text-nexus-700` : `${theme.colors.text.tertiary} hover:text-nexus-600`}`}><Table size={14} className="inline mr-2"/> Ledger</button>
                <button onClick={() => setViewMode('Chart')} className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-md transition-all ${viewMode === 'Chart' ? `${theme.colors.surface} shadow-sm text-nexus-700` : `${theme.colors.text.tertiary} hover:text-nexus-600`}`}><BarChart2 size={14} className="inline mr-2"/> Heatmap</button>
            </div>
            <Button variant="outline" size="sm" icon={Download} disabled={!hasData} className="font-bold uppercase tracking-widest text-[10px] h-9">Export Dataset</Button>
        </div>
    );

    return (
        <PageLayout
            title="Multidimensional Analytics Engine"
            subtitle="Dynamic ad-hoc pivot engine for high-density portfolio introspection."
            icon={Activity}
            actions={headerActions}
        >
            <PanelContainer 
                header={
                    <PivotConfigPanel 
                        rowField={rowField} setRowField={setRowField as any}
                        colField={colField} setColField={setColField as any}
                        valField={valField} setValField={setValField as any}
                        availablePivotFields={availablePivotFields}
                        availableAggregateFields={availableAggregateFields}
                        onRecalculate={() => {}}
                    />
                }
            >
                <div className={`flex-1 overflow-hidden relative`}>
                    {!hasData ? (
                        <div className="flex-1 flex flex-col items-center justify-center p-12 h-full">
                            <EmptyGrid 
                                title="Analytics Buffer Neutral"
                                description="Configure your multidimensional pivot axes to generate a results set from the enterprise graph."
                                icon={Layers}
                                actionLabel="Define Search Axes"
                                onAdd={() => {}}
                            />
                        </div>
                    ) : (
                        <PivotView 
                            viewMode={viewMode} 
                            pivotData={pivotData} 
                            valField={valField}
                            rowField={rowField}
                            colField={colField}
                        />
                    )}
                </div>
            </PanelContainer>
        </PageLayout>
    );
};

export default PivotAnalytics;
