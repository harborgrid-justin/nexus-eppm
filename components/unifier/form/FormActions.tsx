import React from 'react';
import { ArrowRight, Save } from 'lucide-react';
import { Button } from '../../ui/Button';

interface Props {
  currentStep: { actions: string[] };
  onAction: (action: string) => void;
  onCancel: () => void;
}

export const FormActions: React.FC<Props> = ({ currentStep, onAction, onCancel }) => {
  const availableActions = currentStep?.actions.length > 0 ? currentStep.actions : ['Save'];
  
  return (
    <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        {availableActions.map(action => (
            <Button 
                key={action} 
                onClick={() => onAction(action)}
                variant={action === 'Reject' ? 'danger' : 'primary'}
                icon={['Submit', 'Approve', 'Certify'].includes(action) ? ArrowRight : Save}
            >
                {action}
            </Button>
        ))}
    </div>
  );
};