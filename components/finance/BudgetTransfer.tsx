
import React, { useState } from 'react';
import { ArrowRightLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useTheme } from '../../context/ThemeContext';
import { useData } from '../../context/DataContext';
import { formatCurrency } from '../../utils/formatters';

interface BudgetTransferProps {
  projectId: string;
  onClose: () => void;
}

const BudgetTransfer: React.FC<BudgetTransferProps> = ({ projectId, onClose }) => {
  const theme = useTheme();
  const { state, dispatch } = useData();
  const [amount, setAmount] = useState<number>(0);
  const [sourceCodeId, setSourceCodeId] = useState('');
  const [targetCodeId, setTargetCodeId] = useState('');
  const [reason, setReason] = useState('');

  const budgetItems = state.budgetItems.filter(b => b.projectId === projectId);
  const selectedSource = budgetItems.find(b => b.id === sourceCodeId);
  const sourceAvailable = selectedSource ? selectedSource.planned - selectedSource.actual : 0;

  const handleTransfer = () => {
    if (!amount || !sourceCodeId || !targetCodeId || !reason) return;
    if (sourceCodeId === targetCodeId || amount > sourceAvailable) return;
    
    dispatch({
        type: 'TRANSFER_BUDGET',
        payload: { projectId, sourceItemId: sourceCodeId, targetItemId: targetCodeId, amount, reason }
    });
    onClose();
  };

  return (
    <div className="space-y-10 animate-nexus-in">
      <div className={`flex items-center gap-4 p-6 bg-blue-50 border border-blue-100 rounded-[2rem] text-blue-900 shadow-inner`}>
        <div className="p-3 bg-white rounded-2xl shadow-sm text-blue-600"><ArrowRightLeft size={24}/></div>
        <p className="text-xs font-black uppercase tracking-tight leading-relaxed">
            Budget transfers reallocate authorized funds between cost nodes. Transfers exceeding <span className="text-blue-600 font-black">$10,000</span> require secondary executive approval.
        </p>
      </div>
      
      <div className="grid grid-cols-2 gap-8 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 border border-slate-200 shadow-xl">
            <ArrowRightLeft size={20} className="text-nexus-600"/>
        </div>
        
        <div className={`bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100 shadow-inner`}>
            <label className={`block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1`}>Source Node</label>
            <select className={`w-full p-3.5 border-2 border-slate-200 rounded-xl text-sm font-black bg-white focus:ring-8 focus:ring-nexus-500/5 focus:border-nexus-500 outline-none transition-all text-slate-700`} value={sourceCodeId} onChange={e => setSourceCodeId(e.target.value)}>
                <option value="">Select Code...</option>
                {budgetItems.map(item => <option key={item.id} value={item.id}>{item.category}</option>)}
            </select>
            {selectedSource && (
                <div className="mt-4 flex justify-between items-end px-1">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Available</span>
                    <span className={`font-black font-mono text-base ${amount > sourceAvailable ? 'text-red-600' : 'text-green-600'}`}>{formatCurrency(sourceAvailable)}</span>
                </div>
            )}
        </div>
        
        <div className={`bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100 shadow-inner`}>
            <label className={`block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1`}>Target Node</label>
            <select className={`w-full p-3.5 border-2 border-slate-200 rounded-xl text-sm font-black bg-white focus:ring-8 focus:ring-nexus-500/5 focus:border-nexus-500 outline-none transition-all text-slate-700`} value={targetCodeId} onChange={e => setTargetCodeId(e.target.value)}>
                <option value="">Select Code...</option>
                {budgetItems.map(item => <option key={item.id} value={item.id}>{item.category}</option>)}
            </select>
        </div>
      </div>

      <div className="space-y-8">
         <div className="max-w-xs">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block ml-1">Transfer Intensity ($)</label>
            <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 font-black text-xl group-focus-within:text-nexus-500 transition-colors">$</span>
                <input 
                    type="number" 
                    className={`w-full pl-10 pr-4 py-4 border-2 border-slate-200 rounded-2xl text-2xl font-black font-mono outline-none focus:ring-8 focus:ring-nexus-500/5 focus:border-nexus-500 transition-all bg-white shadow-sm`}
                    value={amount} 
                    onChange={e => setAmount(parseFloat(e.target.value))} 
                />
            </div>
         </div>

         <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Business Rationale</label>
            <textarea 
                className={`w-full p-5 border-2 border-slate-200 rounded-[2rem] text-sm h-32 focus:ring-8 focus:ring-nexus-500/5 focus:border-nexus-500 outline-none resize-none transition-all bg-white shadow-inner font-medium`} 
                value={reason} 
                onChange={e => setReason(e.target.value)} 
                placeholder="Explain the delta shift..." 
            />
         </div>
      </div>

      <div className={`flex justify-end gap-3 pt-8 border-t border-slate-100`}>
         <Button variant="secondary" onClick={onClose} className="font-black uppercase tracking-widest text-[10px] h-12 px-8">Discard</Button>
         <Button 
            onClick={handleTransfer} icon={CheckCircle} 
            disabled={!sourceCodeId || !targetCodeId || amount <= 0 || amount > sourceAvailable}
            className="shadow-2xl shadow-nexus-500/20 font-black uppercase tracking-widest text-[10px] h-12 px-10"
         >
             Commit Reallocation
         </Button>
      </div>
    </div>
  );
};

export default BudgetTransfer;
