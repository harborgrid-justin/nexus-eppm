
import React, { useState, useEffect } from 'react';
import { AlertTriangle, Info, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { SectionHeading, DemoContainer, ComponentLabel } from './DesignHelpers';

export const DesignFeedback = () => {
  const [progress, setProgress] = useState(45);

  useEffect(() => {
    const timer = setInterval(() => setProgress(p => (p >= 100 ? 0 : p + 10)), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-8 animate-fade-in">
        <SectionHeading title="Feedback & States" icon={AlertTriangle} count="FB-01 to FB-46" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <DemoContainer>
                <ComponentLabel id="FB-01" name="Alert Info" />
                <div className="bg-blue-50 border border-blue-200 rounded-md p-3 flex items-start gap-3 relative shadow-sm">
                    <Info size={16} className="text-blue-600 mt-0.5 shrink-0"/>
                    <div className="flex-1">
                        <h5 className="text-xs font-bold text-blue-900 mb-0.5">System Update</h5>
                        <span className="text-[10px] text-blue-800 leading-tight block">Maintenance scheduled for 2AM EST.</span>
                    </div>
                </div>
            </DemoContainer>

            <DemoContainer>
                <ComponentLabel id="FB-02" name="Alert Success" />
                <div className="bg-emerald-50 border border-emerald-200 rounded-md p-3 flex items-start gap-3 shadow-sm">
                    <CheckCircle size={16} className="text-emerald-600 mt-0.5 shrink-0"/>
                    <div className="flex-1">
                        <span className="text-xs font-bold text-emerald-900 block">Changes Saved</span>
                        <span className="text-[10px] text-emerald-800">Your profile has been updated.</span>
                    </div>
                </div>
            </DemoContainer>
            
            <DemoContainer>
                <ComponentLabel id="FB-03" name="Alert Warning" />
                <div className="bg-amber-50 border border-amber-200 rounded-md p-3 flex items-start gap-3 shadow-sm">
                    <AlertTriangle size={16} className="text-amber-600 mt-0.5 shrink-0"/>
                    <div className="flex-1">
                        <span className="text-xs font-bold text-amber-900 block">Verification Needed</span>
                        <span className="text-[10px] text-amber-800">Please confirm your email address.</span>
                    </div>
                </div>
            </DemoContainer>

            <DemoContainer>
                <ComponentLabel id="FB-04" name="Alert Error" />
                <div className="bg-red-50 border border-red-200 rounded-md p-3 flex items-start gap-3 shadow-sm">
                    <XCircle size={16} className="text-red-600 mt-0.5 shrink-0"/>
                    <div className="flex-1">
                        <span className="text-xs font-bold text-red-900 block">Connection Failed</span>
                        <span className="text-[10px] text-red-800">Unable to sync with server.</span>
                    </div>
                </div>
            </DemoContainer>

            <DemoContainer>
                <ComponentLabel id="FB-05" name="Spinner" />
                <div className="flex justify-center py-4 bg-slate-50 rounded border border-slate-100">
                    <Loader2 className="animate-spin text-blue-600 h-8 w-8"/>
                </div>
            </DemoContainer>

            <DemoContainer>
                <ComponentLabel id="FB-08" name="Progress Bar" />
                <div className="space-y-2 pt-2">
                    <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        <span>Uploading...</span>
                        <span>{progress}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
                        <div className="bg-blue-600 h-full transition-all duration-300 rounded-full relative overflow-hidden" style={{ width: `${progress}%` }}>
                        </div>
                    </div>
                </div>
            </DemoContainer>

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
        </div>
    </div>
  );
};
