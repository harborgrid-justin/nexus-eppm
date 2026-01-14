import React, { useRef, useState, useEffect } from 'react';
import { Risk } from '../../../types/index';
import { Badge } from '../../ui/Badge';
import { formatCompactCurrency } from '../../../utils/formatters';
import { useVirtualScroll } from '../../../hooks/useVirtualScroll';
import { useTheme } from '../../../context/ThemeContext';
import { ShieldAlert } from 'lucide-react';
import { EmptyGrid } from '../../common/EmptyGrid';

interface RiskListViewProps {
  risks: Risk[];
  onSelectRisk: (id: string) => void;
}

export const RiskListView: React.FC<RiskListViewProps> = ({ risks, onSelectRisk }) => {
  const theme = useTheme();
  const parentRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState(600);
  
  const ROW_HEIGHT = 64; 

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
               <EmptyGrid title="Risk Register Neutral" description="No threats or opportunities have been identified for this partition." icon={ShieldAlert} />
          </div>
      );
  }

  return (
    <div className={`h-full flex flex-col ${theme.colors.surface} overflow-hidden`}>
        <div className={`flex items-center h-14 border-b ${theme.colors.border} ${theme.colors.background}/95 backdrop-blur-sm px-6 sticky top-0 z-10 text-[10px] font-black ${theme.colors.text.tertiary} uppercase tracking-[0.15em]`}>
            <div className="w-32 flex-shrink-0">Identity Ref</div>
            <div className="flex-1">Risk Narrative / Project Origin</div>
            <div className="w-24 text-center">Heat Score</div>
            <div className="w-32 text-right">Exposure (EMV)</div>
            <div className="w-28 text-center">Lifecycle</div>
            <div className="w-32 hidden md:block pl-6">Governance</div>
        </div>

        <div 
            ref={parentRef} 
            className="flex-1 overflow-y-auto scrollbar-thin relative"
            onScroll={(e) => onScroll(e.currentTarget.scrollTop)}
        >
            <div style={{ height: `${totalHeight}px`, position: 'relative' }}>
                {virtualItems.map(({ index, offsetTop }) => {
                    const r = risks[index];
                    return (
                        <div 
                            key={r.id}
                            onClick={() => onSelectRisk(r.id)}
                            className={`absolute top-0 left-0 w-full flex items-center px-6 border-b border-slate-100 hover:${theme.colors.background} cursor-pointer transition-colors border-l-4 border-l-transparent hover:border-l-nexus-500 box-border group`}
                            style={{ 
                                height: `${ROW_HEIGHT}px`,
                                transform: `translateY(${offsetTop}px)`
                            }}
                        >
                            <div className={`w-32 flex-shrink-0 font-mono text-xs font-black ${theme.colors.text.tertiary} group-hover:text-nexus-600 transition-colors`}>{r.id}</div>
                            <div className="flex-1 min-w-0 pr-4">
                                <div className={`text-sm font-bold ${theme.colors.text.primary} truncate uppercase tracking-tight`} title={r.description}>
                                    {r.description}
                                </div>
                                <div className={`text-[10px] font-black ${theme.colors.text.tertiary} truncate mt-0.5 uppercase tracking-widest`}>
                                    {(r as any).projectName ? `${(r as any).projectName}` : r.category}
                                    {r.isEscalated && <span className="text-red-600 ml-1"> (Escalated)</span>}
                                </div>
                            </div>
                            <div className="w-24 flex-shrink-0 text-center">
                                <Badge variant={getScoreVariant(r.score)}>{r.score}</Badge>
                            </div>
                            <div className={`w-32 flex-shrink-0 text-right font-mono text-sm font-black text-slate-700`}>
                                {formatCompactCurrency(r.emv || 0)}
                            </div>
                            <div className="w-28 flex-shrink-0 text-center">
                                <span className={`text-[9px] px-2.5 py-1 rounded-lg font-black uppercase border shadow-sm ${
                                    r.status === 'Open' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                    r.status === 'Closed' ? 'bg-slate-100 text-slate-600 border-slate-200' :
                                    'bg-green-50 text-green-700 border-green-200'
                                }`}>{r.status}</span>
                            </div>
                            <div className={`w-32 hidden md:block pl-6 text-[11px] font-bold ${theme.colors.text.secondary} truncate`}>
                                {r.ownerId}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    </div>
  );
};