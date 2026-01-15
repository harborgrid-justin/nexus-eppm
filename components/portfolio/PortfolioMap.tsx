
import React, { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';
import { useI18n } from '../../context/I18nContext';
import { Navigation, Maximize2, Map as MapIcon } from 'lucide-react';
import { formatCompactCurrency } from '../../utils/formatters';
import { EmptyGrid } from '../common/EmptyGrid';

export const PortfolioMap: React.FC = () => {
    const { state } = useData();
    const theme = useTheme();
    const { t } = useI18n();
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const mapData = useMemo(() => state.projects.map(p => {
        const loc = state.locations.find(l => l.id === p.locationId);
        // Fallback to deterministic pseudo-random for demo if location missing, but preferably from state.locations
        const lat = loc?.coordinates?.lat || (p.id.length * 3.5) % 80 - 40; 
        const lng = loc?.coordinates?.lng || (p.id.length * 7.2) % 240 - 120;
        return { p, x: ((lng + 180) / 360) * 100, y: ((-lat + 90) / 180) * 100 };
    }), [state.projects, state.locations]);

    const activeProj = state.projects.find(p => p.id === selectedId);

    if (state.projects.length === 0) {
        return <EmptyGrid title="Geospatial Ledger Null" description="Identify projects with valid coordinates to activate the global operations map." icon={MapIcon} />;
    }

    return (
        <div className="h-full flex flex-col bg-slate-950 relative overflow-hidden rounded-[2.5rem] shadow-2xl border border-slate-900 m-4">
             <div className="absolute inset-0 opacity-40 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')] bg-cover bg-center mix-blend-lighten"></div>
             <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-transparent to-slate-900/50 pointer-events-none"></div>
             
             <div className="absolute top-6 left-6 z-20 bg-slate-900/90 backdrop-blur-md text-white px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3 border border-white/10 shadow-2xl">
                 <div className="w-2 h-2 rounded-full bg-nexus-500 animate-pulse shadow-[0_0_8px_#0ea5e9]"></div>
                 {t('portfolio.global_ops', 'Global Command Center')}
             </div>

             <div className="absolute inset-0 pointer-events-none">
                 {mapData.map(({ p, x, y }) => (
                     <div 
                        key={p.id} 
                        onClick={() => setSelectedId(p.id)} 
                        className="absolute cursor-pointer group pointer-events-auto transition-transform hover:z-50" 
                        style={{ left: `${x}%`, top: `${y}%` }}
                    >
                         <div className={`w-4 h-4 rounded-full shadow-2xl transform -translate-x-1/2 -translate-y-1/2 transition-all group-hover:scale-150 group-hover:ring-4 group-hover:ring-white/20 ${
                             p.health === 'Critical' ? 'bg-red-500 shadow-[0_0_15px_#ef4444]' : 
                             p.health === 'Warning' ? 'bg-yellow-500' : 'bg-nexus-500 shadow-[0_0_15px_#0ea5e9]'
                         }`}></div>
                         <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 bg-black/80 rounded text-[8px] font-black text-white uppercase opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-white/10">{p.code}</div>
                     </div>
                 ))}
             </div>

             {activeProj && (
                 <div className="absolute bottom-10 left-10 z-30 w-80 bg-white/95 backdrop-blur-md rounded-[2rem] shadow-2xl border border-slate-200 overflow-hidden animate-in slide-in-from-bottom-8">
                     <div className={`h-2 w-full ${activeProj.health === 'Critical' ? 'bg-red-500' : activeProj.health === 'Warning' ? 'bg-yellow-500' : 'bg-nexus-600'}`}></div>
                     <div className="p-6">
                         <div className="flex justify-between items-start mb-6">
                             <div className="min-w-0">
                                <h3 className="font-black text-slate-900 text-lg uppercase tracking-tight truncate">{activeProj.name}</h3>
                                <p className="text-[10px] text-slate-400 font-mono font-bold uppercase mt-1">Ref: {activeProj.code}</p>
                             </div>
                             <button onClick={() => setSelectedId(null)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"><Maximize2 size={18}/></button>
                         </div>
                         <div className="grid grid-cols-2 gap-8 mb-8">
                             <div>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{t('common.budget', 'Total Authority')}</p>
                                <p className="text-base font-mono font-black text-slate-900">{formatCompactCurrency(activeProj.budget)}</p>
                             </div>
                             <div>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{t('common.spent', 'Consolidated Spend')}</p>
                                <p className="text-base font-mono font-black text-slate-900">{formatCompactCurrency(activeProj.spent)}</p>
                             </div>
                         </div>
                         <button className="w-full bg-slate-900 text-white py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-black transition-all shadow-xl active:scale-95">{t('common.open', 'Launch Workspace')}</button>
                     </div>
                 </div>
             )}
        </div>
    );
};
