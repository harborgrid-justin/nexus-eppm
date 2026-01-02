
import React, { useRef, useState, useEffect } from 'react';
import { Risk } from '../../../types';
import { Badge } from '../../ui/Badge';
import { formatCompactCurrency } from '../../../utils/formatters';
import { useVirtualScroll } from '../../../hooks/useVirtualScroll';
import { useTheme } from '../../../context/ThemeContext';

interface RiskListViewProps {
  risks: Risk[];
  onSelectRisk: (id: string) => void;
}

export const RiskListView: React.FC<RiskListViewProps> = ({ risks, onSelectRisk }) => {
  const theme = useTheme();
  const parentRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState(600);
  
  const ROW_HEIGHT = 56; // Fixed height for virtual rows

  // Update container height on resize
  useEffect(() => {
    if (parentRef.current) {
        setContainerHeight(parentRef.current.clientHeight);
    }
    const observer = new ResizeObserver(entries => {
        if (entries[0]) {
            setContainerHeight(entries[0].contentRect.height);
        }
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

  return (
    <div className={`h-full flex flex-col ${theme.components.card} overflow-hidden`}>
        {/* Header - Mimic Table Header */}
        <div className={`flex items-center h-12 border-b ${theme.colors.border} bg-slate-50/80 backdrop-blur-sm px-4 sticky top-0 z-10 text-xs font-bold text-slate-500 uppercase tracking-wider`}>
            <div className="w-24 flex-shrink-0">Risk ID</div>
            <div className="flex-1">Description / Project</div>
            <div className="w-24 text-center">Score</div>
            <div className="w-32 text-right">Exposure</div>
            <div className="w-28 text-center">Status</div>
            <div className="w-32 hidden md:block pl-4">Owner</div>
        </div>

        {/* Virtual List Container */}
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
                            className={`absolute top-0 left-0 w-full flex items-center px-4 border-b ${theme.colors.border} hover:${theme.colors.background} cursor-pointer transition-colors border-l-4 border-l-transparent hover:border-l-nexus-500 box-border`}
                            style={{ 
                                height: `${ROW_HEIGHT}px`,
                                transform: `translateY(${offsetTop}px)`
                            }}
                        >
                            <div className="w-24 flex-shrink-0 font-mono text-xs text-slate-500">{r.id}</div>
                            <div className="flex-1 min-w-0 pr-4">
                                <div className="text-sm font-medium text-slate-900 truncate" title={r.description}>
                                    {r.description}
                                </div>
                                <div className="text-[10px] text-slate-500 truncate">
                                    {(r as any).projectName ? `${(r as any).projectName}` : r.category}
                                    {r.isEscalated && <span className="text-red-600 font-bold ml-1"> (Escalated)</span>}
                                </div>
                            </div>
                            <div className="w-24 flex-shrink-0 text-center">
                                <Badge variant={getScoreVariant(r.score)}>{r.score}</Badge>
                            </div>
                            <div className="w-32 flex-shrink-0 text-right font-mono text-sm text-slate-700">
                                {formatCompactCurrency(r.emv || 0)}
                            </div>
                            <div className="w-28 flex-shrink-0 text-center">
                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase border ${
                                    r.status === 'Open' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                    r.status === 'Closed' ? 'bg-slate-100 text-slate-600 border-slate-200' :
                                    'bg-green-50 text-green-700 border-green-200'
                                }`}>{r.status}</span>
                            </div>
                            <div className="w-32 hidden md:block pl-4 text-xs text-slate-600 truncate">
                                {r.ownerId}
                            </div>
                        </div>
                    );
                })}
            </div>
            
            {risks.length === 0 && (
                 <div className="flex h-full items-center justify-center text-slate-400 text-sm">
                    No risks match your criteria.
                 </div>
            )}
        </div>
    </div>
  );
};
