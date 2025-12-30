
import React from 'react';
import { Search, Sliders } from 'lucide-react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

interface FilterBarProps {
  onSearch: (term: string) => void;
  searchValue: string;
  searchPlaceholder?: string;
  onFilterClick?: () => void;
  actions?: React.ReactNode;
  className?: string;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  onSearch,
  searchValue,
  searchPlaceholder = "Search...",
  onFilterClick,
  actions,
  className = ""
}) => {
  return (
    <div className={`flex flex-col sm:flex-row justify-between items-center gap-3 ${className}`}>
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <Input 
          isSearch 
          placeholder={searchPlaceholder} 
          value={searchValue} 
          onChange={(e) => onSearch(e.target.value)} 
          className="w-full sm:w-64"
        />
        {onFilterClick && (
          <Button variant="secondary" size="md" icon={Sliders} onClick={onFilterClick}>
            Filter
          </Button>
        )}
      </div>
      {actions && (
        <div className="w-full sm:w-auto flex gap-2">
          {actions}
        </div>
      )}
    </div>
  );
};
