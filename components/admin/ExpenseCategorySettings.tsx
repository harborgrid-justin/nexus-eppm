
import React, { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { Receipt, Plus, Globe, Briefcase, Edit2, Trash2, Save, X } from 'lucide-react';
import { ActivityCodeScope, ExpenseCategory } from '../../types/index';
import { SidePanel } from '../ui/SidePanel';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { generateId } from '../../utils/formatters';
import { useTheme } from '../../context/ThemeContext';
import { EmptyGrid } from '../common/EmptyGrid';

export const ExpenseCategorySettings: React.FC = () => {
    const { state, dispatch } = useData();
    const theme = useTheme();
    const [activeScope, setActiveScope] = useState<ActivityCodeScope>('Global');
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Partial<ExpenseCategory> | null>(null);

    const filteredCategories = useMemo(() => {
        return state.expenseCategories.filter(ec => ec.scope === activeScope);
    }, [state.expenseCategories, activeScope]);

    const handleOpenPanel = (category?: ExpenseCategory) => {
        setEditingCategory(category || { name: '', scope: activeScope });
        setIsPanelOpen(true);
    };

    const handleSave = () => {
        if (!editingCategory?.name) return;
        const categoryToSave: ExpenseCategory = {
            id: editingCategory.id || generateId('EC'),
            name: editingCategory.name,
            scope: editingCategory.scope || 'Global',
        };
        dispatch({
            type: editingCategory.id ? 'ADMIN_UPDATE_EXPENSE_CATEGORY' : 'ADMIN_ADD_EXPENSE_CATEGORY',
            payload: categoryToSave
        });
        setIsPanelOpen(false);
    };

    const handleDelete = (id: string) => {
        if (confirm("Delete this category? This may affect existing expense records.")) {
            dispatch({ type: 'ADMIN_DELETE_EXPENSE_CATEGORY', payload: id });
        }
    };

    return (
        <div className="space-y-6 h-full flex flex-col">
            <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${theme.colors.surface} p-4 rounded-xl border ${theme.colors.border} shadow-sm`}>
                <div>
                    <h3 className={`font-bold ${theme.colors.text.primary} text-lg`}>Expense Category Dictionary</h3>
                    <p className={`text-sm ${theme.colors.text.secondary}`}>Define standardized cost categories for expense tracking and reporting.</p>
                </div>
                <Button size="sm" icon={Plus} onClick={() => handleOpenPanel()}>New Category</Button>
            </div>

            <div className={`flex ${theme.colors.background} p-1 rounded-lg w-full sm:w-min shadow-inner border ${theme.colors.border}`}>
                <button onClick={() => setActiveScope('Global')} className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-1.5 text-xs font-bold rounded-md ${activeScope === 'Global' ? `${theme.colors.surface} shadow` : `${theme.colors.text.secondary}`}`}><Globe size={14}/> Global</button>
                <button onClick={() => setActiveScope('Project')} className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-1.5 text-xs font-bold rounded-md ${activeScope === 'Project' ? `${theme.colors.surface} shadow` : `${theme.colors.text.secondary}`}`}><Briefcase size={14}/> Project</button>
            </div>

            <div className="flex-1 overflow-auto">
                {filteredCategories.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-10">
                        {filteredCategories.map(cat => (
                            <div key={cat.id} className={`${theme.colors.surface} border ${theme.colors.border} rounded-xl p-4 shadow-sm group hover:border-nexus-300 transition-all flex items-center justify-between`}>
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 ${theme.colors.background} rounded-lg ${theme.colors.text.tertiary} group-hover:bg-nexus-50 group-hover:text-nexus-600`}>
                                        <Receipt size={16}/>
                                    </div>
                                    <span className={`font-bold ${theme.colors.text.primary}`}>{cat.name}</span>
                                </div>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => handleOpenPanel(cat)} className={`p-1.5 hover:${theme.colors.background} rounded ${theme.colors.text.secondary}`}><Edit2 size={14}/></button>
                                    <button onClick={() => handleDelete(cat.id)} className={`p-1.5 hover:bg-red-50 rounded ${theme.colors.text.secondary} hover:text-red-500`}><Trash2 size={14}/></button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="h-full flex items-center justify-center">
                        <EmptyGrid 
                            title={`No ${activeScope} Categories`}
                            description={`Define cost categories for ${activeScope === 'Global' ? 'organization-wide' : 'project-specific'} expense reporting.`}
                            onAdd={() => handleOpenPanel()}
                            actionLabel="Add Category"
                            icon={Receipt}
                        />
                    </div>
                )}
            </div>
            
            <SidePanel
                isOpen={isPanelOpen}
                onClose={() => setIsPanelOpen(false)}
                title={editingCategory?.id ? "Edit Category" : "New Category"}
                footer={<>
                    <Button variant="secondary" onClick={() => setIsPanelOpen(false)}>Cancel</Button>
                    <Button onClick={handleSave} icon={Save}>Save Category</Button>
                </>}
            >
                <div className="space-y-4">
                    <Input label="Category Name" value={editingCategory?.name} onChange={e => setEditingCategory({...editingCategory, name: e.target.value})} />
                </div>
            </SidePanel>
        </div>
    );
};
