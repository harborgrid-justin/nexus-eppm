
import React, { useState, useMemo } from 'react';
import { useProjectWorkspace } from '../../context/ProjectWorkspaceContext';
import { useTheme } from '../../context/ThemeContext';
import { BudgetTable } from './budget/BudgetTable';
import { BudgetDetailPanel } from './budget/BudgetDetailPanel';
import { calculateCommittedCost } from '../../utils/integrationUtils';

const CostBudgetView: React.FC = () => {
    const { budgetItems, purchaseOrders } = useProjectWorkspace();
    const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
    const theme = useTheme();

    const tableData = useMemo(() => {
        return budgetItems.map(item => {
            const committed = calculateCommittedCost(purchaseOrders, item.id);
            const totalExposure = item.actual + committed;
            const remaining = item.planned - totalExposure;
            return { ...item, committed, totalExposure, remaining };
        });
    }, [budgetItems, purchaseOrders]);

    const selectedItem = tableData.find(i => i.id === selectedItemId);
    const linkedPOs = selectedItem ? purchaseOrders.filter(po => po.linkedBudgetLineItemId === selectedItemId) : [];

    return (
        <div className="h-full flex relative overflow-hidden">
            <div className={`flex-1 flex flex-col transition-all duration-300 ${selectedItemId ? 'w-2/3' : 'w-full'}`}>
                <div className="p-4 border-b border-slate-200">
                    <h3 className="font-bold text-slate-800">Cost Breakdown Structure (CBS)</h3>
                </div>
                <div className="flex-1 overflow-auto">
                    <BudgetTable items={tableData} onSelectItem={setSelectedItemId} />
                </div>
            </div>
            <BudgetDetailPanel item={selectedItem} linkedPOs={linkedPOs} onClose={() => setSelectedItemId(null)} />
        </div>
    );
};

export default CostBudgetView;
