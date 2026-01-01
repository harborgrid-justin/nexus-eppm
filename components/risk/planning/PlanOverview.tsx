
import React from 'react';
import { Project, RiskManagementPlan } from '../../../types';
import { Target, Layers, Info } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

interface PlanOverviewProps {
    formData: RiskManagementPlan;
    setFormData: (data: RiskManagementPlan) => void;
    isReadOnly: boolean;
    project: Project;
}

export const PlanOverview: React.FC<PlanOverviewProps> = ({ formData, setFormData, isReadOnly, project }) => {
    const theme = useTheme();
    const handleChange = (field: keyof RiskManagementPlan, value: any) => {
        setFormData({ ...formData, [field]: value });
    };

    return (
        <div className="space-y-8 animate-in fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className={`${theme.typography.label} flex items-center gap-2`}><Target /> Strategic Objectives</label>
                    <textarea disabled={isReadOnly} className="w-full h-40 p-4 border rounded-lg text-sm" value={formData.objectives} onChange={(e) => handleChange('objectives', e.target.value)} />
                </div>
                <div className="space-y-2">
                    <label className={`${theme.typography.label} flex items-center gap-2`}><Layers /> Governance Scope</label>
                    <textarea disabled={isReadOnly} className="w-full h-40 p-4 border rounded-lg text-sm" value={formData.scope} onChange={(e) => handleChange('scope', e.target.value)} />
                </div>
            </div>
            <div className="p-5 bg-blue-50 border border-blue-200 rounded-xl flex gap-4 items-start">
                <Info size={20} className="text-blue-600 mt-0.5 shrink-0"/>
                <div>
                    <h4 className="text-sm font-bold text-blue-900">Project Context</h4>
                    <p className="text-xs text-blue-800 mt-1">This plan is bound to project <strong>{project.name}</strong> ({project.code}).</p>
                </div>
            </div>
        </div>
    );
};
