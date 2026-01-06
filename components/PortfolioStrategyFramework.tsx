import React, { useState } from 'react';
import { 
  Users, Shield, Scale, BookOpen, ArrowRight, Layers, Plus, Edit2, Trash2
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useTheme } from '../../context/ThemeContext';
import { useData } from '../../context/DataContext';
import { Project, ScoringCriterion } from '../../types/index';
import { StatusBadge } from '../common/StatusBadge';
import { SidePanel } from '../ui/SidePanel';
import { PORTFOLIO_CATEGORIES } from '../../constants/index';
import { usePortfolioData } from '../../hooks/usePortfolioData';

const PortfolioStrategyFramework: React.FC = () => {
  const theme = useTheme();
  const { dispatch, state: { governance } } = useData(); // Keep useData for dispatch and governance
  const { projects, strategicGoals } = usePortfolioData(); // Use dedicated hook for portfolio data
  
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isEditPanelOpen, setIsEditPanelOpen] = useState(false);
  const { scoringCriteria } = governance;

  const calculateProjectScores = (project: Project): Record<string, number> => {
      return scoringCriteria.reduce((acc, criterion) => {
          if (criterion.id === 'strategic') acc[criterion.id] = project.strategicImportance || 5;
          else if (criterion.id === 'financial') acc[criterion.id] = project.financialValue || 5;
          else if (criterion.id === 'risk') acc[criterion.id] = project.riskScore ? Math.max(1, 10 - Math.ceil(project.riskScore / 5)) : 5;
          else if (criterion.id === 'feasibility') acc[criterion.id] = project.resourceFeasibility || 5;
          else acc[criterion.id] = 5;
          return acc;
      }, {} as Record<string, number>);
  };

  const calculateWeightedScore = (scores: Record<string, number>): number => {
    const totalScore = scoringCriteria.reduce((acc, criterion) => {
      const score = scores[criterion.id] || 0;
      return acc + (score / 10) * criterion.weight;
    }, 0);
    return Math.round(totalScore * 100);
  };

  const getProjectById = (id: string) => projects.find(p => p.id === id);

  const handleMoveCategory = (projectId: string, newCategory: string) => {
      dispatch({
          type: 'PROJECT_UPDATE',
          payload: {
              projectId,
              updatedData: { category: newCategory }
          }
      });
  };

  const handleEditProject = (id: string) => {
      setSelectedProjectId(id);
      setIsEditPanelOpen(true);
  };

  const currentProject = selectedProjectId ? getProjectById(selectedProjectId) : null;

  return (
    <div className={`h-full overflow-y-auto ${theme.layout.pageContainer} ${theme.layout.pagePadding} ${theme.layout.sectionSpacing} animate-in fade-in duration-300`}>
      
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Shield className="text-nexus-600" size={20} />
          <h2 className={theme.typography.h2}>1. Portfolio Governance & Decision Rights</h2>
        </div>
        <Card className="p-6">
          <h3 className={`${theme.typography.h3} mb-4`}>Governance Structure & Roles</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className={`p-4 ${theme.colors.background} border ${theme.colors.border} rounded-lg`}>
              <h4 className={`font-bold flex items-center gap-2 text-sm ${theme.colors.text.primary}`}><Users size={16}/> Governance Board</h4>
              <p className={`text-xs ${theme.colors.text.secondary} mt-1`}>CEO, CFO, CIO, COO</p>
              <p className={`text-xs mt-2 ${theme.colors.text.primary} leading-relaxed`}>Final authority on portfolio funding and strategic alignment.</p>
            </div>
             <div className={`p-4 ${theme.colors.background} border ${theme.colors.border} rounded-lg`}>
              <h4 className={`font-bold text-sm ${theme.colors.text.primary}`}>Portfolio Sponsor</h4>
               <p className={`text-xs ${theme.colors.text.secondary} mt-1`}>Executive Leadership</p>
              <p className={`text-xs mt-2 ${theme.colors.text.primary} leading-relaxed`}>Champions the portfolio and secures resources.</p>
            </div>
             <div className={`p-4 ${theme.colors.background} border ${theme.colors.border} rounded-lg`}>
              <h4 className={`font-bold text-sm ${theme.colors.text.primary}`}>Portfolio Manager</h4>
               <p className={`text-xs ${theme.colors.text.secondary} mt-1`}>Jessica Pearson</p>
              <p className={`text-xs mt-2 ${theme.colors.text.primary} leading-relaxed`}>Monitors performance and balances the portfolio.</p>
            </div>
          </div>
          
          <h3 className={`${theme.typography.h3} mb-4`}>Decision & Escalation Path</h3>
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-600">
            <div className={`px-3 py-2 ${theme.colors.background} rounded-lg`}>Proposal</div>
            <ArrowRight size={16} className={theme.colors.text.tertiary} />
            <div className={`px-3 py-2 ${theme.colors.background} rounded-lg`}>Business Case Review</div>
            <ArrowRight size={16} className={theme.colors.text.tertiary} />
            <div className={`px-3 py-2 ${theme.colors.background} rounded-lg`}>Scoring & Prioritization</div>
             <ArrowRight size={16} className={theme.colors.text.tertiary} />
            <div className={`px-3 py-2 ${theme.colors.semantic.info.bg} ${theme.colors.semantic.info.text} rounded-lg`}>Board Approval</div>
             <ArrowRight size={16} className={theme.colors.text.tertiary} />
            <div className={`px-3 py-2 ${theme.colors.semantic.success.bg} ${theme.colors.semantic.success.text} rounded-lg`}>Execution</div>
          </div>
        </Card>
      </section>

      <section>
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="text-nexus-600" size={20} />
          <h2 className={theme.typography.h2}>2. Portfolio Strategy & Alignment Criteria</h2>
        </div>
        <Card className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className={`${theme.typography.h3} mb-4`}>Strategic Objectives</h3>
              <ul className="space-y-2 text-sm">
                {strategicGoals.length > 0 ? strategicGoals.map(goal => (
                    <li key={goal.id} className={`p-3 ${theme.colors.background} rounded-lg border ${theme.colors.border}`}>
                        <span className="font-bold block mb-1">{goal.name}</span>
                        <span className="text-slate-500">{goal.description}</span>
                    </li>
                )) : (
                    <li className={`p-3 ${theme.colors.background} rounded-lg border ${theme.colors.border} text-slate-400 italic`}>No strategic goals defined.</li>
                )}
              </ul>
            </div>
            <div>
              <h3 className={`${theme.typography.h3} mb-4`}>Portfolio Scoring Model</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                    <tr className={`border-b ${theme.colors.border}`}>
                        <th className={`py-2 text-left font-bold ${theme.colors.text.secondary}`}>Criteria</th>
                        <th className={`py-2 text-center font-bold ${theme.colors.text.secondary}`}>Weight</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                    {scoringCriteria.map(c => (
                        <tr key={c.id}>
                        <td className={`py-2 ${theme.colors.text.primary}`}>{c.name}</td>
                        <td className={`py-2 text-center font-mono ${theme.colors.text.secondary}`}>{(c.weight * 100).toFixed(0)}%</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className={`mt-8 pt-6 border-t ${theme.colors.border}`}>
            <h3 className={`${theme.typography.h3} mb-4`}>Project Evaluation</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className={`border-b ${theme.colors.border} ${theme.colors.background}`}>
                    <th className={`p-2 text-left font-bold ${theme.colors.text.secondary}`}>Project</th>
                    {scoringCriteria.map(c => <th key={c.id} className={`p-2 text-center font-bold ${theme.colors.text.secondary}`}>{c.name.split(' ')[0]}</th>)}
                    <th className="p-2 text-center font-black text-nexus-800 bg-nexus-50">Weighted Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {projects.map((project) => {
                    const scores = calculateProjectScores(project);
                    return (
                      <tr key={project.id}>
                        <td className={`p-2 font-medium ${theme.colors.text.primary}`}>
                            {project.name}
                            <div className="text-[10px] text-slate-400">{project.code}</div>
                        </td>
                        {scoringCriteria.map(c => <td key={c.id} className={`p-2 text-center ${theme.colors.text.secondary}`}>{scores[c.id]}</td>)}
                        <td className="p-2 text-center font-bold text-lg text-nexus-700 bg-nexus-50/50">{calculateWeightedScore(scores)}</td>
                      </tr>
                    )
                  })}
                  {projects.length === 0 && (
                      <tr><td colSpan={scoringCriteria.length + 2} className="p-4 text-center text-slate-400">No active projects to evaluate.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </Card>
      </section>

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
                    <h3 className={`font-black ${theme.colors.text.secondary} text-[10px] uppercase tracking-widest`}>{category}</h3>
                    <button className={`${theme.colors.text.tertiary} hover:text-nexus-600 transition-colors`}>
                        <Plus size={14} />
                    </button>
                </div>
                <div className="space-y-3 min-h-[150px]">
                    {projectsInCategory.length > 0 ? projectsInCategory.map(project => (
                        <div key={project.id} className={`${theme.components.card} p-4 group hover:border-nexus-300 relative`}>
                            <div className="flex justify-between items-start mb-2">
                                <h4 className={`font-bold text-sm ${theme.colors.text.primary} group-hover:text-nexus-700 transition-colors line-clamp-2`}>{project.name}</h4>
                                <div className={`flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity absolute top-2 right-2 ${theme.colors.surface} rounded shadow-sm border ${theme.colors.border}`}>
                                    <button onClick={() => handleEditProject(project.id)} className={`p-1.5 hover:${theme.colors.background} rounded text-slate-500 hover:text-nexus-600`}><Edit2 size={12}/></button>
                                </div>
                            </div>
                            <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-50">
                                <span className={`text-[10px] font-mono ${theme.colors.text.tertiary} uppercase tracking-tighter`}>{project.code}</span>
                                <StatusBadge status={project.health} variant="health" className="scale-75 origin-right" />
                            </div>
                        </div>
                    )) : (
                        <div className={`p-6 border-2 border-dashed ${theme.colors.border} rounded-xl flex items-center justify-center text-center ${theme.colors.background}/50`}>
                            <p className={`text-xs ${theme.colors.text.tertiary} italic`}>No projects assigned.</p>
                        </div>
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
                <div className={`p-4 ${theme.colors.background} border ${theme.colors.border} rounded-lg`}>
                    <p className={`text-[10px] font-bold ${theme.colors.text.secondary} uppercase tracking-widest mb-1`}>Project Component</p>
                    <p className={`text-lg font-bold ${theme.colors.text.primary}`}>{currentProject.name}</p>
                </div>

                <div>
                    <label className={`block text-sm font-bold ${theme.colors.text.primary} mb-3`}>Strategic Category</label>
                    <div className="space-y-2">
                        {PORTFOLIO_CATEGORIES.map(cat => (
                            <button
                                key={cat}
                                onClick={() => currentProject && handleMoveCategory(currentProject.id, cat)}
                                className={`w-full text-left p-3 rounded-lg border transition-all ${
                                    currentProject.category === cat 
                                    ? `${theme.colors.semantic.info.bg} border-nexus-500 ${theme.colors.semantic.info.text} ring-1 ring-nexus-500` 
                                    : `${theme.colors.surface} ${theme.colors.border} hover:${theme.colors.background} hover:border-slate-300`
                                }`}
                            >
                                <span className="text-sm font-medium">{cat}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className={`${theme.colors.semantic.info.bg} p-4 rounded-lg border ${theme.colors.semantic.info.border} flex items-start gap-3`}>
                    <div className={`p-1 ${theme.colors.background} rounded text-blue-600 shrink-0`}><Scale size={14}/></div>
                    <p className="text-xs text-blue-800 leading-relaxed">
                        Reclassifying a component updates its position in the Strategic Roadmap and resource allocation balancing models.
                    </p>
                </div>
            </div>
        )}
      </SidePanel>
    </div>
  );
};

export default PortfolioStrategyFramework;