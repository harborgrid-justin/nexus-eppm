
import React, { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';
import { MapPin, Maximize2, AlertTriangle, Navigation } from 'lucide-react';
import { Project, Location } from '../../types';
import { formatCompactCurrency } from '../../utils/formatters';

export const PortfolioMap: React.FC = () => {
    const { state } = useData();
    const theme = useTheme();
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

    // Map projects to locations
    // In a real app, use a library like react-leaflet or mapbox-gl
    // For this demo, we project onto a static SVG world map with relative coordinates
    const mapData = useMemo(() => {
        return state.projects.map(p => {
            const loc = state.locations.find(l => l.id === p.locationId);
            // Mock coordinates if location missing, to ensure pins appear on map for demo
            const lat = loc?.coordinates?.lat || (Math.random() * 100 - 50); 
            const lng = loc?.coordinates?.lng || (Math.random() * 300 - 150);
            
            // Simple Equirectangular projection approximation for demo SVG
            // Map bounds: -180 to 180 lng, -90 to 90 lat
            const x = ((lng + 180) / 360) * 100;
            const y = ((-lat + 90) / 180) * 100;
            
            return { project: p, x, y, locName: loc?.name || 'Unknown' };
        });
    }, [state.projects, state.locations]);

    return (
        <div className="h-full flex flex-col bg-slate-900 relative overflow-hidden rounded-xl border border-slate-700 shadow-2xl">
             {/* Map Background */}
             <div className="absolute inset-0 opacity-40 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')] bg-cover bg-no-repeat bg-center"></div>
             <div className="absolute inset-0 bg-blue-900/10 mix-blend-overlay pointer-events-none"></div>

             {/* Controls */}
             <div className="absolute top-4 left-4 z-20 flex gap-2">
                 <div className="bg-slate-800/90 backdrop-blur text-white px-4 py-2 rounded-lg border border-slate-700 shadow-lg text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                     <Navigation size={14} className="text-nexus-400"/> Global Operations
                 </div>
             </div>

             {/* Pins */}
             <div className="absolute inset-0 pointer-events-none">
                 {mapData.map((item) => (
                     <div 
                        key={item.project.id}
                        className="absolute cursor-pointer group pointer-events-auto"
                        style={{ left: `${item.x}%`, top: `${item.y}%` }}
                        onClick={() => setSelectedProject(item.project)}
                     >
                         <div className="relative">
                             <div className={`w-3 h-3 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)] transform -translate-x-1/2 -translate-y-1/2 transition-all group-hover:scale-150 ${item.project.health === 'Critical' ? 'bg-red-500 animate-pulse' : item.project.health === 'Warning' ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
                             <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded border border-slate-700 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-30 pointer-events-none">
                                 {item.project.name}
                             </div>
                         </div>
                     </div>
                 ))}
             </div>

             {/* Detail Panel Overlay */}
             {selectedProject && (
                 <div className="absolute bottom-6 left-6 z-30 w-80 bg-white/95 backdrop-blur-md rounded-xl shadow-2xl border border-slate-200 overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
                     <div className={`h-2 w-full ${selectedProject.health === 'Critical' ? 'bg-red-500' : selectedProject.health === 'Warning' ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
                     <div className="p-5">
                         <div className="flex justify-between items-start mb-2">
                             <div>
                                 <h3 className="font-bold text-slate-900 text-lg leading-tight">{selectedProject.name}</h3>
                                 <p className="text-xs text-slate-500 font-mono mt-1">{selectedProject.code}</p>
                             </div>
                             <button onClick={() => setSelectedProject(null)} className="text-slate-400 hover:text-slate-600"><Maximize2 size={16}/></button>
                         </div>
                         
                         <div className="grid grid-cols-2 gap-4 my-4 text-sm">
                             <div>
                                 <p className="text-[10px] text-slate-400 uppercase font-bold">Budget</p>
                                 <p className="font-mono font-bold text-slate-800">{formatCompactCurrency(selectedProject.budget)}</p>
                             </div>
                             <div>
                                 <p className="text-[10px] text-slate-400 uppercase font-bold">Spent</p>
                                 <p className="font-mono font-bold text-slate-600">{formatCompactCurrency(selectedProject.spent)}</p>
                             </div>
                         </div>

                         {selectedProject.health === 'Critical' && (
                             <div className="bg-red-50 text-red-800 text-xs p-3 rounded-lg border border-red-100 flex items-start gap-2">
                                 <AlertTriangle size={14} className="shrink-0 mt-0.5"/>
                                 <span>Project is in critical status. Immediate executive review recommended.</span>
                             </div>
                         )}

                         <div className="mt-4 pt-4 border-t border-slate-100 flex gap-2">
                             <button className="flex-1 bg-nexus-600 text-white py-2 rounded-lg text-xs font-bold hover:bg-nexus-700 transition-colors">Open Workspace</button>
                             <button className="flex-1 bg-white border border-slate-300 text-slate-700 py-2 rounded-lg text-xs font-bold hover:bg-slate-50 transition-colors">Risk Log</button>
                         </div>
                     </div>
                 </div>
             )}
        </div>
    );
};
