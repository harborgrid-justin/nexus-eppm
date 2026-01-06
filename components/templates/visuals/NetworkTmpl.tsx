import React from 'react';
import { useData } from '../../../context/DataContext';
import { Share2 } from 'lucide-react';

export const NetworkDiagramTmpl: React.FC = () => {
    const { state } = useData();
    const tasks = state.projects[0]?.tasks || [];

    return (
        <div className="h-full flex flex-col bg-slate-50 relative overflow-hidden">
            <div className="p-4 border-b bg-white z-10 flex items-center gap-2 font-bold"><Share2 size={18}/> Logic Flow Network</div>
            <div className="flex-1 relative">
                {tasks.slice(0, 5).map((t, i) => (
                    <div key={t.id} className="absolute p-3 bg-white border-2 border-slate-300 rounded shadow-sm w-32 h-20 flex flex-col items-center justify-center text-center text-xs font-bold" style={{ left: 50 + (i * 180), top: 100 + (i % 2 * 100) }}>
                        {t.name}
                        <div className="text-[9px] font-normal text-slate-400 mt-1">{t.wbsCode}</div>
                    </div>
                ))}
                <svg className="absolute inset-0 w-full h-full opacity-20"><path d="M 100 150 L 250 250 L 400 150" stroke="black" strokeWidth="2" fill="none"/></svg>
            </div>
        </div>
    );
};