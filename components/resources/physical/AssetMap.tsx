
import React from 'react';
import { MapPin, AlertTriangle, Plus } from 'lucide-react';
import { usePhysicalResources } from '../../../hooks/usePhysicalResources';
import { Button } from '../../ui/Button';

export const AssetMap: React.FC = () => {
    const { equipment } = usePhysicalResources();
    const locatedEquipment = equipment.filter(e => e.location && e.status === 'Active');

    return (
        <div className="h-full bg-slate-100 rounded-xl relative overflow-hidden flex flex-col border border-slate-200">
             {/* Map Background */}
             <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] opacity-40"></div>
             
             <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur p-4 rounded-xl shadow-sm border border-slate-200 max-w-sm">
                 <h4 className="font-bold text-slate-800 text-sm mb-2">Live Asset Tracking</h4>
                 <div className="flex gap-4 text-xs">
                     <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-500"></div> {locatedEquipment.length} Online</span>
                     <span className="flex items-center gap-1 text-slate-500"><div className="w-2 h-2 rounded-full bg-slate-300"></div> {equipment.length - locatedEquipment.length} Offline</span>
                 </div>
             </div>

             {locatedEquipment.length > 0 ? (
                 <div className="flex-1 relative">
                     {/* Mock Positioning Logic for Demo */}
                     {locatedEquipment.map((eq, i) => (
                         <div 
                            key={eq.id}
                            className="absolute cursor-pointer group"
                            style={{ 
                                top: `${30 + (i * 15) % 40}%`, 
                                left: `${20 + (i * 20) % 60}%` 
                            }}
                         >
                             <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-nexus-600 group-hover:scale-110 transition-transform relative z-10">
                                 <MapPin size={20} className="text-nexus-600"/>
                             </div>
                             <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                                 <strong>{eq.name}</strong><br/>
                                 <span className="opacity-80">{eq.location}</span>
                             </div>
                             {eq.maintenanceStatus !== 'Good' && (
                                 <div className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 border-2 border-white z-20">
                                     <AlertTriangle size={8}/>
                                 </div>
                             )}
                         </div>
                     ))}
                 </div>
             ) : (
                 <div className="flex-1 flex flex-col items-center justify-center z-10">
                     <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg mb-4 text-slate-300">
                         <MapPin size={32}/>
                     </div>
                     <h3 className="font-bold text-slate-500">No Geolocated Assets</h3>
                     <p className="text-xs text-slate-400 mt-1 mb-4">Equipment needs location data to appear on the map.</p>
                     <Button size="sm" icon={Plus}>Update Locations</Button>
                 </div>
             )}
        </div>
    );
};
