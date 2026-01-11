
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Logger } from '../services/Logger';

// Mock Dictionary - Extended with full navigation and system labels for production use
const dictionaries: Record<string, Record<string, string>> = {
  'en-US': {
    'app.title': 'Nexus PPM',
    // Navigation Groups
    'nav.strategy': 'Strategy',
    'nav.execution': 'Execution',
    'nav.system': 'System',
    // Navigation Items
    'nav.portfolio': 'Portfolio',
    'nav.programs': 'Programs',
    'nav.unifier': 'Unifier',
    'nav.enterpriseRisks': 'Global Risk',
    'nav.projects': 'Projects',
    'nav.resources': 'Resources',
    'nav.myWork': 'Work',
    'nav.reports': 'Reports',
    'nav.data_exchange': 'Exchange',
    'nav.admin': 'Admin',
    'nav.design_system': 'Design System',
    // Common
    'common.project': 'Project',
    'common.save': 'Save Changes',
    'common.cancel': 'Cancel',
    'common.loading': 'Loading...',
    'common.welcome': 'Welcome back',
    'common.back_to_portfolio': 'Back to Portfolio',
    'common.close': 'Close',
    'common.analyzing': 'Synthesizing Executive Summary...',
    'common.analyzing_short': 'Analyzing...',
    'common.loading_context': 'Mounting Context...',
    'status.active': 'Active',
    'status.closed': 'Closed',
    // Module Specific
    'dashboard.title': 'Executive Portfolio Overview',
    'dashboard.subtitle': 'Consolidated KPIs for organizational investment and delivery.',
    'dashboard.ai_briefing': 'AI Briefing',
    'dashboard.ai_brief': 'Executive AI Briefing',
    'portfolio.provision': 'Provision Portfolio',
    'portfolio.not_init': 'Portfolio Inactive',
    'portfolio.not_init_desc': 'The organizational executive layer requires a defined Enterprise Project Structure (EPS) and active programs. Provision a strategic portfolio to activate predictive analytics.',
  },
  'es-ES': {
    'app.title': 'Nexus PPM',
    // Navigation Groups
    'nav.strategy': 'Estrategia',
    'nav.execution': 'Ejecución',
    'nav.system': 'Sistema',
    // Navigation Items
    'nav.portfolio': 'Portafolio',
    'nav.programs': 'Programas',
    'nav.unifier': 'Unifier',
    'nav.enterpriseRisks': 'Riesgo Global',
    'nav.projects': 'Proyectos',
    'nav.resources': 'Recursos',
    'nav.myWork': 'Trabajo',
    'nav.reports': 'Informes',
    'nav.data_exchange': 'Intercambio',
    'nav.admin': 'Admin',
    // Common
    'common.project': 'Proyecto',
    'common.save': 'Guardar Cambios',
    'common.cancel': 'Cancelar',
    'common.loading': 'Cargando...',
    'common.welcome': 'Bienvenido de nuevo',
    'status.active': 'Activo',
    'status.closed': 'Cerrado',
  }
};

interface I18nContextType {
  locale: string;
  setLocale: (locale: string) => void;
  t: (key: string, fallback?: string) => string;
  formatDate: (date: string | Date) => string;
  formatCurrency: (amount: number) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [locale, setLocale] = useState('en-US');

  const t = (key: string, fallback?: string): string => {
    const dict = dictionaries[locale] || dictionaries['en-US'];
    const text = dict[key];
    if (!text) {
      // Don't warn in production to avoid console noise
      if (process.env.NODE_ENV !== 'production') {
        Logger.warn(`Missing translation for key: ${key}`, { locale, component: 'I18nProvider' });
      }
      return fallback || key;
    }
    return text;
  };

  const formatDate = (date: string | Date): string => {
    if (!date) return '-';
    // Ensure locale-aware formatting
    return new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(date));
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat(locale, { style: 'currency', currency: 'USD' }).format(amount);
  };

  return (
    <I18nContext.Provider value={{ locale, setLocale, t, formatDate, formatCurrency }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) throw new Error('useI18n must be used within an I18nProvider');
  return context;
};
