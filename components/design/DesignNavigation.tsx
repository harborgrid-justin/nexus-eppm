
import React, { useState } from 'react';
import { 
    Map, Home, ChevronRight, LayoutGrid, Menu, MoreVertical, 
    Bell, User, Settings, ChevronDown, Calendar, Search, Command,
    ArrowLeft, ArrowRight, PanelLeftClose, PanelLeftOpen
} from 'lucide-react';
import { SectionHeading, DemoContainer, ComponentLabel } from './DesignHelpers';
import { UserAvatar } from '../common/UserAvatar';

export const DesignNavigation = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className="space-y-12 animate-fade-in pb-20">
        <SectionHeading title="Global Navigation" icon={Map} count="NV-01 to NV-50" />
        
        {/* --- BREADCRUMBS & HEADERS --- */}
        <div className="space-y-6">
            <h4 className="text-lg font-bold text-slate-900 border-b pb-2">Breadcrumbs & Headers</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DemoContainer>
                    <ComponentLabel id="NV-01" name="Breadcrumbs (Standard)" />
                    <div className="flex items-center text-xs text-slate-500">
                        <span className="hover:text-blue-600 cursor-pointer flex items-center"><Home className="w-3 h-3 mr-1"/> Home</span> 
                        <ChevronRight className="w-3 h-3 mx-1"/> 
                        <span className="hover:text-blue-600 cursor-pointer">Projects</span>
                        <ChevronRight className="w-3 h-3 mx-1"/> 
                        <span className="font-bold text-slate-800 cursor-default">Project Alpha</span>
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="NV-10" name="Breadcrumbs (Collapsed)" />
                    <div className="flex items-center text-xs text-slate-500">
                        <span className="hover:text-blue-600 cursor-pointer">Root</span> 
                        <ChevronRight className="w-3 h-3 mx-1"/> 
                        <span className="px-1 py-0.5 rounded hover:bg-slate-100 cursor-pointer">...</span>
                        <ChevronRight className="w-3 h-3 mx-1"/> 
                        <span className="font-bold text-slate-800">Detail View</span>
                    </div>
                </DemoContainer>
                
                <DemoContainer>
                    <ComponentLabel id="NV-11" name="App Header (Compact)" />
                    <div className="flex items-center justify-between bg-slate-900 text-white p-2 rounded-lg shadow-md">
                        <div className="flex items-center gap-3">
                            <div className="p-1 bg-white/10 rounded"><Menu size={16}/></div>
                            <span className="font-bold text-sm tracking-tight">Nexus PPM</span>
                        </div>
                        <div className="flex items-center gap-2">
                             <Search size={14} className="text-slate-400"/>
                             <UserAvatar name="JS" size="sm" className="bg-blue-600 text-white border-2 border-slate-800"/>
                        </div>
                    </div>
                </DemoContainer>
            </div>
        </div>

        {/* --- TABS & SEGMENTED CONTROLS --- */}
        <div className="space-y-6">
            <h4 className="text-lg font-bold text-slate-900 border-b pb-2">Tabs & Switchers</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <DemoContainer>
                    <ComponentLabel id="NV-15" name="Line Tabs" />
                    <div className="flex border-b border-slate-200">
                        {['Overview', 'Tasks', 'Gantt'].map((tab, i) => (
                            <button 
                                key={i} 
                                onClick={() => setActiveTab(i)}
                                className={`px-4 py-2 text-xs font-bold border-b-2 transition-colors ${activeTab === i ? 'border-nexus-600 text-nexus-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="NV-16" name="Pill Tabs" />
                    <div className="flex bg-slate-100 p-1 rounded-lg w-fit">
                        {['Day', 'Week', 'Month'].map((tab, i) => (
                            <button 
                                key={i}
                                className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${i === 1 ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="NV-17" name="Folder Tabs" />
                    <div className="flex items-end gap-1 border-b border-slate-200 pl-2">
                        <div className="bg-white border-t border-x border-slate-200 px-4 py-2 rounded-t-lg text-xs font-bold text-slate-800 relative top-px z-10">Active</div>
                        <div className="bg-slate-50 border-t border-x border-slate-200 px-4 py-1.5 rounded-t-lg text-xs text-slate-500 hover:bg-slate-100 cursor-pointer">Archive</div>
                    </div>
                </DemoContainer>
            </div>
        </div>

        {/* --- PAGINATION & STEPPERS --- */}
        <div className="space-y-6">
            <h4 className="text-lg font-bold text-slate-900 border-b pb-2">Pagination & Wizards</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DemoContainer>
                    <ComponentLabel id="NV-20" name="Pagination (Simple)" />
                    <div className="flex items-center gap-2 text-xs">
                        <button className="p-1 rounded border border-slate-200 hover:bg-slate-50 disabled:opacity-50" disabled><ArrowLeft size={12}/></button>
                        <span className="text-slate-600">Page 1 of 12</span>
                        <button className="p-1 rounded border border-slate-200 hover:bg-slate-50"><ArrowRight size={12}/></button>
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="NV-21" name="Pagination (Complex)" />
                    <div className="flex items-center gap-1 text-xs font-medium">
                        <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-slate-100 border border-transparent hover:border-slate-200">Prev</button>
                        <button className="w-8 h-8 flex items-center justify-center rounded bg-nexus-600 text-white shadow-sm">1</button>
                        <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-slate-50">2</button>
                        <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-slate-50">3</button>
                        <span className="w-8 text-center text-slate-400">...</span>
                        <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-slate-50">12</button>
                        <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-slate-100 border border-transparent hover:border-slate-200">Next</button>
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="NV-25" name="Wizard Stepper" />
                    <div className="flex items-center w-full">
                        <div className="flex flex-col items-center relative z-10">
                            <div className="w-6 h-6 rounded-full bg-nexus-600 text-white flex items-center justify-center text-[10px] font-bold">1</div>
                            <span className="text-[9px] font-bold text-nexus-700 mt-1 uppercase">Setup</span>
                        </div>
                        <div className="flex-1 h-0.5 bg-nexus-600 -mx-2 mb-4"></div>
                        <div className="flex flex-col items-center relative z-10">
                            <div className="w-6 h-6 rounded-full bg-white border-2 border-nexus-600 text-nexus-600 flex items-center justify-center text-[10px] font-bold">2</div>
                            <span className="text-[9px] font-bold text-slate-500 mt-1 uppercase">Config</span>
                        </div>
                        <div className="flex-1 h-0.5 bg-slate-200 -mx-2 mb-4"></div>
                        <div className="flex flex-col items-center relative z-10">
                            <div className="w-6 h-6 rounded-full bg-white border-2 border-slate-200 text-slate-300 flex items-center justify-center text-[10px] font-bold">3</div>
                            <span className="text-[9px] font-bold text-slate-300 mt-1 uppercase">Deploy</span>
                        </div>
                    </div>
                </DemoContainer>
            </div>
        </div>

        {/* --- MENUS & SIDEBARS --- */}
        <div className="space-y-6">
            <h4 className="text-lg font-bold text-slate-900 border-b pb-2">Menus & Sidebars</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <DemoContainer>
                    <ComponentLabel id="NV-30" name="Sidebar Item (Active)" />
                    <div className="w-full bg-slate-50 rounded-lg p-2 border-l-4 border-nexus-500 flex items-center gap-3 shadow-sm">
                        <LayoutGrid size={16} className="text-nexus-600"/>
                        <span className="text-sm font-bold text-slate-900">Dashboard</span>
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="NV-31" name="Sidebar Item (Inactive)" />
                    <div className="w-full p-2 flex items-center gap-3 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer">
                        <Settings size={16}/>
                        <span className="text-sm font-medium">Settings</span>
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="NV-35" name="User Dropdown" />
                    <div className="bg-white border border-slate-200 rounded-lg shadow-lg w-48 overflow-hidden">
                        <div className="p-3 border-b border-slate-100">
                            <p className="text-xs font-bold text-slate-800">Justin S.</p>
                            <p className="text-[10px] text-slate-500">Admin</p>
                        </div>
                        <div className="p-1 space-y-0.5">
                            <button className="w-full text-left px-2 py-1.5 text-xs text-slate-600 hover:bg-slate-50 rounded flex items-center gap-2"><User size={12}/> Profile</button>
                            <button className="w-full text-left px-2 py-1.5 text-xs text-slate-600 hover:bg-slate-50 rounded flex items-center gap-2"><Settings size={12}/> Settings</button>
                        </div>
                    </div>
                </DemoContainer>
                
                 <DemoContainer>
                    <ComponentLabel id="NV-40" name="Command Bar" />
                    <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-2 flex items-center gap-2 text-xs text-slate-500 cursor-text hover:border-nexus-300 transition-colors w-full">
                        <Search size={14}/>
                        <span>Type a command...</span>
                        <span className="ml-auto bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded text-[9px] font-mono flex items-center gap-1"><Command size={8}/> K</span>
                    </div>
                </DemoContainer>
            </div>
        </div>
    </div>
  );
};
