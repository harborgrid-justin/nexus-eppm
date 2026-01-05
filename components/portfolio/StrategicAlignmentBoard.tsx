
import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Target, DollarSign, GripVertical, AlertTriangle } from 'lucide-react';
import { Card } from '../ui/Card';
import { formatCompactCurrency } from '../../utils/formatters';
import { useStrategicAlignmentLogic } from '../../hooks/domain/useStrategicAlignmentLogic';

const StrategicAlignmentBoard: React.FC = () => {
    const theme = useTheme();
    const { boardData, totalPortfolioBudget } = useStrategicAlignmentLogic();

    return (
        <div className={`h-full overflow-hidden flex flex-col ${theme.layout.pagePadding}`}>
            <div className="flex justify-between items-center mb-6 flex-shrink-0">
                <div>
                    <h2 className={theme.typography.h2}>Strategic Alignment Board</h2>
                    <p className={theme.typography.small}>Balance investment across strategic pillars.</p>
                </div>
                <div className="flex items-center gap-2 bg-slate-100 p-2 rounded-lg text-sm text-slate-600">
                    <Target size={16}/> Total Portfolio: <strong>{formatCompactCurrency(totalPortfolioBudget)}</strong>
                </div>
            </div>

            <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4">
                <div className="flex h-full gap-4 min-w-max">
                    {boardData.map(column => (
                        <div key={column.id} className="w-80 flex flex-col h-full bg-slate-50 rounded-xl border border-slate-200 shadow-sm">
                            {/* Column Header */}
                            <div className={`p-4 border-b border-slate-200 rounded-t-xl ${
                                column.title.includes('Growth') ? 'bg-blue-50 border-blue-200' :
                                column.title.includes('Efficiency') ? 'bg-green-50 border-green-200' :
                                column.title.includes('Compliance') ? 'bg-purple-50 border-purple-200' : 'bg-slate-100'
                            }`}>
                                <h3 className="font-bold text-slate-800 text-sm mb-1">{column.title}</h3>
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-slate-500 font-medium">{column.projects.length} Projects</span>
                                    <span className="font-mono font-bold text-slate-900">{formatCompactCurrency(column.totalBudget)}</span>
                                </div>
                                <div className="w-full bg-white/50 h-1.5 rounded-full mt-2 overflow-hidden">
                                    <div className="h-full bg-slate-800 opacity-20" style={{ width: `${Math.min(100, (column.totalBudget / 20000000) * 100)}%` }}></div>
                                </div>
                            </div>

                            {/* Cards Container */}
                            <div className="flex-1 p-3 space-y-3 overflow-y-auto scrollbar-thin">
                                {column.projects.map(proj => (
                                    <Card 
                                        key={proj.id} 
                                        className="p-3 cursor-grab active:cursor-grabbing hover:shadow-md hover:border-nexus-300 group relative border border-slate-200 bg-white"
                                        draggable
                                    >
                                        <div className="absolute top-3 right-3 text-slate-300 opacity-0 group-hover:opacity-100">
                                            <GripVertical size={14}/>
                                        </div>
                                        <div className="mb-2">
                                            <span className="text-[10px] font-mono text-slate-400">{proj.code}</span>
                                            <h4 className="font-bold text-sm text-slate-900 leading-tight">{proj.name}</h4>
                                        </div>
                                        <div className="flex justify-between items-center pt-2 border-t border-slate-50">
                                            <div className="flex items-center gap-1 text-xs font-mono text-slate-600">
                                                <DollarSign size={10}/> {formatCompactCurrency(proj.budget)}
                                            </div>
                                            {proj.strategicImportance < 5 && (
                                                <div className="text-[10px] text-orange-500 flex items-center gap-1" title="Low Strategic Score">
                                                    <AlertTriangle size={10}/> Review
                                                </div>
                                            )}
                                        </div>
                                        {/* Strategic Score Bar */}
                                        <div className="mt-2 flex items-center gap-2">
                                            <span className="text-[9px] font-bold text-slate-400 uppercase">Strat. Score</span>
                                            <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                <div 
                                                    className={`h-full ${proj.strategicImportance >= 8 ? 'bg-green-500' : proj.strategicImportance >= 5 ? 'bg-yellow-500' : 'bg-red-500'}`} 
                                                    style={{ width: `${proj.strategicImportance * 10}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-[9px] font-mono font-bold text-slate-600">{proj.strategicImportance}</span>
                                        </div>
                                    </Card>
                                ))}
                                {column.projects.length === 0 && (
                                    <div className="h-24 border-2 border-dashed border-slate-200 rounded-lg flex items-center justify-center text-xs text-slate-400 italic">
                                        Drop projects here
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StrategicAlignmentBoard;
