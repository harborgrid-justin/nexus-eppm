
import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Target, DollarSign, GripVertical, AlertTriangle, Plus } from 'lucide-react';
import { Card } from '../ui/Card';
import { formatCompactCurrency } from '../../utils/formatters';
import { useStrategicAlignmentLogic } from '../../hooks/domain/useStrategicAlignmentLogic';
import { FieldPlaceholder } from '../common/FieldPlaceholder';

const StrategicAlignmentBoard: React.FC = () => {
    const theme = useTheme();
    const { boardData, totalPortfolioBudget } = useStrategicAlignmentLogic();

    return (
        <div className={`h-full overflow-hidden flex flex-col ${theme.layout.pagePadding} ${theme.layout.sectionSpacing}`}>
            <div className="flex justify-between items-center flex-shrink-0">
                <div>
                    <h2 className={theme.typography.h2}>Strategic Alignment Board</h2>
                    <p className={theme.typography.small}>Balance investment across strategic pillars.</p>
                </div>
                <div className={`flex items-center gap-2 ${theme.colors.background} p-2 rounded-lg text-sm ${theme.colors.text.secondary} border ${theme.colors.border}`}>
                    <Target size={16} className="text-nexus-600"/> Total Portfolio: <strong>{formatCompactCurrency(totalPortfolioBudget)}</strong>
                </div>
            </div>

            <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4">
                <div className={`flex h-full ${theme.layout.gridGap} min-w-max`}>
                    {boardData.map(column => (
                        <div key={column.id} className={`w-80 flex flex-col h-full ${theme.colors.background} rounded-xl border ${theme.colors.border} shadow-sm`}>
                            {/* Column Header */}
                            <div className={`p-4 border-b ${theme.colors.border} rounded-t-xl ${
                                column.title.includes('Growth') ? 'bg-blue-50/50' :
                                column.title.includes('Efficiency') ? 'bg-green-50/50' :
                                column.title.includes('Compliance') ? 'bg-purple-50/50' : `${theme.colors.surface}`
                            }`}>
                                <h3 className={`font-bold ${theme.colors.text.primary} text-sm mb-1`}>{column.title}</h3>
                                <div className="flex justify-between items-center text-xs">
                                    <span className={`${theme.colors.text.secondary} font-medium`}>{column.projects.length} Projects</span>
                                    <span className={`font-mono font-bold ${theme.colors.text.primary}`}>{formatCompactCurrency(column.totalBudget)}</span>
                                </div>
                                <div className={`w-full ${theme.colors.surface}/50 h-1.5 rounded-full mt-2 overflow-hidden`}>
                                    <div className="h-full bg-slate-800 opacity-20" style={{ width: `${Math.min(100, (column.totalBudget / 20000000) * 100)}%` }}></div>
                                </div>
                            </div>

                            {/* Cards Container */}
                            <div className="flex-1 p-3 space-y-3 overflow-y-auto scrollbar-thin">
                                {column.projects.length > 0 ? (
                                    column.projects.map(proj => (
                                        <Card 
                                            key={proj.id} 
                                            className={`p-3 cursor-grab active:cursor-grabbing hover:shadow-md hover:border-nexus-300 group relative border ${theme.colors.border} ${theme.colors.surface}`}
                                            draggable
                                        >
                                            <div className="absolute top-3 right-3 text-slate-300 opacity-0 group-hover:opacity-100">
                                                <GripVertical size={14}/>
                                            </div>
                                            <div className="mb-2">
                                                <span className="text-[10px] font-mono text-slate-400">{proj.code}</span>
                                                <h4 className={`font-bold text-sm ${theme.colors.text.primary} leading-tight`}>{proj.name}</h4>
                                            </div>
                                            <div className={`flex justify-between items-center pt-2 border-t ${theme.colors.border.replace('border-','border-slate-')}50`}>
                                                <div className={`flex items-center gap-1 text-xs font-mono ${theme.colors.text.secondary}`}>
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
                                    ))
                                ) : (
                                    <div className="h-full">
                                        <FieldPlaceholder 
                                            label="No Initiatives Aligned" 
                                            onAdd={() => {}} 
                                            className="h-full min-h-[120px]"
                                        />
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
