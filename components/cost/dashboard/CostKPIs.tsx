import React from 'react';
import StatCard from '../../shared/StatCard';
import { DollarSign, ShoppingCart, Coins, Layers, Activity } from 'lucide-react';
import { formatCompactCurrency } from '../../../utils/formatters';
import { useTheme } from '../../../context/ThemeContext';

interface CostKPIsProps {
    financials: { revisedBudget: number; pendingCOAmount: number; budgetUtilization: number };
    projectBudget: number;
    committedCosts: number;
    costOfQuality: number;
    eac: number;
    isPending: boolean;
}

export const CostKPIs: React.FC<CostKPIsProps> = ({ 
    financials, projectBudget, committedCosts, costOfQuality, eac, isPending 
}) => {
    const theme = useTheme();
    return (
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 ${theme.layout.gridGap} transition-all duration-700 ${isPending ? 'opacity-40 blur-[2px]' : 'opacity-100'}`}>
            <StatCard 
                title="Authorization Basis" 
                value={formatCompactCurrency(financials.revisedBudget)} 
                subtext={`Pending: ${formatCompactCurrency(financials.pendingCOAmount)}`} 
                icon={DollarSign} 
            />
            <StatCard 
                title="Thread Commitments" 
                value={formatCompactCurrency(committedCosts)} 
                subtext={`${financials.budgetUtilization.toFixed(1)}% Saturation`} 
                icon={ShoppingCart} 
            />
            <StatCard 
                title="Friction (CoQ)" 
                value={formatCompactCurrency(costOfQuality)} 
                subtext="Rework & NCR impact" 
                icon={Coins} 
                trend="down"
            />
            <StatCard 
                title="EAC Projection" 
                value={formatCompactCurrency(eac)} 
                subtext={`Limit: ${formatCompactCurrency(projectBudget)}`} 
                icon={Activity} 
                trend={projectBudget >= eac ? 'up' : 'down'} 
            />
        </div>
    );
};