import { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { Project } from '../../types';

type PivotField = 'Category' | 'Status' | 'Health' | 'Manager' | 'EPS';
type AggregateField = 'Budget' | 'Spent' | 'Count';

export const usePivotAnalyticsLogic = () => {
    const { state } = useData();
    
    const [rowField, setRowField] = useState<PivotField>('Category');
    const [colField, setColField] = useState<PivotField>('Status');
    const [valField, setValField] = useState<AggregateField>('Budget');
    const [viewMode, setViewMode] = useState<'Table' | 'Chart'>('Table');

    // Dynamic Pivot Logic
    const pivotData = useMemo(() => {
        const rows = new Set<string>();
        const cols = new Set<string>();
        const values: Record<string, number> = {};

        state.projects.forEach(p => {
            const getFieldVal = (field: PivotField, item: Project): string => {
                switch(field) {
                    case 'Category': return item.category || 'Unassigned';
                    case 'Status': return item.status || 'Draft';
                    case 'Health': return item.health || 'Unknown';
                    case 'Manager': return item.managerId || 'Unassigned';
                    case 'EPS': return item.epsId || 'Root';
                    default: return 'N/A';
                }
            };
            
            const r = getFieldVal(rowField, p);
            const c = getFieldVal(colField, p);
            
            rows.add(r);
            cols.add(c);
            
            const key = `${r}::${c}`;
            const val = valField === 'Count' ? 1 : (valField === 'Budget' ? p.budget : p.spent);
            values[key] = (values[key] || 0) + val;
        });

        const rowKeys = Array.from(rows).sort();
        const colKeys = Array.from(cols).sort();
        
        // Prepare Chart Data
        const chartData = rowKeys.map(r => {
            const item: Record<string, string | number> = { name: r };
            colKeys.forEach(c => {
                item[c] = values[`${r}::${c}`] || 0;
            });
            return item;
        });

        return { rowKeys, colKeys, values, chartData };
    }, [state.projects, rowField, colField, valField]);

    return {
        rowField, setRowField,
        colField, setColField,
        valField, setValField,
        viewMode, setViewMode,
        pivotData
    };
};