
import React from 'react';
import { ChangeOrder } from '../../../types';
import { useTheme } from '../../../context/ThemeContext';
import { Badge } from '../../ui/Badge';
import { formatCompactCurrency } from '../../../utils/formatters';

interface ChangeOrderBoardProps {
    orders: ChangeOrder[];
    onSelect: (id: string) => void;
}

export const ChangeOrderBoard: React.FC<ChangeOrderBoardProps> = ({ orders, onSelect }) => {
    const theme = useTheme();
    const stages = ['Initiation', 'Technical Review', 'CCB Review', 'Execution'];

    return (
        <div className="flex h-full gap-4 overflow-x-auto pb-2">
            {stages.map(stage => (
                <div key={stage} className="flex-1 min-w-[280px] flex flex-col bg-slate-100 rounded-xl border">
                    <div className="p-3 border-b font-bold text-slate-700 text-sm flex justify-between">
                        {stage}
                        <span className="bg-white px-2 rounded-full text-xs">{orders.filter(c => c.stage === stage).length}</span>
                    </div>
                    <div className="flex-1 p-2 space-y-2 overflow-y-auto">
                        {orders.filter(c => c.stage === stage).map(co => (
                            <div key={co.id} onClick={() => onSelect(co.id)} className="bg-white p-3 cursor-pointer rounded-lg shadow-sm border hover:border-nexus-300">
                                <div className="flex justify-between items-start mb-1">
                                    <span className="text-xs font-mono text-slate-400">{co.id}</span>
                                    <Badge variant={co.priority === 'Critical' ? 'danger' : 'neutral'}>{co.priority}</Badge>
                                </div>
                                <h4 className="font-bold text-sm text-slate-800 mb-2">{co.title}</h4>
                                <div className="flex justify-between text-xs text-slate-500 border-t pt-2">
                                    <span>{formatCompactCurrency(co.amount)}</span>
                                    <span className={co.scheduleImpactDays > 0 ? 'text-red-500' : ''}>{co.scheduleImpactDays > 0 ? `+${co.scheduleImpactDays}d` : '-'}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};
