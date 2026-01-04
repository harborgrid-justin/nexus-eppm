
import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';
import { HardHat, Code, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { INDUSTRY_SEEDS } from '../../constants/industry_seeds';

export const IndustrySeeder: React.FC = () => {
    const { state, dispatch } = useData();
    const theme = useTheme();
    const [seeding, setSeeding] = useState<string | null>(null);

    // Check against live data to see if template is applied
    const isConstructionApplied = state.activityCodes.some(ac => ac.name === 'CSI Division');
    const isSoftwareApplied = state.activityCodes.some(ac => ac.name === 'Sprint Phase');

    const handleSeed = (industry: keyof typeof INDUSTRY_SEEDS) => {
        setSeeding(industry);
        setTimeout(() => {
            const data = INDUSTRY_SEEDS[industry];
            
            // Batch dispatch
            data.roles.forEach(role => dispatch({ type: 'ADMIN_ADD_ROLE', payload: role }));
            data.activityCodes.forEach(ac => dispatch({ type: 'ADMIN_ADD_ACTIVITY_CODE', payload: ac }));
            data.issueCodes.forEach(ic => dispatch({ type: 'ADMIN_ADD_ISSUE_CODE', payload: ic }));
            
            setSeeding(null);
        }, 1500);
    };

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
                {industries.map((ind) => {
                    const isProcessing = seeding === ind.id;

                    return (
                        <div key={ind.id} className={`p-4 border rounded-xl transition-all ${ind.applied ? 'bg-green-50 border-green-200' : 'bg-white border-slate-200 hover:border-nexus-300'}`}>
                            <div className="flex items-start justify-between mb-3">
                                <div className={`p-3 rounded-lg ${ind.applied ? 'bg-white text-green-600' : 'bg-slate-50 text-slate-600'}`}>
                                    <ind.icon size={24} />
                                </div>
                                {ind.applied && <CheckCircle size={20} className="text-green-600" />}
                            </div>
                            <h4 className="font-bold text-slate-900">{ind.label}</h4>
                            <p className="text-xs text-slate-500 mt-1 mb-4 h-10">{ind.desc}</p>
                            
                            <Button 
                                className="w-full" 
                                variant={ind.applied ? 'outline' : 'primary'}
                                onClick={() => handleSeed(ind.id as any)}
                                disabled={ind.applied || isProcessing}
                            >
                                {isProcessing ? <Loader2 className="animate-spin" size={16} /> : ind.applied ? 'Applied' : 'Apply Template'}
                            </Button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
