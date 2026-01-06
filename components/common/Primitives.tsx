
import React from 'react';
import { Card } from '../ui/Card';
import { FileText as FileTextIcon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const FileIcon: React.FC<{ type?: string }> = ({ type }) => (
  <div className="bg-slate-100 p-2 rounded text-slate-500"><FileTextIcon size={16}/></div>
);

export const TagList: React.FC<{ tags?: string[] }> = ({ tags = ['Default Tag'] }) => (
  <div className="flex gap-1">
    {tags.map((tag, i) => (
       <span key={i} className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded">{tag}</span>
    ))}
  </div>
);

export const MetricCard: React.FC<{ label: string; value: string; icon: React.ElementType; className?: string; }> = ({ label, value, icon: Icon, className }) => {
  const theme = useTheme();
  return (
    <Card className={`p-4 relative ${className}`}>
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
      <Icon className="absolute top-4 right-4 text-slate-300" size={24}/>
    </Card>
  );
};
