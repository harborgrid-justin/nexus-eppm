
import React, { useState } from 'react';
import { ArrowRightLeft, CheckCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useTheme } from '../../context/ThemeContext';

interface BudgetTransferProps {
  projectId: string;
  onClose: () => void;
}

const BudgetTransfer: React.FC<BudgetTransferProps> = ({ projectId, onClose }) => {
  const theme = useTheme();
  const [amount, setAmount] = useState<number>(0);
  const [sourceCode, setSourceCode] = useState('');
  const [targetCode, setTargetCode] = useState('');
  const [reason, setReason] = useState('');

  const handleTransfer = () => {
    // Dispatch logic would go here
    alert(`Transferred $${amount} from ${sourceCode} to ${targetCode}`);
    onClose();
  };

  return (
    <div className="space-y-6">
      <div className={`flex items-center gap-2 p-4 ${theme.colors.semantic.info.bg} ${theme.colors.semantic.info.border} border rounded-lg ${theme.colors.semantic.info.text} text-sm`}>
        <ArrowRightLeft size={18} />
        <span>Budget transfers require approval if exceeding $10,000.</span>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
            <label className={theme.typography.label + " block mb-1"}>Source Cost Code</label>
            <select className={`w-full p-2 border ${theme.colors.border} rounded-lg text-sm ${theme.colors.surface} focus:ring-2 focus:ring-nexus-500 outline-none`} value={sourceCode} onChange={e => setSourceCode(e.target.value)}>
                <option value="">Select Source...</option>
                <option value="10-000">10-000: General Labor</option>
                <option value="20-000">20-000: Materials</option>
                <option value="30-000">30-000: Contingency</option>
            </select>
        </div>
        <div>
            <label className={theme.typography.label + " block mb-1"}>Target Cost Code</label>
            <select className={`w-full p-2 border ${theme.colors.border} rounded-lg text-sm ${theme.colors.surface} focus:ring-2 focus:ring-nexus-500 outline-none`} value={targetCode} onChange={e => setTargetCode(e.target.value)}>
                <option value="">Select Target...</option>
                <option value="10-000">10-000: General Labor</option>
                <option value="20-000">20-000: Materials</option>
                <option value="50-000">50-000: Equipment</option>
            </select>
        </div>
      </div>

      <div>
         <label className={theme.typography.label + " block mb-1"}>Transfer Amount</label>
         <Input type="number" value={amount} onChange={e => setAmount(parseFloat(e.target.value))} placeholder="0.00" />
      </div>

      <div>
         <label className={theme.typography.label + " block mb-1"}>Justification</label>
         <textarea 
            className={`w-full p-3 border ${theme.colors.border} rounded-lg text-sm h-24 focus:ring-2 focus:ring-nexus-500 outline-none resize-none`} 
            value={reason} 
            onChange={e => setReason(e.target.value)} 
            placeholder="Reason for transfer..." 
         />
      </div>

      <div className="flex justify-end gap-2 pt-4">
         <Button variant="secondary" onClick={onClose}>Cancel</Button>
         <Button onClick={handleTransfer} icon={CheckCircle}>Submit Transfer</Button>
      </div>
    </div>
  );
};

export default BudgetTransfer;