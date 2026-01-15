
import React, { useState } from 'react';
import { ProjectFunding, FundingSource } from '../../types';
import { Save, DollarSign, AlertCircle } from 'lucide-react';
import { SidePanel } from '../ui/SidePanel';
import { Button } from '../ui/Button';
import { useTheme } from '../../context/ThemeContext';
import { generateId } from '../../utils/formatters';

interface FundingAllocationModalProps {
  projectId: string;
  sources: FundingSource[];
  onClose: () => void;
  onSave: (funding: ProjectFunding) => void;
}

const FundingAllocationModal: React.FC<FundingAllocationModalProps> = ({ projectId, sources, onClose, onSave }) => {
  const theme = useTheme();
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
        id: generateId('TX'),
        date: new Date().toISOString().split('T')[0],
        type: 'Allocation' as const,
        amount: formData.amount,
        description: transactionNote || 'Initial allocation',
        approverId: 'CurrentUser' // In real app, from context
    };

    const finalFunding = { 
        ...formData, 
        id: generateId('PF'), 
        transactions: [initialTransaction] 
    } as ProjectFunding;

    onSave(finalFunding);
    onClose();
  };

  return (
    <SidePanel
       isOpen={true}
       onClose={onClose}
       width="md:w-[500px]"
       title={
          <div className="flex items-center gap-2 text-green-700">
             <DollarSign size={20}/> Allocate Funds
          </div>
       }
       footer={
         <>
             <Button variant="secondary" onClick={onClose}>Cancel</Button>
             <Button onClick={handleSubmit} icon={Save}>Allocate Funds</Button>
         </>
       }
    >
       <div className="space-y-6">
          <div>
             <label className={`${theme.typography.label} block mb-1`}>Funding Source</label>
             <select 
                 className={`w-full border ${theme.colors.border} rounded-lg p-2.5 text-sm bg-white focus:ring-2 focus:ring-nexus-500 outline-none`}
                 onChange={e => setFormData({...formData, fundingSourceId: e.target.value})}
             >
                 <option value="">-- Select Source --</option>
                 {sources.map(s => <option key={s.id} value={s.id}>{s.name} ({s.type})</option>)}
             </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
              <div>
                 <label className={`${theme.typography.label} block mb-1`}>Fiscal Year</label>
                 <select 
                     className={`w-full border ${theme.colors.border} rounded-lg p-2.5 text-sm bg-white focus:ring-2 focus:ring-nexus-500 outline-none`}
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
                 <label className={`${theme.typography.label} block mb-1`}>Status</label>
                 <select 
                     className={`w-full border ${theme.colors.border} rounded-lg p-2.5 text-sm bg-white focus:ring-2 focus:ring-nexus-500 outline-none`}
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
             <label className={`${theme.typography.label} block mb-1`}>Amount</label>
             <div className="relative">
                 <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold">$</span>
                 <input 
                     type="number" 
                     className={`w-full border ${theme.colors.border} rounded-lg pl-8 pr-4 py-3 text-lg font-mono font-bold focus:ring-2 focus:ring-nexus-500 outline-none transition-all`}
                     placeholder="0.00"
                     onChange={e => setFormData({...formData, amount: parseFloat(e.target.value)})}
                 />
             </div>
          </div>

          <div>
             <label className={`${theme.typography.label} block mb-1`}>Restrictions / Notes</label>
             <textarea 
                 className={`w-full border ${theme.colors.border} rounded-lg p-3 text-sm h-32 focus:ring-2 focus:ring-nexus-500 resize-none outline-none`}
                 placeholder="e.g., Cannot be used for software licensing..."
                 value={transactionNote}
                 onChange={e => setTransactionNote(e.target.value)}
             />
          </div>

          <div className="bg-blue-50 p-4 rounded-xl flex gap-3 items-start border border-blue-100">
             <AlertCircle size={20} className="text-blue-600 mt-0.5 shrink-0"/>
             <p className="text-xs text-blue-800 leading-relaxed font-medium">
                 Allocating funds creates a ledger entry. Ensure authorization documents are signed before setting status to 'Released'.
             </p>
          </div>
       </div>
    </SidePanel>
  );
};

export default FundingAllocationModal;
