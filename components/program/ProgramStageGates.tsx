
import React from 'react';
import { useProgramData } from '../../hooks/useProgramData';
import { CheckCircle, XCircle, Clock, AlertTriangle, FileText, ChevronRight, Gavel } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { Badge } from '../ui/Badge';

interface ProgramStageGatesProps {
  programId: string;
}

const ProgramStageGates: React.FC<ProgramStageGatesProps> = ({ programId }) => {
  const { programStageGates } = useProgramData(programId);
  const theme = useTheme();

  const getStatusIcon = (status: string) => {
      switch(status) {
          case 'Approved': return <CheckCircle className="text-green-500" size={20}/>;
          case 'Rejected': return <XCircle className="text-red-500" size={20}/>;
          case 'Conditional': return <AlertTriangle className="text-yellow-500" size={20}/>;
          default: return <Clock className="text-slate-400" size={20}/>;
      }
  };

  return (
    <div className={`h-full overflow-y-auto ${theme.layout.pagePadding} space-y-8 animate-in fade-in duration-300`}>
        <div className="flex items-center gap-2 mb-2">
            <Gavel className="text-nexus-600" size={24}/>
            <h2 className={theme.typography.h2}>Stage Gates & Performance Reviews</h2>
        </div>

        {/* Timeline Visual */}
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
        </div>
    </div>
  );
};

export default ProgramStageGates;
