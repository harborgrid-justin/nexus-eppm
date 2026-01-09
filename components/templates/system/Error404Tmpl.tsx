
import React from 'react';
import { AlertOctagon, Home, ChevronLeft } from 'lucide-react';
import { Button } from '../../ui/Button';

export const Error404Tmpl: React.FC = () => {
    return (
        <div className="h-full flex flex-col items-center justify-center bg-slate-50 text-center p-6 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:32px_32px] opacity-40"></div>
            
            <div className="relative z-10 max-w-md w-full bg-white p-12 rounded-3xl shadow-xl border border-slate-200 animate-in zoom-in-95">
                <div className="w-20 h-20 bg-red-50 rounded-2xl flex items-center justify-center mb-8 mx-auto rotate-12 shadow-sm">
                    <AlertOctagon size={40} className="text-red-500"/>
                </div>
                <h1 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">Page Not Found</h1>
                <p className="text-slate-500 mb-8 leading-relaxed">
                    The resource you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                </p>
                <div className="flex flex-col gap-3">
                    <Button icon={Home} className="w-full justify-center">Return to Dashboard</Button>
                    <Button variant="ghost" className="w-full justify-center" icon={ChevronLeft} onClick={() => window.history.back()}>Go Back</Button>
                </div>
            </div>
        </div>
    );
};
