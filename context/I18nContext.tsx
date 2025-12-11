
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Logger } from '../services/Logger';

// Mock Dictionary - In a real app, these would be separate JSON files loaded lazily
const dictionaries: Record<string, Record<string, string>> = {
  'en-US': {
    'app.title': 'Nexus PPM',
    // Navigation
    'nav.core_modules': 'Core Modules',
    'nav.installed_engines': 'Installed Engines',
    'nav.administration': 'Administration',
    'nav.portfolio': 'Portfolio',
    'nav.programs': 'Programs',
    'nav.projects': 'Projects',
    'nav.data_exchange': 'Data Exchange',
    'nav.marketplace': 'App Marketplace',
    'nav.integrations': 'Integration Hub',
    'nav.settings': 'Settings',
    'nav.workbench': 'Component Workbench',
    // Common
    'common.project': 'Project',
    'common.save': 'Save Changes',
    'common.cancel': 'Cancel',
    'common.loading': 'Loading...',
    'common.welcome': 'Welcome back',
    'status.active': 'Active',
    'status.closed': 'Closed',
  },
  'es-ES': {
    'app.title': 'Nexus PPM',
    // Navigation
    'nav.core_modules': 'Módulos Principales',
    'nav.installed_engines': 'Motores Instalados',
    'nav.administration': 'Administración',
    'nav.portfolio': 'Portafolio',
    'nav.programs': 'Programas',
    'nav.projects': 'Proyectos',
    'nav.data_exchange': 'Intercambio de Datos',
    'nav.marketplace': 'Mercado de Aplicaciones',
    'nav.integrations': 'Centro de Integración',
    'nav.settings': 'Configuración',
    'nav.workbench': 'Banco de Componentes',
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
