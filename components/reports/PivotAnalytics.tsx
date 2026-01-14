import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Table, BarChart2, Download, Layers, Activity, Filter, RefreshCw } from 'lucide-react';
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
        <div className={`h-full flex flex-col ${theme.layout.pagePadding} bg-slate-50/50 animate-in fade-in duration-500`}>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 border-b border-slate-100 pb-6">
                <div className="flex items-center gap-5">
                    <div className="p-4 bg-slate-900 text-white rounded-2xl shadow-xl shadow-slate-900/20"><Activity size={28}/></div>
                    <div>
                        <h2 className={`text-2xl font-black ${theme.colors.text.primary} uppercase tracking-tighter`}>Multidimensional Analytics Engine</h2>
                        <p className={`text-sm ${theme.colors.text.secondary} font-medium mt-1`}>Dynamic ad-hoc pivot engine for high-density portfolio introspection.</p>
                    </div>
                </div>
                <div className="flex gap-4 items-center">
                    <div className={`flex ${theme.colors.background} p-1.5 rounded-2xl border ${theme.colors.border} shadow-inner`}>
                        <button onClick={() => setViewMode('Table')} className={`px-5 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${viewMode === 'Table' ? `${theme.colors.surface} shadow-md text-nexus-700` : `${theme.colors.text.tertiary} hover:text-nexus-600`}`}><Table size={14} className="inline mr-2"/> Ledger</button>
                        <button onClick={() => setViewMode('Chart')} className={`px-5 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${viewMode === 'Chart' ? `${theme.colors.surface} shadow-md text-nexus-700` : `${theme.colors.text.tertiary} hover:text-nexus-600`}`}><BarChart2 size={14} className="inline mr-2"/> Heatmap</button>
                    </div>
                    <Button variant="outline" size="md" icon={Download} disabled={!hasData} className="font-bold uppercase tracking-widest text-[10px] h-10">Export Dataset</Button>
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

            <div className={`flex-1 ${theme.colors.surface} rounded-[2.5rem] border ${theme.colors.border} shadow-sm overflow-hidden flex flex-col relative`}>
                {!hasData ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-12">
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
        </div>
    );
};

export default PivotAnalytics;