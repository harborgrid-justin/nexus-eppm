
import React from 'react';
import { ArrowRight, Save, XCircle, CheckCircle } from 'lucide-react';
import { Button } from '../../ui/Button';

interface Props {
  currentStep: { actions: string[] };
  onAction: (action: string) => void;
  onCancel: () => void;
}

export const FormActions: React.FC<Props> = ({ currentStep, onAction, onCancel }) => {
  const availableActions = currentStep?.actions.length > 0 ? currentStep.actions : ['Save Draft'];
  
  return (
    <div className="p-6 border-t border-slate-200 bg-slate-50/80 backdrop-blur-sm flex flex-col sm:flex-row justify-end gap-3 shrink-0 z-10">
        <Button variant="ghost" onClick={onCancel} className="font-bold uppercase tracking-widest text-[10px] h-11 px-8">Cancel</Button>
        {availableActions.map(action => {
            const isCritical = ['Reject', 'Terminate', 'Discard'].includes(action);
            const isSuccess = ['Submit', 'Approve', 'Certify', 'Commit'].includes(action);
            
            return (
                <Button 
                    key={action} 
                    onClick={() => onAction(action)}
                    variant={isCritical ? 'danger' : isSuccess ? 'primary' : 'secondary'}
                    icon={isSuccess ? ArrowRight : isCritical ? XCircle : Save}
                    className="font-black uppercase tracking-widest text-[10px] h-11 px-10 shadow-lg"
                >
                    {action}
                </Button>
            );
        })}
    </div>
  );
};
