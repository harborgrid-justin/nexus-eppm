
import React from 'react';
import { useData } from '../../../context/DataContext';
import { FundingSource } from '../../../types';
import { Edit2, Trash2, DollarSign } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { formatCurrency } from '../../../utils/formatters';

interface FundingSourceGridProps {
    onEdit: (source: FundingSource) => void;
    onDelete: (id: string) => void;
}

export const FundingSourceGrid: React.FC<FundingSourceGridProps> = ({ onEdit, onDelete }) => {
    const { state } = useData();
    const theme = useTheme();

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {state.fundingSources.map(source => (
                <div key={source.id} className={`${theme.components.card} p-5 flex flex-col justify-between group hover:border-nexus-300 transition-all`}>
                    <div>
                        <div className="flex justify-between items-start mb-2">
                            <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                                <DollarSign size={20} />
                            </div>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => onEdit(source)} className="p-1.5 hover:bg-slate-100 rounded text-slate-400 hover:text-nexus-600">
                                    <Edit2 size={14} />
                                </button>
                                <button onClick={() => onDelete(source.id)} className="p-1.5 hover:bg-red-50 rounded text-slate-400 hover:text-red-500">
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                        <h4 className="font-bold text-slate-800 text-lg mb-1">{source.name}</h4>
                        <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full uppercase tracking-wider">{source.type}</span>
                        <p className="text-sm text-slate-600 mt-3 line-clamp-2">{source.description}</p>
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-100">
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">Authorized Amount</p>
                        <p className="text-xl font-mono font-black text-slate-900">{formatCurrency(source.totalAuthorized)}</p>
                    </div>
                </div>
            ))}
            {state.fundingSources.length === 0 && (
                <div className="col-span-full py-12 text-center text-slate-400 border-2 border-dashed border-slate-200 rounded-xl">
                    No funding sources defined.
                </div>
            )}
        </div>
    );
};
