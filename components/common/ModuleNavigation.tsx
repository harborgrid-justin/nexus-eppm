
import React, { useRef, useEffect } from 'react';

export interface NavItem {
  id: string;
  label: string;
  icon?: React.ComponentType<{ size?: string | number; className?: string }>;
}

export interface NavGroup {
  id: string;
  label: string;
  items: NavItem[];
}

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

  // Scroll active item into view on mount or change
  useEffect(() => {
    if (currentGroup && itemRef.current) {
        const activeBtn = itemRef.current.querySelector(`button[data-active="true"]`);
        if (activeBtn) {
            activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
    }
  }, [activeItem, currentGroup]);

  return (
    <div className={`flex flex-col bg-white border-b border-slate-200 shadow-sm z-20 sticky top-0 ${className}`}>
      {/* Level 1: Groups */}
      <div className="w-full overflow-x-auto scrollbar-hide border-b border-slate-100 bg-white">
        <div ref={groupRef} className="flex px-4 py-3 space-x-3 min-w-max sm:justify-start items-center">
          {groups.map(group => {
            const isActive = activeGroup === group.id;
            return (
              <button
                key={group.id}
                onClick={() => onGroupChange(group.id)}
                className={`
                  px-5 py-2 rounded-full text-xs md:text-sm font-bold transition-all duration-300 ease-out whitespace-nowrap
                  focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-nexus-500
                  ${isActive 
                    ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20 transform scale-105' 
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 hover:shadow-sm'
                  }
                `}
              >
                {group.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Level 2: Items */}
      {currentGroup && currentGroup.items.length > 0 && (
        <div className="w-full overflow-x-auto scrollbar-hide bg-slate-50/80 backdrop-blur-sm transition-colors duration-300">
          <div ref={itemRef} className="flex px-4 py-2 space-x-1 min-w-max items-center">
            {currentGroup.items.map(item => {
              const isActive = activeItem === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  data-active={isActive}
                  onClick={() => onItemChange(item.id)}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-2xl text-xs md:text-sm font-medium transition-all duration-200 whitespace-nowrap
                    focus:outline-none select-none
                    ${isActive 
                      ? 'bg-white text-nexus-700 shadow-sm ring-1 ring-black/5 font-semibold scale-[1.02]' 
                      : 'text-slate-500 hover:text-slate-700 hover:bg-white/60 active:scale-95'
                    }
                  `}
                >
                  {Icon && <Icon size={16} className={`transition-colors ${isActive ? 'text-nexus-600' : 'opacity-70 group-hover:opacity-100'}`} />}
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
