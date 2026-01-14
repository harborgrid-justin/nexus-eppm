
import React from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { useData } from '../../../context/DataContext';
import { Mail, Phone } from 'lucide-react';

export const StakeholderSidebar: React.FC = () => {
    const theme = useTheme();
    const { state } = useData();
    
    // Filter for key roles to display as contacts
    const stakeholders = state.users.filter(u => 
        ['Portfolio Manager', 'Global Admin', 'Executive'].includes(u.role)
    ).slice(0, 5); // Limit display

    return (
        <div className={`${theme.components.card} p-6 h-full flex flex-col`}>
            <h3 className="font-bold text-slate-800 mb-6">Key Contacts</h3>
            <div className="space-y-6 flex-1 overflow-y-auto pr-2 scrollbar-thin">
                {stakeholders.map(s => (
                    <div key={s.id} className="flex gap-3 items-start">
                        <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border border-slate-200">
                             <img src={s.avatar} alt={s.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-sm text-slate-900 truncate">{s.name}</h4>
                            <p className="text-xs text-slate-500 truncate">{s.role}</p>
                            <p className="text-[10px] text-slate-400 truncate">{s.department}</p>
                            <div className="flex gap-3 mt-2">
                                <a href={`mailto:${s.email}`} className="text-nexus-600 hover:text-nexus-700 p-1 hover:bg-nexus-50 rounded"><Mail size={14}/></a>
                                <button className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100 rounded"><Phone size={14}/></button>
                            </div>
                        </div>
                    </div>
                ))}
                {stakeholders.length === 0 && (
                    <div className="text-center text-slate-400 text-xs italic p-4">
                        No key stakeholders identified in directory.
                    </div>
                )}
            </div>
        </div>
    );
};
