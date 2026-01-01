
import React, { useState, useEffect, useRef } from 'react';
import { Search, Command, Briefcase, Settings, Users, FileText, X, Sparkles, ChevronRight } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: string, projectId?: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose, onNavigate }) => {
  const { state } = useData();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const theme = useTheme();

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  }, [isOpen]);

  const filteredItems = [
    ...state.projects.map(p => ({ id: p.id, label: p.name, type: 'Project', icon: Briefcase, action: () => onNavigate('projectWorkspace', p.id) })),
    { id: 'nav-portfolio', label: 'Portfolio Overview', type: 'Navigation', icon: Command, action: () => onNavigate('portfolio') },
    { id: 'nav-admin', label: 'System Settings', type: 'Admin', icon: Settings, action: () => onNavigate('admin') },
    { id: 'nav-resources', label: 'Enterprise Resource Pool', type: 'Navigation', icon: Users, action: () => onNavigate('projectWorkspace') },
    { id: 'nav-ai', label: 'AI Strategy Report', type: 'AI', icon: Sparkles, action: () => onNavigate('portfolio') },
  ].filter(item => item.label.toLowerCase().includes(query.toLowerCase()));

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % filteredItems.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filteredItems.length) % filteredItems.length);
    } else if (e.key === 'Enter') {
      filteredItems[selectedIndex]?.action();
      onClose();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
        className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] p-4 bg-slate-900/40 backdrop-blur-[2px] animate-in fade-in duration-300"
        onClick={onClose}
        role="dialog"
        aria-label="Command Palette"
        aria-modal="true"
    >
      <div 
        className={`w-full max-w-2xl ${theme.colors.surface} rounded-2xl shadow-2xl border ${theme.colors.border} overflow-hidden animate-in zoom-in-95 duration-300`}
        onKeyDown={handleKeyDown}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`flex items-center px-6 py-5 border-b ${theme.colors.border} ${theme.colors.surface}`}>
          <Search size={22} className="text-slate-400 mr-4" aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            className="flex-1 bg-transparent border-none outline-none text-lg font-medium text-slate-800 placeholder:text-slate-400"
            placeholder="Type a command or search..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            aria-label="Search commands"
          />
          <div className="flex items-center gap-2 ml-4">
              <kbd className={`hidden sm:inline-flex items-center justify-center px-2 py-1 text-[10px] font-bold ${theme.colors.text.tertiary} ${theme.colors.background} border ${theme.colors.border} rounded uppercase`}>ESC</kbd>
          </div>
        </div>

        <div className={`max-h-[420px] overflow-y-auto p-3 scrollbar-thin ${theme.colors.surface}`} role="listbox">
          {filteredItems.length > 0 ? (
            <div className="space-y-1">
              {filteredItems.map((item, idx) => (
                <div
                  key={item.id}
                  onClick={() => { item.action(); onClose(); }}
                  role="option"
                  aria-selected={selectedIndex === idx}
                  className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all ${
                    selectedIndex === idx ? `${theme.colors.background} ring-1 ring-slate-200 shadow-sm` : `hover:${theme.colors.background}/50`
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2.5 rounded-xl transition-all ${selectedIndex === idx ? `${theme.colors.surface} shadow-sm text-nexus-600` : `${theme.colors.background} text-slate-400`}`}>
                        <item.icon size={20} />
                    </div>
                    <div>
                        <p className={`text-sm font-bold ${selectedIndex === idx ? 'text-slate-900' : 'text-slate-700'}`}>{item.label}</p>
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mt-0.5">{item.type}</p>
                    </div>
                  </div>
                  {selectedIndex === idx && (
                    <div className="flex items-center gap-1.5 text-xs font-bold text-nexus-600 animate-in fade-in slide-in-from-right-2">
                        Jump to <ChevronRight size={14} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center text-slate-400">
                <Search size={48} className="mx-auto mb-4 opacity-10"/>
                <p className="text-sm font-medium">No results found for "{query}"</p>
            </div>
          )}
        </div>
        
        <div className={`p-4 ${theme.colors.background} border-t ${theme.colors.border} flex justify-between items-center px-6`}>
             <div className="flex gap-6">
                <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                    <span className={`px-1.5 py-0.5 ${theme.colors.surface} border ${theme.colors.border} rounded-md shadow-sm`}>↑↓</span> Navigate
                </div>
                <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                    <span className={`px-1.5 py-0.5 ${theme.colors.surface} border ${theme.colors.border} rounded-md shadow-sm`}>↵</span> Select
                </div>
             </div>
             <div className="text-[10px] font-black text-nexus-500 uppercase tracking-widest">Nexus Hub</div>
        </div>
      </div>
    </div>
  );
};
