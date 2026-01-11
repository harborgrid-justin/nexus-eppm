
import React from 'react';
import { Plus, Briefcase, RefreshCw } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { Button } from '../ui/Button';

interface Props {
  title: string;
  onCreate: () => void;
  onRefresh: () => void;
  disabled?: boolean;
}

export const UnifierToolbar: React.FC<Props> = ({ title, onCreate, onRefresh, disabled }) => {
  const theme = useTheme();
  return (
    <div className={`p-4 border-b ${theme.colors.border} flex flex-col sm:flex-row justify-between items-center bg-slate-50/50 gap-3`}>
        <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className={`p-2 ${theme.colors.surface} rounded-lg border ${theme.colors.border} shadow-sm ${theme.colors.text.tertiary}`}>
                <Briefcase size={16}/>
            </div>
            <h3 className={`font-black ${theme.colors.text.primary} text-sm uppercase tracking-widest truncate`}>{title}</h3>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
            <Button 
                variant="ghost" 
                size="sm" 
                onClick={onRefresh} 
                icon={RefreshCw}
                className="flex-1 sm:flex-none"
                disabled={disabled}
            >
                Refresh
            </Button>
            <Button 
                variant="primary"
                size="sm"
                onClick={onCreate} 
                icon={Plus}
                className="flex-1 sm:flex-none"
                disabled={disabled}
            >
                Initialize
            </Button>
        </div>
    </div>
  );
};
