
import React, { useState, useEffect } from 'react';
import { 
    AlertTriangle, Info, CheckCircle, XCircle, Loader2, WifiOff, 
    Lock, Clock, CloudOff, RefreshCw, Server, ShieldAlert,
    FileWarning, Search, Bell
} from 'lucide-react';
import { SectionHeading, DemoContainer, ComponentLabel } from './DesignHelpers';

export const DesignFeedback = () => {
  const [progress, setProgress] = useState(45);

  useEffect(() => {
    const timer = setInterval(() => setProgress(p => (p >= 100 ? 0 : p + 10)), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-12 animate-fade-in pb-20">
        <SectionHeading title="State & Feedback" icon={AlertTriangle} count="FB-01 to FB-50" />
        
        {/* --- ALERTS & NOTIFICATIONS --- */}
        <div className="space-y-6">
            <h4 className="text-lg font-bold text-slate-900 border-b pb-2">System Alerts</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <DemoContainer>
                    <ComponentLabel id="FB-01" name="Info Banner" />
                    <div className="bg-blue-50 border border-blue-200 rounded-md p-3 flex items-start gap-3 relative shadow-sm">
                        <Info size={16} className="text-blue-600 mt-0.5 shrink-0"/>
                        <div className="flex-1">
                            <h5 className="text-xs font-bold text-blue-900 mb-0.5">System Update</h5>
                            <span className="text-[10px] text-blue-800 leading-tight block">Maintenance scheduled for 2AM EST.</span>
                        </div>
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="FB-02" name="Success Toast" />
                    <div className="bg-emerald-50 border border-emerald-200 rounded-md p-3 flex items-start gap-3 shadow-sm">
                        <CheckCircle size={16} className="text-emerald-600 mt-0.5 shrink-0"/>
                        <div className="flex-1">
                            <span className="text-xs font-bold text-emerald-900 block">Changes Saved</span>
                            <span className="text-[10px] text-emerald-800">Your profile has been updated.</span>
                        </div>
                    </div>
                </DemoContainer>
                
                <DemoContainer>
                    <ComponentLabel id="FB-03" name="Warning Callout" />
                    <div className="bg-amber-50 border border-amber-200 rounded-md p-3 flex items-start gap-3 shadow-sm">
                        <AlertTriangle size={16} className="text-amber-600 mt-0.5 shrink-0"/>
                        <div className="flex-1">
                            <span className="text-xs font-bold text-amber-900 block">Verification Needed</span>
                            <span className="text-[10px] text-amber-800">Please confirm your email address.</span>
                        </div>
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="FB-04" name="Error Inline" />
                    <div className="bg-red-50 border border-red-200 rounded-md p-3 flex items-start gap-3 shadow-sm">
                        <XCircle size={16} className="text-red-600 mt-0.5 shrink-0"/>
                        <div className="flex-1">
                            <span className="text-xs font-bold text-red-900 block">Connection Failed</span>
                            <span className="text-[10px] text-red-800">Unable to sync with server.</span>
                        </div>
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="FB-20" name="Offline Banner" />
                    <div className="bg-slate-800 text-white p-2 rounded flex items-center justify-center gap-2 text-xs font-bold shadow-md">
                        <WifiOff size={14} className="text-red-400"/> You are currently offline.
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="FB-21" name="Session Timeout" />
                    <div className="bg-orange-50 border border-orange-200 p-3 rounded flex items-center gap-3">
                        <Clock size={16} className="text-orange-600 animate-pulse"/>
                        <div>
                            <p className="text-xs font-bold text-orange-900">Session Expiring</p>
                            <p className="text-[10px] text-orange-800">Log out in 59s...</p>
                        </div>
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="FB-22" name="Compliance Badge" />
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-50 text-purple-700 border border-purple-200 rounded-full text-[10px] font-black uppercase tracking-widest">
                        <ShieldAlert size={12}/> Audit Logged
                    </div>
                </DemoContainer>
            </div>
        </div>

        {/* --- LOADERS & PROGRESS --- */}
        <div className="space-y-6">
            <h4 className="text-lg font-bold text-slate-900 border-b pb-2">Loaders & Progress</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <DemoContainer>
                    <ComponentLabel id="FB-05" name="Spinner (Primary)" />
                    <div className="flex justify-center py-4 bg-slate-50 rounded border border-slate-100">
                        <Loader2 className="animate-spin text-blue-600 h-8 w-8"/>
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="FB-08" name="Linear Progress" />
                    <div className="space-y-2 pt-2">
                        <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                            <span>Uploading...</span>
                            <span>{progress}%</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
                            <div className="bg-blue-600 h-full transition-all duration-300 rounded-full relative overflow-hidden" style={{ width: `${progress}%` }}>
                                <div className="absolute inset-0 bg-white/30 w-full h-full animate-shimmer"></div>
                            </div>
                        </div>
                    </div>
                </DemoContainer>
                
                <DemoContainer>
                    <ComponentLabel id="FB-30" name="Sync Status" />
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                        <RefreshCw size={14} className="animate-spin text-nexus-500"/>
                        Syncing changes...
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="FB-31" name="Step Progress" />
                    <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-nexus-600"></div>
                        <div className="w-2 h-2 rounded-full bg-nexus-600"></div>
                        <div className="w-2 h-2 rounded-full bg-nexus-200 animate-pulse"></div>
                        <div className="w-2 h-2 rounded-full bg-slate-200"></div>
                    </div>
                </DemoContainer>
            </div>
        </div>

        {/* --- SKELETONS --- */}
        <div className="space-y-6">
            <h4 className="text-lg font-bold text-slate-900 border-b pb-2">Loading Skeletons</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <DemoContainer>
                     <ComponentLabel id="FB-15" name="Skeleton Card" />
                     <div className="p-4 border rounded-lg bg-white animate-pulse">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-200"></div>
                            <div className="flex-1 space-y-2">
                                <div className="h-2 w-3/4 bg-slate-200 rounded"></div>
                                <div className="h-2 w-1/2 bg-slate-200 rounded"></div>
                            </div>
                        </div>
                     </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="FB-16" name="Skeleton Text" />
                    <div className="space-y-3 p-4 animate-pulse">
                        <div className="h-2 bg-slate-200 rounded"></div>
                        <div className="h-2 bg-slate-200 rounded"></div>
                        <div className="h-2 w-5/6 bg-slate-200 rounded"></div>
                    </div>
                </DemoContainer>
                
                <DemoContainer>
                    <ComponentLabel id="FB-35" name="Skeleton Table Row" />
                    <div className="flex items-center gap-4 p-2 animate-pulse border-b border-slate-100">
                        <div className="w-4 h-4 rounded bg-slate-200"></div>
                        <div className="h-3 w-24 bg-slate-200 rounded"></div>
                        <div className="h-3 flex-1 bg-slate-200 rounded"></div>
                        <div className="h-3 w-16 bg-slate-200 rounded"></div>
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="FB-36" name="Skeleton Chart" />
                    <div className="h-20 flex items-end gap-1 p-2 animate-pulse bg-slate-50 rounded">
                        <div className="w-1/5 h-40% bg-slate-200 rounded-t"></div>
                        <div className="w-1/5 h-70% bg-slate-200 rounded-t"></div>
                        <div className="w-1/5 h-50% bg-slate-200 rounded-t"></div>
                        <div className="w-1/5 h-80% bg-slate-200 rounded-t"></div>
                        <div className="w-1/5 h-30% bg-slate-200 rounded-t"></div>
                    </div>
                </DemoContainer>
            </div>
        </div>

        {/* --- EMPTY STATES --- */}
        <div className="space-y-6">
            <h4 className="text-lg font-bold text-slate-900 border-b pb-2">Empty States</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <DemoContainer>
                    <ComponentLabel id="FB-40" name="Empty Search" />
                    <div className="flex flex-col items-center justify-center p-6 text-center bg-slate-50 border border-slate-200 rounded-lg">
                        <Search className="h-8 w-8 text-slate-300 mb-2"/>
                        <p className="text-xs font-bold text-slate-500">No results found</p>
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="FB-41" name="Server Disconnect" />
                    <div className="flex flex-col items-center justify-center p-6 text-center bg-red-50 border border-red-100 rounded-lg">
                        <CloudOff className="h-8 w-8 text-red-300 mb-2"/>
                        <p className="text-xs font-bold text-red-700">Server Unreachable</p>
                        <button className="mt-2 text-[10px] font-bold uppercase text-red-600 hover:underline">Retry Connection</button>
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="FB-42" name="Empty Folder" />
                    <div className="flex flex-col items-center justify-center p-6 text-center nexus-empty-pattern border-2 border-dashed border-slate-200 rounded-xl">
                        <FileWarning className="h-8 w-8 text-slate-300 mb-2"/>
                        <p className="text-xs font-bold text-slate-500">Folder is empty</p>
                        <button className="mt-2 px-3 py-1 bg-white border border-slate-200 rounded text-[10px] font-bold text-slate-600 hover:text-nexus-600 shadow-sm">
                            Upload File
                        </button>
                    </div>
                </DemoContainer>
            </div>
        </div>

        {/* --- VALIDATION STATES --- */}
        <div className="space-y-6">
            <h4 className="text-lg font-bold text-slate-900 border-b pb-2">Input Validation</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <DemoContainer>
                    <ComponentLabel id="FB-45" name="Input Error" />
                    <div className="space-y-1">
                        <input className="w-full text-xs border-red-300 focus:border-red-500 focus:ring-red-500 rounded p-2 bg-red-50 text-red-900" value="invalid@email" readOnly />
                        <span className="text-[10px] text-red-600 font-medium">Please enter a valid email address.</span>
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="FB-46" name="Input Success" />
                    <div className="space-y-1 relative">
                        <input className="w-full text-xs border-green-300 focus:border-green-500 focus:ring-green-500 rounded p-2 bg-green-50 text-green-900 pr-8" value="Correct Value" readOnly />
                        <CheckCircle size={14} className="absolute right-2 top-2.5 text-green-600"/>
                    </div>
                </DemoContainer>
            </div>
        </div>
    </div>
  );
};
