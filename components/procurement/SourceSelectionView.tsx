
import React from 'react';
import { ListCheck } from 'lucide-react';

export const SourceSelectionView: React.FC = () => {
    return (
        <div className="p-6 bg-white rounded-xl shadow-sm border h-full">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2"><ListCheck /> Source Selection Criteria</h2>
            <div className="bg-slate-50 p-4 rounded-lg border">
                <p className="text-sm text-slate-600 mb-4">Criteria used to rate or score vendor proposals.</p>
                <ul className="space-y-3">
                    <li className="flex justify-between items-center p-2 bg-white rounded border">
                        <span className="text-sm font-medium">Technical Capability</span>
                        <span className="text-xs bg-slate-100 px-2 py-1 rounded font-bold">Weight: 35%</span>
                    </li>
                    <li className="flex justify-between items-center p-2 bg-white rounded border">
                        <span className="text-sm font-medium">Past Performance</span>
                        <span className="text-xs bg-slate-100 px-2 py-1 rounded font-bold">Weight: 25%</span>
                    </li>
                    <li className="flex justify-between items-center p-2 bg-white rounded border">
                        <span className="text-sm font-medium">Price / Cost</span>
                        <span className="text-xs bg-slate-100 px-2 py-1 rounded font-bold">Weight: 40%</span>
                    </li>
                </ul>
            </div>
        </div>
    );
};
