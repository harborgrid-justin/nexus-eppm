
import React from 'react';
import { CostEstimate, WBSNode } from '../../../types/index';
import { Save, Calculator, FileText, BarChart2, ShieldCheck, History } from 'lucide-react';
import { Button } from '../../ui/Button';
import { formatCurrency } from '../../../utils/formatters';
import { useTheme } from '../../../context/ThemeContext';
import { Badge } from '../../ui/Badge';

interface EstimateHeaderProps {
    estimate: CostEstimate;
    wbsNode: WBSNode;
    onSave: () => void;
    activeTab: string;
    onTabChange: (tab: 'worksheet' | 'analysis' | 'boe') => void;
}

export const EstimateHeader: React.FC<EstimateHeaderProps> = ({ estimate, wbsNode, onSave, activeTab, onTabChange }) => {
    const theme = useTheme();
    return (
        <div className={`p-10 border-b ${theme.colors.border} bg-white flex flex-col gap-10 shadow-sm shrink-0 z-10 animate-nexus-in`}>
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
                <div className="flex items-center gap-6">
                    <div className={`p-5 bg-slate-900 text-white rounded-[1.5rem] shadow-2xl shadow-slate-900/20 border border-white/5 transition-transform hover:scale-105 active:scale-95 cursor-pointer`}>
                        <Calculator size={32}/>
                    </div>
                    <div>
                        <div className="flex items-center gap-4">
                            <h2 className="text-3xl font-black text-slate-950 uppercase tracking-tighter">{wbsNode.name}</h2>
                            <Badge variant={estimate.status === 'Approved' ? 'success' : 'warning'} className="font-black px-4 h-7 text-[10px] tracking-widest">{estimate.status}</Badge>
                        </div>
                        <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mt-2">
                            <span className="bg-slate-50 border border-slate-100 px-3 py-1 rounded-xl shadow-inner text-slate-500 font-mono">Node: {wbsNode.wbsCode}</span>
                            <div className="w-1.5 h-1.5 bg-slate-200 rounded-full"></div>
                            <span>AACE {estimate.class}</span>
                            <div className="w-1.5 h-1.5 bg-slate-200 rounded-full"></div>
                            <span>Artifact v{estimate.version}.0</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-12 bg-slate-50/50 border border-slate-100 p-6 rounded-[2.5rem] shadow-inner w-full lg:w-auto">
                    <div className="text-right">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1.5 flex items-center justify-end gap-2">
                            <History size={12}/> Net Validated Baseline
                        </p>
                        <p className="text-4xl font-mono font-black text-slate-900 tabular-nums tracking-tighter">{formatCurrency(estimate.totalCost)}</p>
                    </div>
                    <div className="h-12 w-px bg-slate-200 hidden sm:block"></div>
                    <Button 
                        onClick={onSave} 
                        icon={ShieldCheck} 
                        className="shadow-2xl shadow-nexus-500/20 px-10 h-14 font-black uppercase tracking-widest text-xs rounded-2xl transition-all active:scale-95"
                    >
                        Commit To Basis
                    </Button>
                </div>
            </div>
            
            <div className="flex justify-between items-center pt-8 border-t border-slate-50">
                <div className={`flex ${theme.colors.background} p-1.5 rounded-[1.5rem] border ${theme.colors.border} shadow-inner`}>
                    {[ 
                        { id: 'worksheet', label: 'Itemized Ledger', icon: Calculator }, 
                        { id: 'analysis', label: 'Mix Optimization', icon: BarChart2 }, 
                        { id: 'boe', label: 'Basis of Estimate', icon: FileText } 
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange(tab.id as any)}
                            className={`flex items-center gap-3 px-8 py-3 text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all duration-300 ${
                                activeTab === tab.id 
                                ? 'bg-white shadow-xl text-nexus-700 ring-1 ring-nexus-50 border border-nexus-100 scale-105 z-10' 
                                : 'text-slate-400 hover:text-slate-800 hover:bg-white/50'
                            }`}
                        >
                            <tab.icon size={16} className={activeTab === tab.id ? 'text-nexus-600' : 'opacity-40'}/> {tab.label}
                        </button>
                    ))}
                </div>
                <div className="hidden xl:flex items-center gap-3 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] italic opacity-60">
                    <ShieldCheck size={14}/> Baseline snapshot auto-archives on commit
                </div>
            </div>
        </div>
    );
};
