
import React from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { Calendar } from 'lucide-react';

interface ViewProps {
    plan: any[];
}

export const PmoView: React.FC<ViewProps> = ({ plan }) => {
    const theme = useTheme();
    return (
        <div className="space-y-4">
            {plan.map(item => (
                <div key={item.id} className={`${theme.components.card} p-6 flex justify-between items-center border-l-4 border-l-nexus-500`}>
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-nexus-50 text-nexus-600 rounded-lg">
                            <Calendar size={24}/>
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900">{item.item}</h4>
                            <p className="text-sm text-slate-500">Cadence: {item.freq}</p>
                        </div>
                    </div>
                </div>
            ))}
            {plan.length === 0 && <div className="p-8 text-center text-slate-400">No PMO governance reviews scheduled.</div>}
        </div>
    );
};
