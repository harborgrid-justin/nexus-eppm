import React from 'react';
import { Activity, BarChart3, PieChart as PieIcon } from 'lucide-react';
import { SectionHeading } from './DesignHelpers';
import { MicroVisuals } from './visuals/MicroVisuals';
import { BarVisuals } from './visuals/BarVisuals';

export const DesignVisualizations = () => (
    <div className="space-y-12 animate-fade-in pb-20">
        <SectionHeading title="Micro Charts & Sparklines" icon={Activity} count="VZ-01 to VZ-12" />
        <MicroVisuals />
        <SectionHeading title="Bar & Column Variants" icon={BarChart3} count="VZ-13 to VZ-24" />
        <BarVisuals />
        <p className="text-xs text-slate-400 italic">Decomposed into sub-modules for enterprise scalability.</p>
    </div>
);