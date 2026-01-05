import React, { useState, useMemo } from 'react';
import { useProjectWorkspace } from '../context/ProjectWorkspaceContext';
import { useTheme } from '../../context/ThemeContext';
import { BudgetTable } from './budget/BudgetTable';
import { BudgetDetailPanel } from './budget/BudgetDetailPanel';
import { calculateCommittedCost } from '../../utils/integrationUtils';
import { Button } from '../ui/Button';
import { Plus } from 'lucide-react';
import { SidePanel } from '../ui/SidePanel';
import { Input } from '../ui/Input';
import { useData } from '../../context/DataContext';
import { BudgetLineItem } from '../../types/index';
import { generateId } from '../../utils/formatters';

const CostBudgetView: React.FC = () => {
    const { project, budgetItems, purchaseOrders } = useProjectWorkspace();
    const { dispatch } = useData();
    const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [newItem, setNewItem] = useState<Partial<BudgetLineItem>>({ category: '', planned: 0 });
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

    const handleAddItem = () => {
        if (!newItem.category || !newItem.planned) return;
        const item: BudgetLineItem = {
            id: generateId('BLI'),
            projectId: project.id,
            category: newItem.category,
            planned: newItem.planned,
            actual: 0
        };
        dispatch({ type: 'ADD_BUDGET_ITEM', payload: item });
        setIsCreateOpen(false);
        setNewItem({ category: '', planned: 0 });
    };

    return (
        <div className="h-full flex relative overflow-hidden">
            <div className={`flex-1 flex flex-col transition-all duration-300 ${selectedItemId ? 'w-2/3' : 'w-full'}`}>
                <div className="p-4 border-b border-slate-200 flex justify-between items-center">
                    <h3 className="font-bold text-slate-800">Cost Breakdown Structure (CBS)</h3>
                    <Button size="sm" icon={Plus} onClick={() => setIsCreateOpen(true)}>Add Cost Code</Button>
                </div>
                <div className="flex-1 overflow-auto">
                    <BudgetTable items={tableData} onSelectItem={setSelectedItemId} />
                </div>
            </div>
            <BudgetDetailPanel item={selectedItem} linkedPOs={linkedPOs} onClose={() => setSelectedItemId(null)} />
            
            <SidePanel
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                title="New Budget Item"
                footer={<Button onClick={handleAddItem}>Create Item</Button>}
            >
                <div className="space-y-4">
                    <Input label="Category / Cost Code" value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value})} placeholder="e.g. 03-3000 Concrete" />
                    <Input label="Planned Budget" type="number" value={newItem.planned} onChange={e => setNewItem({...newItem, planned: parseFloat(e.target.value)})} />
                </div>
            </SidePanel>
        </div>
    );
};

export default CostBudgetView;