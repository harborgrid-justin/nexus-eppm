
import React from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { Users } from 'lucide-react';

interface ViewProps {
    plan: any[];
}

export const TeamView: React.FC<ViewProps> = ({ plan }) => {
    const theme = useTheme();
    return (
        <div className="space-y-4">
            {plan.map(item => (
                <div key={item.id} className={`${theme.components.card} p-4`}>
                    <div className="flex items-center gap-3 mb-2">
                        <Users size={16} className="text-green-600"/>
                        <h4 className="font-bold text-slate-800">{item.item}</h4>
                    </div>
                    <div className="text-xs text-slate-500 flex justify-between border-t pt-2 mt-2">
                        <span>{item.channel}</span>
                        <span>{item.freq}</span>
                    </div>
                </div>
            ))}
            {plan.length === 0 && <div className="p-8 text-center text-slate-400">No team-level syncs defined.</div>}
        </div>
    );
};
