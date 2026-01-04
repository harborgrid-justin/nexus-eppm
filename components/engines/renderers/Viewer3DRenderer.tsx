
import React, { useState } from 'react';
import { Box, Layers, Eye, EyeOff, Search, Settings, Maximize2, Move, Rotate3D, Info, AlertTriangle } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { useData } from '../../../context/DataContext';

interface Viewer3DRendererProps {
    extensionVersion: string;
}

export const Viewer3DRenderer: React.FC<Viewer3DRendererProps> = ({ extensionVersion }) => {
    const theme = useTheme();
    const { state } = useData();
    const [selectedPart, setSelectedPart] = useState<string | null>(null);
    
    // Fallback if data is missing
    const modelTree = state.extensionData.bim?.tree || [];
    
    // We maintain local state for toggles to avoid dispatching for purely visual toggles (unless we want persistence)
    const [localTree, setLocalTree] = useState(modelTree);

    const toggleVisibility = (id: string) => {
        const newTree = localTree.map(cat => cat.id === id ? { ...cat, visible: !cat.visible } : cat);
        setLocalTree(newTree);
    };

    return (
        <div className="flex h-full bg-slate-900 overflow-hidden relative">
            {/* 3D Canvas Mockup */}
            <div className="flex-1 relative bg-gradient-to-b from-slate-800 to-slate-900 flex items-center justify-center overflow-hidden">
                {/* Grid Floor */}
                <div className="absolute inset-0 perspective-grid opacity-20 pointer-events-none" 
                     style={{ 
                         backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                         backgroundSize: '40px 40px',
                         transform: 'perspective(500px) rotateX(60deg) scale(2)',
                         transformOrigin: '50% 100%',
                         bottom: '-50%'
                     }}>
                </div>
                
                {/* 3D Object Representation */}
                <div className="relative z-10 w-64 h-64 border-4 border-nexus-500/50 bg-nexus-500/10 backdrop-blur-sm transform rotate-12 flex flex-col items-center justify-center shadow-[0_0_50px_rgba(14,165,233,0.2)] animate-float">
                    <Box size={64} className="text-white opacity-80" />
                    <p className="text-nexus-300 font-mono text-xs mt-2">IFC Model v{extensionVersion}</p>
                    {selectedPart && (
                        <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-3 py-1 rounded border border-slate-600 whitespace-nowrap">
                            Selected: {selectedPart}
                        </div>
                    )}
                </div>

                {/* Floating Toolbar */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-slate-800/90 backdrop-blur border border-slate-700 rounded-full px-4 py-2 flex gap-4 text-slate-300 shadow-xl z-20">
                    <button className="hover:text-white transition-colors flex flex-col items-center gap-1">
                        <Move size={18}/><span className="text-[9px] uppercase font-bold">Pan</span>
                    </button>
                    <div className="w-px bg-slate-600 h-8"></div>
                    <button className="hover:text-white transition-colors flex flex-col items-center gap-1 text-nexus-400">
                        <Rotate3D size={18}/><span className="text-[9px] uppercase font-bold">Orbit</span>
                    </button>
                    <div className="w-px bg-slate-600 h-8"></div>
                    <button className="hover:text-white transition-colors flex flex-col items-center gap-1">
                        <Maximize2 size={18}/><span className="text-[9px] uppercase font-bold">Fit</span>
                    </button>
                    <div className="w-px bg-slate-600 h-8"></div>
                    <button className="hover:text-white transition-colors flex flex-col items-center gap-1">
                        <Settings size={18}/><span className="text-[9px] uppercase font-bold">Props</span>
                    </button>
                </div>
            </div>

            {/* Model Tree Sidebar */}
            <div className="w-72 bg-slate-950 border-l border-slate-800 flex flex-col z-20 shadow-2xl">
                <div className="p-4 border-b border-slate-800 flex justify-between items-center text-slate-300">
                    <h3 className="font-bold text-sm flex items-center gap-2"><Layers size={16}/> Model Tree</h3>
                    <div className="flex gap-2">
                         <button className="hover:text-white"><Search size={14}/></button>
                         <button className="hover:text-white"><Settings size={14}/></button>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto p-2 text-sm text-slate-400">
                    {localTree.length > 0 ? localTree.map(cat => (
                        <div key={cat.id} className="mb-2">
                            <div className="flex items-center justify-between p-2 hover:bg-slate-900 rounded cursor-pointer group">
                                <span className="font-bold text-slate-300">{cat.name}</span>
                                <button onClick={() => toggleVisibility(cat.id)} className="opacity-50 group-hover:opacity-100">
                                    {cat.visible ? <Eye size={14}/> : <EyeOff size={14}/>}
                                </button>
                            </div>
                            {cat.visible && cat.children && (
                                <div className="ml-4 border-l border-slate-800 pl-2 space-y-1">
                                    {cat.children.map(child => (
                                        <div 
                                            key={child.id} 
                                            onClick={() => setSelectedPart(child.name)}
                                            className={`flex items-center justify-between p-1.5 rounded cursor-pointer text-xs ${selectedPart === child.name ? 'bg-nexus-900 text-nexus-400' : 'hover:bg-slate-900'}`}
                                        >
                                            <span>{child.name}</span>
                                            {child.visible ? <Eye size={12} className="opacity-30"/> : <EyeOff size={12} className="opacity-30"/>}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )) : (
                        <div className="p-4 text-center text-slate-600 text-xs">No model loaded.</div>
                    )}
                </div>

                {/* Properties Panel */}
                <div className="h-1/3 border-t border-slate-800 bg-slate-900 p-4">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <Info size={12}/> Properties
                    </h4>
                    {selectedPart ? (
                        <div className="space-y-2 text-xs">
                            <div className="flex justify-between border-b border-slate-800 pb-1">
                                <span className="text-slate-500">Type</span>
                                <span className="text-slate-300">IFCWallStandardCase</span>
                            </div>
                            <div className="flex justify-between border-b border-slate-800 pb-1">
                                <span className="text-slate-500">Material</span>
                                <span className="text-slate-300">Concrete - Cast-in-Place</span>
                            </div>
                            <div className="flex justify-between border-b border-slate-800 pb-1">
                                <span className="text-slate-500">Volume</span>
                                <span className="text-slate-300">4.2 m³</span>
                            </div>
                            <div className="flex justify-between border-b border-slate-800 pb-1">
                                <span className="text-slate-500">WBS Link</span>
                                <span className="text-nexus-400 cursor-pointer hover:underline">1.2.4.1</span>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center text-slate-600 text-xs italic mt-8">Select an element to view properties</div>
                    )}
                </div>
            </div>
        </div>
    );
};
