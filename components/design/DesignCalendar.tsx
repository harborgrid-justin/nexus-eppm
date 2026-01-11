
import React from 'react';
import { Calendar, Clock, MapPin, Users, ChevronLeft, ChevronRight, MoreHorizontal, CheckCircle } from 'lucide-react';
import { SectionHeading, DemoContainer, ComponentLabel } from './DesignHelpers';

export const DesignCalendar = () => {
  return (
    <div className="space-y-12 animate-fade-in pb-20">
        <SectionHeading title="Planning Calendar" icon={Calendar} count="CAL-01 to CAL-60" />
        
        {/* --- DAY & CELL PATTERNS --- */}
        <div className="space-y-6">
            <h4 className="text-lg font-bold text-slate-900 border-b pb-2">Calendar Cells & States</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                <DemoContainer>
                    <ComponentLabel id="CAL-01" name="Month Cell (Std)" />
                    <div className="w-full aspect-square border border-slate-200 bg-white p-2 relative hover:bg-slate-50 transition-colors cursor-pointer">
                        <span className="text-xs font-medium text-slate-700">14</span>
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="CAL-02" name="Month Cell (Today)" />
                    <div className="w-full aspect-square border border-slate-200 bg-white p-2 relative">
                        <span className="w-6 h-6 rounded-full bg-nexus-600 text-white flex items-center justify-center text-xs font-bold shadow-sm">14</span>
                    </div>
                </DemoContainer>
                
                <DemoContainer>
                    <ComponentLabel id="CAL-03" name="Cell w/ Event Dots" />
                    <div className="w-full aspect-square border border-slate-200 bg-white p-2 relative flex flex-col justify-between">
                        <span className="text-xs font-medium text-slate-700">22</span>
                        <div className="flex gap-1 justify-center">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                        </div>
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="CAL-04" name="Non-Working Day" />
                    <div className="w-full aspect-square border border-slate-200 bg-slate-100 p-2 relative pattern-diagonal-lines opacity-50">
                        <span className="text-xs font-bold text-slate-400">Sat</span>
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="CAL-05" name="Fiscal Period End" />
                    <div className="w-full aspect-square border-r-2 border-r-red-400 border-y border-l bg-white p-2 relative">
                        <span className="text-xs font-medium text-slate-700">30</span>
                        <span className="absolute bottom-1 right-1 text-[8px] font-black text-red-500 uppercase tracking-tighter">Q3 Close</span>
                    </div>
                </DemoContainer>
            </div>
        </div>

        {/* --- EVENT CHIPS & BARS --- */}
        <div className="space-y-6">
            <h4 className="text-lg font-bold text-slate-900 border-b pb-2">Event Representations</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <DemoContainer>
                    <ComponentLabel id="CAL-10" name="Multi-Day Span" />
                    <div className="w-full bg-blue-100 border-l-4 border-blue-500 text-blue-700 text-xs font-bold px-2 py-1 rounded-r truncate cursor-pointer hover:brightness-95">
                        Project Mobilization Phase
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="CAL-11" name="Milestone Marker" />
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-nexus-600 rotate-45"></div>
                        <span className="text-xs font-bold text-slate-700">Phase 1 Sign-off</span>
                        <div className="h-px bg-nexus-200 flex-1"></div>
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="CAL-12" name="Agenda Item" />
                    <div className="flex gap-3 p-2 border border-slate-100 rounded-lg hover:shadow-sm bg-white cursor-pointer">
                        <div className="w-1 bg-green-500 rounded-full"></div>
                        <div className="flex-1">
                            <p className="text-xs font-bold text-slate-800">Steering Committee</p>
                            <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                                <Clock size={10}/> 10:00 AM - 11:30 AM
                            </div>
                        </div>
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="CAL-13" name="Resource Shift" />
                    <div className="flex border border-slate-200 rounded overflow-hidden h-8 text-[10px] font-bold text-center">
                        <div className="w-1/3 bg-slate-50 flex items-center justify-center text-slate-400 border-r">OFF</div>
                        <div className="w-2/3 bg-green-50 text-green-700 flex items-center justify-center">08:00 - 17:00</div>
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="CAL-14" name="Conflict Indicator" />
                    <div className="w-full bg-red-50 border border-red-200 text-red-700 text-xs px-2 py-1 rounded flex items-center justify-between">
                        <span>Site Inspection</span>
                        <AlertTriangleIcon size={12} className="text-red-500"/>
                    </div>
                </DemoContainer>

                 <DemoContainer>
                    <ComponentLabel id="CAL-15" name="Completed Event" />
                    <div className="w-full bg-slate-50 border border-slate-200 text-slate-400 text-xs px-2 py-1 rounded flex items-center gap-2 line-through">
                        <CheckCircle size={10}/> Design Review
                    </div>
                </DemoContainer>
            </div>
        </div>

        {/* --- CALENDAR CHROME --- */}
        <div className="space-y-6">
            <h4 className="text-lg font-bold text-slate-900 border-b pb-2">Calendar Chrome</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DemoContainer>
                    <ComponentLabel id="CAL-20" name="Navigation Header" />
                    <div className="flex items-center justify-between bg-white border border-slate-200 rounded-lg p-2">
                        <div className="flex items-center gap-2">
                            <button className="p-1 hover:bg-slate-100 rounded text-slate-500"><ChevronLeft size={16}/></button>
                            <button className="p-1 hover:bg-slate-100 rounded text-slate-500"><ChevronRight size={16}/></button>
                            <span className="text-sm font-bold text-slate-800 ml-2">October 2023</span>
                        </div>
                        <div className="flex bg-slate-100 p-0.5 rounded">
                            <button className="px-3 py-1 text-[10px] font-bold bg-white shadow-sm rounded text-slate-700">Month</button>
                            <button className="px-3 py-1 text-[10px] font-bold text-slate-500">Week</button>
                            <button className="px-3 py-1 text-[10px] font-bold text-slate-500">Day</button>
                        </div>
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="CAL-21" name="Resource Row Header" />
                    <div className="flex items-center justify-between p-2 border-b border-slate-200 bg-slate-50">
                        <div className="flex items-center gap-2">
                             <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-[10px] font-bold text-indigo-700">JP</div>
                             <span className="text-xs font-bold text-slate-700">Jessica Pearson</span>
                        </div>
                        <div className="text-[9px] text-slate-400 font-mono">160h Cap</div>
                    </div>
                </DemoContainer>
            </div>
        </div>
    </div>
  );
};

// Internal Mock
const AlertTriangleIcon = (props: any) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
)
