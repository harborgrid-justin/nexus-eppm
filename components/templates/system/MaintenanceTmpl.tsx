
import React from 'react';
import { Wrench } from 'lucide-react';

export const MaintenanceTmpl: React.FC = () => {
    return (
        <div className="h-full flex flex-col items-center justify-center bg-amber-50 text-center p-6 relative">
            <div className="max-w-lg w-full">
                <Wrench size={64} className="text-amber-500 mb-6 mx-auto animate-pulse"/>
                <h1 className="text-3xl font-black text-amber-900 mb-3 tracking-tight">System Under Maintenance</h1>
                <p className="text-amber-800/80 mb-8 text-lg">
                    We are currently deploying a critical security patch. <br/>
                    The system will be back online at <strong>02:00 UTC</strong>.
                </p>
                <div className="bg-white rounded-xl border border-amber-200 shadow-sm p-4 text-left">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Deployment Status</span>
                        <span className="text-xs font-mono font-bold text-amber-600">85%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500 w-[85%] animate-pulse"></div>
                    </div>
                    <p className="text-xs text-slate-400 mt-2 font-mono">Running migration script: 05_schema_update.sql...</p>
                </div>
            </div>
        </div>
    );
};
