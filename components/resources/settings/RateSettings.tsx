
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../../ui/Button';
import { useTheme } from '../../../context/ThemeContext';

export const RateSettings: React.FC = () => {
    const theme = useTheme();
    return (
        <div className="space-y-6 animate-in fade-in">
            <div className="flex justify-between items-center bg-slate-900 p-6 rounded-2xl text-white shadow-lg">
                <div>
                    <h3 className="text-lg font-bold">Standard Labor Rate Tables</h3>
                    <p className="text-xs text-slate-400">Manage multi-tiered rates for global resource pooling.</p>
                </div>
                <Button size="sm" icon={Plus} className="bg-white/10 hover:bg-white/20 border-white/10 text-white">Update Effective Rates</Button>
            </div>
            
            <div className={`${theme.colors.surface} border ${theme.colors.border} rounded-xl overflow-hidden shadow-sm`}>
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Rate Type</th>
                            <th className="px-6 py-3 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Eff. Date</th>
                            <th className="px-6 py-3 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Std Rate ($)</th>
                            <th className="px-6 py-3 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Overtime Multi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {[
                            { title: 'Level 1: Intern/Junior', date: 'Jan 01, 2024', rate: 75, multi: 1.5 },
                            { title: 'Level 2: Professional', date: 'Jan 01, 2024', rate: 125, multi: 1.5 },
                            { title: 'Level 3: Senior/Expert', date: 'Jan 01, 2024', rate: 250, multi: 2.0 }
                        ].map((r, i) => (
                            <tr key={i} className="hover:bg-slate-50">
                                <td className="px-6 py-4 text-sm font-bold text-slate-800">{r.title}</td>
                                <td className="px-6 py-4 text-center text-xs font-mono text-slate-500">{r.date}</td>
                                <td className="px-6 py-4 text-right text-sm font-mono font-bold text-nexus-700">${r.rate}/hr</td>
                                <td className="px-6 py-4 text-right text-sm font-mono font-bold text-orange-600">{r.multi}x</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
