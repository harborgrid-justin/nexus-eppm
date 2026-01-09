
import React from 'react';
import { Plus, Search, Loader2, Receipt } from 'lucide-react';
import { SidePanel } from '../ui/SidePanel';
import { Button } from '../ui/Button';
import { useCostExpensesLogic } from '../../hooks/domain/useCostExpensesLogic';
import { ExpenseForm } from './expenses/ExpenseForm';
import { ExpenseTable } from './expenses/ExpenseTable';
import { EmptyGrid } from '../common/EmptyGrid';

interface CostExpensesProps {
    projectId: string;
}

const CostExpenses: React.FC<CostExpensesProps> = ({ projectId }) => {
    const {
        searchTerm,
        setSearchTerm,
        deferredSearch,
        isPanelOpen,
        setIsPanelOpen,
        filteredExpenses,
        handleSaveExpense,
    } = useCostExpensesLogic(projectId);

    return (
        <div className="h-full flex flex-col">
            <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50 flex-shrink-0">
                <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                        type="text" 
                        placeholder="Search expenses..." 
                        className="pl-9 pr-4 py-1.5 text-sm border border-slate-300 rounded-md w-64 focus:outline-none focus:ring-1 focus:ring-nexus-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm !== deferredSearch && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <Loader2 size={12} className="animate-spin text-slate-400"/>
                        </div>
                    )}
                </div>
                <button 
                    onClick={() => setIsPanelOpen(true)}
                    className="px-3 py-2 bg-nexus-600 text-white rounded-lg flex items-center gap-2 hover:bg-nexus-700 shadow-sm text-sm font-medium"
                >
                    <Plus size={16} /> Add Expense
                </button>
            </div>

            <div className={`flex-1 overflow-auto transition-opacity duration-200 ${searchTerm !== deferredSearch ? 'opacity-60' : 'opacity-100'}`}>
                {filteredExpenses.length > 0 ? (
                    <ExpenseTable expenses={filteredExpenses} />
                ) : (
                     <div className="h-full flex items-center justify-center">
                         <EmptyGrid 
                            title="No Expenses Logged"
                            description={deferredSearch ? `No expenses found matching "${deferredSearch}".` : "The expense ledger is empty. Add non-labor costs like travel or materials."}
                            icon={Receipt}
                            actionLabel="Add Expense"
                            onAdd={() => setIsPanelOpen(true)}
                         />
                     </div>
                )}
            </div>

            <ExpenseForm 
                isOpen={isPanelOpen}
                onClose={() => setIsPanelOpen(false)}
                onSave={handleSaveExpense}
                projectId={projectId}
            />
        </div>
    );
};

export default CostExpenses;
