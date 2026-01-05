
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

  // Get project budget items for dropdown
  const budgetItems = state.budgetItems.filter(b => b.projectId === projectId);

  const selectedSource = budgetItems.find(b => b.id === sourceCodeId);
  const selectedTarget = budgetItems.find(b => b.id === targetCodeId);
  
  // Calculate availability (simplified: planned - actual)
  const sourceAvailable = selectedSource ? selectedSource.planned - selectedSource.actual : 0;

  const handleTransfer = () => {
    if (!amount || !sourceCodeId || !targetCodeId || !reason) {
        alert("Please fill all fields.");
        return;
    }
    
    if (sourceCodeId === targetCodeId) {
        alert("Source and Target cannot be the same.");
        return;
    }
    
    if (amount > sourceAvailable) {
        alert(`Insufficient funds in source code. Available: ${formatCurrency(sourceAvailable)}`);
        return;
    }
    
    dispatch({
        type: 'TRANSFER_BUDGET',
        payload: {
            projectId,
            sourceItemId: sourceCodeId,
            targetItemId: targetCodeId,
            amount,
            reason
        }
    });

    onClose();
  };

  return (
    <div className="space-y-6">
      <div className={`flex items-center gap-3 p-4 ${theme.colors.semantic.info.bg} ${theme.colors.semantic.info.border} border rounded-lg ${theme.colors.semantic.info.text} text-sm`}>
        <ArrowRightLeft size={20} className="shrink-0"/>
        <span>Budget transfers reallocate authorized funds between cost codes. Transfers exceeding $10,000 require secondary approval workflow.</span>
      </div>
      
      <div className="grid grid-cols-2 gap-6 relative">
        <div className="absolute top-8 left-1/2 -translate-x-1/2 z-10 bg-slate-100 rounded-full p-1 border border-slate-300">
            <ArrowRightLeft size={16} className="text-slate-400"/>
        </div>
        
        <div className={`bg-slate-50 p-4 rounded-xl border ${theme.colors.border}`}>
            <label className={`block text-xs font-bold ${theme.colors.text.secondary} uppercase mb-2`}>From Source</label>
            <select className={`w-full p-2.5 border ${theme.colors.border} rounded-lg text-sm ${theme.colors.surface} focus:ring-2 focus:ring-nexus-500 outline-none`} value={sourceCodeId} onChange={e => setSourceCodeId(e.target.value)}>
                <option value="">Select Source Code...</option>
                {budgetItems.map(item => (
                    <option key={item.id} value={item.id}>{item.category}</option>
                ))}
            </select>
            {selectedSource && (
                <div className="mt-2 flex justify-between text-xs">
                    <span className={theme.colors.text.secondary}>Available:</span>
                    <span className={`font-bold font-mono ${amount > sourceAvailable ? 'text-red-500' : 'text-green-600'}`}>
                        {formatCurrency(sourceAvailable)}
                    </span>
                </div>
            )}
        </div>
        
        <div className={`bg-slate-50 p-4 rounded-xl border ${theme.colors.border}`}>
            <label className={`block text-xs font-bold ${theme.colors.text.secondary} uppercase mb-2`}>To Destination</label>
            <select className={`w-full p-2.5 border ${theme.colors.border} rounded-lg text-sm ${theme.colors.surface} focus:ring-2 focus:ring-nexus-500 outline-none`} value={targetCodeId} onChange={e => setTargetCodeId(e.target.value)}>
                <option value="">Select Target Code...</option>
                {budgetItems.map(item => (
                    <option key={item.id} value={item.id}>{item.category}</option>
                ))}
            </select>
             {selectedTarget && (
                <div className="mt-2 flex justify-between text-xs">
                    <span className={theme.colors.text.secondary}>Current Budget:</span>
                    <span className={`font-bold font-mono ${theme.colors.text.primary}`}>
                        {formatCurrency(selectedTarget.planned)}
                    </span>
                </div>
            )}
        </div>
      </div>

      <div>
         <label className={theme.typography.label + " block mb-1"}>Transfer Amount</label>
         <div className="relative">
             <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
             <input 
                type="number" 
                className={`w-full pl-8 pr-4 py-3 text-lg font-bold border ${theme.colors.border} rounded-lg focus:ring-2 focus:ring-nexus-500 outline-none ${theme.colors.surface} ${theme.colors.text.primary}`}
                value={amount} 
                onChange={e => setAmount(parseFloat(e.target.value))} 
                placeholder="0.00" 
            />
         </div>
         {amount > 10000 && (
             <div className="mt-2 text-xs text-orange-600 flex items-center gap-1 font-medium">
                 <AlertCircle size={12}/> High value transfer: Approval required.
             </div>
         )}
      </div>

      <div>
         <label className={theme.typography.label + " block mb-1"}>Justification</label>
         <textarea 
            className={`w-full p-3 border ${theme.colors.border} rounded-lg text-sm h-24 focus:ring-2 focus:ring-nexus-500 outline-none resize-none ${theme.colors.surface}`} 
            value={reason} 
            onChange={e => setReason(e.target.value)} 
            placeholder="Explain why funds are being moved..." 
         />
      </div>

      <div className={`flex justify-end gap-2 pt-4 border-t ${theme.colors.border.replace('border-', 'border-slate-')}100`}>
         <Button variant="secondary" onClick={onClose}>Cancel</Button>
         <Button onClick={handleTransfer} icon={CheckCircle} disabled={!sourceCodeId || !targetCodeId || amount <= 0 || amount > sourceAvailable}>
             Submit Transfer
         </Button>
      </div>
    </div>
  );
};

export default BudgetTransfer;
