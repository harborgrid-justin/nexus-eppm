
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export type Density = 'comfortable' | 'compact';
export type ThemeMode = 'light' | 'dark';

export interface Theme {
  mode: ThemeMode;
  setMode: (m: ThemeMode) => void;
  density: Density;
  setDensity: (d: Density) => void;
  colors: {
    background: string;
    surface: string;
    border: string;
    primary: string;
    primaryHover: string;
    accentBg: string;
    accentText: string;
    text: {
        primary: string;
        secondary: string;
        tertiary: string;
        inverted: string;
    };
    semantic: {
        success: { bg: string; text: string; border: string; icon: string };
        warning: { bg: string; text: string; border: string; icon: string };
        danger: { bg: string; text: string; border: string; icon: string };
        info: { bg: string; text: string; border: string; icon: string };
        neutral: { bg: string; text: string; border: string; icon: string };
    };
  };
  charts: {
      palette: string[];
      grid: string;
      tooltip: any;
  };
  layout: {
    pageContainer: string;
    pagePadding: string;
    sectionSpacing: string;
    gridGap: string;
    borderRadius: string;
    shadow: string;
    inputHeight: string;
    headerBorder: string;
    cardPadding: string;
    panelContainer: string;
    headerHeight: string;
  };
  components: {
      card: string;
      table: {
          header: string;
          row: string;
          cell: string;
      };
      button: {
          base: string;
          sizes: { sm: string; md: string; lg: string };
      };
      badge: {
          base: string;
      }
  };
  typography: {
    h1: string;
    h2: string;
    h3: string;
    heading: string;
    subtext: string;
    body: string;
    small: string;
    label: string;
    value: string;
    mono: string;
  };
}

