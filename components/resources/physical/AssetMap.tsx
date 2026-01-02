import React from 'react';
import { MapPin } from 'lucide-react';

export const AssetMap: React.FC = () => {
    return (
        <div className="h-full bg-slate-100 rounded-xl relative overflow-hidden flex items-center justify-center border border-slate-200">
             <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] opacity-40"></div>
             <div className="text-center z-10">
                 <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg mx-auto mb-4 text-nexus-600">
                     <MapPin size={32}/>
                 </div>
                 <h3 className="font-bold text-slate-700 text-lg">Live Asset Tracking</h3>
                 <p className="text-slate-500 text-sm mt-1">Geospatial telemetry integration required.</p>
             </div>
        </div>
    );
};
