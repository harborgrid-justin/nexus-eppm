
import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Table, BarChart2, Download, Layers } from 'lucide-react';
import { Button } from '../ui/Button';
import { usePivotAnalyticsLogic } from '../../hooks/domain/usePivotAnalyticsLogic';
import { EmptyGrid } from '../common/EmptyGrid';
import { useData } from '../../context/DataContext';
import { PivotConfigPanel } from './pivot/PivotConfigPanel';
import { PivotView } from './pivot/PivotView';

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

    return (
        <div className={`h-full flex flex-col ${theme.layout.pagePadding}`}>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                    <h2 className={theme.typography.h2}>Ad-Hoc Analytics Engine</h2>
                    <p className={theme.typography.small}>Multidimensional analysis of portfolio performance.</p>
                </div>
                <div className="flex gap-2">
                    <div className={`flex ${theme.colors.background} p-1 rounded-lg border ${theme.colors.border}`}>
                        <button onClick={() => setViewMode('Table')} className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${viewMode === 'Table' ? `${theme.colors.surface} shadow text-nexus-700` : `${theme.colors.text.secondary}`}`}><Table size={14} className="inline mr-1"/> Table</button>
                        <button onClick={() => setViewMode('Chart')} className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${viewMode === 'Chart' ? `${theme.colors.surface} shadow text-nexus-700` : `${theme.colors.text.secondary}`}`}><BarChart2 size={14} className="inline mr-1"/> Chart</button>
                    </div>
                    <Button variant="outline" size="sm" icon={Download} disabled={!hasData}>Export</Button>
                </div>
            </div>

            <PivotConfigPanel 
                rowField={rowField} setRowField={setRowField as any}
                colField={colField} setColField={setColField as any}
                valField={valField} setValField={setValField as any}
                availablePivotFields={availablePivotFields}
                availableAggregateFields={availableAggregateFields}
                onRecalculate={() => {}}
            />

            <div className={`flex-1 ${theme.colors.surface} rounded-xl border ${theme.colors.border} shadow-sm overflow-hidden flex flex-col`}>
                {!hasData ? (
                    <div className="flex-1 flex flex-col items-center justify-center">
                         <EmptyGrid 
                            title="Analytics Buffer Empty"
                            description="Adjust your pivot dimensions above to generate a multidimensional result set from the project ledger."
                            icon={Layers}
                            actionLabel="Define Dimensions"
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
        </div>
    );
};

export default PivotAnalytics;
