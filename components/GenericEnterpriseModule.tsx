
import React from 'react';
import { Construction, RefreshCw } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface GenericModuleProps {
  title: string;
  description: string;
  type: 'grid' | 'dashboard' | 'form';
  icon?: any;
}

const GenericEnterpriseModule: React.FC<GenericModuleProps> = ({ title, description, type, icon: Icon = Construction }) => {
  const theme = useTheme();

  return (
    <div className={`h-full flex flex-col ${theme.layout.pagePadding}`}>
       <div className={`${theme.layout.header} mb-6`}>
          <div>
            <h2 className={theme.typography.h2}>
               {title}
            </h2>
            <p className={theme.typography.body}>{description}</p>
          </div>
          <div className="flex gap-2">
             <button className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg flex items-center gap-2 hover:bg-slate-50 shadow-sm text-sm font-medium">
                <RefreshCw size={16} /> Refresh
             </button>
             <button className={`px-4 py-2 ${theme.colors.accentBg} text-white rounded-lg shadow-sm text-sm font-medium hover:bg-nexus-700`}>
                Actions
             </button>
          </div>
       </div>

       <div className={`${theme.colors.surface} border ${theme.colors.border} rounded-xl flex-1 flex flex-col overflow-hidden relative shadow-sm`}>
          {/* Mock Enterprise UI scaffold */}
          <div className={`absolute inset-0 ${theme.colors.background}/50 backdrop-blur-[1px] z-10 flex flex-col items-center justify-center text-center p-8`}>
             <div className={`w-16 h-16 ${theme.colors.surface} rounded-full shadow-sm border ${theme.colors.border} flex items-center justify-center mb-4`}>
                <Icon size={32} className="text-slate-400" />
             </div>
             <h2 className="text-xl font-bold text-slate-800 mb-2">Module Initialized</h2>
             <p className="text-slate-500 max-w-md mb-6">
                The <span className="font-semibold text-nexus-600">{title}</span> module is active. Connect an enterprise data source to populate real-time records.
             </p>
             <div className="flex gap-3">
                <button className="px-4 py-2 bg-white border border-slate-300 rounded-md text-sm font-medium text-slate-700">View Demo Data</button>
                <button className={`px-4 py-2 ${theme.colors.accentBg} rounded-md text-sm font-medium text-white`}>Connect Source</button>
             </div>
          </div>

          {/* Background visuals to make it look "real" behind the blur */}
          <div className="flex-1 p-6 opacity-20 pointer-events-none">
             <div className="h-8 bg-slate-200 w-1/3 mb-6 rounded"></div>
             <div className="space-y-4">
                {[...Array(8)].map((_, i) => (
                   <div key={i} className="h-12 bg-slate-100 w-full rounded border border-slate-200"></div>
                ))}
             </div>
          </div>
       </div>
    </div>
  );
};

export default GenericEnterpriseModule;
