
import React, { useState } from 'react';
import { useProgramData } from '../../hooks/useProgramData';
import { useData } from '../../context/DataContext';
import { CheckCircle, XCircle, Clock, AlertTriangle, FileText, Plus, Save, Target } from 'lucide-react';
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
      name: '', type: 'Funding', plannedDate: new Date().toISOString().split('T')[0], description: ''
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
          id: generateId('GATE'), programId, name: newGate.name, type: newGate.type as any,
          plannedDate: newGate.plannedDate, status: 'Pending', approverIds: [],
          decisionNotes: newGate.description, criteria: []
      };
      dispatch({ type: 'PROGRAM_UPDATE_GATE', payload: gate }); 
      setIsPanelOpen(false);
  };

  return (
    <div className={`h-full overflow-y-auto ${theme.layout.pagePadding} space-y-12 animate-in fade-in duration-300 scrollbar-thin`}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2 gap-4">
            <div className="flex items-center gap-3">
                <div className="p-3 bg-nexus-900 text-white rounded-2xl shadow-xl border border-slate-700"><FileText size={24}/></div>
                <div>
                    <h2 className={theme.typography.h2}>Stage Gate Performance Reviews</h2>
                    <p className={theme.typography.small}>Authorized check-points for capital release and phase progression.</p>
                </div>
            </div>
            <Button size="sm" icon={Plus} onClick={() => setIsPanelOpen(true)}>Schedule Gate</Button>
        </div>

        {programStageGates.length > 0 && (
            <div className="relative pt-12 pb-10 overflow-x-auto scrollbar-hide">
                <div className="flex min-w-[1000px] justify-between relative z-10 px-20">
                    <div className={`absolute top-4 left-20 right-20 h-1 bg-slate-100 -z-10 rounded-full shadow-inner`}></div>
                    {programStageGates.map((gate) => (
                        <div key={gate.id} className="flex flex-col items-center group cursor-pointer relative">
                            <div className={`w-10 h-10 rounded-xl border-4 flex items-center justify-center bg-white mb-4 transition-all group-hover:scale-110 shadow-lg ${
                                gate.status === 'Approved' ? 'border-green-500' : 
                                gate.status === 'Conditional' ? 'border-yellow-400 shadow-yellow-500/10' : 
                                gate.status === 'Rejected' ? 'border-red-500 shadow-red-500/10' : 'border-slate-200'
                            }`}>
                                {getStatusIcon(gate.status)}
                            </div>
                            <div className="text-center w-32">
                                <p className={`text-[10px] font-black uppercase tracking-tight ${theme.colors.text.primary}`}>{gate.name}</p>
                                <p className={`text-[9px] ${theme.colors.text.tertiary} font-mono mt-1 font-bold`}>{gate.actualDate || gate.plannedDate}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        <div className="grid grid-cols-1 gap-8 max-w-5xl mx-auto">
            {programStageGates.map(gate => (
                <div key={gate.id} className={`${theme.colors.surface} rounded-[2rem] border ${theme.colors.border} shadow-sm overflow-hidden group hover:border-nexus-200 transition-all`}>
                    <div className={`p-6 border-b ${theme.colors.border} bg-slate-50/50 flex justify-between items-center`}>
                        <div className="flex items-center gap-4">
                            <div className={`p-2.5 bg-white rounded-xl border ${theme.colors.border} shadow-sm group-hover:text-nexus-600 transition-colors`}>
                                {getStatusIcon(gate.status)}
                            </div>
                            <div>
                                <h3 className={`font-black text-slate-800 text-sm uppercase tracking-tight`}>{gate.name}</h3>
                                <div className={`flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1`}>
                                    <span className={`bg-white border ${theme.colors.border} px-2 py-0.5 rounded shadow-inner`}>{gate.type} Gate</span>
                                    <span>•</span>
                                    <span>Auth ID: {(gate.approverIds || []).join(', ') || 'PENDING'}</span>
                                </div>
                            </div>
                        </div>
                        <Badge variant={
                            gate.status === 'Approved' ? 'success' : 
                            gate.status === 'Rejected' ? 'danger' : 
                            gate.status === 'Conditional' ? 'warning' : 'neutral'
                        }>{gate.status}</Badge>
                    </div>
                    
                    <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-10">
                        <div>
                            <h4 className={`text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2`}>
                                <CheckCircle size={14} className="text-green-500"/> Certified Criteria
                            </h4>
                            <ul className="space-y-4">
                                {gate.criteria.map(c => (
                                    <li key={c.id} className="flex items-start gap-3">
                                        <div className={`mt-0.5 ${c.status === 'Met' ? 'text-green-500' : 'text-slate-300'}`}>
                                            <CheckCircle size={14}/>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-slate-700">{c.description}</p>
                                            {c.notes && <p className="text-xs text-slate-500 italic mt-0.5">{c.notes}</p>}
                                        </div>
                                    </li>
                                ))}
                                {gate.criteria.length === 0 && <li className="text-xs text-slate-400 italic">No specific criteria defined for this gate.</li>}
                            </ul>
                        </div>
                        <div>
                            <h4 className={`text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2`}>
                                <FileText size={14} className="text-blue-500"/> Decision Summary
                            </h4>
                            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 min-h-[120px] relative overflow-hidden group">
                                <p className="text-sm text-slate-600 leading-relaxed italic relative z-10">
                                    {gate.decisionNotes || 'Pending formal review session outcomes...'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
            {programStageGates.length === 0 && (
                <div className="flex-1 flex flex-col justify-center">
                    <EmptyGrid 
                        title="Stage Gate Lifecycle Not Defined"
                        description="Initialize the program phase gates to enable structured performance reporting."
                        icon={Target}
                        actionLabel="Define Stage Gate"
                        onAdd={() => setIsPanelOpen(true)}
                    />
                </div>
            )}
        </div>

        <SidePanel
            isOpen={isPanelOpen}
            onClose={() => setIsPanelOpen(false)}
            title="Schedule New Stage Gate"
            width="md:w-[500px]"
            footer={
                <>
                    <Button variant="secondary" onClick={() => setIsPanelOpen(false)}>Cancel</Button>
                    <Button onClick={handleSave} icon={Save}>Schedule Gate</Button>
                </>
            }
        >
            <div className="space-y-6">
                <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Gate Designation</label>
                    <Input value={newGate.name} onChange={e => setNewGate({...newGate, name: e.target.value})} placeholder="e.g. Critical Design Review" />
                </div>
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Gate Type</label>
                        <select 
                            className={`w-full p-3 border border-slate-300 rounded-xl text-sm bg-slate-50 font-bold focus:ring-2 focus:ring-nexus-500 outline-none`}
                            value={newGate.type} 
                            onChange={e => setNewGate({...newGate, type: e.target.value})}
                        >
                            <option>Funding</option><option>Technical</option><option>Business</option>
                        </select>
                    </div>
                    <div>
                         <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Planned Target</label>
                         <Input type="date" value={newGate.plannedDate} onChange={e => setNewGate({...newGate, plannedDate: e.target.value})} />
                    </div>
                </div>
                <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Scope & Objective</label>
                    <textarea 
                        className={`w-full p-4 border border-slate-300 rounded-xl text-sm h-32 focus:ring-2 focus:ring-nexus-500 outline-none resize-none bg-slate-50 font-medium`}
                        value={newGate.description}
                        onChange={e => setNewGate({...newGate, description: e.target.value})}
                        placeholder="Define the criteria for entry and exit of this gate..."
                    />
                </div>
            </div>
        </SidePanel>
    </div>
  );
};

export default ProgramStageGates;
