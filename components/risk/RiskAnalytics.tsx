import React from 'react';
import { Risk } from '../../types';
import { RiskAnalyticsView } from './views/RiskAnalyticsView';

interface RiskAnalyticsProps {
    risks: Risk[];
    onSelectRisk?: (id: string) => void;
}

const RiskAnalytics: React.FC<RiskAnalyticsProps> = ({ risks, onSelectRisk = () => {} }) => {
    return (
        <div className="h-full bg-slate-50/50 overflow-auto">
            <RiskAnalyticsView risks={risks} onSelectRisk={onSelectRisk} />
        </div>
    );
};

export default RiskAnalytics;