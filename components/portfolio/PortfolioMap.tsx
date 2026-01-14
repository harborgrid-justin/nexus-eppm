import React, { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';
import { useI18n } from '../../context/I18nContext';
import { Navigation, Maximize2, AlertTriangle } from 'lucide-react';
import { formatCompactCurrency } from '../../utils/formatters';

export const PortfolioMap: React.FC = () => {
    const { state } = useData();
    const theme = useTheme();
    const { t } = useI18n();
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const mapData = useMemo(() => state.projects.map(p => {
        const loc = state.locations.find(l => l.id === p.locationId);
        const lat = loc?.coordinates?.lat || (Math.random() * 80 - 40); 
        const lng = loc?.coordinates?.lng || (Math.random() * 240 - 120);
        return { p, x: ((lng + 180) / 360) * 100, y: ((-lat + 90) / 180) * 100 };
    }), [state.projects, state.locations]);

    const activeProj = state.projects.find(p => p.id === selectedId);

    return (
        <div className="h-full flex flex-col bg-slate-900 relative overflow-hidden rounded-xl shadow-2xl">
             <div className="absolute inset-0 opacity-40 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')] bg-cover bg-center"></div>
             <div className="absolute top-4 left-4 z-20 bg-slate-800/90 backdrop-blur text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest flex items-center gap-2 border border-white/10 shadow-lg">
                 <Navigation size={14} className="text-nexus-400"/> {t('portfolio.global_ops', 'Global Operations')}
             </div>
             <div className="absolute inset-0 pointer-events-none">
                 {mapData.map(({ p, x, y }) => (
                     <div key={p.id} onClick={() => setSelectedId(p.id)} className="absolute cursor-pointer group pointer-events-auto" style={{ left: `${x}%`, top: `${y}%` }}>
                         <div className={`w-3 h-3 rounded-full shadow-lg transform -translate-x-1/2 -translate-y-1/2 transition-all group-hover:scale-150 ${p.health === 'Critical' ? 'bg-red-500 animate-pulse' : p.health === 'Warning' ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
                     </div>
                 ))}
             </div>
             {activeProj && (
                 <div className="absolute bottom-6 left-6 z-30 w-80 bg-white/95 backdrop-blur-md rounded-xl shadow-2xl border border-slate-200 overflow-hidden animate-in slide-in-from-bottom-4">
                     <div className={`h-1.5 w-full ${activeProj.health === 'Critical' ? 'bg-red-500' : 'bg-green-500'}`}></div>
                     <div className="p-5">
                         <div className="flex justify-between items-start mb-2">
                             <div><h3 className="font-bold text-slate-900 text-lg">{activeProj.name}</h3><p className="text-xs text-slate-500 font-mono uppercase">{activeProj.code}</p></div>
                             <button onClick={() => setSelectedId(null)} className="text-slate-400 hover:text-slate-600"><Maximize2 size={16}/></button>
                         </div>
                         <div className="grid grid-cols-2 gap-4 my-4 text-xs font-bold uppercase tracking-wider">
                             <div><p className="text-slate-400">{t('common.budget', 'Budget')}</p><p className="text-slate-900">{formatCompactCurrency(activeProj.budget)}</p></div>
                             <div><p className="text-slate-400">{t('common.spent', 'Spent')}</p><p className="text-slate-900">{formatCompactCurrency(activeProj.spent)}</p></div>
                         </div>
                         <button className="w-full bg-nexus-600 text-white py-2 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-nexus-700 transition-colors shadow-lg shadow-nexus-500/10">{t('common.open', 'Open Workspace')}</button>
                     </div>
                 </div>
             )}
        </div>
    );
};
export default PortfolioMap;