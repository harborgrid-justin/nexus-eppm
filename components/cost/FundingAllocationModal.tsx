
import React, { useState } from 'react';
import { ProjectFunding, FundingSource } from '../../types';
import { X, Save, DollarSign, AlertCircle } from 'lucide-react';
import { usePermissions } from '../../hooks/usePermissions';

interface FundingAllocationModalProps {
  projectId: string;
  sources: FundingSource[];
  onClose: () => void;
  onSave: (funding: Partial<ProjectFunding>) => void;
}

const FundingAllocationModal: React.FC<FundingAllocationModalProps> = ({ projectId, sources, onClose, onSave }) => {
  const [formData, setFormData] = useState<Partial<ProjectFunding>>({
    projectId,
    status: 'Planned',
    amount: 0,
    fiscalYear: new Date().getFullYear().toString(),
    transactions: []
  });
  
  const [transactionNote, setTransactionNote] = useState('');

  const handleSubmit = () => {
    if (!formData.fundingSourceId || !formData.amount) return;
    
    // Auto-generate the first transaction ledger entry
    const initialTransaction = {
        id: `TX-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        type: 'Allocation' as const,
        amount: formData.amount,
        description: transactionNote || 'Initial allocation',
        approvedBy: 'CurrentUser' // In real app, from context
    };

    onSave({ ...formData, transactions: [initialTransaction] });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
       <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
          <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50">
             <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <DollarSign className="text-green-600" size={20}/> Allocate Funds
             </h2>
             <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
             </button>
          </div>

          <div className="p-6 space-y-4">
             <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Funding Source</label>
                <select 
                    className="w-full border border-slate-300 rounded-lg p-2 text-sm"
                    onChange={e => setFormData({...formData, fundingSourceId: e.target.value})}
                >
                    <option value="">-- Select Source --</option>
                    {sources.map(s => <option key={s.id} value={s.id}>{s.name} ({s.type})</option>)}
                </select>
             </div>

             <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Fiscal Year</label>
                    <select 
                        className="w-full border border-slate-300 rounded-lg p-2 text-sm"
                        value={formData.fiscalYear}
                        onChange={e => setFormData({...formData, fiscalYear: e.target.value})}
                    >
                        <option>2023</option>
                        <option>2024</option>
                        <option>2025</option>
                        <option>2026</option>
                    </select>
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                    <select 
                        className="w-full border border-slate-300 rounded-lg p-2 text-sm"
                        value={formData.status}
                        onChange={e => setFormData({...formData, status: e.target.value as any})}
                    >
                        <option value="Planned">Planned</option>
                        <option value="Authorized">Authorized</option>
                        <option value="Released">Released</option>
                    </select>
                 </div>
             </div>

             <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Amount</label>
                <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                    <input 
                        type="number" 
                        className="w-full border border-slate-300 rounded-lg pl-8 pr-4 py-2 text-sm font-mono font-bold"
                        placeholder="0.00"
                        onChange={e => setFormData({...formData, amount: parseFloat(e.target.value)})}
                    />
                </div>
             </div>

             <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Restrictions / Notes</label>
                <textarea 
                    className="w-full border border-slate-300 rounded-lg p-2 text-sm h-20"
                    placeholder="e.g., Cannot be used for software licensing..."
                    value={transactionNote}
                    onChange={e => setTransactionNote(e.target.value)}
                />
             </div>

             <div className="bg-blue-50 p-3 rounded-lg flex gap-2 items-start border border-blue-100">
                <AlertCircle size={16} className="text-blue-600 mt-0.5 shrink-0"/>
                <p className="text-xs text-blue-700">
                    Allocating funds creates a ledger entry. Ensure authorization documents are signed before setting status to 'Released'.
                </p>
             </div>
          </div>

          <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
             <button onClick={onClose} className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">Cancel</button>
             <button onClick={handleSubmit} className="px-4 py-2 bg-nexus-600 rounded-lg text-sm font-medium text-white hover:bg-nexus-700 shadow-sm flex items-center gap-2">
                <Save size={16}/> Allocate Funds
             </button>
          </div>
       </div>
    </div>
  );
};

export default FundingAllocationModal;
