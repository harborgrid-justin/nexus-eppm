
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
        { id: 'nav-portfolio', label: 'Portfolio Overview', type: 'Navigation', icon: Command, action: () => onNavigate('portfolio') },
        { id: 'nav-admin', label: 'System Settings', type: 'Admin', icon: Settings, action: () => onNavigate('admin') },
        { id: 'nav-resources', label: 'Enterprise Resource Pool', type: 'Navigation', icon: Users, action: () => onNavigate('resources') },
        { id: 'nav-ai', label: 'AI Strategy Report', type: 'AI', icon: Sparkles, action: () => onNavigate('portfolio') },
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
        className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] p-4 bg-slate-900/40 backdrop-blur-[2px] animate-in fade-in duration-200"
        onClick={onClose}
        role="dialog"
        aria-label="Command Palette"
        aria-modal="true"
    >
      <div 
        className={`w-full max-w-2xl ${theme.colors.surface} rounded-2xl shadow-2xl border ${theme.colors.border} overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[600px]`}
        onKeyDown={handleKeyDown}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`flex items-center px-4 py-4 border-b ${theme.colors.border} ${theme.colors.surface}`}>
          <Search size={20} className="text-slate-400 mr-3 shrink-0" aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            className={`flex-1 bg-transparent border-none outline-none text-lg font-medium ${theme.colors.text.primary} placeholder:text-slate-400`}
            placeholder="Type a command or search..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            aria-label="Search commands"
          />
          {isStale && <Loader2 size={16} className="animate-spin text-slate-400 mr-2" />}
          <div className="flex items-center gap-2 ml-2">
              <kbd className={`hidden sm:inline-flex items-center justify-center px-2 py-1 text-[10px] font-bold ${theme.colors.text.tertiary} ${theme.colors.background} border ${theme.colors.border} rounded uppercase select-none`}>ESC</kbd>
          </div>
        </div>

        <div className={`flex-1 overflow-y-auto p-2 scrollbar-thin ${theme.colors.surface}`} role="listbox">
          {filteredItems.length > 0 ? (
            <div className="space-y-1">
              {filteredItems.map((item, idx) => (
                <div
                  key={item.id}
                  onClick={() => { item.action(); onClose(); }}
                  role="option"
                  aria-selected={selectedIndex === idx}
                  className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all ${
                    selectedIndex === idx 
                        ? `${theme.colors.background} ring-1 ring-nexus-500/20 bg-nexus-50/50` 
                        : `hover:${theme.colors.background}`
                  }`}
                  onMouseEnter={() => setSelectedIndex(idx)}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`p-2 rounded-lg transition-all ${
                        selectedIndex === idx ? `bg-white shadow-sm text-nexus-600` : `${theme.colors.background} text-slate-400`
                    }`}>
                        <item.icon size={18} />
                    </div>
                    <div className="min-w-0">
                        <p className={`text-sm font-bold truncate ${selectedIndex === idx ? 'text-slate-900' : 'text-slate-700'}`}>
                            {item.label}
                        </p>
                        <p className={`text-[10px] ${theme.colors.text.tertiary} uppercase tracking-widest font-bold`}>{item.type}</p>
                    </div>
                  </div>
                  {selectedIndex === idx && (
                    <div className="flex items-center gap-1.5 text-xs font-bold text-nexus-600 animate-in fade-in slide-in-from-left-2 duration-200">
                        Jump <ChevronRight size={14} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className={`py-12 text-center ${theme.colors.text.tertiary}`}>
                {query ? (
                    <>
                        <Search size={32} className="mx-auto mb-3 opacity-20"/>
                        <p className="text-sm font-medium">No results for "{query}"</p>
                    </>
                ) : (
                    <>
                        <Command size={32} className="mx-auto mb-3 opacity-20"/>
                        <p className="text-sm font-medium">Type to search...</p>
                    </>
                )}
            </div>
          )}
        </div>
        
        <div className={`px-4 py-3 ${theme.colors.background} border-t ${theme.colors.border} flex justify-between items-center text-[10px] ${theme.colors.text.tertiary} font-medium select-none`}>
             <div className="flex gap-4">
                <span className="flex items-center gap-1"><kbd className="font-sans px-1 bg-white border rounded">↑</kbd> <kbd className="font-sans px-1 bg-white border rounded">↓</kbd> Navigate</span>
                <span className="flex items-center gap-1"><kbd className="font-sans px-1 bg-white border rounded">↵</kbd> Select</span>
             </div>
             <div className="uppercase tracking-widest font-bold text-nexus-400">Nexus Hub</div>
        </div>
      </div>
    </div>
  );
};
