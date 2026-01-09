
import React, { useState, useMemo } from 'react';
import { useProjectWorkspace } from '../../context/ProjectWorkspaceContext';
import { useTheme } from '../../context/ThemeContext';
import { BudgetTable } from './budget/BudgetTable';
import { BudgetDetailPanel } from './budget/BudgetDetailPanel';
import { calculateCommittedCost } from '../../utils/integrations/cost';
import { Button } from '../ui/Button';
import { Plus, AlertTriangle, CheckCircle, ArrowRightLeft } from 'lucide-react';
import { SidePanel } from '../ui/SidePanel';
import { Input } from '../ui/Input';
import { useData } from '../../context/DataContext';
import { BudgetLineItem } from '../../types/index';
import { generateId, formatCurrency } from '../../utils/formatters';
import { useToast } from '../../context/ToastContext';
import BudgetTransfer from './BudgetTransfer';

const CostBudgetView: React.FC = () => {
    const { project, budgetItems, purchaseOrders } = useProjectWorkspace();
    const { dispatch } = useData();
    const { success, error } = useToast();
    const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isTransferOpen, setIsTransferOpen] = useState(false);
    
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

    const totalAllocated = tableData.reduce((sum, item) => sum + item.planned, 0);
    const projectBudget = project ? project.budget : 0;
    const variance = projectBudget - totalAllocated;
    const isBalanced = Math.abs(variance) < 0.01;

    const selectedItem = tableData.find(i => i.id === selectedItemId);
    const linkedPOs = selectedItem ? purchaseOrders.filter(po => po.linkedBudgetLineItemId === selectedItemId) : [];

    const handleAddItem = () => {
        if (!newItem.category) {
            error("Validation Error", "Category name is required.");
            return;
        }
        if (!newItem.planned || newItem.planned <= 0) {
            error("Validation Error", "Planned amount must be greater than zero.");
            return;
        }
        
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
        success("Budget Item Created", `Added ${item.category} to Cost Breakdown Structure.`);
    };

    return (
        <div className="h-full flex relative overflow-hidden">
            <div className={`flex-1 flex flex-col transition-all duration-300 ${selectedItemId ? 'w-2/3' : 'w-full'}`}>
                {/* Rollup Validation Header */}
                <div className={`p-4 border-b border-slate-200 flex justify-between items-center ${isBalanced ? 'bg-slate-50' : 'bg-red-50'}`}>
                    <div>
                        <h3 className="font-bold text-slate-800">Cost Breakdown Structure (CBS)</h3>
                        <div className="flex items-center gap-4 mt-1 text-xs">
                            <span className="text-slate-500">Project Budget: <strong>{formatCurrency(projectBudget)}</strong></span>
                            <span className="text-slate-500">Allocated: <strong>{formatCurrency(totalAllocated)}</strong></span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {isBalanced ? (
                            <div className="flex items-center gap-2 text-green-700 font-bold text-xs bg-green-100 px-3 py-1.5 rounded-full border border-green-200">
                                <CheckCircle size={14}/> Fully Allocated
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 text-red-700 font-bold text-xs bg-white px-3 py-1.5 rounded-full border border-red-200 shadow-sm">
                                <AlertTriangle size={14}/> Variance: {formatCurrency(variance)}
                            </div>
                        )}
                        <Button size="sm" variant="outline" icon={ArrowRightLeft} onClick={() => setIsTransferOpen(true)}>Transfer</Button>
                        <Button size="sm" icon={Plus} onClick={() => setIsCreateOpen(true)}>Add Cost Code</Button>
                    </div>
                </div>
                
                <div className="flex-1 overflow-auto">
                    <BudgetTable items={tableData} onSelectItem={setSelectedItemId} />
                </div>
            </div>
            
            <BudgetDetailPanel item={selectedItem} linkedPOs={linkedPOs} onClose={() => setSelectedItemId(null)} />
            
            {/* Create Modal */}
            <SidePanel
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                title="New Budget Item"
                footer={
                    <div className="flex justify-end gap-2 w-full">
                        <Button variant="secondary" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                        <Button onClick={handleAddItem} icon={Plus}>Create Item</Button>
                    </div>
                }
            >
                <div className="space-y-4">
                    <Input label="Category / Cost Code" value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value})} placeholder="e.g. 03-3000 Concrete" />
                    <Input label="Planned Budget" type="number" value={newItem.planned} onChange={e => setNewItem({...newItem, planned: parseFloat(e.target.value)})} />
                </div>
            </SidePanel>
            
            {/* Transfer Modal */}
            {isTransferOpen && (
                <SidePanel 
                    isOpen={isTransferOpen}
                    onClose={() => setIsTransferOpen(false)}
                    title="Budget Transfer"
                    width="md:w-[600px]"
                >
                    <BudgetTransfer projectId={project.id} onClose={() => setIsTransferOpen(false)} />
                </SidePanel>
            )}
        </div>
    );
};

export default CostBudgetView;
