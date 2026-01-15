
import React, { useState, useEffect, useRef, useDeferredValue, useMemo } from 'react';
import { Search, Command, Briefcase, Settings, Users, X, Sparkles, ChevronRight, Loader2 } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: string, projectId?: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose, onNavigate }) => {
  const { state } = useData();
  const theme = useTheme();
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  const isStale = query !== deferredQuery;
  
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [isOpen]);

  const filteredItems = useMemo(() => {
    const term = deferredQuery.toLowerCase();
    if (!term) return [];

    const items = [
        ...state.projects.map(p => ({ id: p.id, label: p.name, type: 'Project', icon: Briefcase, action: () => onNavigate('projectWorkspace', p.id) })),
        { id: 'nav-portfolio', label: 'Executive Portfolio Overview', type: 'Navigation', icon: Command, action: () => onNavigate('portfolio') },
        { id: 'nav-admin', label: 'Enterprise System Settings', type: 'Admin', icon: Settings, action: () => onNavigate('admin') },
        { id: 'nav-resources', label: 'Global Resource Pool', type: 'Navigation', icon: Users, action: () => onNavigate('resources') },
        { id: 'nav-ai', label: 'AI Strategy Advisor', type: 'AI', icon: Sparkles, action: () => onNavigate('portfolio') },
    ];

    return items.filter(item => item.label.toLowerCase().includes(term));
  }, [state.projects, deferredQuery, onNavigate]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % filteredItems.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filteredItems.length) % filteredItems.length);
    } else if (e.key === 'Enter') {
      if (filteredItems[selectedIndex]) {
          filteredItems[selectedIndex].action();
          onClose();
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
        className="fixed inset-0 z-[200] flex items-start justify-center pt-[15vh] p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
        role="dialog"
        aria-label="Command Palette"
        aria-modal="true"
    >
      <div 
        className={`w-full max-w-2xl bg-white rounded-3xl shadow-[0_32px_64px_-12px_rgba(0,0,0,0.3)] border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[600px]`}
        onKeyDown={handleKeyDown}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`flex items-center px-6 py-5 border-b border-slate-100 bg-white`}>
          <Search size={22} className="text-slate-300 mr-4 shrink-0" aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            className={`flex-1 bg-transparent border-none outline-none text-lg font-bold text-slate-900 placeholder:text-slate-300`}
            placeholder="Type a command or search entities..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            aria-label="Search commands"
          />
          {isStale && <Loader2 size={18} className="animate-spin text-nexus-500 mr-4" />}
          <div className="flex items-center gap-2">
              <kbd className={`hidden sm:inline-flex items-center justify-center px-2 py-1 text-[10px] font-black text-slate-400 bg-slate-50 border border-slate-200 rounded uppercase shadow-inner`}>ESC</kbd>
          </div>
        </div>

        <div className={`flex-1 overflow-y-auto p-3 scrollbar-thin bg-white`} role="listbox">
          {filteredItems.length > 0 ? (
            <div className="space-y-1">
              {filteredItems.map((item, idx) => (
                <div
                  key={item.id}
                  onClick={() => { item.action(); onClose(); }}
                  role="option"
                  aria-selected={selectedIndex === idx}
                  className={`flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all ${
                    selectedIndex === idx 
                        ? `bg-nexus-50 border border-nexus-100 shadow-md ring-4 ring-nexus-500/5` 
                        : `hover:bg-slate-50 border border-transparent`
                  }`}
                  onMouseEnter={() => setSelectedIndex(idx)}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className={`p-2.5 rounded-xl transition-all ${
                        selectedIndex === idx ? `bg-white shadow-sm text-nexus-600` : `bg-slate-100 text-slate-400`
                    }`}>
                        <item.icon size={20} />
                    </div>
                    <div className="min-w-0">
                        <p className={`text-sm font-black truncate uppercase tracking-tight ${selectedIndex === idx ? 'text-slate-900' : 'text-slate-600'}`}>
                            {item.label}
                        </p>
                        <p className={`text-[10px] text-slate-400 uppercase tracking-[0.15em] font-bold mt-0.5`}>{item.type}</p>
                    </div>
                  </div>
                  {selectedIndex === idx && (
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-nexus-600 animate-in fade-in slide-in-from-left-2 duration-200">
                        Jump <ChevronRight size={14} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className={`py-16 text-center text-slate-300 flex flex-col items-center justify-center nexus-empty-pattern h-full`}>
                {query ? (
                    <>
                        <Search size={48} className="mb-4 opacity-10"/>
                        <p className="text-sm font-black uppercase tracking-widest italic">No record matches identified</p>
                    </>
                ) : (
                    <>
                        <Command size={48} className="mb-4 opacity-10"/>
                        <p className="text-sm font-black uppercase tracking-widest">Type to search the enterprise graph</p>
                    </>
                )}
            </div>
          )}
        </div>
        
        <div className={`px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center text-[9px] text-slate-400 font-black select-none uppercase tracking-[0.2em]`}>
             <div className="flex gap-6">
                <span className="flex items-center gap-2"><kbd className="px-1.5 py-0.5 bg-white border rounded shadow-inner">↑↓</kbd> Navigate</span>
                <span className="flex items-center gap-2"><kbd className="px-1.5 py-0.5 bg-white border rounded shadow-inner">↵</kbd> Select</span>
             </div>
             <div className="text-nexus-500 font-mono tracking-tighter">NEXUS_HUB_v1.3</div>
        </div>
      </div>
    </div>
  );
};
