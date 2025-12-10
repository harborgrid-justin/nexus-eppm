
import React, { createContext, useContext, ReactNode } from 'react';

interface Theme {
  layout: {
    pageContainer: string;
    pagePadding: string;
    sectionSpacing: string;
    gridGap: string;
    cardPadding: string;
    header: string;
    headerBorder: string;
    panelContainer: string;
  };
  colors: {
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    primary: string;
    border: string;
    accentBg: string;
  };
  typography: {
    h1: string;
    h2: string;
    h3: string;
    body: string;
    small: string;
  };
}

export const defaultTheme: Theme = {
  layout: {
    pageContainer: 'h-full flex flex-col overflow-hidden animate-in fade-in duration-500',
    pagePadding: 'p-6',
    sectionSpacing: 'space-y-6',
    gridGap: 'gap-6',
    cardPadding: 'p-6',
    header: 'flex justify-between items-center flex-shrink-0',
    headerBorder: 'border-b border-slate-200',
    panelContainer: 'bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col',
  },
  colors: {
    background: 'bg-slate-50',
    surface: 'bg-white',
    text: 'text-slate-900',
    textSecondary: 'text-slate-500',
    primary: 'text-nexus-600',
    border: 'border-slate-200',
    accentBg: 'bg-nexus-600',
  },
  typography: {
    h1: 'text-2xl font-bold text-slate-900 flex items-center gap-2',
    h2: 'text-lg font-bold text-slate-900',
    h3: 'text-lg font-bold text-slate-900',
    body: 'text-sm text-slate-700',
    small: 'text-xs text-slate-500',
  }
};

const ThemeContext = createContext<Theme>(defaultTheme);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <ThemeContext.Provider value={defaultTheme}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
