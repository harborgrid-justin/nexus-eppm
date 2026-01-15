
import React, { useRef, useState, useEffect } from 'react';
import { Risk } from '../../../types/index';
import { Badge } from '../../ui/Badge';
import { formatCompactCurrency } from '../../../utils/formatters';
import { useVirtualScroll } from '../../../hooks/useVirtualScroll';
import { useTheme } from '../../../context/ThemeContext';
import { ShieldAlert, AlertTriangle, ArrowUpRight } from 'lucide-react';
import { EmptyGrid } from '../../common/EmptyGrid';

interface RiskListViewProps {
  risks: Risk[];
  onSelectRisk: (id: string) => void;
}

export const RiskListView: React.FC<RiskListViewProps> = ({ risks, onSelectRisk }) => {
  const theme = useTheme();
  const parentRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState(600);
  
  const ROW_HEIGHT = 72; 

  useEffect(() => {
    if (parentRef.current) setContainerHeight(parentRef.current.clientHeight);
    const observer = new ResizeObserver(entries => {
        if (entries[0]) setContainerHeight(entries[0].contentRect.height);
    });
    if (parentRef.current) observer.observe(parentRef.current);
    return () => observer.disconnect();
  }, []);

  const { virtualItems, totalHeight, onScroll } = useVirtualScroll(0, {
      totalItems: risks.length,
      itemHeight: ROW_HEIGHT,
      containerHeight
  });

  const getScoreVariant = (score: number) => {
    if (score >= 15) return 'danger';
    if (score >= 8) return 'warning';
    return 'success';
  };

  if (risks.length === 0) {
      return (
          <div className="h-full flex items-center justify-center p-12">
               <EmptyGrid 
                    title="Risk Inventory Null" 
                    description="No threat or opportunity artifacts identified for this data partition. Establish a risk baseline to enable probabilistic analysis." 
                    icon={ShieldAlert} 
                />
          </div>
      );
  }

  return (
    <div className={`h-full flex flex-col bg-white overflow-hidden animate-nexus-in`}>
        <div className={`flex items-center h-14 border-b border-slate-100 bg-slate-50/50 px-8 sticky top-0 z-10 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] shadow-sm`}>
            <div className="w-32 flex-shrink-0">Node Hash</div>
            <div className="flex-1">Risk Narrative Summary</div>
            <div className="w-24 text-center">Score Heat</div>
            <div className="w-36 text-right">Exposure (EMV)</div>
            <div className="w-28 text-center">Lifecycle</div>
            <div className="w-32 hidden md:block pl-8">Responsible</div>
        </div>

        <div 
            ref={parentRef} 
            className="flex-1 overflow-y-auto scrollbar-thin relative"
            onScroll={(e) => onScroll(e.currentTarget.scrollTop)}
            style={{ contain: 'strict' }}
        >
            <div style={{ height: `${totalHeight}px`, position: 'relative' }}>
                {virtualItems.map(({ index, offsetTop }) => {
                    const r = risks[index];
                    return (
                        <div 
                            key={r.id}
                            onClick={() => onSelectRisk(r.id)}
                            className={`absolute top-0 left-0 w-full flex items-center px-8 border-b border-slate-50 hover:bg-slate-50 cursor-pointer transition-all duration-150 border-l-[6px] border-l-transparent hover:border-l-nexus-500 hover:shadow-lg z-0 hover:z-10 group`}
                            style={{ height: `${ROW_HEIGHT}px`, transform: `translateY(${offsetTop}px)` }}
                        >
                            <div className={`w-32 flex-shrink-0 font-mono text-[11px] font-black text-slate-400 group-hover:text-nexus-600 transition-colors`}>{r.id}</div>
                            <div className="flex-1 min-w-0 pr-6">
                                <div className={`text-sm font-black text-slate-800 truncate uppercase tracking-tight`} title={r.description}>
                                    {r.description}
                                </div>
                                <div className={`flex items-center gap-2 mt-1`}>
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest truncate">{(r as any).projectName || r.category}</span>
                                    {r.isEscalated && <Badge variant="danger" className="scale-75 origin-left px-1.5 py-0"><ArrowUpRight size={10} className="mr-1"/> Escalated</Badge>}
                                </div>
                            </div>
                            <div className="w-24 flex-shrink-0 flex justify-center">
                                <Badge variant={getScoreVariant(r.score)} className="h-8 w-12 flex items-center justify-center text-sm shadow-inner">{r.score}</Badge>
                            </div>
                            <div className={`w-36 flex-shrink-0 text-right font-mono text-sm font-black text-slate-900 tabular-nums`}>
                                {formatCompactCurrency(r.emv || 0)}
                            </div>
                            <div className="w-28 flex-shrink-0 flex justify-center">
                                <span className={`text-[10px] px-3 py-1.5 rounded-xl font-black uppercase border shadow-sm ${
                                    r.status === 'Open' ? 'bg-yellow-50 text-yellow-700 border-yellow-100' :
                                    r.status === 'Closed' ? 'bg-slate-100 text-slate-500 border-slate-200' :
                                    'bg-green-50 text-green-700 border-green-100'
                                }`}>{r.status}</span>
                            </div>
                            <div className={`w-32 hidden md:block pl-8 text-[11px] font-black text-slate-500 uppercase tracking-tight truncate`}>
                                {r.ownerId}
                            </div>
                        </div>
                    );
                })}
                {/* Visual Pacing */}
                {[...Array(3)].map((_, i) => (
                    <div key={`p-${i}`} className="nexus-empty-pattern opacity-10" style={{ height: `${ROW_HEIGHT}px` }}></div>
                ))}
            </div>
        </div>
    </div>
  );
};
