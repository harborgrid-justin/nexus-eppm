
import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Smartphone, Tablet, Monitor, Box, Folder, Search, Grid, List, MoreVertical, Wifi, Battery, Signal, User, Bell, CheckCircle, AlertTriangle, Wrench, Globe, Maximize2 } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

// Mock Mobile Status Bar
const StatusBar = () => (
    <div className="h-6 bg-black text-white flex justify-between items-center px-4 text-[10px] font-bold select-none">
        <span>9:41</span>
        <div className="flex gap-1.5">
            <Signal size={10} />
            <Wifi size={10} />
            <Battery size={10} />
        </div>
    </div>
);

export const FileExplorerTmpl: React.FC = () => {
    const theme = useTheme();
    return (
        <div className={`h-full flex ${theme.colors.background}`}>
            <div className="w-64 border-r border-slate-200 bg-white flex flex-col p-4">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Drives</h3>
                <div className="space-y-1">
                    <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-bold cursor-pointer"><Box size={16}/> Project Files</div>
                    <div className="flex items-center gap-2 px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-lg text-sm cursor-pointer"><Box size={16}/> Shared Team</div>
                    <div className="flex items-center gap-2 px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-lg text-sm cursor-pointer"><Box size={16}/> Archives</div>
                </div>
            </div>
            <div className="flex-1 flex flex-col">
                <div className="p-4 border-b border-slate-200 bg-white flex justify-between items-center">
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                        <span className="hover:underline cursor-pointer">Root</span> / <span className="hover:underline cursor-pointer">Project Alpha</span> / <span className="font-bold text-slate-800">Designs</span>
                    </div>
                    <div className="flex gap-2">
                        <Button size="sm" variant="ghost" icon={List} />
                        <Button size="sm" variant="ghost" icon={Grid} />
                    </div>
                </div>
                <div className="flex-1 p-6 overflow-y-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {[...Array(12)].map((_, i) => (
                            <div key={i} className="group p-4 bg-white border border-slate-200 rounded-xl hover:shadow-md hover:border-nexus-300 cursor-pointer flex flex-col items-center text-center transition-all">
                                <Folder size={48} className="text-blue-400 fill-blue-50 mb-2 group-hover:text-blue-500" />
                                <span className="text-xs font-medium text-slate-700 truncate w-full">Design_Asset_{i+1}.fig</span>
                                <span className="text-[10px] text-slate-400 mt-1">2.4 MB</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export const MobilePreviewTmpl: React.FC = () => {
    return (
        <div className="h-full flex items-center justify-center bg-slate-100 p-8 overflow-hidden">
            <div className="w-[375px] h-[812px] bg-white rounded-[3rem] border-8 border-slate-900 shadow-2xl overflow-hidden relative flex flex-col">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-6 bg-slate-900 rounded-b-2xl z-20"></div>
                <StatusBar />
                
                {/* App Content */}
                <div className="flex-1 bg-slate-50 flex flex-col overflow-hidden">
                    <div className="p-6 bg-white shadow-sm z-10">
                        <div className="flex justify-between items-center mb-6">
                            <div className="w-10 h-10 bg-slate-200 rounded-full"></div>
                            <Bell size={24} className="text-slate-400"/>
                        </div>
                        <h2 className="text-2xl font-black text-slate-900">Good Morning,<br/>Mike</h2>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        <div className="p-4 bg-nexus-600 text-white rounded-2xl shadow-lg shadow-nexus-500/30">
                            <p className="text-xs opacity-80 uppercase font-bold">Project Status</p>
                            <h3 className="text-xl font-bold mt-1">On Track</h3>
                            <div className="mt-4 flex gap-2">
                                <div className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
                                    <div className="h-full bg-white w-[70%]"></div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-white rounded-2xl shadow-sm">
                                <CheckCircle className="text-green-500 mb-2"/>
                                <p className="font-bold text-slate-800">Tasks</p>
                                <p className="text-xs text-slate-400">12 Pending</p>
                            </div>
                            <div className="p-4 bg-white rounded-2xl shadow-sm">
                                <AlertTriangle className="text-orange-500 mb-2"/>
                                <p className="font-bold text-slate-800">Alerts</p>
                                <p className="text-xs text-slate-400">3 New</p>
                            </div>
                        </div>
                    </div>

                    {/* Tab Bar */}
                    <div className="h-16 bg-white border-t border-slate-200 flex justify-around items-center px-2">
                         <div className="p-2 text-nexus-600"><Grid size={24}/></div>
                         <div className="p-2 text-slate-300"><Search size={24}/></div>
                         <div className="p-2 text-slate-300"><User size={24}/></div>
                    </div>
                </div>
                
                {/* Home Indicator */}
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-slate-900 rounded-full"></div>
            </div>
        </div>
    );
};

export const KioskModeTmpl: React.FC = () => {
    return (
        <div className="h-full bg-slate-900 flex flex-col items-center justify-center p-12 text-center text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-nexus-900 via-slate-900 to-black opacity-80"></div>
            <div className="relative z-10 max-w-4xl w-full">
                <h1 className="text-5xl font-black mb-4 tracking-tighter">Manufacturing Floor Terminal 04</h1>
                <p className="text-xl text-slate-400 mb-12">Select an operation to begin</p>
                
                <div className="grid grid-cols-2 gap-8">
                    <button className="h-64 bg-nexus-600 hover:bg-nexus-500 rounded-3xl flex flex-col items-center justify-center gap-6 transition-all shadow-[0_0_40px_rgba(2,132,199,0.3)] hover:scale-105 active:scale-95 group">
                        <Box size={80} className="text-white group-hover:animate-bounce"/>
                        <span className="text-2xl font-bold uppercase tracking-widest">Inventory Check</span>
                    </button>
                    <button className="h-64 bg-slate-800 hover:bg-slate-700 rounded-3xl flex flex-col items-center justify-center gap-6 transition-all border-2 border-slate-700 hover:border-white/20 hover:scale-105 active:scale-95">
                        <Wrench size={80} className="text-slate-400"/>
                        <span className="text-2xl font-bold uppercase tracking-widest text-slate-300">Maintenance Log</span>
                    </button>
                </div>
                
                <div className="mt-12 flex justify-center gap-8">
                    <div className="bg-black/40 px-6 py-3 rounded-full backdrop-blur border border-white/10 text-sm font-mono text-slate-400">
                        Uptime: 42d 12h
                    </div>
                    <div className="bg-black/40 px-6 py-3 rounded-full backdrop-blur border border-white/10 text-sm font-mono text-green-400 flex items-center gap-2">
                        <Wifi size={14}/> Connected
                    </div>
                </div>
            </div>
        </div>
    );
};

export const CommandCenterTmpl: React.FC = () => {
    return (
        <div className="h-full bg-black text-green-500 font-mono p-4 grid grid-cols-3 grid-rows-2 gap-4">
            <div className="border border-green-900/50 bg-green-900/10 rounded p-4 relative overflow-hidden">
                <h3 className="text-xs font-bold uppercase mb-2">Global Threat Map</h3>
                <div className="absolute inset-0 flex items-center justify-center opacity-20">
                    <Globe size={200} />
                </div>
                <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
            </div>
            <div className="col-span-2 border border-green-900/50 bg-green-900/10 rounded p-4">
                <h3 className="text-xs font-bold uppercase mb-2">Live Event Stream</h3>
                <div className="space-y-1 text-xs opacity-80">
                    <div>[14:02:01] <span className="text-white">SYS_INIT</span> Sequence started...</div>
                    <div>[14:02:05] <span className="text-blue-400">NET_chk</span> Handshake OK (12ms)</div>
                    <div>[14:02:12] <span className="text-yellow-400">WARN_04</span> Latency spike detected on node us-east-4</div>
                </div>
            </div>
            <div className="col-span-3 border border-green-900/50 bg-green-900/10 rounded p-4 flex justify-between items-center">
                 <div>
                     <h3 className="text-xs font-bold uppercase">System Status</h3>
                     <p className="text-2xl font-bold text-white">OPERATIONAL</p>
                 </div>
                 <div className="flex gap-4">
                     <div className="text-center">
                         <div className="text-xs text-slate-500">CPU</div>
                         <div className="text-xl font-bold">12%</div>
                     </div>
                     <div className="text-center">
                         <div className="text-xs text-slate-500">RAM</div>
                         <div className="text-xl font-bold">4.2GB</div>
                     </div>
                 </div>
            </div>
        </div>
    );
};
