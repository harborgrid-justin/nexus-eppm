import React from 'react';
import { useIndustry } from '../context/IndustryContext';
import { Industry } from '../types/index';
import { Building, Code, BookOpen, ChevronDown } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const IndustrySelector: React.FC = () => {
  const { industry, setIndustry } = useIndustry();
  const theme = useTheme();

  const industries: { id: Industry; label: string; icon: React.ElementType }[] = [
    { id: 'Construction', label: 'Infrastructure & EPC', icon: Building },
    { id: 'Software', label: 'Systems Development', icon: Code },
    { id: 'Standard', label: 'Standard PMBOK', icon: BookOpen },
  ];

  const CurrentIcon = industries.find(i => i.id === industry)?.icon || BookOpen;

  return (
    <div className="relative group">
      <select
        value={industry}
        onChange={(e) => setIndustry(e.target.value as Industry)}
        className={`appearance-none cursor-pointer ${theme.colors.background} border ${theme.colors.border} ${theme.colors.text.primary} text-xs font-bold uppercase tracking-widest rounded-xl pl-10 pr-10 py-2.5 focus:outline-none focus:ring-2 focus:ring-nexus-500 shadow-sm transition-all hover:border-slate-300`}
        aria-label="Global Industry Context Switcher"
      >
        {industries.map(i => (
          <option key={i.id} value={i.id}>{i.label}</option>
        ))}
      </select>
      <CurrentIcon size={16} className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${theme.colors.text.tertiary} pointer-events-none group-hover:text-nexus-500 transition-colors`} />
      <ChevronDown size={14} className={`absolute right-3.5 top-1/2 -translate-y-1/2 ${theme.colors.text.tertiary} pointer-events-none group-hover:text-nexus-500 transition-colors`} />
    </div>
  );
};

export default IndustrySelector;