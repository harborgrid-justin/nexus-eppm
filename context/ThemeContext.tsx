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

  const themeValue = useMemo(() => {
    const activeColors = isDark ? { ...tokens.colors, background: '#020617', surface: '#0f172a', text: '#e2e8f0' } : tokens.colors;
    return {
      tokens, density, setDensity, isDark, toggleDark,
      mode: (isDark ? 'dark' : 'light') as 'light' | 'dark',
      colors: { ...activeColors, primary: 'bg-primary text-text-inverted', text: { primary: 'text-text-primary', secondary: 'text-text-secondary' }, semantic: { success: { bg: 'bg-green-50', text: 'text-green-700' }, warning: { bg: 'bg-amber-50', text: 'text-amber-700' }, danger: { bg: 'bg-red-50', text: 'text-red-700' }, info: { bg: 'bg-blue-50', text: 'text-blue-700' }, neutral: { bg: 'bg-slate-100', text: 'text-slate-700' } } },
      layout: { pageContainer: 'h-full flex flex-col', pagePadding: 'p-6 md:p-8', sectionSpacing: 'space-y-6 md:space-y-8', gridGap: 'gap-6', panelContainer: 'flex-1 flex flex-col bg-surface rounded-xl border border-border shadow-sm overflow-hidden', headerBorder: 'border-b border-border' },
      components: { card: 'bg-surface border border-border rounded-xl shadow-sm', badge: { base: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border' }, table: { header: 'px-6 py-4 text-left text-xs font-medium uppercase', row: 'transition-colors', cell: 'px-6 py-4 whitespace-nowrap' } },
      typography: { h1: 'text-2xl font-bold tracking-tight', h2: 'text-xl font-bold', h3: 'text-lg font-bold', body: 'text-sm leading-relaxed', label: 'text-xs font-bold uppercase tracking-wider' },
      charts: { grid: isDark ? '#1e293b' : '#e2e8f0', tooltip: { backgroundColor: isDark ? '#0f172a' : '#fff' }, palette: ['#0ea5e9', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6'] }
    };
  }, [isDark, density, tokens]);

  useEffect(() => {
    const root = document.documentElement;
    const spacing = tokens.spacing[density];
    // FIX: Cast 'v' to string to resolve 'unknown' type error in root.style.setProperty calls.
    Object.entries(spacing).forEach(([k, v]) => root.style.setProperty(`--spacing-${k}`, v as string));
    // FIX: Cast 'v' to string to resolve 'unknown' type error in root.style.setProperty calls.
    Object.entries(tokens.colors).forEach(([k, v]) => root.style.setProperty(`--color-${k}`, v as string));
  }, [tokens, density]);

  return <ThemeContext.Provider value={themeValue}><div className={`${isDark ? 'dark' : ''} h-full`}>{children}</div></ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};