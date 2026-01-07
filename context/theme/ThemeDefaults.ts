
export type ThemeDensity = 'compact' | 'normal' | 'comfortable';
export type FontMode = 'sans' | 'serif';

export interface DesignTokens {
  fontMode: FontMode;
  colors: Record<string, string>;
  spacing: Record<ThemeDensity, Record<string, string>>;
  shadows: Record<string, string>;
  borderRadius: Record<string, string>;
  typography: any;
  transitions: Record<string, string>;
  zIndex: Record<string, string>;
}

export const DEFAULT_TOKENS: DesignTokens = {
  fontMode: 'sans',
  colors: {
    // Enterprise Navy & Cool Greys
    primary: '#0f172a', // Slate 900
    primaryDark: '#020617', // Slate 950
    primaryLight: '#334155', // Slate 700
    
    secondary: '#2563eb', // Blue 600
    accent: '#4f46e5', // Indigo 600
    
    background: '#f8fafc', // Slate 50 - Very subtle off-white
    surface: '#ffffff',
    
    border: '#e2e8f0', // Slate 200
    borderLight: '#f1f5f9', // Slate 100
    
    text: '#1e293b', // Slate 800 - High contrast for readability
    textMuted: '#64748b', // Slate 500
    
    success: '#10b981', // Emerald 500
    warning: '#f59e0b', // Amber 500
    error: '#ef4444', // Red 500
    info: '#3b82f6', // Blue 500
  },
  spacing: {
    // Tighter spacing for high-density information display
    compact: { unit: '4px', gutter: '12px', container: '100%', inputPadding: '4px 8px', cardPadding: '12px', rowHeight: '28px' },
    normal: { unit: '4px', gutter: '20px', container: '100%', inputPadding: '8px 12px', cardPadding: '20px', rowHeight: '40px' },
    comfortable: { unit: '6px', gutter: '32px', container: '100%', inputPadding: '10px 16px', cardPadding: '24px', rowHeight: '56px' },
  },
  shadows: {
    // Subtle, expensive-looking shadows using ring offsets
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.05), 0 4px 6px -4px rgb(0 0 0 / 0.05)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.05), 0 8px 10px -6px rgb(0 0 0 / 0.05)',
    inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.02)',
  },
  // Drastically sharper corners for professional feel. 
  // Remapping 'xl' to 8px ensures existing UI components tighten up without code changes.
  borderRadius: { 
    sm: '2px', 
    md: '4px', 
    lg: '6px', 
    xl: '8px', // Was often 12px or 16px in default tailwind
    full: '9999px' 
  },
  typography: {
    fontSans: "'Inter', system-ui, -apple-system, sans-serif",
    fontSerif: "'Merriweather', serif",
    fontMono: "'JetBrains Mono', monospace",
    weights: { light: '300', normal: '400', medium: '500', semibold: '600', bold: '700', black: '900' },
    // Slightly smaller base size for density
    sizes: { 
        xs: '0.75rem', 
        sm: '0.8125rem', // 13px - Great for data grids
        base: '0.875rem', // 14px - New Standard Body
        lg: '1rem', 
        xl: '1.125rem', 
        '2xl': '1.25rem', 
        '3xl': '1.5rem' 
    }
  },
  transitions: { 
    fast: '100ms cubic-bezier(0.4, 0, 0.2, 1)', 
    normal: '200ms cubic-bezier(0.4, 0, 0.2, 1)', 
    slow: '300ms cubic-bezier(0.4, 0, 0.2, 1)' 
  },
  zIndex: { base: '0', header: '40', sidebar: '50', modal: '100', overlay: '90' }
};
