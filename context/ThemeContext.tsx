
import React, { createContext, useContext, useState, useMemo, ReactNode, useEffect } from 'react';
import { DEFAULT_TOKENS, ThemeDensity, DesignTokens } from './theme/ThemeDefaults';

interface ThemeContextType {
  tokens: DesignTokens; density: ThemeDensity; setDensity: (d: ThemeDensity) => void;
  isDark: boolean; toggleDark: () => void;
  mode: 'light' | 'dark'; colors: any; layout: any; components: any; typography: any; charts: any;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tokens, setTokens] = useState<DesignTokens>(DEFAULT_TOKENS);
  const [density, setDensity] = useState<ThemeDensity>('normal');
  const [isDark, setIsDark] = useState(false);

  const toggleDark = () => setIsDark(!isDark);

  const activeColors = useMemo(() => {
    return isDark 
      ? { ...tokens.colors, background: '#020617', surface: '#0f172a', text: '#e2e8f0', border: '#1e293b' } 
      : tokens.colors;
  }, [isDark, tokens]);

  const themeValue = useMemo(() => {
    return {
      tokens, density, setDensity, isDark, toggleDark,
      mode: (isDark ? 'dark' : 'light') as 'light' | 'dark',
      // Update colors object to return class names that map to the Tailwind config we set in index.html
      colors: { 
          ...activeColors, 
          primary: 'bg-primary text-text-inverted', 
          background: 'bg-background',
          surface: 'bg-surface',
          border: 'border-border',
          text: { primary: 'text-text-primary', secondary: 'text-text-secondary', tertiary: 'text-slate-400' }, 
          semantic: { 
              success: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', icon: 'text-green-500', solid: 'bg-green-600 text-white' }, 
              warning: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', icon: 'text-amber-500', solid: 'bg-amber-500 text-white' }, 
              danger: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', icon: 'text-red-500', solid: 'bg-red-600 text-white' }, 
              info: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', icon: 'text-blue-500', solid: 'bg-blue-600 text-white' }, 
              neutral: { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-200', icon: 'text-slate-400', solid: 'bg-slate-500 text-white' } 
          } 
      },
      layout: { pageContainer: 'h-full flex flex-col', pagePadding: 'p-6 md:p-8', sectionSpacing: 'space-y-4', gridGap: 'gap-6', panelContainer: 'flex-1 flex flex-col bg-surface rounded-xl border border-border shadow-sm overflow-hidden', headerBorder: 'border-b border-border' },
      components: { card: 'bg-surface border border-border rounded-xl shadow-sm', badge: { base: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border' }, table: { header: 'px-6 py-4 text-left text-xs font-medium uppercase text-text-secondary', row: 'transition-colors', cell: 'px-6 py-4 whitespace-nowrap' } },
      typography: { h1: 'text-2xl font-bold tracking-tight text-text-primary', h2: 'text-xl font-bold text-text-primary', h3: 'text-lg font-bold text-text-primary', body: 'text-sm leading-relaxed text-text-secondary', small: 'text-xs text-text-secondary', label: 'text-xs font-bold uppercase tracking-wider text-text-secondary' },
      charts: { grid: isDark ? '#1e293b' : '#e2e8f0', tooltip: { backgroundColor: isDark ? '#0f172a' : '#fff', borderColor: isDark ? '#1e293b' : '#e2e8f0' }, palette: ['#0ea5e9', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6'] }
    };
  }, [activeColors, density, isDark, tokens]);

  useEffect(() => {
    const root = document.documentElement;
    const spacing = tokens.spacing[density];
    Object.entries(spacing).forEach(([k, v]) => root.style.setProperty(`--spacing-${k}`, v as string));
    // Set CSS variables for colors from activeColors (which handles dark mode)
    Object.entries(activeColors).forEach(([k, v]) => root.style.setProperty(`--color-${k}`, v as string));
  }, [activeColors, density, tokens]);

  return <ThemeContext.Provider value={themeValue}><div className={`${isDark ? 'dark' : ''} h-full bg-background text-text-primary`}>{children}</div></ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};
