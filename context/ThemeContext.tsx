
import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Density = 'comfortable' | 'compact';

export interface Theme {
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

export const defaultTheme = (density: Density = 'comfortable'): Theme => {
  const isCompact = density === 'compact';
  
  return {
    density,
    setDensity: () => {},
    colors: {
      background: 'bg-slate-50', 
      surface: 'bg-white',
      border: 'border-slate-200',
      primary: 'bg-nexus-600',
      primaryHover: 'hover:bg-nexus-700',
      accentBg: 'bg-nexus-600',
      accentText: 'text-nexus-600',
      text: {
          primary: 'text-slate-900',
          secondary: 'text-slate-500',
          tertiary: 'text-slate-400',
          inverted: 'text-white'
      },
      semantic: {
          success: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', icon: 'text-emerald-500' },
          warning: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', icon: 'text-amber-500' },
          danger: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', icon: 'text-red-500' },
          info: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', icon: 'text-blue-500' },
          neutral: { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-200', icon: 'text-slate-400' },
      }
    },
    charts: {
        palette: ['#0ea5e9', '#22c55e', '#eab308', '#ef4444', '#8b5cf6', '#f97316'],
        grid: '#e2e8f0', 
        tooltip: {
            backgroundColor: '#fff',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            fontSize: '12px',
            color: '#1e293b'
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
      headerBorder: 'border-b border-slate-200',
      cardPadding: isCompact ? 'p-3 md:p-4' : 'p-5 md:p-6',
      panelContainer: `flex flex-col h-full bg-white ${isCompact ? 'rounded-lg' : 'rounded-xl'} border border-slate-200 shadow-sm overflow-hidden`,
      headerHeight: isCompact ? 'h-14' : 'h-16',
    },
    components: {
        card: `bg-white border border-slate-200 ${isCompact ? 'rounded-lg' : 'rounded-xl'} shadow-sm transition-all duration-200`,
        table: {
            header: `bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200 ${isCompact ? 'px-3 py-2 text-[10px]' : 'px-6 py-3 text-xs'}`,
            row: `hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0`,
            cell: `${isCompact ? 'px-3 py-2 text-xs' : 'px-6 py-4 text-sm'} text-slate-700 whitespace-nowrap`
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
        ? 'text-lg font-bold tracking-tight text-slate-900' 
        : 'text-2xl md:text-3xl font-black tracking-tight text-slate-900',
      h2: isCompact 
        ? 'text-base font-bold tracking-tight text-slate-800' 
        : 'text-xl font-bold tracking-tight text-slate-800',
      h3: 'text-base font-bold text-slate-800',
      heading: 'text-lg md:text-xl font-bold text-slate-900 tracking-tight',
      subtext: 'text-xs md:text-sm text-slate-500',
      body: 'text-sm text-slate-600 leading-relaxed',
      small: 'text-xs text-slate-500 font-medium',
      label: 'text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest',
      value: 'font-mono font-bold text-slate-900',
      mono: 'font-mono text-slate-500',
    }
  };
};

const ThemeContext = createContext<Theme>(defaultTheme());

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [density, setDensity] = useState<Density>('comfortable');
  
  return (
    <ThemeContext.Provider value={{ ...defaultTheme(density), setDensity }}>
      <div className={`${density === 'compact' ? 'density-compact' : ''} text-slate-900 h-full`}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
