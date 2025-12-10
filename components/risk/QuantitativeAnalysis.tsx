
import React from 'react';
import { BarChart2 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface QuantitativeAnalysisProps {
  projectId: string;
}

const QuantitativeAnalysis: React.FC<QuantitativeAnalysisProps> = ({ projectId }) => {
  const theme = useTheme();

  return (
    <div className={`h-full overflow-y-auto ${theme.layout.pagePadding} ${theme.layout.sectionSpacing}`}>
        <div className={theme.layout.header}>
          <div>
            <h1 className={theme.typography.h1}>
              <BarChart2 className="text-nexus-600" /> Quantitative Risk Analysis
            </h1>
            <p className={theme.typography.small}>Model the combined effect of risks on project objectives.</p>
          </div>
          <button className={`px-4 py-2 ${theme.colors.accentBg} text-white rounded-lg flex items-center gap-2 hover:bg-nexus-700 shadow-sm text-sm font-medium`}>
             Run Simulation
          </button>
       </div>

       <div className={`${theme.colors.surface} rounded-xl shadow-sm border ${theme.colors.border} flex-1 flex flex-col overflow-hidden relative`}>
          <div className={`absolute inset-0 ${theme.colors.background}/50 backdrop-blur-[1px] z-10 flex flex-col items-center justify-center text-center p-8`}>
             <div className={`w-16 h-16 ${theme.colors.surface} rounded-full shadow-sm border ${theme.colors.border} flex items-center justify-center mb-4`}>
                <BarChart2 size={32} className="text-slate-400" />
             </div>
             <h2 className="text-xl font-bold text-slate-800 mb-2">Module Provisioned</h2>
             <p className="text-slate-500 max-w-md mb-6">
                The <span className="font-semibold text-nexus-600">Quantitative Analysis Engine</span> is available. This module supports Monte Carlo simulation and sensitivity analysis. Connect a licensed analytics engine to run models.
             </p>
             <div className="flex gap-3">
                <button className="px-4 py-2 bg-white border border-slate-300 rounded-md text-sm font-medium text-slate-700">View Documentation</button>
                <button className={`px-4 py-2 ${theme.colors.accentBg} rounded-md text-sm font-medium text-white`}>Configure Engine</button>
             </div>
          </div>

          <div className="flex-1 p-6 opacity-20 pointer-events-none grid grid-cols-2 gap-6">
             <div>
                <div className="h-8 bg-slate-200 w-2/3 mb-4 rounded"></div>
                <div className="h-48 bg-slate-100 w-full rounded border border-slate-200"></div>
             </div>
             <div>
                <div className="h-8 bg-slate-200 w-1/2 mb-4 rounded"></div>
                <div className="h-48 bg-slate-100 w-full rounded border border-slate-200"></div>
             </div>
          </div>
       </div>
    </div>
  );
};

export default QuantitativeAnalysis;
