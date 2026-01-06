
import React from 'react';
import { formatCurrency } from '../../../utils/formatters';
import { Button } from '../../ui/Button';
import { ReserveAnalysisData } from '../../../types';

export const GapAnalysis: React.FC<{ data: ReserveAnalysisData; onAdjust: () => void }> = ({ data, onAdjust }) => {
    const isAdequate = data.coverageRatio >= 1.0;

    return (
        <div className="bg-surface border border-border rounded-lg p-[var(--spacing-cardPadding)] h-full flex flex-col">
            <h3 className="font-bold text-text-primary mb-4">Risk Exposure Gap</h3>
            <div className="flex-1 flex flex-col justify-center gap-6">
                <div className={`p-4 rounded-xl border ${isAdequate ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                    <p className="text-sm font-bold mb-1">{isAdequate ? 'Adequate Coverage' : 'Reserve Shortfall'}</p>
                    <p className="text-2xl font-black">{isAdequate ? '+' : ''}{formatCurrency(data.totalReserves - data.currentRiskExposure)}</p>
                </div>
                <div className="space-y-2 text-sm text-text-secondary">
                    <div className="flex justify-between"><span>Risk Exposure:</span> <span className="font-bold">{formatCurrency(data.currentRiskExposure)}</span></div>
                    <div className="flex justify-between"><span>Available Reserve:</span> <span className="font-bold">{formatCurrency(data.totalReserves)}</span></div>
                </div>
            </div>
            <Button className="mt-6 w-full" onClick={onAdjust}>Adjust Reserves</Button>
        </div>
    );
};
