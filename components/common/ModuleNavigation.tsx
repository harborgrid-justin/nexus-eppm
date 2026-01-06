
import React, { useRef, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { NavGroup, NavItem } from '../../types/ui';

export type { NavGroup, NavItem };

interface ModuleNavigationProps {
  groups: NavGroup[];
  activeGroup: string;
  activeItem: string;
  onGroupChange: (groupId: string) => void;
  onItemChange: (itemId: string) => void;
  className?: string;
}

export const ModuleNavigation: React.FC<ModuleNavigationProps> = ({
  groups,
  activeGroup,
  activeItem,
  onGroupChange,
  onItemChange,
  className = ''
}) => {
  const groupRef = useRef<HTMLDivElement>(null);
  const itemRef = useRef<HTMLDivElement>(null);
  
  const currentGroup = groups.find(g => g.id === activeGroup);

  useEffect(() => {
    if (currentGroup && itemRef.current) {
        const activeBtn = itemRef.current.querySelector(`button[data-active="true"]`);
        if (activeBtn) {
            activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
    }
  }, [activeItem, currentGroup]);

  return (
    <div className={`flex flex-col bg-surface border-b border-border shadow-sm z-20 sticky top-0 ${className}`}>
      {/* Level 1: Groups (Strategy/Execution/etc) */}
      <div className="w-full overflow-x-auto scrollbar-hide border-b border-border bg-surface">
        <div ref={groupRef} className="flex px-6 py-3.5 space-x-3 min-w-max items-center">
          {groups.map(group => {
            const isActive = activeGroup === group.id;
            return (
              <button
                key={group.id}
                onClick={() => onGroupChange(group.id)}
                className={`
                  px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 ease-out whitespace-nowrap
                  focus:outline-none focus:ring-2 focus:ring-nexus-500
                  ${isActive 
                    ? `bg-primary text-text-inverted shadow-lg shadow-slate-900/20` 
                    : `bg-surface text-text-secondary border border-border hover:border-slate-300 hover:text-text-primary`
                  }
                `}
              >
                {group.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Level 2: Items (Specific views) */}
      {currentGroup && currentGroup.items.length > 0 && (
        <div className="w-full overflow-x-auto scrollbar-hide bg-background/50 backdrop-blur-sm transition-all duration-300">
          <div ref={itemRef} className="flex px-6 py-2.5 space-x-1 min-w-max items-center">
            {currentGroup.items.map(item => {
              const isActive = activeItem === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  data-active={isActive}
                  onClick={() => onItemChange(item.id)}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 whitespace-nowrap
                    focus:outline-none select-none
                    ${isActive 
                      ? 'bg-surface text-nexus-600 shadow-sm ring-1 ring-slate-200' 
                      : 'text-text-secondary hover:text-text-primary hover:bg-white/40 active:scale-95'
                    }
                  `}
                >
                  {Icon && <Icon size={16} className={`transition-colors ${isActive ? 'text-nexus-600' : 'opacity-60 group-hover:opacity-100'}`} />}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
