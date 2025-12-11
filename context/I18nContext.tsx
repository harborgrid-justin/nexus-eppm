
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Logger } from '../services/Logger';

// Mock Dictionary - In a real app, these would be separate JSON files loaded lazily
const dictionaries: Record<string, Record<string, string>> = {
  'en-US': {
    'app.title': 'Nexus PPM',
    'nav.portfolio': 'Portfolio',
    'nav.programs': 'Programs',
    'nav.projects': 'Projects',
    'nav.admin': 'Administration',
    'status.active': 'Active',
    'status.closed': 'Closed',
    'common.save': 'Save Changes',
    'common.cancel': 'Cancel',
    'common.loading': 'Loading...',
  },
  'es-ES': {
    'app.title': 'Nexus PPM',
    'nav.portfolio': 'Portafolio',
    'nav.programs': 'Programas',
    'nav.projects': 'Proyectos',
    'nav.admin': 'Administración',
    'status.active': 'Activo',
    'status.closed': 'Cerrado',
    'common.save': 'Guardar Cambios',
    'common.cancel': 'Cancelar',
    'common.loading': 'Cargando...',
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
      Logger.warn(`Missing translation for key: ${key}`, { locale });
      return fallback || key;
    }
    return text;
  };

  const formatDate = (date: string | Date): string => {
    if (!date) return '-';
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
