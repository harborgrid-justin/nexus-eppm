
import React from 'react';
import StatCard from '../../shared/StatCard';
import { DollarSign, ShoppingCart, Coins, Layers } from 'lucide-react';
import { formatCompactCurrency } from '../../../utils/formatters';

interface CostKPIsProps {
    financials: { revisedBudget: number; pendingCOAmount: number };
    projectBudget: number;
    committedCosts: number;
    costOfQuality: number;
    eac: number;
    isPending: boolean;
}

export const CostKPIs: React.FC<CostKPIsProps> = ({ 
    financials, projectBudget, committedCosts, costOfQuality, eac, isPending 
}) => {
    return (
        <div className={`grid grid-cols-1 md:grid-cols-4 gap-6 transition-opacity ${isPending ? 'opacity-50' : 'opacity-100'}`}>
            <StatCard title="Revised Budget" value={formatCompactCurrency(financials.revisedBudget)} subtext="Approved Baseline" icon={DollarSign} />
            <StatCard title="Committed Cost" value={formatCompactCurrency(committedCosts)} subtext="Issued PO Ledger" icon={ShoppingCart} />
            <StatCard title="Cost of Quality" value={formatCompactCurrency(costOfQuality)} subtext="Rework & Defects" icon={Coins} trend="down"/>
            <StatCard title="EAC (Forecast)" value={formatCompactCurrency(eac)} subtext={`Target: ${formatCompactCurrency(projectBudget)}`} icon={Layers} trend={projectBudget >= eac ? 'up' : 'down'} />
        </div>
    );
};
