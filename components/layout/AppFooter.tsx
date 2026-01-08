
import React from 'react';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';
import { Activity, WifiOff, Wifi, Signal } from 'lucide-react';

export const AppFooter: React.FC = () => {
    const { isOnline, effectiveType } = useNetworkStatus();

    return (
        <>
            {!isOnline && (
                <div className="h-8 bg-red-600 text-white text-xs font-bold flex items-center justify-center z-[30] animate-in slide-in-from-top shadow-md">
                    <WifiOff size={14} className="mr-2"/> SYSTEM OFFLINE: Changes will be queued.
                </div>
            )}
            <footer className="h-7 bg-surface border-t border-border flex justify-between items-center px-4 flex-shrink-0 text-[10px] font-bold text-slate-400 uppercase tracking-widest z-30 select-none">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                        <div className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <span>{isOnline ? 'Connected' : 'Offline'}</span>
                    </div>
                    {isOnline && (
                        <div className="flex items-center gap-1.5 hidden sm:flex" title={`Connection Speed: ${effectiveType.toUpperCase()}`}>
                            <Signal size={10} />
                            <span>{effectiveType.toUpperCase()}</span>
                        </div>
                    )}
                    <div className="flex items-center gap-1.5 hidden sm:flex">
                        <Activity size={10} />
                        <span>24ms</span>
                    </div>
                </div>
                <span>Nexus PPM v1.3 Enterprise</span>
            </footer>
        </>
    );
};
