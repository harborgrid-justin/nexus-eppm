
import React from 'react';
import { RiskManagementPlan } from '../../../types';
import { Settings } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

interface PlanMethodologyProps {
    formData: RiskManagementPlan;
    setFormData: (data: RiskManagementPlan) => void;
    isReadOnly: boolean;
}

export const PlanMethodology: React.FC<PlanMethodologyProps> = ({ formData, setFormData, isReadOnly }) => {
    const theme = useTheme();
    const handleChange = (field: keyof RiskManagementPlan, value: any) => {
        setFormData({ ...formData, [field]: value });
    };

    return (
        <div className="space-y-8 animate-in fade-in">
             <div className="space-y-2">
                <label className={`${theme.typography.label} flex items-center gap-2`}><Settings /> Methodology & Approach</label>
                <textarea disabled={isReadOnly} className="w-full h-64 p-4 border rounded-lg text-sm" value={formData.approach} onChange={(e) => handleChange('approach', e.target.value)} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 rounded-xl border bg-slate-50"><h4 className="text-sm font-bold">Cadence: Weekly</h4></div>
                <div className="p-4 rounded-xl border bg-slate-50"><h4 className="text-sm font-bold">Analysis: Qualitative</h4></div>
                <div className="p-4 rounded-xl border bg-slate-50"><h4 className="text-sm font-bold">Tooling: Nexus + P6</h4></div>
            </div>
        </div>
    );
};
