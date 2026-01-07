
import React, { useState } from 'react';
import { 
  Users, Shield, Scale, BookOpen, ArrowRight, Layers, Plus, Edit2, Gavel, Target
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useTheme } from '../../context/ThemeContext';
import { useData } from '../../context/DataContext';
import { Project } from '../../types/index';
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

  const currentProject = selectedProjectId ? getProjectById(selectedProjectId) : null;

  const handleMoveCategory = (projectId: string, newCategory: string) => {
      dispatch({
          type: 'PROJECT_UPDATE',
          payload: { projectId, updatedData: { category: newCategory } }
      });
  };

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
          <h3 className={`${theme.typography.h3} ${theme.colors.text.primary} mb-4`}>Governance Structure & Roles</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="space-y-2">
                <label className={`${theme.typography.label} ${theme.colors.text.tertiary} ml-1`}>Governance Board</label>
                {getRoleAssignee('Governance Board') ? (
                    <div className={`p-4 ${theme.colors.background} border ${theme.colors.border} rounded-xl`}>
                        <p className={`text-sm font-bold ${theme.colors.text.primary}`}>{getRoleAssignee('Governance Board')}</p>
                        <p className={`${theme.typography.small} ${theme.colors.text.secondary} mt-1`}>Final authority on funding & strategic alignment.</p>
                    </div>
                ) : (
                    <FieldPlaceholder label="No Board Defined" onAdd={() => {}} icon={Gavel} />
                )}
            </div>
            <div className="space-y-2">
                <label className={`${theme.typography.label} ${theme.colors.text.tertiary} ml-1`}>Portfolio Sponsor</label>
                {getRoleAssignee('Portfolio Sponsor') ? (
                    <div className={`p-4 ${theme.colors.background} border ${theme.colors.border} rounded-xl`}>
                        <p className={`text-sm font-bold ${theme.colors.text.primary}`}>{getRoleAssignee('Portfolio Sponsor')}</p>
                        <p className={`${theme.typography.small} ${theme.colors.text.secondary} mt-1`}>Champions the portfolio and secures resources.</p>
                    </div>
                ) : (
                    <FieldPlaceholder label="Unassigned Sponsor" onAdd={() => {}} icon={Users} />
                )}
            </div>
            <div className="space-y-2">
                <label className={`${theme.typography.label} ${theme.colors.text.tertiary} ml-1`}>Portfolio Manager</label>
                {getRoleAssignee('Portfolio Manager') ? (
                    <div className={`p-4 ${theme.colors.background} border ${theme.colors.border} rounded-xl`}>
                        <p className={`text-sm font-bold ${theme.colors.text.primary}`}>{getRoleAssignee('Portfolio Manager')}</p>
                        <p className={`${theme.typography.small} ${theme.colors.text.secondary} mt-1`}>Monitors performance and balances the portfolio.</p>
                    </div>
                ) : (
                    <FieldPlaceholder label="Unassigned Manager" onAdd={() => {}} icon={Target} />
                )}
            </div>
          </div>
          
          <h3 className={`${theme.typography.h3} ${theme.colors.text.primary} mb-4`}>Decision & Escalation Path</h3>
          <div className={`flex flex-wrap items-center gap-2 ${theme.typography.label} ${theme.colors.text.secondary} bg-slate-50/50 p-4 rounded-xl border ${theme.colors.border}`}>
            <div className={`px-3 py-2 ${theme.colors.surface} border ${theme.colors.border} rounded-lg shadow-sm`}>Proposal</div>
            <ArrowRight size={14} className={theme.colors.text.tertiary} />
            <div className={`px-3 py-2 ${theme.colors.surface} border ${theme.colors.border} rounded-lg shadow-sm`}>Business Case Review</div>
            <ArrowRight size={14} className={theme.colors.text.tertiary} />
            <div className={`px-3 py-2 ${theme.colors.surface} border ${theme.colors.border} rounded-lg shadow-sm`}>Scoring</div>
             <ArrowRight size={14} className={theme.colors.text.tertiary} />
            <div className={`px-3 py-2 ${theme.colors.semantic.info.solid} rounded-lg shadow-md`}>Board Approval</div>
             <ArrowRight size={14} className={theme.colors.text.tertiary} />
            <div className={`px-3 py-2 ${theme.colors.semantic.success.solid} rounded-lg shadow-md`}>Execution</div>
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
                  <h3 className={`${theme.typography.h3} ${theme.colors.text.primary}`}>Strategic Objectives</h3>
                  <Button size="sm" variant="ghost" icon={Plus} onClick={() => {}}>Define Goal</Button>
              </div>
              <div className="space-y-2">
                {strategicGoals.length > 0 ? strategicGoals.map(goal => (
                    <div key={goal.id} className={`p-4 ${theme.colors.surface} rounded-xl border ${theme.colors.border} shadow-sm group hover:border-nexus-300 transition-all`}>
                        <span className={`font-bold ${theme.colors.text.primary} block mb-1`}>{goal.name}</span>
                        <span className={`${theme.typography.small} ${theme.colors.text.secondary} leading-relaxed`}>{goal.description}</span>
                    </div>
                )) : (
                    <FieldPlaceholder label="No strategic goals defined." onAdd={() => {}} icon={Target} />
                )}
              </div>
            </div>
            <div>
              <h3 className={`${theme.typography.h3} ${theme.colors.text.primary} mb-4`}>Portfolio Scoring Model</h3>
              {scoringCriteria.length > 0 ? (
                  <div className={`${theme.colors.background} rounded-xl border ${theme.colors.border} overflow-hidden`}>
                    <table className="w-full text-sm">
                        <thead className={`${theme.colors.surface} border-b ${theme.colors.border}`}>
                            <tr>
                                <th className={`px-4 py-3 text-left ${theme.typography.label} ${theme.colors.text.tertiary}`}>Criteria</th>
                                <th className={`px-4 py-3 text-right ${theme.typography.label} ${theme.colors.text.tertiary}`}>Weight</th>
                            </tr>
                        </thead>
                        <tbody className={`divide-y ${theme.colors.border.replace('border-', 'divide-')}`}>
                            {scoringCriteria.map(c => (
                                <tr key={c.id}>
                                    <td className={`px-4 py-3 text-sm font-medium ${theme.colors.text.primary}`}>{c.name}</td>
                                    <td className={`px-4 py-3 text-right font-mono font-bold text-nexus-600`}>{(c.weight * 100).toFixed(0)}%</td>
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
            <h3 className={`${theme.typography.h3} ${theme.colors.text.primary} mb-6`}>Project Evaluation Matrix</h3>
            {projects.length > 0 ? (
                <div className={`overflow-x-auto border ${theme.colors.border} rounded-xl shadow-inner`}>
                <table className="w-full text-sm border-collapse">
                    <thead>
                    <tr className={`border-b ${theme.colors.border} ${theme.colors.background}`}>
                        <th className={`px-4 py-3 text-left ${theme.typography.label} ${theme.colors.text.tertiary}`}>Component</th>
                        {(scoringCriteria || []).map(c => <th key={c.id} className={`px-4 py-3 text-center ${theme.typography.label} ${theme.colors.text.tertiary}`}>{c.name.split(' ')[0]}</th>)}
                        <th className={`px-4 py-3 text-right ${theme.typography.label} text-nexus-600 bg-nexus-50/50`}>Score</th>
                    </tr>
                    </thead>
                    <tbody className={`divide-y ${theme.colors.border.replace('border-', 'divide-')}`}>
                    {projects.map((project) => {
                        const scores = calculateProjectScores(project);
                        const weighted = calculateWeightedScore(scores);
                        return (
                        <tr key={project.id} className={`hover:${theme.colors.background} transition-colors`}>
                            <td className="px-4 py-3">
                                <div className={`font-bold ${theme.colors.text.primary}`}>{project.name}</div>
                                <div className={`${theme.typography.small} ${theme.colors.text.tertiary} font-mono mt-0.5`}>{project.code}</div>
                            </td>
                            {scoringCriteria.map(c => <td key={c.id} className={`px-4 py-3 text-center ${theme.colors.text.secondary} font-mono`}>{scores[c.id]}</td>)}
                            <td className={`px-4 py-3 text-right font-black text-lg text-nexus-700 bg-nexus-50/20`}>{weighted}</td>
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
                <div className={`${theme.colors.background} p-3 rounded-xl border ${theme.colors.border} flex justify-between items-center`}>
                    <h3 className={`${theme.typography.label} ${theme.colors.text.tertiary}`}>{category}</h3>
                    <span className={`${theme.typography.small} font-bold ${theme.colors.text.tertiary} ${theme.colors.surface} px-1.5 py-0.5 rounded border ${theme.colors.border}`}>{projectsInCategory.length}</span>
                </div>
                <div className="space-y-3 min-h-[150px]">
                    {projectsInCategory.length > 0 ? projectsInCategory.map(project => (
                        <div key={project.id} className={`${theme.components.card} p-4 group hover:border-nexus-300 relative ${theme.colors.surface}`}>
                            <div className="flex justify-between items-start mb-2">
                                <h4 className={`font-bold text-sm ${theme.colors.text.primary} group-hover:text-nexus-700 transition-colors line-clamp-2`}>{project.name}</h4>
                                <div className={`flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity absolute top-2 right-2 ${theme.colors.surface} rounded shadow-sm border ${theme.colors.border}`}>
                                    <button onClick={() => handleEditProject(project.id)} className={`p-1.5 hover:${theme.colors.background} rounded ${theme.colors.text.tertiary} hover:text-nexus-600`} title="Edit Alignment"><Edit2 size={12}/></button>
                                </div>
                            </div>
                            <div className={`flex justify-between items-center mt-3 pt-3 border-t ${theme.colors.border}`}>
                                <span className={`${theme.typography.small} font-mono ${theme.colors.text.tertiary} uppercase tracking-tighter`}>{project.code}</span>
                                <StatusBadge status={project.health} variant="health" className="scale-75 origin-right" />
                            </div>
                        </div>
                    )) : (
                        <FieldPlaceholder label="No projects assigned." onAdd={() => {}} icon={Layers} />
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
        title={<span className={`${theme.typography.label} ${theme.colors.text.primary}`}>Manage Component Alignment</span>}
        width="md:w-[450px]"
        footer={<Button onClick={() => setIsEditPanelOpen(false)}>Done</Button>}
      >
        {currentProject && (
            <div className="space-y-6">
                <div className={`p-4 ${theme.colors.background} border ${theme.colors.border} rounded-xl`}>
                    <p className={`${theme.typography.label} ${theme.colors.text.tertiary} mb-1`}>Project Component</p>
                    <p className={`text-lg font-bold ${theme.colors.text.primary}`}>{currentProject.name}</p>
                </div>
                <div>
                    <label className={`${theme.typography.label} ${theme.colors.text.tertiary} block mb-3 ml-1`}>Strategic Pillar</label>
                    <div className="space-y-2">
                        {PORTFOLIO_CATEGORIES.map(cat => (
                            <button
                                key={cat}
                                onClick={() => currentProject && handleMoveCategory(currentProject.id, cat)}
                                className={`w-full text-left p-4 rounded-xl border transition-all ${
                                    currentProject.category === cat 
                                    ? `bg-nexus-50 border-nexus-500 text-nexus-700 ring-4 ring-nexus-500/5 font-bold` 
                                    : `${theme.colors.surface} ${theme.colors.border} ${theme.colors.text.secondary} hover:${theme.colors.background} hover:border-slate-300`
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
