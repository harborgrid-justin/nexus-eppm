
import { LucideIcon } from 'lucide-react';
import React from 'react';

// --- Navigation Types ---
export interface NavItem {
  id: string;
  label: string;
  icon?: LucideIcon;
}

export interface NavGroup {
  id: string;
  label: string;
  items: NavItem[];
}

// --- Data Table Types ---
export interface Column<T> {
  key: string;
  header: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
  className?: string;
}

export interface SortConfig {
  key: string;
  direction: 'asc' | 'desc' | null;
}

// --- Badge Types ---
export type StatusVariant = 'health' | 'status' | 'priority' | 'custom' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';
