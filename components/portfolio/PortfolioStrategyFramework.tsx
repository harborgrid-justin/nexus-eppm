
import React, { useState } from 'react';
import { 
  Users, Shield, Scale, BookOpen, BarChart2, Briefcase, FileText, ArrowRight, Layers, Plus, MoreHorizontal, Move, Edit2, Trash2
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { useTheme } from '../../context/ThemeContext';
import { useData } from '../../context/DataContext';
import { Project } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { SidePanel } from '../ui/SidePanel';

// --- Scoring Model Logic ---
const SCORING_MODEL = [
  { id: 'strategic', name: 'Strategic Contribution', weight: 0.4, description: 'Alignment with core business objectives.' },
  { id: 'financial', name: 'Financial Value (ROI)', weight: 0.3, description: 'Expected return on investment.' },
  { id: 'risk', name: 'Risk Level (Inverse)', weight: 0.2, description: 'Lower risk scores higher.' },
  { id: 'feasibility', name: 'Resource Feasibility', weight: 0.1, description: 'Availability of skills and resources.' },
];

const MOCK_PROJECT_SCORES: Record<string, Record<string, number>> = {
  'P1001': { strategic: 9, financial: 7, risk: 4, feasibility: 6 },
};

const calculateScore = (scores: Record<string, number>): number => {
  const totalScore = SCORING_MODEL.reduce((acc, criterion) => {
    // For 'risk', a lower input is better, so we invert it for scoring (10 - score)
    const score = criterion.id === 'risk' ? 10 - (scores[criterion.id] || 0) : (scores[criterion.id] || 0);
    return acc + (score / 10) * criterion.weight;
  }, 0);
  return Math.round(totalScore * 100);
};

const PORTFOLIO_CATEGORIES = [
  'Innovation & Growth',
  'Operational Efficiency',
  'Regulatory & Compliance',
  'Keep the Lights On'
];

const PortfolioStrategyFramework: React.FC = () => {
  const theme = useTheme();
  const { state, dispatch } = useData();
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isEditPanelOpen, setIsEditPanelOpen] = useState(false);

  const getProjectById = (id: string) => state.projects.find(p => p.id === id);

  const handleMoveCategory = (projectId: string, newCategory: string) => {
      dispatch({
          type: 'UPDATE_PROJECT',
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
      
      {/* 1. GOVERNANCE */}
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

      {/* 2. STRATEGY & ALIGNMENT */}
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
                <li className={`p-3 ${theme.colors.background} rounded-lg border ${theme.colors.border}`}>Increase Market Share by 10% in EU</li>
                <li className={`p-3 ${theme.colors.background} rounded-lg border ${theme.colors.border}`}>Achieve 15% Operational Efficiency Gain</li>
                <li className={`p-3 ${theme.colors.background} rounded-lg border ${theme.colors.border}`}>Meet new ESG Compliance Standards</li>
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
                    {SCORING_MODEL.map(c => (
                        <tr key={c.id}>
                        <td className={`py-2 ${theme.colors.text.primary}`}>{c.name}</td>
                        <td className={`py-2 text-center font-mono ${theme.colors.text.secondary}`}>{c.weight * 100}%</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className={`mt-8 pt-6 border-t ${theme.colors.border}`}>
            <h3 className={`${theme.typography.h3} mb-4`}>Example Project Evaluation</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className={`border-b ${theme.colors.border} ${theme.colors.background}`}>
                    <th className={`p-2 text-left font-bold ${theme.colors.text.secondary}`}>Project</th>
                    {SCORING_MODEL.map(c => <th key={c.id} className={`p-2 text-center font-bold ${theme.colors.text.secondary}`}>{c.name}</th>)}
                    <th className="p-2 text-center font-black text-nexus-800 bg-nexus-50">Weighted Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {Object.entries(MOCK_PROJECT_SCORES).map(([projectId, scores]) => {
                    const project = getProjectById(projectId);
                    return (
                      <tr key={projectId}>
                        <td className={`p-2 font-medium ${theme.colors.text.primary}`}>{project?.name || projectId}</td>
                        {SCORING_MODEL.map(c => <td key={c.id} className={`p-2 text-center ${theme.colors.text.secondary}`}>{scores[c.id]} / 10</td>)}
                        <td className="p-2 text-center font-bold text-lg text-nexus-700 bg-nexus-50/50">{calculateScore(scores)}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </Card>
      </section>

      {/* 3. COMPONENT STRUCTURE */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Layers className="text-nexus-600" size={20} />
          <h2 className={theme.typography.h2}>3. Portfolio Component Structure</h2>
        </div>
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 ${theme.layout.gridGap}`}>
          {PORTFOLIO_CATEGORIES.map((category) => {
            const projectsInCategory = state.projects.filter(p => p.category === category);
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

      {/* Edit Panel for Category Assignment */}
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
                                onClick={() => handleMoveCategory(currentProject.id, cat)}
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
