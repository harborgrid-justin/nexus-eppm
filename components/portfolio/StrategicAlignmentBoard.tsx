
import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Target, DollarSign, GripVertical, AlertTriangle, Plus, ShieldCheck, Activity } from 'lucide-react';
import { Card } from '../ui/Card';
import { formatCompactCurrency } from '../../utils/formatters';
import { useStrategicAlignmentLogic } from '../../hooks/domain/useStrategicAlignmentLogic';
import { EmptyGrid } from '../common/EmptyGrid';
import { PageLayout } from '../layout/standard/PageLayout';
import { PanelContainer } from '../layout/standard/PanelContainer';

const StrategicAlignmentBoard: React.FC = () => {
    const theme = useTheme();
    const { boardData, totalPortfolioBudget } = useStrategicAlignmentLogic();

    return (
        <PageLayout
            title="Strategic Alignment Workbench"
            subtitle="Visualizing investment distribution across organizational strategic pillars."
            icon={Target}
            actions={
                 <div className="flex items-center gap-6">
                    <div className="text-right hidden md:block">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Portfolio Capital</p>
                        <p className="text-xl font-black text-slate-900 font-mono leading-none">{formatCompactCurrency(totalPortfolioBudget)}</p>
                    </div>
                    <div className="flex items-center gap-2 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-sm">
                        <ShieldCheck size={16} className="text-nexus-600"/>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-700">Governance Locked</span>
                    </div>
                </div>
            }
        >
            <PanelContainer className="bg-slate-50/50">
                <div className="flex-1 overflow-x-auto overflow-y-hidden p-6 scrollbar-thin">
                    {boardData.length > 0 ? (
                        <div className={`flex h-full gap-8 min-w-max pb-2`}>
                            {boardData.map(column => (
                                <div key={column.id} className={`w-[360px] flex flex-col h-full bg-slate-50 border ${theme.colors.border} rounded-3xl shadow-inner relative overflow-hidden group/lane`}>
                                    {/* Column Header */}
                                    <div className={`p-6 border-b ${theme.colors.border} rounded-t-3xl bg-white shadow-sm z-10`}>
                                        <div className="flex justify-between items-start mb-4">
                                            <h3 className={`font-black text-slate-900 text-sm uppercase tracking-[0.1em] truncate w-56`}>{column.title}</h3>
                                            <button className="text-slate-400 hover:text-nexus-600 transition-colors"><Plus size={18}/></button>
                                        </div>
                                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                            <span className={`text-slate-400`}>{column.projects.length} Initiatives</span>
                                            <span className={`font-mono font-black text-nexus-700`}>{formatCompactCurrency(column.totalBudget)}</span>
                                        </div>
                                        <div className={`w-full bg-slate-100 h-2 rounded-full mt-4 overflow-hidden border border-slate-200 shadow-inner`}>
                                            <div className="h-full bg-nexus-600 transition-all duration-1000 shadow-[0_0_8px_rgba(14,165,233,0.3)]" style={{ width: `${Math.min(100, (column.totalBudget / (totalPortfolioBudget || 1)) * 100)}%` }}></div>
                                        </div>
                                    </div>

                                    {/* Cards Container */}
                                    <div className="flex-1 p-4 space-y-4 overflow-y-auto scrollbar-thin relative z-0">
                                        {column.projects.length > 0 ? (
                                            column.projects.map(p => (
                                                <Card 
                                                    key={p.id} 
                                                    className={`p-5 cursor-grab active:cursor-grabbing hover:shadow-xl hover:border-nexus-400 group relative border border-slate-200 bg-white rounded-2xl transition-all duration-300 hover:scale-[1.02]`}
                                                    draggable
                                                >
                                                    <div className="absolute top-4 right-4 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <GripVertical size={16}/>
                                                    </div>
                                                    <div className="mb-4">
                                                        <span className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-tighter">{p.code}</span>
                                                        <h4 className={`font-black text-sm text-slate-800 leading-tight uppercase mt-1 tracking-tight pr-4`}>{p.name}</h4>
                                                    </div>
                                                    <div className={`flex justify-between items-center pt-4 border-t border-slate-50`}>
                                                        <div className={`flex items-center gap-1.5 text-xs font-mono font-bold text-slate-500`}>
                                                            <DollarSign size={14} className="text-green-600 opacity-60"/> {formatCompactCurrency(p.budget)}
                                                        </div>
                                                        {p.strategicImportance < 5 ? (
                                                            <div className="text-[9px] font-black text-red-600 bg-red-50 border border-red-100 px-2 py-0.5 rounded-lg flex items-center gap-1 uppercase" title="Below strategic threshold">
                                                                <AlertTriangle size={10}/> Descope Rev
                                                            </div>
                                                        ) : (
                                                            <div className="text-[9px] font-black text-green-700 bg-green-50 border border-green-100 px-2 py-0.5 rounded-lg flex items-center gap-1 uppercase">
                                                                <ShieldCheck size={10}/> Baseline OK
                                                            </div>
                                                        )}
                                                    </div>
                                                    {/* Strategic Score Bar */}
                                                    <div className="mt-4 flex items-center gap-3">
                                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Index Score</span>
                                                        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-50">
                                                            <div 
                                                                className={`h-full transition-all duration-1000 ${p.strategicImportance >= 8 ? 'bg-green-500' : p.strategicImportance >= 5 ? 'bg-amber-400' : 'bg-red-500'}`} 
                                                                style={{ width: `${p.strategicImportance * 10}%` }}
                                                            ></div>
                                                        </div>
                                                        <span className={`text-[10px] font-mono font-black ${p.strategicImportance >= 8 ? 'text-green-700' : 'text-slate-400'}`}>{p.strategicImportance}</span>
                                                    </div>
                                                </Card>
                                            ))
                                        ) : (
                                            <div className="h-full py-8">
                                                <div className="h-full flex flex-col items-center justify-center nexus-empty-pattern rounded-3xl border-2 border-dashed border-slate-200">
                                                    <Activity size={32} className="text-slate-300 mb-2 opacity-20"/>
                                                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest text-center px-8 leading-relaxed">No initiatives aligned to this pillar.</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="h-full flex items-center justify-center">
                            <EmptyGrid title="Strategic Board Isolated" description="No strategic drivers identified in the organizational configuration. Define drivers to enable alignment mapping." icon={Target} />
                        </div>
                    )}
                </div>
            </PanelContainer>
        </PageLayout>
    );
};

export default StrategicAlignmentBoard;
