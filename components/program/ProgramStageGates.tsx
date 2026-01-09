
import React, { useState } from 'react';
import { useProgramData } from '../../hooks/useProgramData';
import { useData } from '../../context/DataContext';
import { CheckCircle, XCircle, Clock, AlertTriangle, FileText, Plus, Save } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { SidePanel } from '../ui/SidePanel';
import { Input } from '../ui/Input';
import { generateId } from '../../utils/formatters';
import { EmptyGrid } from '../common/EmptyGrid';

interface ProgramStageGatesProps {
  programId: string;
}

const ProgramStageGates: React.FC<ProgramStageGatesProps> = ({ programId }) => {
  const { programStageGates } = useProgramData(programId);
  const { dispatch } = useData();
  const theme = useTheme();

  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [newGate, setNewGate] = useState({
      name: '',
      type: 'Funding',
      plannedDate: new Date().toISOString().split('T')[0],
      description: ''
  });

  const getStatusIcon = (status: string) => {
      switch(status) {
          case 'Approved': return <CheckCircle className="text-green-500" size={20}/>;
          case 'Rejected': return <XCircle className="text-red-500" size={20}/>;
          case 'Conditional': return <AlertTriangle className="text-yellow-500" size={20}/>;
          default: return <Clock className="text-slate-400" size={20}/>;
      }
  };

  const handleSave = () => {
      if(!newGate.name) return;
      const gate = {
          id: generateId('GATE'),
          programId,
          name: newGate.name,
          type: newGate.type as any,
          plannedDate: newGate.plannedDate,
          status: 'Pending',
          approverIds: [],
          decisionNotes: newGate.description,
          criteria: []
      };
      
      dispatch({ type: 'PROGRAM_UPDATE_GATE', payload: gate }); 
      setIsPanelOpen(false);
  };

  return (
    <div className={`h-full overflow-y-auto ${theme.layout.pagePadding} space-y-8 animate-in fade-in duration-300`}>
        <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
                <FileText className="text-nexus-600" size={24}/>
                <h2 className={theme.typography.h2}>Stage Gates & Performance Reviews</h2>
            </div>
            <Button size="sm" icon={Plus} onClick={() => setIsPanelOpen(true)}>Schedule Gate</Button>
        </div>

        {/* Timeline Visual */}
        {programStageGates.length > 0 && (
            <div className="relative pt-8 pb-4 overflow-x-auto">
                <div className="flex min-w-[800px] justify-between relative z-10">
                    <div className={`absolute top-4 left-0 right-0 h-1 ${theme.colors.border} -z-10`}></div>
                    {programStageGates.map((gate, idx) => (
                        <div key={gate.id} className="flex flex-col items-center group cursor-pointer">
                            <div className={`w-9 h-9 rounded-full border-4 flex items-center justify-center ${theme.colors.surface} mb-2 transition-transform hover:scale-110 ${
                                gate.status === 'Approved' ? 'border-green-500' : 
                                gate.status === 'Conditional' ? 'border-yellow-500' : 
                                gate.status === 'Rejected' ? 'border-red-500' : 'border-slate-300'
                            }`}>
                                {getStatusIcon(gate.status)}
                            </div>
                            <div className="text-center">
                                <p className={`text-xs font-bold ${theme.colors.text.secondary}`}>{gate.name}</p>
                                <p className={`text-[10px] ${theme.colors.text.tertiary} font-mono`}>{gate.actualDate || gate.plannedDate}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* Gate Details */}
        <div className="grid grid-cols-1 gap-6">
            {programStageGates.map(gate => (
                <div key={gate.id} className={`${theme.colors.surface} rounded-xl border ${theme.colors.border} shadow-sm overflow-hidden`}>
                    <div className={`p-4 border-b ${theme.colors.border} ${theme.colors.background} flex justify-between items-center`}>
                        <div className="flex items-center gap-3">
                            <div className={`p-2 ${theme.colors.surface} rounded border ${theme.colors.border}`}>
                                {getStatusIcon(gate.status)}
                            </div>
                            <div>
                                <h3 className={`font-bold ${theme.colors.text.primary} text-lg`}>{gate.name}</h3>
                                <div className={`flex items-center gap-2 text-xs ${theme.colors.text.secondary}`}>
                                    <span className={`${theme.colors.background} border ${theme.colors.border} px-2 py-0.5 rounded`}>{gate.type} Gate</span>
                                    <span>•</span>
                                    <span>Approvers: {(gate.approverIds || []).join(', ')}</span>
                                </div>
                            </div>
                        </div>
                        <Badge variant={
                            gate.status === 'Approved' ? 'success' : 
                            gate.status === 'Rejected' ? 'danger' : 
                            gate.status === 'Conditional' ? 'warning' : 'neutral'
                        }>{gate.status}</Badge>
                    </div>
                    
                    <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div>
                            <h4 className={`text-sm font-bold ${theme.colors.text.secondary} uppercase tracking-wider mb-4 flex items-center gap-2`}>
                                <CheckCircle size={14}/> Decision Criteria
                            </h4>
                            <ul className="space-y-3">
                                {(gate.criteria || []).map(crit => (
                                    <li key={crit.id} className={`flex items-start gap-3 p-3 ${theme.colors.background} rounded-lg border ${theme.colors.border}`}>
                                        {crit.status === 'Met' ? <CheckCircle size={16} className="text-green-500 mt-0.5"/> : 
                                         crit.status === 'Not Met' ? <XCircle size={16} className="text-red-500 mt-0.5"/> :
                                         <AlertTriangle size={16} className="text-yellow-500 mt-0.5"/>
                                        }
                                        <div className="flex-1">
                                            <p className={`text-sm font-medium ${theme.colors.text.primary}`}>{crit.description}</p>
                                            {crit.notes && <p className={`text-xs ${theme.colors.text.secondary} mt-1 italic`}>{crit.notes}</p>}
                                        </div>
                                        <span className={`text-xs font-bold ${theme.colors.text.tertiary} uppercase`}>{crit.status}</span>
                                    </li>
                                ))}
                                {(!gate.criteria || gate.criteria.length === 0) && <li className="text-sm text-slate-400 italic">No specific criteria defined.</li>}
                            </ul>
                        </div>
                        
                        <div>
                            <h4 className={`text-sm font-bold ${theme.colors.text.secondary} uppercase tracking-wider mb-4 flex items-center gap-2`}>
                                <FileText size={14}/> Decision Log
                            </h4>
                            <div className={`${theme.colors.background} border ${theme.colors.border} rounded-lg p-4 h-full`}>
                                <p className={`text-sm ${theme.colors.text.secondary} italic`}>
                                    "{gate.decisionNotes || 'Pending decision notes...'}"
                                </p>
                                <div className={`mt-4 pt-4 border-t ${theme.colors.border.replace('border-', 'border-slate-')}200 text-xs ${theme.colors.text.tertiary}`}>
                                    <p>Decision Date: <span className={`font-mono ${theme.colors.text.primary}`}>{gate.actualDate || 'TBD'}</span></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
            
            {programStageGates.length === 0 && (
                <EmptyGrid 
                    title="No Gates Scheduled"
                    description="Define decision points to control program progression and funding release."
                    icon={FileText}
                    actionLabel="Schedule Gate"
                    onAdd={() => setIsPanelOpen(true)}
                />
            )}
        </div>

        <SidePanel
            isOpen={isPanelOpen}
            onClose={() => setIsPanelOpen(false)}
            title="Schedule New Stage Gate"
            width="md:w-[500px]"
            footer={<><Button variant="secondary" onClick={() => setIsPanelOpen(false)}>Cancel</Button><Button onClick={handleSave} icon={Save}>Schedule Gate</Button></>}
        >
            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Gate Name</label>
                    <Input value={newGate.name} onChange={e => setNewGate({...newGate, name: e.target.value})} placeholder="e.g. Phase 2 Funding Review" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Type</label>
                        <select className="w-full p-2 border rounded-lg text-sm" value={newGate.type} onChange={e => setNewGate({...newGate, type: e.target.value})}>
                            <option>Funding</option><option>Technical</option><option>Business</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Planned Date</label>
                        <Input type="date" value={newGate.plannedDate} onChange={e => setNewGate({...newGate, plannedDate: e.target.value})} />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Description / Notes</label>
                    <textarea className="w-full p-3 border rounded-lg text-sm h-32 focus:ring-2 focus:ring-nexus-500 outline-none" value={newGate.description} onChange={e => setNewGate({...newGate, description: e.target.value})} placeholder="Success criteria summary..." />
                </div>
            </div>
        </SidePanel>
    </div>
  );
};

export default ProgramStageGates;
