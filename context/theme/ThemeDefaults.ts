
export type ThemeDensity = 'compact' | 'normal' | 'comfortable';
export type FontMode = 'sans' | 'serif';

export interface DesignTokens {
  fontMode: FontMode;
  colors: Record<string, string>;
  layout: Record<string, string>;
  spacing: Record<ThemeDensity, Record<string, string>>;
  shadows: Record<string, string>;
  borderRadius: Record<string, string>;
  typography: any;
  transitions: Record<string, string>;
  zIndex: Record<string, string>;
  charts: Record<string, string>;
}

export const DEFAULT_TOKENS: DesignTokens = {
  fontMode: 'sans',
  colors: {
    // Core Brand
    primary: '#0f172a',
    primaryHover: '#1e293b',
    primaryActive: '#020617',
    primaryLight: '#334155',
    
    secondary: '#2563eb',
    secondaryHover: '#1d4ed8',
    secondaryActive: '#1e40af',
    
    accent: '#4f46e5',
    accentHover: '#4338ca',
    
    // Surfaces
    background: '#f8fafc',
    surface: '#ffffff',
    surfaceMuted: '#f1f5f9',
    surfaceInverted: '#0f172a',
    
    // Borders
    border: '#e2e8f0',
    borderSubtle: '#f1f5f9',
    borderStrong: '#cbd5e1',
    focusRing: '#3b82f6',
    
    // Text
    text: '#1e293b',
    textSecondary: '#475569',
    textMuted: '#64748b',
    textInverted: '#ffffff',
    
    // Semantic States
    success: '#10b981',
    successMuted: '#ecfdf5',
    warning: '#f59e0b',
    warningMuted: '#fffbeb',
    error: '#ef4444',
    errorMuted: '#fef2f2',
    info: '#3b82f6',
    infoMuted: '#eff6ff',
  },
  layout: {
    headerHeight: '56px',
    sidebarWidth: '256px',
    sidebarCollapsedWidth: '64px',
    sidePanelWidth: '480px',
    containerMaxWidth: '1440px',
    topNavHeight: '48px',
    footerHeight: '28px'
  },
  spacing: {
    compact: { unit: '4px', gutter: '12px', container: '100%', inputPadding: '4px 8px', cardPadding: '12px', rowHeight: '28px' },
    normal: { unit: '4px', gutter: '20px', container: '100%', inputPadding: '8px 12px', cardPadding: '20px', rowHeight: '40px' },
    comfortable: { unit: '6px', gutter: '32px', container: '100%', inputPadding: '10px 16px', cardPadding: '24px', rowHeight: '56px' },
  },
  shadows: {
    none: 'none',
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.05), 0 4px 6px -4px rgb(0 0 0 / 0.05)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.05), 0 8px 10px -6px rgb(0 0 0 / 0.05)',
    inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.02)',
    focus: '0 0 0 3px rgba(59, 130, 246, 0.4)',
  },
  borderRadius: { 
    none: '0px',
    sm: '2px', 
    md: '4px', 
    lg: '8px', 
    xl: '12px', 
    '2xl': '24px',
    full: '9999px' 
  },
  typography: {
    fontSans: "'Inter', system-ui, -apple-system, sans-serif",
    fontDisplay: "'Inter', sans-serif",
    fontMono: "'JetBrains Mono', monospace",
    lineHeightBase: '1.5',
    lineHeightTight: '1.25',
    lineHeightRelaxed: '1.75',
    letterSpacingTight: '-0.025em',
    letterSpacingWide: '0.025em',
    weights: { 
        light: '300', 
        normal: '400', 
        medium: '500', 
        semibold: '500', 
        bold: '600', 
        black: '700' 
    }
  },
  transitions: { 
    instant: '0ms',
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)', 
    normal: '250ms cubic-bezier(0.4, 0, 0.2, 1)', 
    slow: '400ms cubic-bezier(0.4, 0, 0.2, 1)',
    elastic: '500ms cubic-bezier(0.68, -0.6, 0.32, 1.6)'
  },
  zIndex: { 
    base: '0', 
    dropdown: '10',
    sticky: '20',
    header: '40', 
    sidebar: '50', 
    overlay: '90',
    modal: '100', 
    toast: '200'
  },
  charts: {
    grid: '#e2e8f0',
    text: '#64748b',
    tooltipBg: '#ffffff',
    cpmCritical: '#ef4444',
    cpmNonCritical: '#3b82f6',
    cpmBaseline: '#facc15',
    cpmFloat: '#22c55e',
    heatLow: '#ecfdf5',
    heatMid: '#fde68a',
    heatHigh: '#fca5a5'
  }
};
