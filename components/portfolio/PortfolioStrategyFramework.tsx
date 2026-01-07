import React, { useState } from 'react';
import { 
  Users, Shield, Scale, BookOpen, ArrowRight, Layers, Plus, Edit2, Trash2, Gavel, Target
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useTheme } from '../../context/ThemeContext';
import { useData } from '../../context/DataContext';
import { Project, GovernanceRole } from '../../types/index';
import { StatusBadge } from '../common/StatusBadge';
import { SidePanel } from '../ui/SidePanel';
import { PORTFOLIO_CATEGORIES } from '../../constants/index';
import { usePortfolioData } from '../../hooks/usePortfolioData';
import { FieldPlaceholder } from '../common/FieldPlaceholder';
import { EmptyGrid } from '../common/EmptyGrid';

const PortfolioStrategyFramework: React.FC = () => {
  const theme = useTheme();
  const { dispatch, state: { governance, governanceRoles, users } } = useData(); 
  const { projects, strategicGoals } = usePortfolioData(); 
  
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isEditPanelOpen, setIsEditPanelOpen] = useState(false);
  const { scoringCriteria } = governance;

  const calculateProjectScores = (project: Project): Record<string, number> => {
      return (scoringCriteria || []).reduce((acc, criterion) => {
          if (criterion.id === 'strategic') acc[criterion.id] = project.strategicImportance || 0;
          else if (criterion.id === 'financial') acc[criterion.id] = project.financialValue || 0;
          else if (criterion.id === 'risk') acc[criterion.id] = project.riskScore ? Math.max(0, 10 - Math.ceil(project.riskScore / 5)) : 0;
          else if (criterion.id === 'feasibility') acc[criterion.id] = project.resourceFeasibility || 0;
          else acc[criterion.id] = 0;
          return acc;
      }, {} as Record<string, number>);
  };

  const calculateWeightedScore = (scores: Record<string, number>): number => {
    if (!scoringCriteria || scoringCriteria.length === 0) return 0;
    const totalScore = scoringCriteria.reduce((acc, criterion) => {
      const score = scores[criterion.id] || 0;
      return acc + (score / 10) * criterion.weight;
    }, 0);
    return Math.round(totalScore * 100);
  };

  const getProjectById = (id: string) => projects.find(p => p.id === id);

  const getRoleAssignee = (roleName: string): string | null => {
      const role = (governanceRoles || []).find(r => r.role === roleName);
      if (role) {
          const user = (users || []).find(u => u.id === role.assigneeId);
          return user ? user.name : role.assigneeId;
      }
      return null;
  };

  // FIX: Added getProjectById and currentProject to resolve 'Cannot find name' errors in the side panel.
  const currentProject = selectedProjectId ? getProjectById(selectedProjectId) : null;

  const handleMoveCategory = (projectId: string, newCategory: string) => {
      dispatch({
          type: 'PROJECT_UPDATE',
          payload: { projectId, updatedData: { category: newCategory } }
      });
  };

  // FIX: Added handleEditProject to open the alignment side panel.
  const handleEditProject = (id: string) => {
      setSelectedProjectId(id);
      setIsEditPanelOpen(true);
  };

  return (
    <div className={`h-full overflow-y-auto ${theme.layout.pageContainer} ${theme.layout.pagePadding} ${theme.layout.sectionSpacing} animate-in fade-in duration-300`}>
      
      {/* 1. Governance & Decision Rights */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Shield className="text-nexus-600" size={20} />
          <h2 className={theme.typography.h2}>1. Portfolio Governance & Decision Rights</h2>
        </div>
        <Card className="p-6">
          <h3 className={`${theme.typography.h3} mb-4`}>Governance Structure & Roles</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Governance Board</label>
                {getRoleAssignee('Governance Board') ? (
                    <div className={`p-4 ${theme.colors.background} border ${theme.colors.border} rounded-xl`}>
                        <p className="text-sm font-bold text-slate-800">{getRoleAssignee('Governance Board')}</p>
                        <p className="text-xs text-slate-500 mt-1">Final authority on funding & strategic alignment.</p>
                    </div>
                ) : (
                    <FieldPlaceholder label="No Board Defined" onAdd={() => {}} icon={Gavel} />
                )}
            </div>
            <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Portfolio Sponsor</label>
                {getRoleAssignee('Portfolio Sponsor') ? (
                    <div className={`p-4 ${theme.colors.background} border ${theme.colors.border} rounded-xl`}>
                        <p className="text-sm font-bold text-slate-800">{getRoleAssignee('Portfolio Sponsor')}</p>
                        <p className="text-xs text-slate-500 mt-1">Champions the portfolio and secures resources.</p>
                    </div>
                ) : (
                    <FieldPlaceholder label="Unassigned Sponsor" onAdd={() => {}} icon={Users} />
                )}
            </div>
            <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Portfolio Manager</label>
                {getRoleAssignee('Portfolio Manager') ? (
                    <div className={`p-4 ${theme.colors.background} border ${theme.colors.border} rounded-xl`}>
                        <p className="text-sm font-bold text-slate-800">{getRoleAssignee('Portfolio Manager')}</p>
                        <p className="text-xs text-slate-500 mt-1">Monitors performance and balances the portfolio.</p>
                    </div>
                ) : (
                    <FieldPlaceholder label="Unassigned Manager" onAdd={() => {}} icon={Target} />
                )}
            </div>
          </div>
          
          <h3 className={`${theme.typography.h3} mb-4`}>Decision & Escalation Path</h3>
          <div className="flex flex-wrap items-center gap-2 text-[10px] font-black uppercase tracking-wider text-slate-500 bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div className="px-3 py-2 bg-white border border-slate-200 rounded-lg shadow-sm">Proposal</div>
            <ArrowRight size={14} className="text-slate-300" />
            <div className="px-3 py-2 bg-white border border-slate-200 rounded-lg shadow-sm">Business Case Review</div>
            <ArrowRight size={14} className="text-slate-300" />
            <div className="px-3 py-2 bg-white border border-slate-200 rounded-lg shadow-sm">Scoring</div>
             <ArrowRight size={14} className="text-slate-300" />
            <div className="px-3 py-2 bg-nexus-600 text-white rounded-lg shadow-md shadow-nexus-500/20">Board Approval</div>
             <ArrowRight size={14} className="text-slate-300" />
            <div className="px-3 py-2 bg-emerald-500 text-white rounded-lg shadow-md shadow-emerald-500/20">Execution</div>
          </div>
        </Card>
      </section>

      {/* 2. Strategy & Alignment */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="text-nexus-600" size={20} />
          <h2 className={theme.typography.h2}>2. Portfolio Strategy & Alignment Criteria</h2>
        </div>
        <Card className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <div className="flex justify-between items-center mb-4">
                  <h3 className={theme.typography.h3}>Strategic Objectives</h3>
                  <Button size="sm" variant="ghost" icon={Plus} onClick={() => {}}>Define Goal</Button>
              </div>
              <div className="space-y-2">
                {strategicGoals.length > 0 ? strategicGoals.map(goal => (
                    <div key={goal.id} className={`p-4 bg-white rounded-xl border border-slate-200 shadow-sm group hover:border-nexus-300 transition-all`}>
                        <span className="font-bold text-slate-900 block mb-1">{goal.name}</span>
                        <span className="text-xs text-slate-500 leading-relaxed">{goal.description}</span>
                    </div>
                )) : (
                    <FieldPlaceholder label="No strategic goals defined." onAdd={() => {}} icon={Target} />
                )}
              </div>
            </div>
            <div>
              <h3 className={`${theme.typography.h3} mb-4`}>Portfolio Scoring Model</h3>
              {scoringCriteria.length > 0 ? (
                  <div className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-white border-b border-slate-200">
                            <tr>
                                <th className="px-4 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Criteria</th>
                                <th className="px-4 py-3 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Weight</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {scoringCriteria.map(c => (
                                <tr key={c.id}>
                                    <td className="px-4 py-3 text-sm font-medium text-slate-700">{c.name}</td>
                                    <td className="px-4 py-3 text-right font-mono font-bold text-nexus-600">{(c.weight * 100).toFixed(0)}%</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                  </div>
              ) : (
                  <FieldPlaceholder label="No scoring criteria established." onAdd={() => {}} icon={Scale} />
              )}
            </div>
          </div>
          <div className={`mt-8 pt-8 border-t ${theme.colors.border}`}>
            <h3 className={`${theme.typography.h3} mb-6`}>Project Evaluation Matrix</h3>
            {projects.length > 0 ? (
                <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-sm border-collapse">
                    <thead>
                    <tr className={`border-b ${theme.colors.border} bg-slate-50`}>
                        <th className="px-4 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Project Component</th>
                        {(scoringCriteria || []).map(c => <th key={c.id} className="px-4 py-3 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">{c.name.split(' ')[0]}</th>)}
                        <th className="px-4 py-3 text-right text-[10px] font-black text-nexus-600 uppercase tracking-widest bg-nexus-50/50">Weighted Score</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                    {projects.map((project) => {
                        const scores = calculateProjectScores(project);
                        const weighted = calculateWeightedScore(scores);
                        return (
                        <tr key={project.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-4 py-3">
                                <div className="font-bold text-slate-900">{project.name}</div>
                                <div className="text-[10px] text-slate-400 font-mono uppercase mt-0.5">{project.code}</div>
                            </td>
                            {scoringCriteria.map(c => <td key={c.id} className="px-4 py-3 text-center text-slate-600 font-mono">{scores[c.id]}</td>)}
                            <td className="px-4 py-3 text-right font-black text-lg text-nexus-700 bg-nexus-50/30">{weighted}</td>
                        </tr>
                        )
                    })}
                    </tbody>
                </table>
                </div>
            ) : (
                <EmptyGrid 
                    title="Evaluation Registry Empty"
                    description="Launch your first project initiative to activate the portfolio scoring and strategic alignment engine."
                    icon={Scale}
                    actionLabel="Initialize Project"
                    onAdd={() => {}}
                />
            )}
          </div>
        </Card>
      </section>

      {/* 3. Component Structure */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Layers className="text-nexus-600" size={20} />
          <h2 className={theme.typography.h2}>3. Portfolio Component Structure</h2>
        </div>
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 ${theme.layout.gridGap}`}>
          {PORTFOLIO_CATEGORIES.map((category) => {
            const projectsInCategory = projects.filter(p => p.category === category);
            return (
              <div key={category} className="flex flex-col gap-3">
                <div className={`${theme.colors.background} p-3 rounded-xl border ${theme.colors.border} flex justify-between items-center bg-slate-50/50`}>
                    <h3 className={`font-black text-slate-500 text-[10px] uppercase tracking-widest`}>{category}</h3>
                    <span className="text-[10px] font-bold text-slate-400 bg-white px-1.5 py-0.5 rounded border">{projectsInCategory.length}</span>
                </div>
                <div className="space-y-3 min-h-[150px]">
                    {projectsInCategory.length > 0 ? projectsInCategory.map(project => (
                        <div key={project.id} className={`${theme.components.card} p-4 group hover:border-nexus-300 relative bg-white`}>
                            <div className="flex justify-between items-start mb-2">
                                <h4 className={`font-bold text-sm text-slate-800 group-hover:text-nexus-700 transition-colors line-clamp-2`}>{project.name}</h4>
                                {/* FIX: Added Edit button to trigger the alignment side panel */}
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity absolute top-2 right-2 bg-white rounded shadow-sm border border-slate-200">
                                    <button onClick={() => handleEditProject(project.id)} className="p-1.5 hover:bg-slate-100 rounded text-slate-500 hover:text-nexus-600" title="Edit Alignment"><Edit2 size={12}/></button>
                                </div>
                            </div>
                            <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-50">
                                <span className={`text-[10px] font-mono text-slate-400 uppercase tracking-tighter`}>{project.code}</span>
                                <StatusBadge status={project.health} variant="health" className="scale-75 origin-right" />
                            </div>
                        </div>
                    )) : (
                        <FieldPlaceholder label="No projects assigned." onAdd={() => {}} icon={Layers} className="h-[150px]" />
                    )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <SidePanel
        isOpen={isEditPanelOpen}
        onClose={() => setIsEditPanelOpen(false)}
        title="Manage Component Alignment"
        width="md:w-[450px]"
        footer={<Button onClick={() => setIsEditPanelOpen(false)}>Done</Button>}
      >
        {currentProject && (
            <div className="space-y-6">
                <div className={`p-4 ${theme.colors.background} border ${theme.colors.border} rounded-xl`}>
                    <p className={`text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1`}>Project Component</p>
                    <p className={`text-lg font-bold text-slate-800`}>{currentProject.name}</p>
                </div>
                <div>
                    <label className={`block text-xs font-black text-slate-400 uppercase tracking-widest mb-3 ml-1`}>Strategic Pillar</label>
                    <div className="space-y-2">
                        {PORTFOLIO_CATEGORIES.map(cat => (
                            <button
                                key={cat}
                                onClick={() => currentProject && handleMoveCategory(currentProject.id, cat)}
                                className={`w-full text-left p-4 rounded-xl border transition-all ${
                                    currentProject.category === cat 
                                    ? `bg-nexus-50 border-nexus-500 text-nexus-700 ring-4 ring-nexus-500/5 font-bold` 
                                    : `bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300`
                                }`}
                            >
                                <span className="text-sm">{cat}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        )}
      </SidePanel>
    </div>
  );
};

export default PortfolioStrategyFramework;