import React from 'react';
import { CostEstimate } from '../../../types';
import { useTheme } from '../../../context/ThemeContext';

interface BasisOfEstimateProps {
    estimate: CostEstimate;
    setEstimate: (e: CostEstimate) => void;
}

export const BasisOfEstimate: React.FC<BasisOfEstimateProps> = ({ estimate, setEstimate }) => {
    const theme = useTheme();
    return (
        <div className={`h-full ${theme.components.card} p-6 flex flex-col`}>
            <h3 className="font-bold text-slate-800 mb-4">Basis of Estimate (BoE) Narrative</h3>
            <p className="text-sm text-slate-500 mb-4">
                Document the methodology, assumptions, inclusions, and exclusions used to develop this cost estimate. 
                This narrative supports the confidence level and class of the estimate.
            </p>
            <textarea 
                className={`flex-1 w-full p-4 border ${theme.colors.border} rounded-lg text-sm leading-relaxed focus:ring-2 focus:ring-nexus-500 outline-none resize-none`}
                placeholder="e.g. Labor rates based on 2024 Union Agreement. Material quotes obtained from 3 vendors..."
                value={estimate.basisOfEstimate}
                onChange={(e) => setEstimate({ ...estimate, basisOfEstimate: e.target.value })}
            />
        </div>
    );
};
