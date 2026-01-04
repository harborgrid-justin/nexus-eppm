
import React, { useState, useMemo } from 'react';
import { Landmark, Truck, Users, LayoutDashboard } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { formatCompactCurrency } from '../../utils/formatters';
import { useData } from '../../context/DataContext';
import { calculateProjectProgress } from '../../utils/calculations';
import { ProgressBar } from '../common/ProgressBar';

type Department = 'Governor' | 'DOT' | 'HHS' | 'Education';

const StateGovSuite: React.FC = () => {
  const theme = useTheme();
  const { state } = useData();
  const [activeAgency, setActiveAgency] = useState<Department>('Governor');

  // Dynamic Filtering Logic
  const getProjectsByCategory = (keywords: string[]) => {
      return state.projects.filter(p => 
          keywords.some(k => (p.category || '').toLowerCase().includes(k.toLowerCase()) || (p.name || '').toLowerCase().includes(k.toLowerCase()))
      );
  };

  const renderAgencyDashboard = (title: string, keywords: string[], icon: React.ReactNode) => {
      const relevantProjects = keywords.length === 0 ? state.projects : getProjectsByCategory(keywords);
      const totalBudget = relevantProjects.reduce((sum, p) => sum + p.budget, 0);
      const activeCount = relevantProjects.filter(p => p.status === 'Active').length;
      
      return (
        <div className="p-6 space-y-6 animate-in fade-in duration-300">
             <div className="flex flex-col md:flex-row items-center gap-6 p-6 bg-white rounded-xl shadow-sm border border-slate-200">
                 <div className="p-4 bg-slate-100 rounded-full text-slate-500">{icon}</div>
                 <div>
                     <h3 className="text-2xl font-bold text-slate-800">{title}</h3>
                     <p className="text-slate-500 mt-1">{activeCount} Active Initiatives • {formatCompactCurrency(totalBudget)} Total Budget</p>
                 </div>
             </div>
             
             {relevantProjects.length > 0 ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                     {relevantProjects.map(p => {
                         const progress = calculateProjectProgress(p);
                         return (
                             <Card key={p.id} className="p-5 flex flex-col justify-between h-full hover:border-nexus-300 transition-colors">
                                 <div>
                                     <div className="flex justify-between items-start mb-2">
                                         <h4 className="font-bold text-slate-900 line-clamp-2">{p.name}</h4>
                                         <Badge variant={p.health === 'Good' ? 'success' : p.health === 'Warning' ? 'warning' : 'danger'}>{p.health}</Badge>
                                     </div>
                                     <p className="text-xs text-slate-500 font-mono mb-4">{p.code}</p>
                                 </div>
                                 <div>
                                     <div className="flex justify-between text-xs mb-1">
                                        <span className="text-slate-500 font-medium">Progress</span>
                                        <span className="font-bold text-slate-700">{progress}%</span>
                                     </div>
                                     <ProgressBar value={progress} size="sm" />
                                     <div className="mt-3 pt-3 border-t border-slate-100 flex justify-between text-xs">
                                         <span className="text-slate-500">Budget: {formatCompactCurrency(p.budget)}</span>
                                         <span className="text-slate-500">Spent: {formatCompactCurrency(p.spent)}</span>
                                     </div>
                                 </div>
                             </Card>
                         )
                     })}
                 </div>
             ) : (
                 <div className="p-16 text-center text-slate-400 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
                     <p className="font-medium">No active projects found for this agency.</p>
                     <p className="text-xs mt-1">Check project categories or create new initiatives.</p>
                 </div>
             )}
        </div>
      );
  };

  return (
    <div className={`h-full flex flex-col ${theme.layout.pagePadding}`}>
        <div className="flex justify-between items-center mb-6">
            <div>
                <h1 className={theme.typography.h1}>
                    <Landmark className="text-blue-800" /> State Government Platform
                </h1>
                <p className={theme.typography.small}>Agency Capital Program Management</p>
            </div>
            <div className={`flex ${theme.colors.surface} border border-slate-200 rounded-lg p-1`}>
                <button onClick={() => setActiveAgency('Governor')} className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md ${activeAgency === 'Governor' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-500 hover:text-slate-700'}`}>
                    <Landmark size={14}/> Executive
                </button>
                <button onClick={() => setActiveAgency('DOT')} className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md ${activeAgency === 'DOT' ? 'bg-orange-50 text-orange-700 font-bold' : 'text-slate-500 hover:text-slate-700'}`}>
                    <Truck size={14}/> DOT
                </button>
                <button onClick={() => setActiveAgency('HHS')} className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md ${activeAgency === 'HHS' ? 'bg-green-50 text-green-700 font-bold' : 'text-slate-500 hover:text-slate-700'}`}>
                    <Users size={14}/> HHS
                </button>
                <button onClick={() => setActiveAgency('Education')} className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md ${activeAgency === 'Education' ? 'bg-purple-50 text-purple-700 font-bold' : 'text-slate-500 hover:text-slate-700'}`}>
                    <LayoutDashboard size={14}/> Education
                </button>
            </div>
        </div>

        <div className="flex-1 overflow-y-auto bg-slate-50/50 rounded-xl border border-slate-200">
            {activeAgency === 'Governor' && renderAgencyDashboard("Governor's Office Dashboard", [], <Landmark size={32}/>)}
            {activeAgency === 'DOT' && renderAgencyDashboard("Department of Transportation", ['Infrastructure', 'Transport', 'Road', 'Bridge'], <Truck size={32}/>)}
            {activeAgency === 'HHS' && renderAgencyDashboard("Health & Human Services", ['Health', 'Medical', 'Clinic'], <Users size={32}/>)}
            {activeAgency === 'Education' && renderAgencyDashboard("Department of Education", ['School', 'Education', 'University'], <LayoutDashboard size={32}/>)}
        </div>
    </div>
  );
};

export default StateGovSuite;
