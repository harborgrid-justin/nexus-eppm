import React from 'react';
import { RiskManagementPlan } from '../../../types/index';
import { ListTree, Plus, Layers } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { Button } from '../../ui/Button';
import { Badge } from '../../ui/Badge';

interface PlanTaxonomyProps {
    formData: RiskManagementPlan;
    setFormData: (data: RiskManagementPlan) => void;
    isReadOnly: boolean;
}

export const PlanTaxonomy: React.FC<PlanTaxonomyProps> = ({ formData, setFormData, isReadOnly }) => {
    const theme = useTheme();
    return (
        <div className="space-y-8 animate-in fade-in">
            <div className="flex justify-between items-end border-b pb-4">
                <div>
                    <h3 className={`${theme.typography.h3} flex items-center gap-2`}><ListTree /> Risk Breakdown Structure (RBS)</h3>
                    <p className={`${theme.typography.small} mt-1`}>Hierarchical taxonomy for risk categorization.</p>
                </div>
                {!isReadOnly && <Button variant="secondary" size="sm" icon={Plus}>Add Category</Button>}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {formData.riskCategories.map((cat, idx) => (
                    <div key={idx} className="p-4 border rounded-lg hover:border-nexus-300 group bg-white">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-xs font-mono text-slate-400">RBS-L1-0{idx + 1}</span>
                            <Layers size={14} className="text-slate-300"/>
                        </div>
                        <h4 className="font-bold text-slate-700">{cat.name}</h4>
                        <div className="mt-4"><Badge variant="neutral">Standard</Badge></div>
                    </div>
                ))}
            </div>
        </div>
    );
};
