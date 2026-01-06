
import React from 'react';
import { Box } from 'lucide-react';
import { SectionHeading } from './DesignHelpers';
import { DesignCardsBasic } from './cards/DesignCardsBasic';

export const DesignCards = () => {
  return (
    <div className="space-y-12 animate-fade-in pb-20">
        <SectionHeading title="Cards & Containers" icon={Box} count="CD-01 to CD-60" />
        <h4 className="text-lg font-bold text-slate-900 border-b pb-2 mb-6">Basic Containers</h4>
        <DesignCardsBasic />
        <p className="text-xs text-slate-400 italic">Advanced card patterns extracted for maintainability.</p>
    </div>
  );
};
