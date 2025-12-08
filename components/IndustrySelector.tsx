import React from 'react';
import { useIndustry } from '../context/IndustryContext';
import { Industry } from '../types';
import { Building, Code, BookOpen, ChevronDown } from 'lucide-react';

const IndustrySelector: React.FC = () => {
  const { industry, setIndustry } = useIndustry();

  const industries: { id: Industry; label: string; icon: React.ElementType }[] = [
    { id: 'Construction', label: 'General Contracting', icon: Building },
    { id: 'Software', label: 'Software Development', icon: Code },
    { id: 'Standard', label: 'Standard PM', icon: BookOpen },
  ];

  const CurrentIcon = industries.find(i => i.id === industry)?.icon || BookOpen;

  return (
    <div className="relative">
      <select
        value={industry}
        onChange={(e) => setIndustry(e.target.value as Industry)}
        className="appearance-none cursor-pointer bg-slate-50 border border-slate-200 text-slate-700 text-sm font-medium rounded-lg pl-9 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-nexus-500"
        aria-label="Select Industry Overlay"
      >
        {industries.map(i => (
          <option key={i.id} value={i.id}>{i.label}</option>
        ))}
      </select>
      <CurrentIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
      <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
    </div>
  );
};

export default IndustrySelector;