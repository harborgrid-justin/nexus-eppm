import React from 'react';
import { CostEstimate, WBSNode } from '../../../types';
import { Save, Calculator, FileText, BarChart2 } from 'lucide-react';
import { Button } from '../../ui/Button';
import { formatCurrency } from '../../../utils/formatters';
import { useTheme } from '../../../context/ThemeContext';

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
        <div className={`p-4 border-b ${theme.colors.border} bg-white flex flex-col gap-4`}>
            <div className="flex justify-between items-start">
                <div>
                    <div className="flex items-center gap-2">
                        <h2 className="text-lg font-bold text-slate-800">{wbsNode.name}</h2>
                        <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-mono">{wbsNode.wbsCode}</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-slate-500 mt-1">
                        <span>{estimate.class}</span>
                        <span>•</span>
                        <span>Ver. {estimate.version}</span>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Total Estimate</p>
                    <p className="text-2xl font-mono font-black text-nexus-700">{formatCurrency(estimate.totalCost)}</p>
                </div>
            </div>
            
            <div className="flex justify-between items-center">
                <div className="flex bg-slate-100 p-1 rounded-lg">
                    {[ { id: 'worksheet', label: 'Worksheet', icon: Calculator }, { id: 'analysis', label: 'Analysis', icon: BarChart2 }, { id: 'boe', label: 'Basis of Estimate', icon: FileText } ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange(tab.id as any)}
                            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-md transition-all ${activeTab === tab.id ? 'bg-white shadow text-nexus-700' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            <tab.icon size={14}/> {tab.label}
                        </button>
                    ))}
                </div>
                <Button size="sm" icon={Save} onClick={onSave}>Save Estimate</Button>
            </div>
        </div>
    );
};
