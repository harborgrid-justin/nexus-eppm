
import React from 'react';
import { ChevronDown } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

interface PlanSectionProps {
    title: string;
    icon: any;
    children: React.ReactNode;
    isOpen: boolean;
    onToggle: () => void;
}

export const PlanSection: React.FC<PlanSectionProps> = ({ 
    title, 
    icon: Icon, 
    children, 
    isOpen, 
    onToggle 
}) => {
    const theme = useTheme();
    return (
        <div className={`border rounded-2xl bg-white overflow-hidden mb-6 shadow-sm transition-all duration-300 ${isOpen ? 'border-nexus-200 ring-4 ring-nexus-500/5' : 'border-slate-200'}`}>
            <button 
                onClick={onToggle}
                className={`w-full flex items-center justify-between p-5 text-left transition-colors ${isOpen ? 'bg-white border-b border-slate-100' : 'bg-slate-50/50 hover:bg-slate-100'}`}
                aria-expanded={isOpen}
            >
                <div className="flex items-center gap-4">
                    <div className={`p-2.5 rounded-xl transition-all duration-300 ${isOpen ? 'bg-nexus-600 text-white shadow-lg shadow-nexus-500/20 scale-110' : 'bg-white border border-slate-200 text-slate-400'}`}>
                        <Icon size={20} />
                    </div>
                    <h4 className={`font-bold tracking-tight ${isOpen ? 'text-slate-900 text-lg' : 'text-slate-700 text-base'}`}>{title}</h4>
                </div>
                <div className={`p-1.5 rounded-full transition-all ${isOpen ? 'bg-nexus-50 text-nexus-600 rotate-0' : 'bg-slate-100 text-slate-400 rotate-180'}`}>
                    <ChevronDown size={18} />
                </div>
            </button>
            {isOpen && <div className="p-8 animate-in slide-in-from-top-4 duration-300 bg-white" role="region">{children}</div>}
        </div>
    );
};
