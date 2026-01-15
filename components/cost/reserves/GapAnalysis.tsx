
import React from 'react';
import { formatCurrency } from '../../../utils/formatters';
import { Button } from '../../ui/Button';
import { ReserveAnalysisData } from '../../../types/index';
import { useI18n } from '../../../context/I18nContext';
import { useTheme } from '../../../context/ThemeContext';
import { Plus, ShieldAlert, Target } from 'lucide-react';

export const GapAnalysis: React.FC<{ data: ReserveAnalysisData; onAdjust: () => void }> = ({ data, onAdjust }) => {
    const { t } = useI18n();
    const theme = useTheme();
    const isAdequate = data.coverageRatio >= 1.0;
    const isUnmapped = data.totalReserves === 0;

    return (
        <div className={`${theme.colors.surface} border ${theme.colors.border} rounded-[2.5rem] p-8 h-full flex flex-col shadow-sm group hover:border-nexus-300 transition-all`}>
            <h3 className={`font-black text-[10px] uppercase tracking-widest text-slate-400 mb-8 border-b pb-3 flex items-center gap-2 group-hover:text-nexus-600 transition-colors`}>
                <ShieldAlert size={14} /> Probability / Reserve Exposure
            </h3>
            <div className="flex-1 flex flex-col justify-center gap-6">
                <div className={`p-6 rounded-[2rem] border transition-all duration-500 ${isUnmapped ? 'nexus-empty-pattern border-slate-100' : isAdequate ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200 shadow-xl shadow-red-500/5'}`}>
                    <p className={`text-[10px] font-black uppercase tracking-widest mb-1.5 ${isUnmapped ? 'text-slate-400' : isAdequate ? 'text-green-800' : 'text-red-800'}`}>
                        {isUnmapped ? 'Reserve Node Null' : isAdequate ? 'Baseline Safeguard OK' : 'Critical Funding Gap'}
                    </p>
                    <p className={`text-3xl font-black font-mono tracking-tighter ${isUnmapped ? 'text-slate-300' : isAdequate ? 'text-green-900' : 'text-red-900 animate-pulse'}`}>
                        {isUnmapped ? '$0.00' : (isAdequate ? '+' : '') + formatCurrency(data.totalReserves - data.currentRiskExposure)}
                    </p>
                </div>
            </div>
            
            <div className="mt-10 space-y-3">
                {isUnmapped ? (
                    <Button className="w-full h-12 shadow-lg shadow-nexus-500/20 font-black uppercase tracking-widest text-[10px]" icon={Plus} onClick={onAdjust}>Provision Reserve Basis</Button>
                ) : (
                    <Button 
                        className="w-full h-12 font-black uppercase tracking-widest text-[10px] shadow-sm" 
                        variant={isAdequate ? 'outline' : 'primary'} 
                        onClick={onAdjust}
                        icon={Target}
                    >
                        {isAdequate ? 'Adjust Risk Buffer' : 'Rebalance Contingency'}
                    </Button>
                )}
            </div>
        </div>
    );
};