const getTheme = (mode: ThemeMode, density: Density): Theme => {
  const isCompact = density === 'compact';
  const isDark = mode === 'dark';
  
  const colors = {
      background: isDark ? 'bg-slate-950' : 'bg-slate-50', 
      surface: isDark ? 'bg-slate-900' : 'bg-white',
      border: isDark ? 'border-slate-800' : 'border-slate-200',
      primary: 'bg-nexus-600',
      primaryHover: 'hover:bg-nexus-500',
      accentBg: 'bg-nexus-600',
      accentText: 'text-nexus-500',
      text: {
          primary: isDark ? 'text-slate-100' : 'text-slate-900',
          secondary: isDark ? 'text-slate-400' : 'text-slate-500',
          tertiary: isDark ? 'text-slate-600' : 'text-slate-400',
          inverted: isDark ? 'text-slate-900' : 'text-white'
      },
      semantic: {
          success: { 
              bg: isDark ? 'bg-emerald-900/30' : 'bg-emerald-50', 
              text: isDark ? 'text-emerald-400' : 'text-emerald-700', 
              border: isDark ? 'border-emerald-800' : 'border-emerald-200', 
              icon: isDark ? 'text-emerald-400' : 'text-emerald-500' 
          },
          warning: { 
              bg: isDark ? 'bg-amber-900/30' : 'bg-amber-50', 
              text: isDark ? 'text-amber-400' : 'text-amber-700', 
              border: isDark ? 'border-amber-800' : 'border-amber-200', 
              icon: isDark ? 'text-amber-400' : 'text-amber-500' 
          },
          danger: { 
              bg: isDark ? 'bg-red-900/30' : 'bg-red-50', 
              text: isDark ? 'text-red-400' : 'text-red-700', 
              border: isDark ? 'border-red-800' : 'border-red-200', 
              icon: isDark ? 'text-red-400' : 'text-red-500' 
          },
          info: { 
              bg: isDark ? 'bg-blue-900/30' : 'bg-blue-50', 
              text: isDark ? 'text-blue-400' : 'text-blue-700', 
              border: isDark ? 'border-blue-800' : 'border-blue-200', 
              icon: isDark ? 'text-blue-400' : 'text-blue-500' 
          },
          neutral: { 
              bg: isDark ? 'bg-slate-800' : 'bg-slate-100', 
              text: isDark ? 'text-slate-400' : 'text-slate-700', 
              border: isDark ? 'border-slate-700' : 'border-slate-200', 
              icon: isDark ? 'text-slate-600' : 'text-slate-400' 
          },
      }
  };

  return {
    mode,
    setMode: () => {},
    density,
    setDensity: () => {},
    colors,
    charts: {
        palette: ['#0ea5e9', '#22c55e', '#eab308', '#ef4444', '#8b5cf6', '#f97316'],
        grid: isDark ? '#334155' : '#e2e8f0', 
        tooltip: {
            backgroundColor: isDark ? '#1e293b' : '#fff',
            borderRadius: '8px',
            border: isDark ? '1px solid #334155' : '1px solid #e2e8f0',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            fontSize: '12px',
            color: isDark ? '#f8fafc' : '#1e293b'
        }
    },
    layout: {
      pageContainer: 'w-full max-w-[1920px] mx-auto',
      pagePadding: isCompact ? 'p-3 md:p-4' : 'p-4 md:p-6 lg:p-8',
      sectionSpacing: isCompact ? 'space-y-4' : 'space-y-6 md:space-y-8',
      gridGap: isCompact ? 'gap-3 md:gap-4' : 'gap-4 md:gap-6',
      borderRadius: isCompact ? 'rounded-lg' : 'rounded-xl',
      shadow: 'shadow-sm',
      inputHeight: isCompact ? 'h-8 text-xs' : 'h-10 text-sm',
      headerBorder: `border-b ${colors.border}`,
      cardPadding: isCompact ? 'p-3 md:p-4' : 'p-5 md:p-6',
      panelContainer: `flex flex-col h-full ${colors.surface} ${isCompact ? 'rounded-lg' : 'rounded-xl'} border ${colors.border} shadow-sm overflow-hidden`,
      headerHeight: isCompact ? 'h-14' : 'h-16',
    },
    components: {
        card: `${colors.surface} border ${colors.border} ${isCompact ? 'rounded-lg' : 'rounded-xl'} shadow-sm transition-all duration-200`,
        table: {
            header: `${isDark ? 'bg-slate-800' : 'bg-slate-50'} ${colors.text.secondary} font-bold uppercase tracking-wider border-b ${colors.border} ${isCompact ? 'px-3 py-2 text-[10px]' : 'px-6 py-3 text-xs'}`,
            row: `hover:${isDark ? 'bg-slate-800/50' : 'bg-slate-50'} transition-colors border-b ${isDark ? 'border-slate-800' : 'border-slate-100'} last:border-0`,
            cell: `${isCompact ? 'px-3 py-2 text-xs' : 'px-6 py-4 text-sm'} ${colors.text.primary} whitespace-nowrap`
        },
        button: {
            base: "inline-flex items-center justify-center font-bold tracking-tight transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.97] rounded-lg",
            sizes: {
                sm: "px-3 py-1.5 text-xs",
                md: isCompact ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm",
                lg: "px-6 py-3 text-base"
            }
        },
        badge: {
            base: "inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-[10px] md:text-xs font-bold border uppercase tracking-wider"
        }
    },
    typography: {
      h1: isCompact 
        ? `text-lg font-bold tracking-tight ${colors.text.primary}` 
        : `text-2xl md:text-3xl font-black tracking-tight ${colors.text.primary}`,
      h2: isCompact 
        ? `text-base font-bold tracking-tight ${colors.text.primary}`
        : `text-xl font-bold tracking-tight ${colors.text.primary}`,
      h3: `text-base font-bold ${colors.text.primary}`,
      heading: `text-lg md:text-xl font-bold ${colors.text.primary} tracking-tight`,
      subtext: `text-xs md:text-sm ${colors.text.secondary}`,
      body: `text-sm ${colors.text.tertiary} leading-relaxed`,
      small: `text-xs ${colors.text.secondary} font-medium`,
      label: `text-[10px] md:text-xs font-bold ${colors.text.secondary} uppercase tracking-widest`,
      value: `font-mono font-bold ${colors.text.primary}`,
      mono: `font-mono ${colors.text.secondary}`,
    }
  };
};

const ThemeContext = createContext<Theme>(getTheme('light', 'comfortable'));

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [density, setDensity] = useState<Density>('comfortable');
  const [mode, setMode] = useState<ThemeMode>('light');
  
  useEffect(() => {
      // Sync document background color for full page coverage
      if (mode === 'dark') {
          document.documentElement.classList.add('dark');
          document.body.style.backgroundColor = '#020617'; // slate-950
      } else {
          document.documentElement.classList.remove('dark');
          document.body.style.backgroundColor = '#f8fafc'; // slate-50
      }
  }, [mode]);

  const themeValue = { ...getTheme(mode, density), setDensity, setMode };

  return (
    <ThemeContext.Provider value={themeValue}>
      <div className={`${density === 'compact' ? 'density-compact' : ''} ${mode} h-full transition-colors duration-300 ease-in-out`}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
