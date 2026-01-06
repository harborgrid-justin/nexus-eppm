
import React from 'react';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';
import { HardHat, Code, CheckCircle } from 'lucide-react';

export const IndustrySeeder: React.FC = () => {
    const { state } = useData();
    const theme = useTheme();

    // Check against live data to see if template is applied
    const isConstructionApplied = state.activityCodes.some(ac => ac.name === 'CSI Division');
    const isSoftwareApplied = state.activityCodes.some(ac => ac.name === 'Sprint Phase');

    const industries = [
        { 
            id: 'Construction', 
            label: 'Construction & Engineering', 
            icon: HardHat, 
            desc: 'CSI codes, Safety roles, and Field issue types.',
            applied: isConstructionApplied 
        },
        { 
            id: 'Software', 
            label: 'Software Development', 
            icon: Code, 
            desc: 'Agile roles, Sprint phases, and Bug severity codes.',
            applied: isSoftwareApplied 
        },
    ];

    return (
        <div className={`${theme.components.card} p-6`}>
            <div className="mb-4">
                <h3 className="font-bold text-slate-800 text-lg">Industry Knowledge Base</h3>
                <p className="text-sm text-slate-500">Accelerate setup by injecting standard codes and roles for your vertical.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {industries.map((ind) => (
                    <div key={ind.id} className={`p-4 border rounded-xl transition-all ${ind.applied ? 'bg-green-50 border-green-200' : 'bg-white border-slate-200'}`}>
                        <div className="flex items-start justify-between mb-3">
                            <div className={`p-3 rounded-lg ${ind.applied ? 'bg-white text-green-600' : 'bg-slate-50 text-slate-600'}`}>
                                <ind.icon size={24} />
                            </div>
                        </div>
                        <h4 className="font-bold text-slate-900">{ind.label}</h4>
                        <p className="text-xs text-slate-500 mt-1 mb-4 h-10">{ind.desc}</p>
                        
                        {ind.applied ? (
                            <div className="flex items-center justify-center gap-2 mt-4 text-green-700 font-bold text-sm bg-green-100 p-2 rounded-lg border border-green-200">
                                <CheckCircle size={16} /> Applied
                            </div>
                        ) : (
                            <div className="flex items-center justify-center gap-2 mt-4 text-slate-500 font-bold text-sm bg-slate-100 p-2 rounded-lg border border-slate-200">
                                Not Applied
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};
