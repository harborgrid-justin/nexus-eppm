import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Briefcase, ArrowRight, TrendingUp, AlertTriangle, FolderOpen } from 'lucide-react';
import StatCard from './shared/StatCard';
import { useTheme } from '../context/ThemeContext';
import { formatCompactCurrency, formatPercentage, getHealthColorClass, formatInitials } from '../utils/formatters';

const ProgramManager: React.FC = () => {
  const { state } = useData();
  const [selectedProgramId, setSelectedProgramId] = useState<string | null>(null);
  const theme = useTheme();

  const selectedProgram = state.programs.find(p => p.id === selectedProgramId);
  const programProjects = state.projects.filter(p => p.programId === selectedProgramId);

  // Render List of Programs
  if (!selectedProgram) {
    return (
      <div className={`${theme.layout.pageContainer} ${theme.layout.pagePadding} ${theme.layout.sectionSpacing}`}>
         <div className={theme.layout.header}>
            <div>
                <h1 className={theme.typography.h1}>
                <Briefcase className="text-nexus-600" /> Program Management
                </h1>
                <p className={theme.typography.small}>Manage coordinated groups of related projects to obtain benefits not available from managing them individually.</p>
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {state.programs.map(program => (
               <div 
                  key={program.id} 
                  onClick={() => setSelectedProgramId(program.id)}
                  className={`${theme.colors.surface} rounded-xl border ${theme.colors.border} p-6 shadow-sm hover:shadow-md transition-all cursor-pointer group`}
               >
                  <div className="flex justify-between items-start mb-4">
                     <div className="w-10 h-10 bg-nexus-50 text-nexus-600 rounded-lg flex items-center justify-center">
                        <Briefcase size={20} />
                     </div>
                     <span className={`px-2 py-1 rounded text-xs font-bold ${getHealthColorClass(program.health)}`}>
                        {program.health}
                     </span>
                  </div>
                  <h3 className={`${theme.typography.h3} group-hover:text-nexus-600 transition-colors mb-2`}>{program.name}</h3>
                  <p className={`${theme.typography.body} text-slate-500 mb-4 line-clamp-2`}>{program.description}</p>
                  
                  <div className="flex justify-between items-center text-sm text-slate-600 border-t border-slate-100 pt-4">
                     <span>{state.projects.filter(p => p.programId === program.id).length} Projects</span>
                     <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform text-nexus-600 font-medium">
                        View Dashboard <ArrowRight size={14} />
                     </span>
                  </div>
               </div>
            ))}
         </div>
      </div>
    );
  }

  // Render Single Program Workspace
  const totalBudget = programProjects.reduce((sum, p) => sum + p.budget, 0);
  const totalSpent = programProjects.reduce((sum, p) => sum + p.spent, 0);
  const openRisks = state.risks.filter(r => programProjects.some(p => p.id === r.projectId) && r.status === 'Open').length;
  const utilization = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  return (
    <div className={theme.layout.pageContainer}>
       {/* Header */}
       <div className={`${theme.colors.surface} ${theme.layout.headerBorder} px-6 py-4 flex justify-between items-center flex-shrink-0`}>
          <div>
             <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
                <button onClick={() => setSelectedProgramId(null)} className="hover:text-nexus-600 hover:underline">Programs</button>
                <span>/</span>
                <span>{selectedProgram.id}</span>
             </div>
             <h1 className={theme.typography.h1}>{selectedProgram.name}</h1>
          </div>
          <div className="flex gap-2">
             <button className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">Edit Program</button>
             <button className={`px-4 py-2 ${theme.colors.accentBg} text-white rounded-lg text-sm font-medium hover:bg-nexus-700`}>Add Project</button>
          </div>
       </div>

       {/* Content */}
       <div className={`flex-1 overflow-y-auto p-6 ${theme.layout.sectionSpacing}`}>
          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
             <StatCard title="Program Budget" value={formatCompactCurrency(totalBudget)} subtext="Aggregated from projects" icon={TrendingUp} />
             <StatCard title="Total Spent" value={formatCompactCurrency(totalSpent)} subtext={`${formatPercentage(utilization)} Utilization`} icon={TrendingUp} trend="up" />
             <StatCard title="Active Projects" value={programProjects.length} subtext="In this program" icon={FolderOpen} />
             <StatCard title="Program Risks" value={openRisks} subtext="High-level risks" icon={AlertTriangle} trend={openRisks > 0 ? 'down' : 'up'} />
          </div>

          {/* Benefits & Description */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
             <div className={`lg:col-span-2 ${theme.colors.surface} rounded-xl border ${theme.colors.border} p-6 shadow-sm`}>
                <h3 className={`${theme.typography.h3} mb-4`}>Program Benefits</h3>
                <div className="p-4 bg-green-50 border border-green-100 rounded-lg text-green-800 text-sm">
                   {selectedProgram.benefits}
                </div>
                <h3 className={`${theme.typography.h3} mt-6 mb-4`}>Constituent Projects</h3>
                <div className="space-y-3">
                   {programProjects.map(p => (
                      <div key={p.id} className={`flex items-center justify-between p-3 border ${theme.colors.border} rounded-lg hover:bg-slate-50`}>
                         <div className="flex items-center gap-3">
                            <div className={`w-2 h-12 rounded-full ${getHealthColorClass(p.health).replace('bg-', '').split(' ')[0]}`}></div>
                            <div>
                               <p className="font-semibold text-slate-900">{p.name}</p>
                               <p className="text-xs text-slate-500">{p.manager} • {p.health}</p>
                            </div>
                         </div>
                         <div className="text-right">
                            <p className="text-sm font-bold text-slate-800">{formatCompactCurrency(p.budget)}</p>
                            <p className="text-xs text-slate-500">Budget</p>
                         </div>
                      </div>
                   ))}
                   {programProjects.length === 0 && <p className="text-slate-500 text-sm italic">No projects assigned to this program.</p>}
                </div>
             </div>

             <div className={`${theme.colors.surface} rounded-xl border ${theme.colors.border} p-6 shadow-sm`}>
                <h3 className={`${theme.typography.h3} mb-4`}>Program Manager</h3>
                <div className="flex items-center gap-3 mb-6">
                   <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-lg">
                      {formatInitials(selectedProgram.manager)}
                   </div>
                   <div>
                      <p className="font-medium text-slate-900">{selectedProgram.manager}</p>
                      <p className="text-xs text-slate-500">Senior Program Director</p>
                   </div>
                </div>
                <h3 className={`${theme.typography.h3} mb-2`}>Timeline</h3>
                <div className="space-y-2 text-sm">
                   <div className="flex justify-between"><span className="text-slate-500">Start Date</span> <span className="font-medium">{selectedProgram.startDate}</span></div>
                   <div className="flex justify-between"><span className="text-slate-500">End Date</span> <span className="font-medium">{selectedProgram.endDate}</span></div>
                </div>
             </div>
          </div>
       </div>
    </div>
  );
};

export default ProgramManager;
