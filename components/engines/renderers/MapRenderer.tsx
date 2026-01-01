
import React from 'react';
import { Map as MapIcon } from 'lucide-react';

interface MapRendererProps {
    extensionName: string;
}

export const MapRenderer: React.FC<MapRendererProps> = ({ extensionName }) => {
    return (
        <div className="flex-1 bg-slate-100 relative overflow-hidden flex items-center justify-center">
            <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/light-v10/static/-74.006,40.7128,12,0/800x600?access_token=pk.mock')] bg-cover opacity-50"></div>
            <div className="bg-white/90 backdrop-blur p-8 rounded-xl shadow-lg text-center z-10 max-w-md">
            <MapIcon size={48} className="mx-auto text-nexus-500 mb-4" />
            <h3 className="text-xl font-bold text-slate-900">Geospatial Engine</h3>
            <p className="text-slate-500 mt-2">
                Map interface loaded for {extensionName}. Real-time telemetry overlay enabled.
            </p>
            </div>
        </div>
    );
};
