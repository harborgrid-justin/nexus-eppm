
import React, { createContext, useContext, useState, useMemo, ReactNode, useEffect } from 'react';
import { DEFAULT_TOKENS, ThemeDensity, DesignTokens } from './theme/ThemeDefaults';

interface ThemeContextType {
  tokens: DesignTokens;
  setTokens: (t: DesignTokens) => void;
  density: ThemeDensity;
  setDensity: (d: ThemeDensity) => void;
  isDark: boolean;
  toggleDark: () => void;
  mode: 'light' | 'dark';
  colors: any;
  layout: any;
  components: any;
  typography: any;
  charts: any;
  shadows: Record<string, string>;
  borderRadius: Record<string, string>;
  transitions: Record<string, string>;
  zIndex: Record<string, string>;
  spacing: Record<string, string>;
  
  // New Categories
  status: Record<string, string>;
  priority: Record<string, string>;
  schedule: Record<string, string>;
  inputs: Record<string, string>;
  effects: {
      opacity: Record<string, string>;
      blur: Record<string, string>;
      gradients: Record<string, string>;
  };
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tokens, setTokens] = useState<DesignTokens>(DEFAULT_TOKENS);
  const [density, setDensity] = useState<ThemeDensity>('normal');
  const [isDark, setIsDark] = useState(false);

  const toggleDark = () => setIsDark(!isDark);

  const activeColors = useMemo(() => {
    if (!isDark) return tokens.colors;
    
    return { 
      ...tokens.colors, 
      background: '#020617', 
      surface: '#0f172a', 
      surfaceMuted: '#1e293b',
      text: '#f8fafc', 
      textSecondary: '#94a3b8',
      textMuted: '#64748b',
      border: '#1e293b',
      borderSubtle: '#0f172a',
      borderStrong: '#334155'
    };
  }, [isDark, tokens]);

  const themeValue = useMemo(() => {
    return {
      tokens,
      setTokens,
      density,
      setDensity,
      isDark,
      toggleDark,
      mode: (isDark ? 'dark' : 'light') as 'light' | 'dark',
      shadows: tokens.shadows,
      borderRadius: tokens.borderRadius,
      transitions: tokens.transitions,
      zIndex: tokens.zIndex,
      spacing: tokens.spacing[density],
      
      // New Exposures
      status: tokens.status,
      priority: tokens.priority,
      schedule: tokens.schedule,
      inputs: tokens.inputs,
      effects: {
          opacity: tokens.opacity,
          blur: tokens.blur,
          gradients: tokens.gradients
      },

      colors: { 
          ...activeColors, 
          primary: 'bg-primary text-text-inverted', 
          background: 'bg-background',
          surface: 'bg-surface',
          border: 'border-border',
          text: { 
            primary: 'text-text-primary', 
            secondary: 'text-text-secondary', 
            tertiary: 'text-slate-400' 
          }, 
          semantic: { 
              success: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', icon: 'text-green-500', solid: 'bg-green-600 text-white' }, 
              warning: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', icon: 'text-amber-500', solid: 'bg-amber-500 text-white' }, 
              danger: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', icon: 'text-red-500', solid: 'bg-red-600 text-white' }, 
              info: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', icon: 'text-blue-500', solid: 'bg-blue-600 text-white' }, 
              neutral: { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-200', icon: 'text-slate-400', solid: 'bg-slate-500 text-white' } 
          } 
      },
      layout: { 
        pageContainer: 'h-full flex flex-col', 
        pagePadding: 'p-6 md:p-8', 
        sectionSpacing: 'space-y-4', 
        gridGap: 'gap-6', 
        panelContainer: 'flex-1 flex flex-col bg-surface rounded-xl border border-border shadow-sm overflow-hidden', 
        headerBorder: 'border-b border-border' 
      },
      components: { 
        card: 'bg-surface border border-border rounded-xl shadow-sm', 
        badge: { base: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border' }, 
        table: { 
          header: 'px-6 py-4 text-left text-xs font-medium uppercase text-text-secondary', 
          row: 'transition-colors', 
          cell: 'px-6 py-4 whitespace-nowrap' 
        } 
      },
      typography: { 
        h1: 'text-2xl font-bold tracking-tight text-text-primary', 
        h2: 'text-xl font-bold text-text-primary', 
        h3: 'text-lg font-bold text-text-primary', 
        body: 'text-sm leading-relaxed text-text-secondary', 
        small: 'text-xs text-text-secondary', 
        label: 'text-xs font-bold uppercase tracking-wider text-text-secondary' 
      },
      charts: { 
        grid: isDark ? tokens.charts.grid : '#e2e8f0', 
        tooltip: { backgroundColor: isDark ? '#0f172a' : '#fff', borderColor: isDark ? '#1e293b' : '#e2e8f0' }, 
        // Extended Palette
        palette: [
            tokens.charts.palette1, tokens.charts.palette2, tokens.charts.palette3, 
            tokens.charts.palette4, tokens.charts.palette5, tokens.charts.palette6,
            tokens.charts.palette7, tokens.charts.palette8, tokens.charts.palette9,
            tokens.charts.palette10, tokens.charts.palette11, tokens.charts.palette12
        ] 
      }
    };
  }, [activeColors, density, isDark, tokens]);

  useEffect(() => {
    const root = document.documentElement;
    const spacing = tokens.spacing[density];
    
    // Inject Spacing Variables
    Object.entries(spacing).forEach(([k, v]) => root.style.setProperty(`--spacing-${k}`, v as string));
    
    // Inject Color Variables
    Object.entries(activeColors).forEach(([k, v]) => {
        if (typeof v === 'string') root.style.setProperty(`--color-${k}`, v);
    });
    
    // Inject Layout Variables
    Object.entries(tokens.layout).forEach(([k, v]) => root.style.setProperty(`--layout-${k}`, v as string));
    
    // Inject Border Radius Variables
    Object.entries(tokens.borderRadius).forEach(([k, v]) => root.style.setProperty(`--radius-${k}`, v as string));

    // Inject Z-Index Variables
    Object.entries(tokens.zIndex).forEach(([k, v]) => root.style.setProperty(`--z-${k}`, v as string));

    // Inject Transition Variables
    Object.entries(tokens.transitions).forEach(([k, v]) => root.style.setProperty(`--transition-${k}`, v as string));

    // Inject Chart Variables
    Object.entries(tokens.charts).forEach(([k, v]) => root.style.setProperty(`--chart-${k}`, v as string));

    // Inject New Semantic Categories
    Object.entries(tokens.status).forEach(([k, v]) => root.style.setProperty(`--status-${k}`, v as string));
    Object.entries(tokens.priority).forEach(([k, v]) => root.style.setProperty(`--priority-${k}`, v as string));
    Object.entries(tokens.schedule).forEach(([k, v]) => root.style.setProperty(`--schedule-${k}`, v as string));
    
    // Inject Effects
    Object.entries(tokens.opacity).forEach(([k, v]) => root.style.setProperty(`--opacity-${k}`, v as string));
    
    // Inject Typography Variables
    root.style.setProperty('--font-sans', tokens.typography.fontSans);
    root.style.setProperty('--font-display', tokens.typography.fontDisplay);
    root.style.setProperty('--font-mono', tokens.typography.fontMono);
    root.style.setProperty('--lh-base', tokens.typography.lineHeightBase);
    root.style.setProperty('--lh-tight', tokens.typography.lineHeightTight);
    root.style.setProperty('--ls-tight', tokens.typography.letterSpacingTight);
    root.style.setProperty('--ls-wide', tokens.typography.letterSpacingWide);

  }, [activeColors, density, tokens]);

  return (
    <ThemeContext.Provider value={themeValue}>
      <div className={`${isDark ? 'dark' : ''} h-full bg-background text-text-primary`}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};
