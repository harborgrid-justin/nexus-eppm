
import React from 'react';
import { Risk } from '../../../types';
import { useTheme } from '../../../context/ThemeContext';
import { Shield, Plus, Trash2 } from 'lucide-react';
import { Button } from '../../ui/Button';

interface RiskResponseTabProps {
  risk: Risk;
  setRisk: (risk: Risk) => void;
  isReadOnly: boolean;
}

export const RiskResponseTab: React.FC<RiskResponseTabProps> = ({ risk, setRisk, isReadOnly }) => {
  const theme = useTheme();

  const addAction = () => {
    const newAction = {
        id: Date.now().toString(),
        description: 'New mitigation step',
        ownerId: 'Unassigned',
        dueDate: new Date().toISOString().split('T')[0],
        status: 'Pending' as const
    };
    setRisk({ ...risk, responseActions: [...(risk.responseActions || []), newAction] });
  };

  const removeAction = (id: string) => {
    setRisk({ ...risk, responseActions: risk.responseActions.filter(a => a.id !== id) });
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-slate-800">Mitigation Strategy</h3>
        {!isReadOnly && <Button size="sm" icon={Plus} onClick={addAction}>Add Action</Button>}
      </div>
      
      <div className="space-y-3">
        {risk.responseActions?.map((action, idx) => (
          <div key={action.id} className="p-4 border border-slate-200 rounded-xl bg-slate-50 flex gap-4 items-start">
             <div className="p-2 bg-white rounded-full border border-slate-200 text-slate-400">
               <Shield size={16}/>
             </div>
             <div className="flex-1 space-y-2">
                <input 
                  disabled={isReadOnly}
                  value={action.description}
                  onChange={(e) => {
                    const updated = [...risk.responseActions];
                    updated[idx].description = e.target.value;
                    setRisk({ ...risk, responseActions: updated });
                  }}
                  className="w-full bg-transparent border-b border-transparent focus:border-nexus-500 outline-none font-medium text-sm"
                />
                <div className="flex gap-4 text-xs">
                   <div className="flex items-center gap-1">
                      <span className="text-slate-500">Owner:</span>
                      <input 
                        disabled={isReadOnly}
                        value={action.ownerId}
                        onChange={(e) => {
                            const updated = [...risk.responseActions];
                            updated[idx].ownerId = e.target.value;
                            setRisk({ ...risk, responseActions: updated });
                        }}
                        className="bg-transparent border-b border-slate-300 w-24"
                      />
                   </div>
                   <div className="flex items-center gap-1">
                      <span className="text-slate-500">Due:</span>
                      <input 
                        type="date"
                        disabled={isReadOnly}
                        value={action.dueDate}
                        onChange={(e) => {
                            const updated = [...risk.responseActions];
                            updated[idx].dueDate = e.target.value;
                            setRisk({ ...risk, responseActions: updated });
                        }}
                        className="bg-transparent border-b border-slate-300"
                      />
                   </div>
                </div>
             </div>
             {!isReadOnly && (
                <button onClick={() => removeAction(action.id)} className="text-slate-400 hover:text-red-500">
                    <Trash2 size={16}/>
                </button>
             )}
          </div>
        ))}
        {(!risk.responseActions || risk.responseActions.length === 0) && (
            <div className="text-center p-8 text-slate-400 italic text-sm">No response actions defined.</div>
        )}
      </div>
    </div>
  );
};
