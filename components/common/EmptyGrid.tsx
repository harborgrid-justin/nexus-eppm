import React from 'react';
import { Plus, Database, LucideIcon } from 'lucide-react';
import { Button } from '../ui/Button';

interface EmptyGridProps {
  title: string;
  description: string;
  onAdd?: () => void;
  actionLabel?: string;
  icon?: LucideIcon;
}

/**
 * Standardized Empty State for data tables and lists.
 * Implements the professional light grey radial fill requested for production readiness.
 */
export const EmptyGrid: React.FC<EmptyGridProps> = ({ 
  title, 
  description, 
  onAdd, 
  actionLabel = "Add Record",
  icon: Icon = Database
}) => (
  <div className="flex-1 flex flex-col items-center justify-center p-12 nexus-empty-pattern border-2 border-dashed border-slate-200 rounded-xl m-4 animate-nexus-in">
    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 border border-slate-100 text-slate-300">
      <Icon size={32} />
    </div>
    <h3 className="text-lg font-bold text-slate-800 mb-1">{String(title)}</h3>
    <p className="text-sm text-slate-500 max-w-sm text-center mb-6">{String(description)}</p>
    {onAdd && (
      <Button onClick={onAdd} icon={Plus} size="md">
        {String(actionLabel)}
      </Button>
    )}
  </div>
);