
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

interface ProgramRisksProps {
  programId: string;
}

const ProgramRisks: React.FC<ProgramRisksProps> = ({ programId }) => {
  const { programRisks, projects } = useProgramData(programId);
  const { state, dispatch } = useData();
  const theme = useTheme();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRisk, setNewRisk] = useState<Partial<ProgramRisk>>({
      description: '',
      category: 'External',
      probability: 'Medium',
      impact: 'Medium',
      owner: '',
      mitigationPlan: ''
  });

  const handleAddRisk = () => {
      if (!newRisk.description) return;
      
      // Calculate score
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
          owner: newRisk.owner || 'Unassigned',
          status: 'Open',
          mitigationPlan: newRisk.mitigationPlan || '',
          probabilityValue: pVal,
          impactValue: iVal,
          financialImpact: 0,
          strategy: 'Mitigate',
          responseActions: []
      };

      dispatch({ type: 'ADD_PROGRAM_RISK', payload: risk });
      setIsModalOpen(false);
      setNewRisk({ description: '', category: 'External', probability: 'Medium', impact: 'Medium', owner: '', mitigationPlan: '' });
  };

  const handleDeleteRisk = (id: string) => {
      if(confirm("Are you sure you want to delete this risk?")) {
          dispatch({ type: 'DELETE_PROGRAM_RISK', payload: id });
      }
  };

  // Aggregate project risks
  const escalatedRisks = useMemo(() => {
      const allRisks = state.risks.filter(r => projects.some(p => p.id === r.projectId));
      return allRisks.filter(r => r.score >= 15); // High severity threshold
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard title="Systemic Risks" value={programRisks.length} subtext="Program-level threats" icon={Layers} />
            <StatCard title="Escalated Risks" value={escalatedRisks.length} subtext="High impact from projects" icon={AlertOctagon} trend="down" />
            <StatCard title="Total Exposure" value={totalExposure} subtext="Aggregated risk score" icon={TrendingUp} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Program Risk Register */}
            <div className={`${theme.colors.surface} rounded-xl border ${theme.colors.border} shadow-sm overflow-hidden flex flex-col`}>
                <div className="p-4 border-b border-slate-200 bg-slate-50">
                    <h3 className="font-bold text-slate-800">Program Risk Register (Systemic)</h3>
                </div>
                <div className="flex-1 overflow-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-white">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase w-1/2">Risk</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Category</th>
                                <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase">Score</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
                                <th className="px-4 py-3 w-10"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {programRisks.map(risk => (
                                <tr key={risk.id} className="hover:bg-slate-50 group">
                                    <td className="px-4 py-3 text-sm font-medium text-slate-900">
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
                            {programRisks.length === 0 && (
                                <tr><td colSpan={5} className="p-6 text-center text-sm text-slate-500 italic">No program risks recorded.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Escalated Project Risks */}
            <div className={`${theme.colors.surface} rounded-xl border ${theme.colors.border} shadow-sm overflow-hidden flex flex-col`}>
                <div className="p-4 border-b border-slate-200 bg-red-50">
                    <h3 className="font-bold text-red-900">Escalated Project Risks</h3>
                </div>
                <div className="flex-1 overflow-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-white">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Project</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase w-1/2">Risk Description</th>
                                <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase">Score</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {escalatedRisks.map(risk => {
                                const proj = projects.find(p => p.id === risk.projectId);
                                return (
                                    <tr key={risk.id} className="hover:bg-slate-50">
                                        <td className="px-4 py-3 text-sm text-slate-600">{proj?.name || risk.projectId}</td>
                                        <td className="px-4 py-3 text-sm font-medium text-slate-900">{risk.description}</td>
                                        <td className="px-4 py-3 text-center">
                                            <span className="inline-block w-8 text-center rounded font-bold text-white text-xs py-0.5 bg-red-600">
                                                {risk.score}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                            {escalatedRisks.length === 0 && (
                                <tr>
                                    <td colSpan={3} className="px-4 py-8 text-center text-slate-500 italic">No escalated risks at this time.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
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
                    <label className="block text-sm font-medium text-slate-700 mb-1">Risk Description</label>
                    <textarea 
                        className="w-full p-2 border border-slate-300 rounded-lg text-sm h-20"
                        value={newRisk.description}
                        onChange={e => setNewRisk({...newRisk, description: e.target.value})}
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Probability</label>
                        <select className="w-full p-2 border border-slate-300 rounded-lg text-sm" value={newRisk.probability} onChange={e => setNewRisk({...newRisk, probability: e.target.value as any})}>
                            <option>Low</option>
                            <option>Medium</option>
                            <option>High</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Impact</label>
                        <select className="w-full p-2 border border-slate-300 rounded-lg text-sm" value={newRisk.impact} onChange={e => setNewRisk({...newRisk, impact: e.target.value as any})}>
                            <option>Low</option>
                            <option>Medium</option>
                            <option>High</option>
                        </select>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Mitigation Plan</label>
                    <Input value={newRisk.mitigationPlan} onChange={e => setNewRisk({...newRisk, mitigationPlan: e.target.value})} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Owner</label>
                    <Input value={newRisk.owner} onChange={e => setNewRisk({...newRisk, owner: e.target.value})} />
                </div>
            </div>
        </Modal>
    </div>
  );
};

export default ProgramRisks;
