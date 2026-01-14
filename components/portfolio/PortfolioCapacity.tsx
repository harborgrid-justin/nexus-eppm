
import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { LayoutGrid, BarChart2 } from 'lucide-react';
import { usePortfolioCapacityLogic } from '../../hooks/domain/usePortfolioCapacityLogic';
import { CapacityHeatmap } from './capacity/CapacityHeatmap';

const PortfolioCapacity: React.FC = () => {
    const theme = useTheme();
    const { 
        isPending, viewMode, monthBuckets, resourceMatrix, 
        displayResources, changeViewMode 
    } = usePortfolioCapacityLogic();

    return (
        <div className={`h-full flex flex-col ${theme.layout.pagePadding} ${theme.layout.sectionSpacing} animate-in fade-in`}>
            <div className="flex justify-between items-center">
                <h2 className={theme.typography.h2}>Portfolio Capacity Matrix</h2>
                <div className="bg-white border border-slate-200 rounded-lg p-1 flex text-xs font-medium shadow-sm">
                    <button onClick={() => changeViewMode('chart')} className={`flex items-center gap-1 px-4 py-1.5 rounded transition-colors ${viewMode === 'chart' ? 'bg-nexus-100 text-nexus-700 font-bold' : 'text-slate-600'}`}><BarChart2 size={14}/> Chart</button>
                    <button onClick={() => changeViewMode('heatmap')} className={`flex items-center gap-1 px-4 py-1.5 rounded transition-colors ${viewMode === 'heatmap' ? 'bg-nexus-100 text-nexus-700 font-bold' : 'text-slate-600'}`}><LayoutGrid size={14}/> Heatmap</button>
                </div>
            </div>

            {viewMode === 'heatmap' ? (
                <CapacityHeatmap resources={displayResources} monthBuckets={monthBuckets} matrix={resourceMatrix} />
            ) : (
                <div className="flex-1 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center text-slate-400">
                    Portfolio Capacity Chart Visualization (Aggregated Demand)
                </div>
            )}
        </div>
    );
};
export default PortfolioCapacity;
