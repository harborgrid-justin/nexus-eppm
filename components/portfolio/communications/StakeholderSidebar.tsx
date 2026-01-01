
import React from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { Mail, Phone } from 'lucide-react';

export const StakeholderSidebar: React.FC = () => {
    const theme = useTheme();
    const stakeholders = [
        { name: 'Justin Saadein', role: 'Executive Sponsor', email: 'justin@nexus.com' },
        { name: 'Jessica Pearson', role: 'Portfolio Manager', email: 'jessica@nexus.com' }
    ];

    return (
        <div className={`${theme.components.card} p-6 h-full`}>
            <h3 className="font-bold text-slate-800 mb-6">Key Contacts</h3>
            <div className="space-y-6">
                {stakeholders.map(s => (
                    <div key={s.email} className="flex gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600">
                            {s.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-sm text-slate-900 truncate">{s.name}</h4>
                            <p className="text-xs text-slate-500 truncate">{s.role}</p>
                            <div className="flex gap-3 mt-2">
                                <a href={`mailto:${s.email}`} className="text-nexus-600 hover:text-nexus-700"><Mail size={14}/></a>
                                <button className="text-slate-400 hover:text-slate-600"><Phone size={14}/></button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
