
import React from 'react';
import { ListChecks, Info } from 'lucide-react';
import { useData } from '../../context/DataContext';

export const SourceSelectionView: React.FC = () => {
    const { state } = useData();
    // In a real scenario, this would load from a specific procurement plan or template
    // We try to find a relevant template from standardTemplates
    const template = state.standardTemplates.find(t => t.name.includes('Source') || t.category === 'Procurement');
    
    // Fallback data if no template found, but structured as variable
    const defaultCriteria = [
        { name: 'Technical Capability', weight: '35%' },
        { name: 'Past Performance', weight: '25%' },
        { name: 'Price / Cost', weight: '40%' }
    ];

    const criteria = template?.content?.criteria || defaultCriteria;

    return (
        <div className="p-6 bg-white rounded-xl shadow-sm border h-full">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2"><ListChecks /> Source Selection Criteria</h2>
            <div className="bg-slate-50 p-4 rounded-lg border">
                <p className="text-sm text-slate-600 mb-4 flex items-center gap-2">
                    <Info size={14}/> Criteria used to rate or score vendor proposals.
                </p>
                <ul className="space-y-3">
                    {criteria.map((c: any, i: number) => (
                        <li key={i} className="flex justify-between items-center p-3 bg-white rounded border shadow-sm">
                            <span className="text-sm font-medium text-slate-800">{c.name}</span>
                            <span className="text-xs bg-nexus-50 text-nexus-700 px-2 py-1 rounded font-bold border border-nexus-100">Weight: {c.weight}</span>
                        </li>
                    ))}
                </ul>
            </div>
            
            <div className="mt-6 p-4 border-t border-slate-100">
                <h4 className="text-sm font-bold text-slate-700 mb-2">Evaluation Method</h4>
                <p className="text-sm text-slate-500">Best Value Tradeoff (BVTO) allowing for award to other than lowest priced offeror based on technical superiority.</p>
            </div>
        </div>
    );
};
