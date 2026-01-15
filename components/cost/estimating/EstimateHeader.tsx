
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
        <div className={`p-8 border-b ${theme.colors.border} bg-white flex flex-col gap-8 shadow-sm shrink-0 z-10 animate-nexus-in`}>
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div className="flex items-center gap-5">
                    <div className={`p-4 bg-slate-900 text-white rounded-2xl shadow-xl shadow-slate-900/20 border border-white/5`}>
                        <Calculator size={28}/>
                    </div>
                    <div>
                        <div className="flex items-center gap-3">
                            <h2 className="text-2xl font-black text-slate-950 uppercase tracking-tighter">{wbsNode.name}</h2>
                            <Badge variant={estimate.status === 'Approved' ? 'success' : 'neutral'} className="font-black px-3">{estimate.status}</Badge>
                        </div>
                        <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 mt-1.5">
                            <span className="bg-slate-50 border px-2 py-0.5 rounded shadow-inner">{wbsNode.wbsCode} Partition</span>
                            <span className="text-slate-200">|</span>
                            <span>AACE {estimate.class}</span>
                            <span className="text-slate-200">|</span>
                            <span>Version: {estimate.version}.0</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-10 bg-slate-50 border border-slate-100 p-5 rounded-[2rem] shadow-inner">
                    <div className="text-right">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 flex items-center justify-end gap-1.5">
                            <History size={12}/> Net Authorized Estimate
                        </p>
                        <p className="text-4xl font-mono font-black text-slate-900 tabular-nums tracking-tighter">{formatCurrency(estimate.totalCost)}</p>
                    </div>
                    <div className="h-10 w-px bg-slate-200"></div>
                    <Button onClick={onSave} icon={ShieldCheck} className="shadow-2xl shadow-nexus-500/20 px-8 h-12 font-black uppercase tracking-widest text-[10px] rounded-2xl">Commit Basis</Button>
                </div>
            </div>
            
            <div className="flex justify-between items-center border-t border-slate-50 pt-6">
                <div className={`flex ${theme.colors.background} p-1 rounded-2xl border ${theme.colors.border} shadow-inner`}>
                    {[ 
                        { id: 'worksheet', label: 'Itemized Ledger', icon: Calculator }, 
                        { id: 'analysis', label: 'Mix Analysis', icon: BarChart2 }, 
                        { id: 'boe', label: 'Basis of Estimate', icon: FileText } 
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange(tab.id as any)}
                            className={`flex items-center gap-3 px-6 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${activeTab === tab.id ? 'bg-white shadow-xl text-nexus-700 ring-1 ring-nexus-100' : 'text-slate-400 hover:text-slate-800'}`}
                        >
                            <tab.icon size={16} className={activeTab === tab.id ? 'text-nexus-600' : 'opacity-60'}/> {tab.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};
