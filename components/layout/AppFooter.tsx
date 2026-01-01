
import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';
import { Activity, WifiOff } from 'lucide-react';

export const AppFooter: React.FC = () => {
    const theme = useTheme();
    const isOnline = useNetworkStatus();

    return (
        <>
            {!isOnline && (
                <div className={`h-8 ${theme.colors.semantic.danger.bg} ${theme.colors.semantic.danger.text} text-xs font-bold flex items-center justify-center z-[30] animate-in slide-in-from-top shadow-md`}>
                    <WifiOff size={14} className="mr-2"/> SYSTEM OFFLINE: Changes will be queued.
                </div>
            )}
            <footer className={`h-7 ${theme.colors.surface} ${theme.colors.border} border-t flex justify-between items-center px-4 flex-shrink-0 text-[10px] font-bold text-slate-400 uppercase tracking-widest z-30 select-none`}>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                        <div className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <span>{isOnline ? 'Connected' : 'Offline'}</span>
                    </div>
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
