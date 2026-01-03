
import React, { useState } from 'react';
import { Map as MapIcon, Layers, MapPin, Navigation, Info, Maximize, AlertOctagon } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

interface MapRendererProps {
    extensionName: string;
}

export const MapRenderer: React.FC<MapRendererProps> = ({ extensionName }) => {
    const theme = useTheme();
    const [layers, setLayers] = useState({
        wbs: true,
        assets: true,
        hazards: false
    });
    const [selectedFeature, setSelectedFeature] = useState<string | null>(null);

    return (
        <div className="flex h-full relative overflow-hidden bg-slate-200">
            {/* Map Canvas */}
            <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11/static/-74.006,40.7128,15,0/1200x800?access_token=pk.mock')] bg-cover opacity-80"></div>
            <div className="absolute inset-0 bg-slate-900/10 mix-blend-overlay pointer-events-none"></div>

            {/* WBS Polygons (Simulated SVG Overlay) */}
            {layers.wbs && (
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    <polygon 
                        points="200,150 450,180 400,400 150,350" 
                        fill="rgba(16, 185, 129, 0.2)" 
                        stroke="#10b981" 
                        strokeWidth="2" 
                        strokeDasharray="5 5"
                        className="pointer-events-auto cursor-pointer hover:fill-green-500/40 transition-all"
                        onClick={() => setSelectedFeature("Zone A - Foundation (WBS 1.1)")}
                    />
                    <text x="300" y="280" fill="white" fontSize="12" fontWeight="bold" textAnchor="middle" className="drop-shadow-md">ZONE A</text>

                    <polygon 
                        points="500,200 750,220 700,450 480,400" 
                        fill="rgba(59, 130, 246, 0.2)" 
                        stroke="#3b82f6" 
                        strokeWidth="2" 
                        className="pointer-events-auto cursor-pointer hover:fill-blue-500/40 transition-all"
                        onClick={() => setSelectedFeature("Zone B - Structure (WBS 1.2)")}
                    />
                    <text x="600" y="320" fill="white" fontSize="12" fontWeight="bold" textAnchor="middle" className="drop-shadow-md">ZONE B</text>
                </svg>
            )}

            {/* Map Controls */}
            <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
                <div className="bg-white rounded-lg shadow-xl border border-slate-200 overflow-hidden">
                    <div className="p-3 border-b border-slate-100 bg-slate-50 font-bold text-xs text-slate-700 flex items-center gap-2">
                        <Layers size={14} className="text-nexus-600"/> GIS Layers
                    </div>
                    <div className="p-2 space-y-1">
                        <label className="flex items-center gap-2 px-2 py-1 hover:bg-slate-50 rounded cursor-pointer text-sm">
                            <input type="checkbox" checked={layers.wbs} onChange={() => setLayers(l => ({...l, wbs: !l.wbs}))} className="rounded text-nexus-600"/>
                            WBS Boundaries
                        </label>
                        <label className="flex items-center gap-2 px-2 py-1 hover:bg-slate-50 rounded cursor-pointer text-sm">
                            <input type="checkbox" checked={layers.assets} onChange={() => setLayers(l => ({...l, assets: !l.assets}))} className="rounded text-nexus-600"/>
                            Assets / Fleet
                        </label>
                        <label className="flex items-center gap-2 px-2 py-1 hover:bg-slate-50 rounded cursor-pointer text-sm">
                            <input type="checkbox" checked={layers.hazards} onChange={() => setLayers(l => ({...l, hazards: !l.hazards}))} className="rounded text-nexus-600"/>
                            Hazards
                        </label>
                    </div>
                </div>
            </div>

            {/* Asset Pins */}
            {layers.assets && (
                <>
                    <div className="absolute top-1/3 left-1/3 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group" onClick={() => setSelectedFeature("Excavator 01")}>
                        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-slate-900 group-hover:scale-110 transition-transform">
                            <MapPin size={16} className="text-slate-800"/>
                        </div>
                        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 bg-slate-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">EQ-104</div>
                    </div>
                </>
            )}
            
            {/* Info Panel */}
            {selectedFeature && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-2xl border border-slate-200 w-80 animate-in slide-in-from-bottom-4 z-20">
                    <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-slate-900">{selectedFeature}</h4>
                        <button onClick={() => setSelectedFeature(null)} className="text-slate-400 hover:text-slate-600"><Maximize size={14}/></button>
                    </div>
                    <div className="space-y-2 text-xs">
                        <div className="flex justify-between border-b border-slate-100 pb-1">
                            <span className="text-slate-500">Coordinates</span>
                            <span className="font-mono text-slate-700">40.7128° N, 74.0060° W</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-100 pb-1">
                            <span className="text-slate-500">Status</span>
                            <span className="font-bold text-green-600">Active / On Schedule</span>
                        </div>
                        <div className="flex justify-between pb-1">
                            <span className="text-slate-500">Last Updated</span>
                            <span>2 mins ago via IoT</span>
                        </div>
                    </div>
                    <div className="mt-3 flex gap-2">
                        <button className="flex-1 bg-nexus-600 text-white py-1.5 rounded text-xs font-bold hover:bg-nexus-700">View Schedule</button>
                        <button className="flex-1 bg-white border border-slate-300 text-slate-700 py-1.5 rounded text-xs font-bold hover:bg-slate-50">Log Issue</button>
                    </div>
                </div>
            )}
        </div>
    );
};
