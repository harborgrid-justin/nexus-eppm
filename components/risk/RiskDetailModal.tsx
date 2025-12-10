import React, { useState, useEffect } from 'react';
import { Risk, RiskResponseAction } from '../../types';
import { useData } from '../../context/DataContext';
import { X, Plus, Trash2, Link as LinkIcon, Save, AlertTriangle } from 'lucide-react';

interface RiskDetailModalProps {
  riskId: string;
  projectId: string;
  onClose: () => void;
}

const RiskDetailModal: React.FC<RiskDetailModalProps> = ({ riskId, projectId, onClose }) => {
  const { state, dispatch } = useData();
  const [risk, setRisk] = useState<Risk | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const foundRisk = state.risks.find(r => r.id === riskId);
    if (foundRisk) {
      setRisk(JSON.parse(JSON.stringify(foundRisk))); // Deep copy for local state
    } else {
      setError(`Risk with ID "${riskId}" not found.`);
    }
  }, [riskId, state.risks]);

  const handleSave = () => {
    if (risk) {
      // Basic validation
      if (!risk.description) {
        alert("Description is required.");
        return;
      }
      dispatch({ type: 'UPDATE_RISK', payload: { risk } });
      onClose();
    }
  };

  const handleChange = (field: keyof Risk, value: any) => {
    if (risk) {
        setRisk({ ...risk, [field]: value });
    }
  };
  
  const handleResponseActionChange = (index: number, field: keyof RiskResponseAction, value: string) => {
    if(risk) {
        const newActions = [...risk.responseActions];
        const actionToUpdate = { ...newActions[index], [field]: value };
        newActions[index] = actionToUpdate;
        handleChange('responseActions', newActions);
    }
  };

  if (error) {
    return (
       <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 shadow-xl text-center">
                <AlertTriangle className="mx-auto text-red-500" size={32}/>
                <h3 className="font-bold mt-2">Error</h3>
                <p className="text-slate-600 text-sm mt-1">{error}</p>
                <button onClick={onClose} className="mt-4 px-4 py-2 bg-slate-100 rounded-md text-sm">Close</button>
            </div>
       </div>
    );
  }

  if (!risk) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
       <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
          
          <div className="p-6 border-b border-slate-200 flex justify-between items-start bg-slate-50">
             <div>
                <h2 className="text-2xl font-bold text-slate-900">{risk.id}</h2>
             </div>
             <button onClick={onClose} className="text-slate-400 hover:text-slate-600 bg-white p-2 rounded-full border border-slate-200 shadow-sm hover:shadow">
                <X size={20} />
             </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                    <label className="text-sm font-medium text-slate-700">Description</label>
                    <textarea value={risk.description} onChange={(e) => handleChange('description', e.target.value)} className="w-full mt-1 p-2 border border-slate-300 rounded-md"/>
                 </div>
                 <div>
                    <label className="text-sm font-medium text-slate-700">Category</label>
                    <input type="text" value={risk.category} onChange={(e) => handleChange('category', e.target.value)} className="w-full mt-1 p-2 border border-slate-300 rounded-md"/>
                 </div>
             </div>
             
             <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <h3 className="font-semibold mb-2">Response Actions</h3>
                {risk.responseActions.map((action, index) => (
                    <div key={action.id} className="grid grid-cols-[1fr_120px_40px] gap-2 items-center mb-2">
                        <input type="text" value={action.description} onChange={e => handleResponseActionChange(index, 'description', e.target.value)} placeholder="Action description" className="p-1 border-slate-300 rounded text-sm" />
                        <input type="date" value={action.dueDate} onChange={e => handleResponseActionChange(index, 'dueDate', e.target.value)} className="p-1 border-slate-300 rounded text-sm" />
                        <button className="text-red-500 hover:bg-red-100 p-1 rounded"><Trash2 size={16}/></button>
                    </div>
                ))}
                 <button className="text-sm text-nexus-600 font-semibold flex items-center gap-1 mt-2"><Plus size={14}/> Add Action</button>
             </div>

             <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2"><LinkIcon size={16}/> Linked Risks</h3>
                <select multiple className="w-full p-2 border border-slate-300 rounded-md h-24 text-sm" value={risk.linkedRiskIds || []} onChange={(e) => {
                  const selectedOptions = Array.from(e.target.options as unknown as HTMLOptionElement[]);
                  const selectedValues = selectedOptions
                    .filter(option => option.selected)
                    .map(option => option.value);
                  handleChange('linkedRiskIds', selectedValues);
                }}>
                    {state.risks.filter(r => r.id !== risk.id).map(r => (
                        <option key={r.id} value={r.id}>{r.id} - {r.description}</option>
                    ))}
                </select>
             </div>
          </div>

          <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
             <button onClick={onClose} className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">Cancel</button>
             <button onClick={handleSave} className="px-4 py-2 bg-nexus-600 rounded-lg text-sm font-medium text-white hover:bg-nexus-700 shadow-sm flex items-center gap-2">
                <Save size={16}/> Save Changes
             </button>
          </div>
       </div>
    </div>
  );
};

export default RiskDetailModal;