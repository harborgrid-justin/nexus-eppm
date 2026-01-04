
import React, { useState } from 'react';
import { Map as MapIcon, Layers, MapPin, Navigation, Info, Maximize, AlertOctagon } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { useData } from '../../../context/DataContext';

interface MapRendererProps {
    extensionName: string;
}

export const MapRenderer: React.FC<MapRendererProps> = ({ extensionName }) => {
    const theme = useTheme();
    const { state } = useData();
    const { features } = state.extensionData.gis;
    
    const [layers, setLayers] = useState({
        wbs: true,
        assets: true,
        hazards: false
    });
    const [selectedFeature, setSelectedFeature] = useState<string | null>(null);

    const wbsFeatures = features.filter(f => f.type === 'Polygon');
    
    return (
        <div className="flex h-full relative overflow-hidden bg-slate-200">
            {/* Map Canvas */}
            <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11/static/-74.006,40.7128,15,0/1200x800?access_token=pk.mock')] bg-cover opacity-80"></div>
            <div className="absolute inset-0 bg-slate-900/10 mix-blend-overlay pointer-events-none"></div>

            {/* WBS Polygons (Simulated SVG Overlay) */}
            {layers.wbs && (
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    {wbsFeatures.map(f => (
                        <React.Fragment key={f.id}>
                            <polygon 
                                points={f.coordinates}
                                fill={f.properties.fill}
                                stroke={f.properties.stroke}
                                strokeWidth="2" 
                                strokeDasharray="5 5"
                                className="pointer-events-auto cursor-pointer hover:fill-opacity-40 transition-all"
                                onClick={() => setSelectedFeature(f.name)}
                            />
                            {/* Simple centroid label logic - mocked position for now */}
                            <text x={f.coordinates.split(' ')[0].split(',')[0]} y={f.coordinates.split(' ')[0].split(',')[1]} dx="20" dy="20" fill="white" fontSize="12" fontWeight="bold" textAnchor="middle" className="drop-shadow-md">
                                {f.name.split(' ')[0] + ' ' + f.name.split(' ')[1]}
                            </text>
                        </React.Fragment>
                    ))}
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

            {/* Asset Pins (Dynamic from Extension Data or Resources) */}
            {layers.assets && (
                <>
                    {/* Mock Asset - In real implementation, map coordinates to screen pixels */}
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
