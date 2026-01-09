
import React, { useMemo, useState } from 'react';
import { useProgramData } from '../../hooks/useProgramData';
import { useData } from '../../context/DataContext';
import { ShieldAlert, TrendingUp, AlertOctagon, Layers, Plus, Trash2 } from 'lucide-react';
import StatCard from '../shared/StatCard';
import { useTheme } from '../../context/ThemeContext';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { ProgramRisk } from '../../types';
import { generateId } from '../../utils/formatters';
import { EmptyGrid } from '../common/EmptyGrid';

interface ProgramRisksProps {
  programId: string;
}

export const ProgramRisks: React.FC<ProgramRisksProps> = ({ programId }) => {
  const { programRisks, projects } = useProgramData(programId);
  const { state, dispatch } = useData();
  const theme = useTheme();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRisk, setNewRisk] = useState<Partial<ProgramRisk>>({
      description: '',
      category: 'External',
      probability: 'Medium',
      impact: 'Medium',
      ownerId: '',
      mitigationPlan: ''
  });

  const handleAddRisk = () => {
      if (!newRisk.description) return;
      
      const pVal = newRisk.probability === 'High' ? 5 : newRisk.probability === 'Medium' ? 3 : 1;
      const iVal = newRisk.impact === 'High' ? 5 : newRisk.impact === 'Medium' ? 3 : 1;

      const risk: ProgramRisk = {
          id: generateId('PR'),
          programId,
          description: newRisk.description || '',
          category: newRisk.category || 'External',
          probability: newRisk.probability as any,
          impact: newRisk.impact as any,
          score: pVal * iVal,
          ownerId: newRisk.ownerId || 'Unassigned',
          status: 'Open',
          mitigationPlan: newRisk.mitigationPlan || '',
          probabilityValue: pVal,
          impactValue: iVal,
          financialImpact: 0,
          strategy: 'Mitigate',
          responseActions: []
      };

      dispatch({ type: 'PROGRAM_ADD_RISK', payload: risk });
      setIsModalOpen(false);
      setNewRisk({ description: '', category: 'External', probability: 'Medium', impact: 'Medium', ownerId: '', mitigationPlan: '' });
  };

  const handleDeleteRisk = (id: string) => {
      if(confirm("Are you sure you want to delete this risk?")) {
          dispatch({ type: 'PROGRAM_DELETE_RISK', payload: id });
      }
  };

  const escalatedRisks = useMemo(() => {
      const allRisks = state.risks.filter(r => projects.some(p => p.id === r.projectId));
      return allRisks.filter(r => r.score >= 15);
  }, [state.risks, projects]);

  const totalExposure = useMemo(() => {
      return programRisks.reduce((acc, r) => acc + r.score, 0) + escalatedRisks.reduce((acc, r) => acc + r.score, 0);
  }, [programRisks, escalatedRisks]);

  return (
    <div className={`h-full overflow-y-auto ${theme.layout.pagePadding} space-y-8 animate-in fade-in duration-300`}>
        <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
                <ShieldAlert className="text-nexus-600" size={24}/>
                <h2 className={theme.typography.h2}>Program Risk Management</h2>
            </div>
            <Button size="sm" icon={Plus} onClick={() => setIsModalOpen(true)}>Add Program Risk</Button>
        </div>

        <div className={`grid grid-cols-1 md:grid-cols-3 ${theme.layout.gridGap}`}>
            <StatCard title="Systemic Risks" value={programRisks.length} subtext="Program-level threats" icon={Layers} />
            <StatCard title="Escalated Risks" value={escalatedRisks.length} subtext="High impact from projects" icon={AlertOctagon} trend="down" />
            <StatCard title="Total Exposure" value={totalExposure} subtext="Aggregated risk score" icon={TrendingUp} />
        </div>

        <div className={`grid grid-cols-1 lg:grid-cols-2 ${theme.layout.gridGap}`}>
            <div className={`${theme.colors.surface} rounded-xl border ${theme.colors.border} shadow-sm overflow-hidden flex flex-col min-h-[350px]`}>
                <div className={`p-4 border-b ${theme.colors.border} ${theme.colors.background}`}>
                    <h3 className={`font-bold ${theme.colors.text.primary}`}>Program Risk Register (Systemic)</h3>
                </div>
                {programRisks.length > 0 ? (
                    <div className="flex-1 overflow-auto">
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className={theme.colors.surface}>
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase w-1/2">Risk</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Category</th>
                                    <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase">Score</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
                                    <th className="px-4 py-3 w-10"></th>
                                </tr>
                            </thead>
                            <tbody className={`divide-y ${theme.colors.border.replace('border-', 'divide-')}`}>
                                {programRisks.map(risk => (
                                    <tr key={risk.id} className={`hover:${theme.colors.background} group`}>
                                        <td className={`px-4 py-3 text-sm font-medium ${theme.colors.text.primary}`}>
                                            {risk.description}
                                            <div className="text-xs text-slate-500 mt-1">Mitigation: {risk.mitigationPlan}</div>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-slate-600">{risk.category}</td>
                                        <td className="px-4 py-3 text-center">
                                            <span className={`inline-block w-8 text-center rounded font-bold text-white text-xs py-0.5 ${risk.score >= 12 ? 'bg-red-500' : 'bg-yellow-500'}`}>
                                                {risk.score}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3"><Badge variant="neutral">{risk.status}</Badge></td>
                                        <td className="px-4 py-3 text-right">
                                            <button onClick={() => handleDeleteRisk(risk.id)} className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Trash2 size={14}/>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col justify-center">
                        <EmptyGrid 
                            title="No Systemic Risks Identified" 
                            description="The program register is currently clear of overarching threats. Use project-level escalations to populate this view."
                            icon={ShieldAlert}
                            actionLabel="Identify Program Threat"
                            onAdd={() => setIsModalOpen(true)}
                        />
                    </div>
                )}
            </div>

            <div className={`${theme.colors.surface} rounded-xl border ${theme.colors.border} shadow-sm overflow-hidden flex flex-col min-h-[350px]`}>
                <div className="p-4 border-b border-red-200 bg-red-50">
                    <h3 className="font-bold text-red-900">Escalated Project Risks</h3>
                </div>
                <div className="flex-1 overflow-auto">
                     {escalatedRisks.length > 0 ? (
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className={theme.colors.surface}>
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Project</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase w-1/2">Risk Description</th>
                                    <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase">Score</th>
                                </tr>
                            </thead>
                            <tbody className={`divide-y ${theme.colors.border.replace('border-', 'divide-')}`}>
                                {escalatedRisks.map(risk => {
                                    const proj = projects.find(p => p.id === risk.projectId);
                                    return (
                                        <tr key={risk.id} className={`hover:${theme.colors.background}`}>
                                            <td className="px-4 py-3 text-sm text-slate-600">{proj?.name || risk.projectId}</td>
                                            <td className={`px-4 py-3 text-sm font-medium ${theme.colors.text.primary}`}>{risk.description}</td>
                                            <td className="px-4 py-3 text-center">
                                                <span className="inline-block w-8 text-center rounded font-bold text-white text-xs py-0.5 bg-red-600">
                                                    {risk.score}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    ) : (
                         <div className="flex-1 h-full flex flex-col justify-center">
                             <div className="text-center p-8 text-slate-400 italic">
                                <AlertOctagon size={32} className="mx-auto mb-2 opacity-30"/>
                                <p className="font-bold uppercase tracking-widest text-[10px]">No Escalated Threats</p>
                                <p className="text-xs mt-1">All project-level risks are currently below the escalation threshold.</p>
                             </div>
                         </div>
                    )}
                </div>
            </div>
        </div>

        <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title="New Program Risk"
            footer={
                <>
                    <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                    <Button onClick={handleAddRisk}>Save Risk</Button>
                </>
            }
        >
            <div className="space-y-4">
                <div>
                    <label className={theme.typography.label + " block mb-1"}>Risk Description</label>
                    <textarea 
                        className={`w-full p-2 border ${theme.colors.border} rounded-lg text-sm h-20 ${theme.colors.surface} ${theme.colors.text.primary}`}
                        value={newRisk.description}
                        onChange={e => setNewRisk({...newRisk, description: e.target.value})}
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className={theme.typography.label + " block mb-1"}>Probability</label>
                        <select className={`w-full p-2 border ${theme.colors.border} rounded-lg text-sm ${theme.colors.surface} ${theme.colors.text.primary}`} value={newRisk.probability} onChange={e => setNewRisk({...newRisk, probability: e.target.value as any})}>
                            <option>Low</option>
                            <option>Medium</option>
                            <option>High</option>
                        </select>
                    </div>
                    <div>
                        <label className={theme.typography.label + " block mb-1"}>Impact</label>
                        <select className={`w-full p-2 border ${theme.colors.border} rounded-lg text-sm ${theme.colors.surface} ${theme.colors.text.primary}`} value={newRisk.impact} onChange={e => setNewRisk({...newRisk, impact: e.target.value as any})}>
                            <option>Low</option>
                            <option>Medium</option>
                            <option>High</option>
                        </select>
                    </div>
                </div>
                <div>
                    <label className={theme.typography.label + " block mb-1"}>Mitigation Plan</label>
                    <Input value={newRisk.mitigationPlan} onChange={e => setNewRisk({...newRisk, mitigationPlan: e.target.value})} />
                </div>
                <div>
                    <label className={theme.typography.label + " block mb-1"}>Owner ID</label>
                    <Input value={newRisk.ownerId} onChange={e => setNewRisk({...newRisk, ownerId: e.target.value})} placeholder="e.g. R-001" />
                </div>
            </div>
        </Modal>
    </div>
  );
};
