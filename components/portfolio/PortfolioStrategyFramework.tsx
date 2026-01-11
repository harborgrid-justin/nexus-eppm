
import React, { useState, useMemo } from 'react';
import { 
  Users, Shield, Scale, BookOpen, ArrowRight, Layers, Plus, Edit2, Trash2, Gavel, Target, CheckCircle, Clock, AlertCircle
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
import { formatCompactCurrency } from '../../utils/formatters';

const PortfolioStrategyFramework: React.FC = () => {
  const theme = useTheme();
  const { state: { governance, governanceRoles, users, workflows, strategicGoals } } = useData(); 
  const { projects } = usePortfolioData(); 
  
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isEditPanelOpen, setIsEditPanelOpen] = useState(false);
  const { scoringCriteria } = governance;

  const lifecycleStages = useMemo(() => {
      const approvalWf = workflows.find(w => w.trigger === 'ChangeOrder' || w.name.includes('Approval'));
      if (!approvalWf) return ['Proposal', 'Review', 'Scoring', 'Board Approval', 'Execution'];
      return ['Proposal', ...approvalWf.steps.map(s => s.name), 'Execution'];
  }, [workflows]);

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

  const getRoleAssignee = (roleName: string) => {
      const role = (governanceRoles || []).find(r => r.role === roleName);
      if (role) {
          const user = (users || []).find(u => u.id === role.assigneeId);
          return {
              name: user ? user.name : role.assigneeId,
              status: 'Active',
              id: role.id
          };
      }
      return null;
  };

  return (
    <div className={`h-full overflow-y-auto ${theme.layout.pageContainer} ${theme.layout.pagePadding} ${theme.layout.sectionSpacing} animate-in fade-in duration-300`}>
      
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Shield className="text-nexus-600" size={20} />
          <h2 className={theme.typography.h2}>1. Portfolio Governance & Decision Rights</h2>
        </div>
        <Card className="p-8 rounded-[2rem] shadow-sm">
          <div className="flex justify-between items-center mb-6 border-b border-slate-50 pb-4">
              <h3 className="font-black text-slate-800 text-[10px] uppercase tracking-widest">Enterprise Leadership & Authorities</h3>
              <Button size="sm" variant="ghost" icon={Plus} onClick={() => {}}>Assign Role</Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Governance Board</label>
                {getRoleAssignee('Sponsor') ? (
                    <div className={`p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between group hover:border-nexus-200 transition-all shadow-sm`}>
                        <div>
                            <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{getRoleAssignee('Sponsor')?.name}</p>
                            <p className="text-[9px] text-slate-500 mt-1 uppercase font-bold tracking-tighter">Strategic Funding Authority</p>
                        </div>
                        <CheckCircle size={16} className="text-green-500" />
                    </div>
                ) : (
                    <FieldPlaceholder label="No Board Defined" onAdd={() => {}} icon={Gavel} placeholderLabel="Provision Board" />
                )}
            </div>
            <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Corporate Sponsor</label>
                {getRoleAssignee('Sponsor') ? (
                    <div className={`p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between group hover:border-nexus-200 transition-all shadow-sm`}>
                        <div>
                            <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{getRoleAssignee('Sponsor')?.name}</p>
                            <p className="text-[9px] text-slate-500 mt-1 uppercase font-bold tracking-tighter">Executive Champion</p>
                        </div>
                         <CheckCircle size={16} className="text-green-500" />
                    </div>
                ) : (
                    <FieldPlaceholder label="Unassigned Sponsor" onAdd={() => {}} icon={Users} placeholderLabel="Assign Sponsor" />
                )}
            </div>
            <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Portfolio Manager</label>
                {getRoleAssignee('Program Manager') ? (
                    <div className={`p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between group hover:border-nexus-200 transition-all shadow-sm`}>
                        <div>
                            <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{getRoleAssignee('Program Manager')?.name}</p>
                            <p className="text-[9px] text-slate-500 mt-1 uppercase font-bold tracking-tighter">Portfolio Operations</p>
                        </div>
                         <CheckCircle size={16} className="text-green-500" />
                    </div>
                ) : (
                    <FieldPlaceholder label="No Operational Lead" onAdd={() => {}} icon={Target} placeholderLabel="Assign Lead" />
                )}
            </div>
          </div>
          
          <h3 className="font-black text-slate-800 text-[10px] uppercase tracking-widest mb-6 border-b border-slate-50 pb-4">Authoritative Escalation Path</h3>
          <div className="flex flex-wrap items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-500">
            {lifecycleStages.map((stage, idx) => (
                <React.Fragment key={stage}>
                    <div className={`px-4 py-2.5 rounded-xl border ${idx === lifecycleStages.length - 1 ? 'bg-green-50 text-green-700 border-green-200 shadow-sm' : 'bg-slate-50 border-slate-200 shadow-inner'}`}>
                        {stage}
                    </div>
                    {idx < lifecycleStages.length - 1 && <ArrowRight size={16} className="text-slate-300" />}
                </React.Fragment>
            ))}
          </div>
        </Card>
      </section>

      <section>
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="text-nexus-600" size={20} />
          <h2 className={theme.typography.h2}>2. Strategic Drivers & Scoring Weights</h2>
        </div>
        <Card className="p-8 rounded-[2rem] shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <div className="flex justify-between items-center mb-6 border-b border-slate-50 pb-4">
                  <h3 className="font-black text-slate-800 text-[10px] uppercase tracking-widest">Active Strategic Drivers</h3>
                  <Button size="sm" variant="ghost" icon={Plus} onClick={() => {}}>Define Goal</Button>
              </div>
              <div className="space-y-3">
                {strategicGoals.length > 0 ? strategicGoals.map(goal => (
                    <div key={goal.id} className={`p-5 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col gap-2 group hover:border-nexus-300 transition-all shadow-sm`}>
                        <span className="font-black text-sm text-slate-800 uppercase tracking-tight">{goal.name}</span>
                        <span className="text-xs text-slate-500 leading-relaxed font-medium">{goal.description}</span>
                    </div>
                )) : (
                    <FieldPlaceholder label="No Strategic Mandates Defined" onAdd={() => {}} icon={Target} placeholderLabel="Define Mandate" />
                )}
              </div>
            </div>
            <div>
              <h3 className="font-black text-slate-800 text-[10px] uppercase tracking-widest mb-6 border-b border-slate-50 pb-4">Corporate Scoring Heuristics</h3>
              <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-inner bg-slate-50/50">
                <table className="w-full text-sm">
                    <thead>
                    <tr className={`border-b border-slate-200 bg-white`}>
                        <th className={`py-4 px-6 text-left font-black text-slate-500 text-[10px] uppercase tracking-widest`}>Criteria</th>
                        <th className={`py-4 px-6 text-right font-black text-slate-500 text-[10px] uppercase tracking-widest`}>Weight</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                    {scoringCriteria.map(c => (
                        <tr key={c.id}>
                        <td className={`py-4 px-6 font-bold text-slate-700`}>{c.name}</td>
                        <td className={`py-4 px-6 text-right font-mono font-black text-nexus-700`}>{(c.weight * 100).toFixed(0)}%</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
              </div>
            </div>
          </div>
        </Card>
      </section>

      <section>
        <div className="flex items-center gap-2 mb-4">
          <Layers className="text-nexus-600" size={20} />
          <h2 className={theme.typography.h2}>3. Strategic Component Distribution</h2>
        </div>
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 ${theme.layout.gridGap}`}>
          {PORTFOLIO_CATEGORIES.map((category) => {
            const projectsInCategory = projects.filter(p => p.category === category);
            return (
              <div key={category} className="flex flex-col gap-3">
                <div className={`bg-white p-4 rounded-2xl border border-slate-200 flex justify-between items-center shadow-sm`}>
                    <h3 className={`font-black text-slate-500 text-[10px] uppercase tracking-widest truncate`}>{category}</h3>
                    <div className="bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-200 text-[10px] font-black text-slate-400">
                        {projectsInCategory.length}
                    </div>
                </div>
                <div className="space-y-3 min-h-[200px]">
                    {projectsInCategory.length > 0 ? projectsInCategory.map(project => (
                        <div key={project.id} className={`bg-white p-5 rounded-2xl border border-slate-200 group hover:border-nexus-400 relative transition-all shadow-sm`}>
                            <div className="flex justify-between items-start mb-3">
                                <h4 className={`font-black text-sm text-slate-800 group-hover:text-nexus-800 transition-colors line-clamp-2 uppercase tracking-tight`}>{project.name}</h4>
                            </div>
                            <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-50">
                                <span className={`text-[10px] font-mono font-black text-slate-400 uppercase tracking-tighter`}>{project.code}</span>
                                <div className="text-right">
                                     <span className="text-[10px] font-black text-nexus-600 font-mono">{calculateWeightedScore(calculateProjectScores(project))} Pts</span>
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="h-full">
                            <FieldPlaceholder label={`Unpopulated: ${category}`} className="h-full min-h-[160px]" icon={Layers} onAdd={() => {}} placeholderLabel="Align Initiative" />
                        </div>
                    )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default PortfolioStrategyFramework;
