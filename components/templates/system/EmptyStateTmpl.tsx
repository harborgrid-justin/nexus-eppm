
import React from 'react';
import { Search } from 'lucide-react';
import { Button } from '../../ui/Button';

export const EmptyStateTmpl: React.FC = () => {
    return (
        <div className="h-full flex flex-col items-center justify-center p-8 bg-slate-50/50">
            <div className="w-full max-w-lg border-2 border-dashed border-slate-300 rounded-3xl p-12 flex flex-col items-center text-center bg-white/50">
                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
                    <Search size={40} className="text-slate-300"/>
                </div>
                <h3 className="text-xl font-bold text-slate-800">No Projects Found</h3>
                <p className="text-slate-500 mt-2 mb-8 max-w-xs leading-relaxed">
                    Your portfolio is currently empty. Get started by initializing your first project charter.
                </p>
                <Button>Create Project</Button>
            </div>
        </div>
    );
};
