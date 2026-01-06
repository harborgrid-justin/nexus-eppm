import React from 'react';
import { RiskManagementPlan } from '../../../types/index';
import { BarChart2 } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

interface PlanThresholdsProps {
    formData: RiskManagementPlan;
    setFormData: (data: RiskManagementPlan) => void;
    isReadOnly: boolean;
}

export const PlanThresholds: React.FC<PlanThresholdsProps> = ({ formData, setFormData, isReadOnly }) => {
    const theme = useTheme();
    return (
        <div className="space-y-8 animate-in fade-in">
            <h3 className={`${theme.typography.h3} mb-4 flex items-center gap-2`}><BarChart2 /> Probability & Impact Matrix</h3>
            <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
                <div className="grid grid-cols-5 grid-rows-5 gap-1">
                    {[5,4,3,2,1].map(r => [1,2,3,4,5].map(c => {
                        const score = r * c;
                        let bg = 'bg-green-100';
                        if (score >= 15) bg = 'bg-red-200'; else if (score >= 8) bg = 'bg-yellow-100';
                        return <div key={`${r}-${c}`} className={`w-12 h-12 ${bg} rounded text-[10px] flex items-center justify-center`}>{score}</div>
                    }))}
                </div>
                <div className="space-y-4 flex-1">
                     <div className="flex items-center justify-between p-3 bg-red-50 border rounded-lg"><div className="flex items-center gap-3"><div className="w-3 h-3 bg-red-500 rounded-full"></div><span>Critical Priority</span></div><span className="font-mono text-xs">Score &ge; 15</span></div>
                     <div className="flex items-center justify-between p-3 bg-yellow-50 border rounded-lg"><div className="flex items-center gap-3"><div className="w-3 h-3 bg-yellow-500 rounded-full"></div><span>High Priority</span></div><span className="font-mono text-xs">8 &le; Score &lt; 15</span></div>
                     <div className="flex items-center justify-between p-3 bg-green-50 border rounded-lg"><div className="flex items-center gap-3"><div className="w-3 h-3 bg-green-500 rounded-full"></div><span>Low Priority</span></div><span className="font-mono text-xs">Score &lt; 8</span></div>
                </div>
            </div>
        </div>
    );
};
