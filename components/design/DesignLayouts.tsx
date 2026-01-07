import React, { useState } from 'react';
import { 
  LayoutTemplate, PanelLeftClose, PanelLeftOpen, Maximize2, Minimize2, 
  Menu, Search, Bell, User, Settings, ChevronRight, MoreHorizontal, 
  Plus, Filter, Download, Upload, Calendar, Grid, List, CheckSquare
} from 'lucide-react';
import { SectionHeading, DemoContainer, ComponentLabel } from './DesignHelpers';

export const DesignLayouts = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="space-y-12 animate-fade-in pb-20">
        <SectionHeading title="Structural Layouts" icon={LayoutTemplate} count="LO-01 to LO-70" />
        
        {/* --- APP SHELLS --- */}
        <div className="space-y-6">
            <h4 className="text-lg font-bold text-slate-900 border-b pb-2">Application Shells</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <DemoContainer>
                    <ComponentLabel id="LO-01" name="App Shell (Sidebar)" />
                    <div className="h-32 border border-slate-200 rounded flex overflow-hidden bg-white">
                        <div className={`bg-slate-800 h-full transition-all duration-300 flex flex-col ${sidebarCollapsed ? 'w-4' : 'w-12'}`}>
                            <div className="h-4 w-4 bg-blue-500 m-2 rounded-full"></div>
                            <div className="flex-1 space-y-1 p-2">
                                <div className="h-1 bg-slate-600 rounded w-full"></div>
                                <div className="h-1 bg-slate-600 rounded w-3/4"></div>
                            </div>
                        </div>
                        <div className="flex-1 flex flex-col">
                            <div className="h-8 border-b bg-white flex items-center px-2 justify-between">
                                <div className="h-2 w-12 bg-slate-200 rounded"></div>
                                <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="text-slate-400">
                                    {sidebarCollapsed ? <PanelLeftOpen size={10}/> : <PanelLeftClose size={10}/>}
                                </button>
                            </div>
                            <div className="flex-1 bg-slate-50 p-2">
                                <div className="h-full bg-white border border-dashed border-slate-300 rounded flex items-center justify-center text-[9px] text-slate-400">Main Content</div>
                            </div>
                        </div>
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="LO-02" name="Holy Grail Layout" />
                    <div className="h-32 border border-slate-200 rounded flex flex-col bg-white">
                        <div className="h-6 bg-slate-800 w-full flex items-center px-2"><div className="h-2 w-8 bg-slate-600 rounded"></div></div>
                        <div className="flex-1 flex overflow-hidden">
                            <div className="w-8 bg-slate-100 border-r border-slate-200 hidden sm:block"></div>
                            <div className="flex-1 bg-slate-50 p-2 flex items-center justify-center text-[9px] text-slate-400">Main Content</div>
                            <div className="w-8 bg-slate-100 border-l border-slate-200 hidden sm:block"></div>
                        </div>
                        <div className="h-4 bg-slate-100 border-t border-slate-200 w-full"></div>
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="LO-03" name="Collapsible Right Panel" />
                    <div className="h-32 border border-slate-200 rounded flex overflow-hidden bg-white">
                        <div className="w-10 bg-slate-800 h-full"></div>
                        <div className="flex-1 bg-slate-50 p-2"></div>
                        <div className="w-16 bg-white border-l border-slate-200 h-full flex flex-col">
                             <div className="h-6 border-b border-slate-100"></div>
                             <div className="flex-1 bg-slate-50 m-1 rounded"></div>
                        </div>
                    </div>
                </DemoContainer>
            </div>
        </div>

        {/* --- SPLIT VIEWS --- */}
        <div className="space-y-6">
            <h4 className="text-lg font-bold text-slate-900 border-b pb-2">Split Views & Panes</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <DemoContainer>
                    <ComponentLabel id="LO-04" name="Split View 50/50" />
                    <div className="h-32 border border-slate-200 rounded flex overflow-hidden bg-white">
                        <div className="flex-1 bg-slate-50 border-r border-slate-200 flex items-center justify-center text-[9px]">Pane A</div>
                        <div className="flex-1 bg-white flex items-center justify-center text-[9px]">Pane B</div>
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="LO-05" name="Master-Detail (30/70)" />
                    <div className="h-32 border border-slate-200 rounded flex overflow-hidden bg-white">
                        <div className="w-[30%] bg-slate-50 border-r border-slate-200 flex flex-col p-1 gap-1">
                             {[1,2,3,4].map(i => <div key={i} className="h-4 bg-white border border-slate-200 rounded"></div>)}
                        </div>
                        <div className="flex-1 bg-white p-2">
                             <div className="h-4 w-1/2 bg-slate-100 rounded mb-2"></div>
                             <div className="h-20 bg-slate-50 border border-dashed border-slate-200 rounded"></div>
                        </div>
                    </div>
                </DemoContainer>
                
                <DemoContainer>
                    <ComponentLabel id="LO-44" name="Comparison View" />
                    <div className="h-32 border border-slate-200 rounded flex overflow-hidden bg-white">
                        <div className="flex-1 bg-red-50/30 border-r border-slate-200 p-2 relative">
                             <span className="absolute top-1 left-1 text-[8px] font-bold text-red-400">BEFORE</span>
                             <div className="mt-4 space-y-1">
                                 <div className="h-2 w-3/4 bg-red-100 rounded"></div>
                                 <div className="h-2 w-1/2 bg-red-100 rounded"></div>
                             </div>
                        </div>
                        <div className="flex-1 bg-green-50/30 p-2 relative">
                             <span className="absolute top-1 left-1 text-[8px] font-bold text-green-600">AFTER</span>
                             <div className="mt-4 space-y-1">
                                 <div className="h-2 w-3/4 bg-green-100 rounded"></div>
                                 <div className="h-2 w-2/3 bg-green-100 rounded"></div>
                             </div>
                        </div>
                    </div>
                </DemoContainer>
            </div>
        </div>

        {/* --- DASHBOARDS --- */}
        <div className="space-y-6">
            <h4 className="text-lg font-bold text-slate-900 border-b pb-2">Dashboards & Widgets</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <DemoContainer>
                    <ComponentLabel id="LO-06" name="3-Column Dashboard" />
                    <div className="h-32 border border-slate-200 rounded bg-slate-50 p-2 gap-2 grid grid-cols-3">
                        <div className="bg-white rounded border border-slate-200 shadow-sm"></div>
                        <div className="bg-white rounded border border-slate-200 shadow-sm"></div>
                        <div className="bg-white rounded border border-slate-200 shadow-sm"></div>
                        <div className="col-span-2 bg-white rounded border border-slate-200 shadow-sm"></div>
                        <div className="bg-white rounded border border-slate-200 shadow-sm"></div>
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="LO-07" name="4-Column Stats" />
                    <div className="h-32 border border-slate-200 rounded bg-slate-50 p-2 flex flex-col gap-2">
                        <div className="grid grid-cols-4 gap-2 h-10">
                            {[1,2,3,4].map(i => <div key={i} className="bg-white rounded border border-slate-200 shadow-sm"></div>)}
                        </div>
                        <div className="flex-1 bg-white rounded border border-slate-200 shadow-sm"></div>
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="LO-08" name="Masonry Grid" />
                    <div className="h-32 border border-slate-200 rounded bg-slate-50 p-2 flex gap-2">
                         <div className="flex-1 flex flex-col gap-2">
                             <div className="h-10 bg-white rounded border border-slate-200 shadow-sm"></div>
                             <div className="h-16 bg-white rounded border border-slate-200 shadow-sm"></div>
                         </div>
                         <div className="flex-1 flex flex-col gap-2">
                             <div className="h-14 bg-white rounded border border-slate-200 shadow-sm"></div>
                             <div className="h-12 bg-white rounded border border-slate-200 shadow-sm"></div>
                         </div>
                    </div>
                </DemoContainer>
            </div>
        </div>

        {/* --- TABLES & LISTS --- */}
        <div className="space-y-6">
            <h4 className="text-lg font-bold text-slate-900 border-b pb-2">Tables & Lists</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <DemoContainer>
                    <ComponentLabel id="LO-09" name="Sticky Header Table" />
                    <div className="h-32 border border-slate-200 rounded bg-white flex flex-col overflow-hidden">
                        <div className="h-6 bg-slate-100 border-b border-slate-200 flex items-center px-2 gap-2 sticky top-0">
                            <div className="h-2 w-1/3 bg-slate-300 rounded"></div>
                            <div className="h-2 w-1/4 bg-slate-300 rounded"></div>
                            <div className="h-2 w-1/4 bg-slate-300 rounded"></div>
                        </div>
                        <div className="flex-1 p-2 space-y-2 overflow-y-hidden">
                            {[1,2,3,4].map(i => (
                                <div key={i} className="h-4 bg-slate-50 rounded w-full"></div>
                            ))}
                        </div>
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="LO-10" name="Sticky Footer Actions" />
                    <div className="h-32 border border-slate-200 rounded bg-white flex flex-col overflow-hidden relative">
                         <div className="flex-1 p-2">
                             <div className="space-y-2">
                                 {[1,2,3].map(i => <div key={i} className="h-4 bg-slate-50 w-full rounded"></div>)}
                             </div>
                         </div>
                         <div className="h-8 bg-white border-t border-slate-200 flex items-center justify-end px-2 gap-2 absolute bottom-0 w-full shadow-lg">
                             <div className="h-5 w-12 bg-slate-100 rounded"></div>
                             <div className="h-5 w-12 bg-blue-500 rounded"></div>
                         </div>
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="LO-19" name="List with Avatar" />
                    <div className="h-32 border border-slate-200 rounded bg-white p-2 space-y-2 overflow-hidden">
                        {[1,2,3].map(i => (
                            <div key={i} className="flex items-center gap-2 border-b border-slate-50 pb-1">
                                <div className="w-6 h-6 rounded-full bg-slate-200"></div>
                                <div className="flex-1 space-y-1">
                                    <div className="h-2 w-1/2 bg-slate-800 rounded"></div>
                                    <div className="h-1.5 w-1/3 bg-slate-400 rounded"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </DemoContainer>
            </div>
        </div>

        {/* --- OVERLAYS & MODALS --- */}
        <div className="space-y-6">
            <h4 className="text-lg font-bold text-slate-900 border-b pb-2">Overlays & Modals</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <DemoContainer>
                    <ComponentLabel id="LO-11" name="Modal Center" />
                    <div className="h-32 border border-slate-200 rounded bg-slate-100 relative flex items-center justify-center">
                        <div className="absolute inset-0 bg-black/10"></div>
                        <div className="bg-white w-32 h-20 rounded shadow-lg border border-slate-200 relative z-10 flex flex-col p-2">
                            <div className="h-3 w-16 bg-slate-200 rounded mb-2"></div>
                            <div className="flex-1"></div>
                            <div className="flex justify-end gap-1">
                                <div className="h-3 w-8 bg-slate-200 rounded"></div>
                                <div className="h-3 w-8 bg-blue-500 rounded"></div>
                            </div>
                        </div>
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="LO-12" name="Slide-over Right" />
                    <div className="h-32 border border-slate-200 rounded bg-slate-50 relative overflow-hidden">
                         <div className="absolute inset-0 bg-black/10"></div>
                         <div className="absolute top-0 right-0 bottom-0 w-24 bg-white shadow-xl border-l border-slate-200 z-10 p-2 flex flex-col gap-2">
                             <div className="h-4 border-b border-slate-100"></div>
                             <div className="h-2 bg-slate-100 rounded"></div>
                             <div className="h-2 bg-slate-100 rounded"></div>
                         </div>
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="LO-13" name="Fullscreen Overlay" />
                     <div className="h-32 border border-slate-200 rounded bg-white relative">
                         <div className="absolute inset-2 bg-slate-900 rounded flex items-center justify-center text-white text-[9px]">
                             Fullscreen Focus Mode
                             <button className="absolute top-2 right-2"><Minimize2 size={10}/></button>
                         </div>
                     </div>
                </DemoContainer>
            </div>
        </div>

        {/* --- WIZARDS & TABS --- */}
        <div className="space-y-6">
            <h4 className="text-lg font-bold text-slate-900 border-b pb-2">Wizards & Tabs</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <DemoContainer>
                    <ComponentLabel id="LO-14" name="Wizard Steps (Horizontal)" />
                    <div className="h-32 border border-slate-200 rounded bg-white p-4">
                        <div className="flex items-center justify-between mb-4 relative">
                            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-100 -z-10"></div>
                            <div className="w-4 h-4 rounded-full bg-blue-600 text-[8px] text-white flex items-center justify-center">1</div>
                            <div className="w-4 h-4 rounded-full bg-white border-2 border-blue-600 text-[8px] flex items-center justify-center">2</div>
                            <div className="w-4 h-4 rounded-full bg-white border-2 border-slate-200"></div>
                        </div>
                        <div className="h-10 bg-slate-50 rounded border border-dashed border-slate-200"></div>
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="LO-15" name="Wizard Steps (Vertical)" />
                    <div className="h-32 border border-slate-200 rounded bg-white flex">
                        <div className="w-16 border-r border-slate-100 p-2 flex flex-col gap-4 relative">
                             <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-slate-100 -z-10"></div>
                             <div className="w-4 h-4 rounded-full bg-blue-600 z-10"></div>
                             <div className="w-4 h-4 rounded-full bg-white border-2 border-slate-300 z-10"></div>
                             <div className="w-4 h-4 rounded-full bg-white border-2 border-slate-300 z-10"></div>
                        </div>
                        <div className="flex-1 p-2 bg-slate-50"></div>
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="LO-16" name="Tab Bar Top" />
                    <div className="h-32 border border-slate-200 rounded bg-white flex flex-col">
                        <div className="flex border-b border-slate-200">
                            {[0,1,2].map(i => (
                                <button key={i} onClick={() => setActiveTab(i)} className={`flex-1 py-2 text-[9px] font-bold border-b-2 transition-all ${activeTab===i ? 'border-blue-500 text-blue-600' : 'border-transparent text-slate-400'}`}>Tab {i+1}</button>
                            ))}
                        </div>
                        <div className="flex-1 bg-slate-50 p-2">
                             <div className="h-full bg-white border border-slate-200 rounded"></div>
                        </div>
                    </div>
                </DemoContainer>
            </div>
        </div>

        {/* --- SPECIALIZED VIEWS --- */}
        <div className="space-y-6">
            <h4 className="text-lg font-bold text-slate-900 border-b pb-2">Specialized Data Views</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <DemoContainer>
                    <ComponentLabel id="LO-21" name="Kanban Board" />
                    <div className="h-32 border border-slate-200 rounded bg-slate-50 p-2 flex gap-2 overflow-hidden">
                        {[1,2,3].map(i => (
                            <div key={i} className="w-20 bg-slate-100 rounded flex-shrink-0 flex flex-col gap-1 p-1">
                                <div className="h-2 w-full bg-slate-300 rounded mb-1"></div>
                                <div className="h-6 w-full bg-white border border-slate-200 rounded shadow-sm"></div>
                                <div className="h-6 w-full bg-white border border-slate-200 rounded shadow-sm"></div>
                            </div>
                        ))}
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="LO-22" name="Gantt Chart Layout" />
                    <div className="h-32 border border-slate-200 rounded bg-white flex flex-col">
                        <div className="h-6 border-b border-slate-200 bg-slate-50 flex">
                            <div className="w-16 border-r border-slate-200"></div>
                            <div className="flex-1 flex text-[6px] text-slate-400 items-center justify-around"><span>Jan</span><span>Feb</span><span>Mar</span></div>
                        </div>
                        <div className="flex-1 flex">
                            <div className="w-16 border-r border-slate-200 p-1 space-y-2">
                                <div className="h-2 bg-slate-100 rounded w-10"></div>
                                <div className="h-2 bg-slate-100 rounded w-12"></div>
                            </div>
                            <div className="flex-1 p-1 space-y-2 relative">
                                <div className="h-2 bg-blue-500 rounded w-12 absolute left-4 top-1"></div>
                                <div className="h-2 bg-blue-500 rounded w-8 absolute left-10 top-5"></div>
                            </div>
                        </div>
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="LO-24" name="Calendar Month" />
                    <div className="h-32 border border-slate-200 rounded bg-white flex flex-col">
                        <div className="h-6 flex border-b border-slate-200">
                             {['S','M','T','W','T','F','S'].map(d => <div key={d} className="flex-1 text-[8px] flex items-center justify-center bg-slate-50">{d}</div>)}
                        </div>
                        <div className="flex-1 grid grid-cols-7 grid-rows-4 divide-x divide-y divide-slate-100">
                            {[...Array(28)].map((_, i) => <div key={i} className="text-[6px] p-0.5 text-slate-300">{i+1}</div>)}
                        </div>
                    </div>
                </DemoContainer>
            </div>
        </div>

        {/* --- AUTH & PUBLIC --- */}
        <div className="space-y-6">
            <h4 className="text-lg font-bold text-slate-900 border-b pb-2">Auth & Pages</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <DemoContainer>
                    <ComponentLabel id="LO-26" name="Login Centered" />
                    <div className="h-32 border border-slate-200 rounded bg-slate-100 flex items-center justify-center">
                        <div className="w-32 h-24 bg-white shadow-lg rounded border border-slate-200 p-2 flex flex-col gap-2">
                            <div className="h-3 w-8 bg-blue-600 rounded mx-auto mb-1"></div>
                            <div className="h-4 bg-slate-100 rounded border border-slate-200"></div>
                            <div className="h-4 bg-slate-100 rounded border border-slate-200"></div>
                            <div className="h-4 bg-blue-600 rounded"></div>
                        </div>
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="LO-27" name="Login Split" />
                    <div className="h-32 border border-slate-200 rounded flex overflow-hidden">
                        <div className="w-1/2 bg-white flex items-center justify-center p-4">
                             <div className="w-full space-y-2">
                                <div className="h-2 w-10 bg-slate-800 mb-2"></div>
                                <div className="h-4 bg-slate-100 rounded"></div>
                                <div className="h-4 bg-blue-600 rounded"></div>
                             </div>
                        </div>
                        <div className="w-1/2 bg-slate-900 relative">
                             <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-slate-900 opacity-50"></div>
                        </div>
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="LO-33" name="404 Error Page" />
                    <div className="h-32 border border-slate-200 rounded bg-slate-50 flex flex-col items-center justify-center text-center p-4">
                         <div className="text-2xl font-black text-slate-200">404</div>
                         <div className="h-2 w-20 bg-slate-200 rounded mt-2"></div>
                         <div className="h-4 w-16 bg-blue-500 rounded mt-4"></div>
                    </div>
                </DemoContainer>
            </div>
        </div>

         {/* --- UTILITY & WIDGETS --- */}
         <div className="space-y-6">
            <h4 className="text-lg font-bold text-slate-900 border-b pb-2">Utility & Widgets</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <DemoContainer>
                    <ComponentLabel id="LO-36" name="Comment Thread" />
                    <div className="h-32 border border-slate-200 rounded bg-white p-2 space-y-2 overflow-hidden">
                        <div className="flex gap-2">
                             <div className="w-4 h-4 rounded-full bg-slate-200"></div>
                             <div className="flex-1 bg-slate-50 rounded p-1 text-[6px] text-slate-400 h-6"></div>
                        </div>
                         <div className="flex gap-2 flex-row-reverse">
                             <div className="w-4 h-4 rounded-full bg-blue-200"></div>
                             <div className="flex-1 bg-blue-50 rounded p-1 text-[6px] text-blue-400 h-8"></div>
                        </div>
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="LO-38" name="File Tree" />
                    <div className="h-32 border border-slate-200 rounded bg-white p-2 text-[9px] text-slate-500 font-mono">
                        <div>▼ root</div>
                        <div className="pl-2">▼ src</div>
                        <div className="pl-4">▶ components</div>
                        <div className="pl-4">  app.tsx</div>
                        <div className="pl-2">  package.json</div>
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="LO-45" name="Pricing Table" />
                    <div className="h-32 border border-slate-200 rounded bg-white p-2 flex gap-2 items-center">
                        <div className="flex-1 border rounded p-1 text-center h-20">
                             <div className="h-1 w-6 bg-slate-200 mx-auto mb-1"></div>
                             <div className="h-4 w-8 bg-slate-800 mx-auto mb-2 rounded"></div>
                        </div>
                        <div className="flex-1 border-2 border-blue-500 rounded p-1 text-center h-24 shadow-md bg-white relative -top-1">
                             <div className="h-1 w-6 bg-blue-200 mx-auto mb-1"></div>
                             <div className="h-4 w-8 bg-blue-600 mx-auto mb-2 rounded"></div>
                        </div>
                        <div className="flex-1 border rounded p-1 text-center h-20">
                             <div className="h-1 w-6 bg-slate-200 mx-auto mb-1"></div>
                             <div className="h-4 w-8 bg-slate-800 mx-auto mb-2 rounded"></div>
                        </div>
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="LO-46" name="Invoice Layout" />
                    <div className="h-32 border border-slate-200 rounded bg-white p-3 flex flex-col">
                        <div className="flex justify-between mb-2">
                             <div className="w-8 h-2 bg-slate-800 rounded"></div>
                             <div className="w-8 h-2 bg-slate-200 rounded"></div>
                        </div>
                        <div className="h-12 border rounded mb-2 bg-slate-50"></div>
                        <div className="mt-auto flex justify-end gap-2">
                             <div className="w-12 h-2 bg-slate-100"></div>
                             <div className="w-8 h-2 bg-slate-300"></div>
                        </div>
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="LO-50" name="Terminal Layout" />
                    <div className="h-32 border border-slate-800 rounded bg-slate-900 p-2 font-mono text-[8px] text-green-400">
                        <div>$ npm run build</div>
                        <div className="text-white">Building...</div>
                        <div className="text-yellow-400">WARN: dep deprecated</div>
                        <div className="text-green-400">Success (2.4s)</div>
                        <div className="animate-pulse">_</div>
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="LO-58" name="Popover / Tooltip" />
                    <div className="h-32 border border-slate-200 rounded bg-slate-50 flex items-center justify-center relative">
                        <div className="w-4 h-4 bg-slate-300 rounded-full"></div>
                        <div className="absolute top-8 bg-slate-800 text-white text-[8px] px-2 py-1 rounded shadow-lg">
                            User Info
                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-800 rotate-45"></div>
                        </div>
                    </div>
                </DemoContainer>
                
                <DemoContainer>
                    <ComponentLabel id="LO-61" name="Breadcrumb Header" />
                    <div className="h-32 border border-slate-200 rounded bg-white p-2">
                        <div className="flex items-center text-[8px] text-slate-400 gap-1 mb-2">
                            <span>Home</span> <span>/</span> <span>Project</span> <span>/</span> <span className="text-slate-800 font-bold">Details</span>
                        </div>
                        <div className="h-6 w-32 bg-slate-100 rounded"></div>
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="LO-64" name="Toast Stack" />
                    <div className="h-32 border border-slate-200 rounded bg-slate-50 relative overflow-hidden">
                        <div className="absolute bottom-2 right-2 flex flex-col gap-1 w-32">
                             <div className="bg-white border-l-2 border-green-500 shadow-sm p-1 rounded text-[8px]">Success</div>
                             <div className="bg-white border-l-2 border-red-500 shadow-sm p-1 rounded text-[8px]">Error</div>
                        </div>
                    </div>
                </DemoContainer>
            </div>
        </div>
        
        {/* --- LOADERS & SKELETONS --- */}
         <div className="space-y-6">
            <h4 className="text-lg font-bold text-slate-900 border-b pb-2">Loaders & Skeletons</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <DemoContainer>
                    <ComponentLabel id="LO-66" name="Skeleton Card" />
                    <div className="h-32 border border-slate-200 rounded bg-white p-3 animate-pulse">
                         <div className="flex gap-2 mb-2">
                             <div className="w-8 h-8 bg-slate-200 rounded-full"></div>
                             <div className="flex-1 space-y-1">
                                 <div className="h-2 w-20 bg-slate-200 rounded"></div>
                                 <div className="h-2 w-12 bg-slate-200 rounded"></div>
                             </div>
                         </div>
                         <div className="space-y-1">
                             <div className="h-2 w-full bg-slate-200 rounded"></div>
                             <div className="h-2 w-full bg-slate-200 rounded"></div>
                             <div className="h-2 w-2/3 bg-slate-200 rounded"></div>
                         </div>
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="LO-67" name="Skeleton List" />
                    <div className="h-32 border border-slate-200 rounded bg-white p-2 space-y-2 animate-pulse">
                         {[1,2,3].map(i => (
                             <div key={i} className="flex gap-2 items-center">
                                 <div className="w-6 h-6 bg-slate-100 rounded"></div>
                                 <div className="h-2 flex-1 bg-slate-100 rounded"></div>
                             </div>
                         ))}
                    </div>
                </DemoContainer>
            </div>
         </div>
    </div>
  );
};