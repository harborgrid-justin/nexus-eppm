
import React, { useState, useEffect } from 'react';
import { GitBranch, Box, CheckCircle, XCircle, Loader2, PlayCircle, Server, Terminal } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useData } from '../../context/DataContext';
import { Card } from '../ui/Card';

export const DeploymentPipeline: React.FC = () => {
    const theme = useTheme();
    const { state, dispatch } = useData();
    const stages = state.pipelineStages || [];
    const [selectedStage, setSelectedStage] = useState<string | null>(null);

    // Simulate progress (local effect for visualization of running state)
    useEffect(() => {
        const interval = setInterval(() => {
            const runningStage = stages.find(s => s.status === 'running');
            if (runningStage) {
                 // Randomly complete it to simulate
                 if (Math.random() > 0.9) {
                     dispatch({ type: 'UPDATE_PIPELINE_STAGE', payload: { ...runningStage, status: 'success' } });
                 }
            }
        }, 2000);
        return () => clearInterval(interval);
    }, [stages, dispatch]);

    const handleTriggerBuild = () => {
        // Reset or start a stage
        if (stages.length > 0) {
            dispatch({ type: 'UPDATE_PIPELINE_STAGE', payload: { ...stages[0], status: 'running' } });
        }
    };

    const getStatusIcon = (status: string) => {
        switch(status) {
            case 'success': return <CheckCircle size={20} className="text-green-500" />;
            case 'failed': return <XCircle size={20} className="text-red-500" />;
            case 'running': return <Loader2 size={20} className="text-blue-500 animate-spin" />;
            default: return <div className="w-5 h-5 rounded-full border-2 border-slate-300"></div>;
        }
    };

    const getStatusColor = (status: string) => {
        switch(status) {
            case 'success': return 'border-green-500 bg-green-50';
            case 'failed': return 'border-red-500 bg-red-50';
            case 'running': return 'border-blue-500 bg-blue-50 shadow-md ring-2 ring-blue-200';
            default: return 'border-slate-200 bg-slate-50 opacity-60';
        }
    };

    return (
        <div className={`h-full flex flex-col ${theme.layout.pagePadding}`}>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className={theme.typography.h2}>CI/CD Pipeline Monitor</h2>
                    <p className={theme.typography.small}>Project: Nexus Core API • Branch: <span className="font-mono text-nexus-600 bg-nexus-50 px-2 rounded">main</span></p>
                </div>
                <div className="flex gap-3">
                    <button onClick={handleTriggerBuild} className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold shadow hover:bg-slate-800">
                        <PlayCircle size={16}/> Trigger Build
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg text-sm font-bold shadow-sm hover:bg-slate-50">
                        <GitBranch size={16}/> View Repo
                    </button>
                </div>
            </div>

            {/* Pipeline Visual */}
            <div className="flex items-center justify-between px-10 py-12 bg-white rounded-2xl border border-slate-200 shadow-sm relative mb-8 overflow-x-auto">
                {/* Connecting Line */}
                <div className="absolute top-1/2 left-10 right-10 h-1 bg-slate-200 -z-0 -translate-y-1/2"></div>
                
                {stages.map((stage) => (
                    <div key={stage.id} className="relative z-10 flex flex-col items-center group cursor-pointer" onClick={() => setSelectedStage(stage.id)}>
                        <div className={`w-16 h-16 rounded-full border-4 flex items-center justify-center bg-white transition-all ${getStatusColor(stage.status)}`}>
                            {getStatusIcon(stage.status)}
                        </div>
                        <div className="mt-4 text-center">
                            <p className="font-bold text-slate-800 text-sm">{stage.name}</p>
                            <p className="text-xs text-slate-500 font-mono mt-1">{stage.duration}</p>
                        </div>
                        {selectedStage === stage.id && (
                             <div className="absolute -bottom-2 w-2 h-2 bg-slate-800 rotate-45 translate-y-full"></div>
                        )}
                    </div>
                ))}
            </div>

            {/* Stage Details / Logs */}
            <div className="flex-1 bg-slate-900 rounded-xl border border-slate-800 p-6 font-mono text-sm text-slate-300 overflow-hidden flex flex-col shadow-2xl">
                <div className="flex justify-between items-center border-b border-slate-700 pb-4 mb-4">
                    <h3 className="font-bold text-white flex items-center gap-2">
                        <Terminal size={18} className="text-green-400"/> 
                        {selectedStage ? `Logs: ${stages.find(s => s.id === selectedStage)?.name}` : 'Build Console'}
                    </h3>
                    <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto space-y-2 pr-2 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                    {selectedStage 
                        ? stages.find(s => s.id === selectedStage)?.logs.map((log, i) => (
                            <div key={i} className="flex gap-3">
                                <span className="text-slate-600 select-none">{i+1}</span>
                                <span className="text-green-300">{`>`}</span>
                                <span>{log}</span>
                            </div>
                        ))
                        : (
                            <div className="flex flex-col items-center justify-center h-full text-slate-600">
                                <Box size={48} className="mb-4 opacity-20"/>
                                <p>Select a stage to view logs.</p>
                            </div>
                        )
                    }
                    {selectedStage && stages.find(s => s.id === selectedStage)?.status === 'running' && (
                        <div className="animate-pulse text-blue-400">_</div>
                    )}
                </div>
            </div>
        </div>
    );
};
