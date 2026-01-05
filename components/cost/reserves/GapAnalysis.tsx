
import React from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { formatCurrency } from '../../../utils/formatters';
import { Button } from '../../ui/Button';
import { ReserveAnalysisData } from '../../../types';

export const GapAnalysis: React.FC<{ data: ReserveAnalysisData; onAdjust: () => void }> = ({ data, onAdjust }) => {
    const theme = useTheme();
    const isAdequate = data.coverageRatio >= 1.0;

    return (
        <div className={`${theme.components.card} ${theme.layout.cardPadding} h-full flex flex-col`}>
            <h3 className="font-bold text-slate-800 mb-4">Risk Exposure Gap</h3>
            <div className="flex-1 flex flex-col justify-center gap-6">
                <div className={`p-4 rounded-xl border ${isAdequate ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                    <p className="text-sm font-bold mb-1">{isAdequate ? 'Adequate Coverage' : 'Reserve Shortfall'}</p>
                    <p className="text-2xl font-black">{isAdequate ? '+' : ''}{formatCurrency(data.totalReserves - data.currentRiskExposure)}</p>
                </div>
                <div className="space-y-2 text-sm text-slate-600">
                    <div className="flex justify-between"><span>Risk Exposure:</span> <span className="font-bold">{formatCurrency(data.currentRiskExposure)}</span></div>
                    <div className="flex justify-between"><span>Available Reserve:</span> <span className="font-bold">{formatCurrency(data.totalReserves)}</span></div>
                </div>
            </div>
            <Button className="mt-6 w-full" onClick={onAdjust}>Adjust Reserves</Button>
        </div>
    );
};
