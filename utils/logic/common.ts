
import { SystemAlert, AlertSeverity, AlertCategory } from '../../types/business';

export const createAlert = (
  severity: AlertSeverity, 
  category: AlertCategory, 
  title: string, 
  message: string, 
  link?: any
): SystemAlert => ({
  id: `ALT-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
  date: new Date().toISOString(),
  severity,
  category,
  title,
  message,
  link,
  isRead: false
});

export const sumArray = (arr: number[]) => arr.reduce((a, b) => a + b, 0);
