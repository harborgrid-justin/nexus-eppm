
import React from 'react';
import { ChangeOrder } from '../../../types';
import { useTheme } from '../../../context/ThemeContext';
import { Badge } from '../../ui/Badge';
import { formatCompactCurrency } from '../../../utils/formatters';
import { MoreHorizontal, GripVertical, Plus } from 'lucide-react';

interface ChangeOrderBoardProps {
    orders: ChangeOrder[];
    onSelect: (id: string) => void;
}

export const ChangeOrderBoard: React.FC<ChangeOrderBoardProps> = ({ orders, onSelect }) => {
    const theme = useTheme();
    const stages = ['Draft', 'Pending Approval', 'Approved', 'Rejected'];

    return (
        <div className={`h-full flex gap-6 overflow-x-auto p-6 scrollbar-thin ${theme.colors.background}/30`}>
            {stages.map(stage => (
                <div key={stage} className={`w-80 flex-shrink-0 flex flex-col bg-slate-50 border ${theme.colors.border} rounded-3xl shadow-inner relative group/lane`}>
                    <div className={`p-5 border-b ${theme.colors.border} bg-white rounded-t-3xl flex justify-between items-center shadow-sm z-10`}>
                        <h3 className="font-black text-slate-800 text-[11px] uppercase tracking-[0.2em]">{stage}</h3>
                        <div className="flex items-center gap-2">
                             <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded-lg text-[10px] font-black">{orders.filter(c => c.status === stage).length}</span>
                             <button className="text-slate-300 hover:text-nexus-600 transition-colors"><Plus size={14}/></button>
                        </div>
                    </div>
                    <div className="flex-1 p-3 space-y-3 overflow-y-auto scrollbar-thin relative z-0">
                        {orders.filter(c => c.status === stage).map(co => (
                            <div key={co.id} onClick={() => onSelect(co.id)} className={`bg-white p-5 cursor-pointer rounded-2xl shadow-sm border border-slate-100 hover:border-nexus-300 hover:shadow-xl transition-all group active:scale-95 relative overflow-hidden`}>
                                <div className="absolute top-0 left-0 w-1.5 h-full bg-slate-200 group-hover:bg-nexus-500 transition-colors"></div>
                                <div className="flex justify-between items-start mb-3 pl-1">
                                    <span className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-tighter group-hover:text-nexus-600">{co.id}</span>
                                    <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-50 rounded-lg text-slate-400 transition-all"><MoreHorizontal size={14}/></button>
                                </div>
                                <h4 className="font-black text-slate-800 text-sm uppercase tracking-tight mb-4 leading-tight group-hover:text-nexus-700 transition-colors">{co.title}</h4>
                                <div className="flex justify-between items-center pt-3 border-t border-slate-50">
                                    <div className="flex items-center gap-1.5 text-[11px] font-mono font-black text-slate-700">
                                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                                        {formatCompactCurrency(co.amount)}
                                    </div>
                                    {co.priority === 'Critical' && <Badge variant="danger" className="scale-75 origin-right">CRITICAL</Badge>}
                                </div>
                            </div>
                        ))}
                        {orders.filter(c => c.status === stage).length === 0 && (
                            <div className="h-full flex flex-col items-center justify-center text-slate-300 opacity-40 grayscale nexus-empty-pattern rounded-2xl border-2 border-dashed border-slate-200 m-2">
                                <GripVertical size={24} className="mb-2"/>
                                <span className="text-[9px] font-black uppercase tracking-widest">Queue Null</span>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};
