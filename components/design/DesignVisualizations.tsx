
import React from 'react';
import { Activity, BarChart3, PieChart as PieIcon, Info } from 'lucide-react';
import { SectionHeading, DemoContainer, ComponentLabel } from './DesignHelpers';
import { MicroVisuals } from './visuals/MicroVisuals';
import { BarVisuals } from './visuals/BarVisuals';

export const DesignVisualizations = () => (
    <div className="space-y-12 animate-fade-in pb-20">
        <SectionHeading title="Chart Foundations" icon={BarChart3} count="VZ-01 to VZ-50" />
        
        <h4 className="text-lg font-bold text-slate-900 border-b pb-2 mb-6">Micro & Spark Charts</h4>
        <MicroVisuals />
        
        <h4 className="text-lg font-bold text-slate-900 border-b pb-2 mb-6 mt-12">Standard Series</h4>
        <BarVisuals />

        {/* --- CHART CHROME & AXES --- */}
        <div className="space-y-6 mt-12">
            <h4 className="text-lg font-bold text-slate-900 border-b pb-2">Chart Chrome & Axes</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <DemoContainer>
                    <ComponentLabel id="VZ-20" name="Standard Legend" />
                    <div className="flex flex-wrap gap-3">
                        <div className="flex items-center gap-1.5 text-xs text-slate-600">
                            <div className="w-3 h-3 bg-blue-500 rounded-sm"></div> Actuals
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-600">
                            <div className="w-3 h-3 bg-slate-300 rounded-sm"></div> Baseline
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-600">
                            <div className="w-3 h-3 bg-orange-400 rounded-sm"></div> Forecast
                        </div>
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="VZ-21" name="Custom Tooltip" />
                    <div className="bg-slate-900 text-white p-3 rounded-lg shadow-xl text-xs max-w-[150px]">
                        <p className="font-bold text-slate-300 mb-1 border-b border-white/10 pb-1">Aug 2024</p>
                        <div className="flex justify-between gap-4 mb-0.5">
                            <span className="text-blue-400">Spend:</span>
                            <span className="font-mono font-bold">$12.4k</span>
                        </div>
                         <div className="flex justify-between gap-4">
                            <span className="text-slate-400">Budget:</span>
                            <span className="font-mono">$10.0k</span>
                        </div>
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="VZ-22" name="Axis Label (X)" />
                    <div className="flex justify-between border-t border-slate-300 pt-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider w-full">
                        <span>Q1</span><span>Q2</span><span>Q3</span><span>Q4</span>
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="VZ-23" name="Grid Lines (Dotted)" />
                    <div className="w-full h-16 flex flex-col justify-between border-l border-slate-300 pl-1">
                        <div className="w-full border-b border-dashed border-slate-200 h-0"></div>
                        <div className="w-full border-b border-dashed border-slate-200 h-0"></div>
                        <div className="w-full border-b border-dashed border-slate-200 h-0"></div>
                    </div>
                </DemoContainer>
            </div>
        </div>

        {/* --- PALETTES --- */}
        <div className="space-y-6 mt-12">
            <h4 className="text-lg font-bold text-slate-900 border-b pb-2">Color Palettes</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <DemoContainer>
                    <ComponentLabel id="VZ-30" name="Categorical Palette" />
                    <div className="flex h-8 w-full rounded-md overflow-hidden">
                        <div className="flex-1 bg-[#0ea5e9]"></div>
                        <div className="flex-1 bg-[#22c55e]"></div>
                        <div className="flex-1 bg-[#f59e0b]"></div>
                        <div className="flex-1 bg-[#ef4444]"></div>
                        <div className="flex-1 bg-[#8b5cf6]"></div>
                    </div>
                    <div className="flex justify-between text-[9px] text-slate-400 mt-1 font-mono">
                        <span>Blue</span><span>Green</span><span>Amber</span><span>Red</span><span>Purple</span>
                    </div>
                </DemoContainer>

                 <DemoContainer>
                    <ComponentLabel id="VZ-31" name="Sequential Palette" />
                    <div className="flex h-8 w-full rounded-md overflow-hidden">
                        <div className="flex-1 bg-blue-100"></div>
                        <div className="flex-1 bg-blue-300"></div>
                        <div className="flex-1 bg-blue-500"></div>
                        <div className="flex-1 bg-blue-700"></div>
                        <div className="flex-1 bg-blue-900"></div>
                    </div>
                    <div className="flex justify-between text-[9px] text-slate-400 mt-1 font-mono">
                        <span>Low</span><span>High</span>
                    </div>
                </DemoContainer>
            </div>
        </div>

        <p className="text-xs text-slate-400 italic">Decomposed into sub-modules for enterprise scalability.</p>
    </div>
);
