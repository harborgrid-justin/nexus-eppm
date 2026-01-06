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
    primary: '#0f172a', primaryDark: '#020617', primaryLight: '#f1f5f9',
    secondary: '#2563eb', accent: '#6366f1', background: '#f8fafc',
    surface: '#ffffff', border: '#e2e8f0', borderLight: '#f8fafc',
    text: '#0f172a', textMuted: '#64748b', success: '#10b981',
    warning: '#f59e0b', error: '#ef4444', info: '#3b82f6',
  },
  spacing: {
    compact: { unit: '4px', gutter: '16px', container: '1280px', inputPadding: '6px 12px', cardPadding: '12px', rowHeight: '32px' },
    normal: { unit: '6px', gutter: '24px', container: '1920px', inputPadding: '8px 16px', cardPadding: '24px', rowHeight: '48px' },
    comfortable: { unit: '8px', gutter: '32px', container: '2400px', inputPadding: '12px 24px', cardPadding: '32px', rowHeight: '64px' },
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)', md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)', xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
    inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  },
  borderRadius: { sm: '0.25rem', md: '0.5rem', lg: '0.75rem', xl: '1rem', full: '9999px' },
  typography: {
    fontSans: "'Inter', sans-serif", fontSerif: "'Merriweather', serif", fontMono: "'JetBrains Mono', monospace",
    weights: { light: '300', normal: '400', medium: '500', semibold: '600', bold: '700', black: '900' },
    sizes: { xs: '0.75rem', sm: '0.875rem', base: '1rem', lg: '1.125rem', xl: '1.25rem', '2xl': '1.5rem', '3xl': '1.875rem' }
  },
  transitions: { fast: '150ms ease', normal: '300ms ease', slow: '500ms ease' },
  zIndex: { base: '0', header: '40', sidebar: '50', modal: '100', overlay: '90' }
};