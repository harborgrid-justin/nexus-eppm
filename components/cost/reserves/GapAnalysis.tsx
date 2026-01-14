
import React from 'react';
import { formatCurrency } from '../../../utils/formatters';
import { Button } from '../../ui/Button';
import { ReserveAnalysisData } from '../../../types';
import { useI18n } from '../../../context/I18nContext';
import { useTheme } from '../../../context/ThemeContext';
import { Plus } from 'lucide-react';

export const GapAnalysis: React.FC<{ data: ReserveAnalysisData; onAdjust: () => void }> = ({ data, onAdjust }) => {
    const { t } = useI18n();
    const theme = useTheme();
    const isAdequate = data.coverageRatio >= 1.0;
    const isUnmapped = data.totalReserves === 0;

    return (
        <div className={`${theme.colors.surface} border ${theme.colors.border} rounded-lg p-6 h-full flex flex-col`}>
            <h3 className={`font-bold ${theme.colors.text.primary} mb-4`}>{t('cost.reserves.gap_title', 'Risk Exposure Gap')}</h3>
            <div className="flex-1 flex flex-col justify-center gap-6">
                <div className={`p-4 rounded-xl border ${isUnmapped ? 'nexus-empty-pattern border-slate-200' : isAdequate ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                    <p className={`text-sm font-bold mb-1 ${isUnmapped ? 'text-slate-400' : isAdequate ? 'text-green-800' : 'text-red-800'}`}>
                        {isUnmapped ? t('cost.reserves.unmapped', 'Reserves Not Initialized') : isAdequate ? t('cost.reserves.adequate', 'Adequate Coverage') : t('cost.reserves.shortfall', 'Reserve Shortfall')}
                    </p>
                    <p className={`text-2xl font-black ${isUnmapped ? 'text-slate-300' : isAdequate ? 'text-green-900' : 'text-red-900'}`}>
                        {isUnmapped ? '$0.00' : (isAdequate ? '+' : '') + formatCurrency(data.totalReserves - data.currentRiskExposure)}
                    </p>
                </div>
            </div>
            
            <div className="mt-6 space-y-2">
                {isUnmapped ? (
                    <Button className="w-full" icon={Plus} onClick={onAdjust}>{t('cost.reserves.init_action', 'Initialize Reserves')}</Button>
                ) : (
                    <Button className="w-full" variant={isAdequate ? 'outline' : 'primary'} onClick={onAdjust}>
                        {isAdequate ? t('cost.reserves.adjust', 'Adjust Levels') : t('cost.reserves.fund_action', 'Fund Shortfall')}
                    </Button>
                )}
            </div>
        </div>
    );
};
