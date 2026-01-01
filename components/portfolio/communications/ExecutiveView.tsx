
import React from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { FileText, Send } from 'lucide-react';
import { ProgramCommunicationItem } from '../../../types';

interface ViewProps {
    plan: any[]; // Using generalized type for flexibility across mock/real
}

export const ExecutiveView: React.FC<ViewProps> = ({ plan }) => {
    const theme = useTheme();
    return (
        <div className="space-y-4">
            {plan.map(item => (
                <div key={item.id} className={`${theme.components.card} p-6 flex justify-between items-center`}>
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
                            <FileText size={24}/>
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900">{item.item}</h4>
                            <p className="text-sm text-slate-500">Frequency: {item.freq} • Owner: {item.owner}</p>
                        </div>
                    </div>
                    <button className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50 flex items-center gap-2">
                        <Send size={14}/> Send Update
                    </button>
                </div>
            ))}
            {plan.length === 0 && <div className="p-8 text-center text-slate-400">No executive communications scheduled.</div>}
        </div>
    );
};
