
import React, { useState } from 'react';
import { Risk } from '../../types/index';
import { Shield, Check, Plus } from 'lucide-react';
import { Button } from '../ui/Button';
import { useTheme } from '../../context/ThemeContext';

interface RiskResponsePlanProps {
  risk: Risk;
}

const RiskResponsePlan: React.FC<RiskResponsePlanProps> = ({ risk }) => {
    const theme = useTheme();
    const [actions, setActions] = useState(risk.responseActions || []);

    const addAction = () => {
        setActions([...actions, { id: Date.now().toString(), description: 'New Action', ownerId: 'Unassigned', dueDate: 'TBD', status: 'Pending' }]);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h4 className={`${theme.typography.h3} flex items-center gap-2`}><Shield size={16}/> Mitigation Actions</h4>
                <Button size="sm" icon={Plus} onClick={addAction}>Add Step</Button>
            </div>
            <div className="space-y-2">
                {actions.map((action, i) => (
                    <div key={action.id} className={`flex items-center gap-3 p-3 ${theme.colors.background} border ${theme.colors.border} rounded-lg`}>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${action.status === 'Complete' ? 'bg-green-100 border-green-500 text-green-700' : `${theme.colors.surface} border-slate-300`}`}>
                            {action.status === 'Complete' && <Check size={14}/>}
                        </div>
                        <div className="flex-1">
                            <p className={`text-sm font-medium ${theme.colors.text.primary}`}>{action.description}</p>
                            <p className={`${theme.typography.small}`}>Owner: {action.ownerId} • Due: {action.dueDate}</p>
                        </div>
                    </div>
                ))}
                {actions.length === 0 && <p className={`text-sm ${theme.colors.text.tertiary} italic text-center`}>No mitigation actions defined.</p>}
            </div>
        </div>
    );
};

export default RiskResponsePlan;