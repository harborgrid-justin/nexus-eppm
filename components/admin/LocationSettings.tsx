import React, { useState, useMemo, useDeferredValue } from 'react';
import { useData } from '../../context/DataContext';
import { MapPin, Plus, Search, Globe, MoreHorizontal, Edit2, Trash2, Save, X, Navigation } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { SidePanel } from '../ui/SidePanel';
import { Location } from '../../types/index';
import { generateId } from '../../utils/formatters';
import { useTheme } from '../../context/ThemeContext';
import { EmptyGrid } from '../common/EmptyGrid';

const LocationSettings: React.FC = () => {
    const { state, dispatch } = useData();
    const theme = useTheme();
    const [searchTerm, setSearchTerm] = useState('');
    const deferredSearchTerm = useDeferredValue(searchTerm);

    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [editingLoc, setEditingLoc] = useState<Partial<Location> | null>(null);

    const filteredLocations = useMemo(() => {
        const term = deferredSearchTerm.toLowerCase();
        return state.locations.filter(loc => 
            loc.name.toLowerCase().includes(term) ||
            loc.city.toLowerCase().includes(term)
        );
    }, [state.locations, deferredSearchTerm]);

    const handleOpenPanel = (loc?: Location) => {
        setEditingLoc(loc || { name: '', country: '', city: '', coordinates: { lat: 0, lng: 0 } });
        setIsPanelOpen(true);
    };

    const handleSave = () => {
        if (!editingLoc?.name || !editingLoc?.city) return;
        const locationToSave: Location = {
            id: editingLoc.id || generateId('LOC'),
            name: editingLoc.name,
            country: editingLoc.country || '',
            city: editingLoc.city,
            coordinates: editingLoc.coordinates
        };

        dispatch({
            type: editingLoc.id ? 'ADMIN_UPDATE_LOCATION' : 'ADMIN_ADD_LOCATION',
            payload: locationToSave
        });
        setIsPanelOpen(false);
    };

    const handleDelete = (id: string) => {
        if (confirm("Delete this site? Projects linked to this location will lose their georeference.")) {
            dispatch({ type: 'ADMIN_DELETE_LOCATION', payload: id });
        }
    };

    return (
        <div className={`h-full flex flex-col ${theme.layout.sectionSpacing}`}>
            <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-900 ${theme.layout.cardPadding} rounded-2xl border border-slate-800 shadow-xl gap-4 shrink-0 relative overflow-hidden`}>
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none"></div>
                <div className="flex items-center gap-4 relative z-10">
                    <div className="p-3 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-500/30">
                        <Globe size={24}/>
                    </div>
                    <div>
                        <h4 className={`text-xl font-black text-white uppercase tracking-tighter`}>Global Site Registry</h4>
                        <p className="text-slate-400 text-xs mt-1 font-medium leading-relaxed">Geographical master data for logistics and field telemetry.</p>
                    </div>
                </div>
                <Button size="md" icon={Plus} onClick={() => handleOpenPanel()} className="relative z-10 w-full sm:w-auto">Register New Site</Button>
            </div>

            <div className="flex items-center gap-4 shrink-0">
                <div className="relative flex-1 max-w-md">
                    <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"/>
                    <input 
                        type="text" 
                        placeholder="Search sites by name, city, or region..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={`pl-11 pr-4 py-2.5 w-full border ${theme.colors.border} rounded-xl text-sm focus:ring-2 focus:ring-nexus-500 outline-none transition-all ${theme.colors.surface} ${theme.colors.text.primary} font-medium shadow-sm`}
                    />
                </div>
            </div>

            <div className={`${theme.components.card} overflow-hidden flex-1 flex flex-col`}>
                {filteredLocations.length > 0 ? (
                    <div className="overflow-x-auto flex-1 scrollbar-thin">
                        <table className="min-w-full divide-y divide-slate-100">
                            <thead className={`${theme.colors.background} sticky top-0 z-10 border-b`}>
                                <tr>
                                    <th className={`${theme.components.table.header} px-8`}>Site Name</th>
                                    <th className={theme.components.table.header}>Region / City</th>
                                    <th className={theme.components.table.header}>Topology</th>
                                    <th className={`${theme.components.table.header} text-right px-8`}>Actions</th>
                                </tr>
                            </thead>
                            <tbody className={`divide-y ${theme.colors.border.replace('border-', 'divide-')}`}>
                                {filteredLocations.map(loc => (
                                    <tr key={loc.id} className={`${theme.components.table.row} group`}>
                                        <td className={`${theme.components.table.cell} px-8`}>
                                            <div className="flex items-center gap-3">
                                                <MapPin size={16} className={`${theme.colors.text.tertiary} group-hover:text-nexus-600 transition-colors`}/>
                                                <span className={`font-bold text-sm text-slate-800`}>{loc.name}</span>
                                            </div>
                                        </td>
                                        <td className={`${theme.components.table.cell} text-sm font-medium text-slate-600`}>
                                            {loc.city}, {loc.country}
                                        </td>
                                        <td className={`${theme.components.table.cell} font-mono text-[10px] font-bold text-slate-400 uppercase tracking-widest`}>
                                            {loc.coordinates ? `LAT ${loc.coordinates.lat.toFixed(4)} / LNG ${loc.coordinates.lng.toFixed(4)}` : 'MANUAL_ENTRY'}
                                        </td>
                                        <td className={`${theme.components.table.cell} text-right px-8`}>
                                            <div className="flex justify-end gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => handleOpenPanel(loc)} className={`p-2 hover:${theme.colors.background} rounded-lg text-slate-500 hover:text-nexus-600 transition-colors`}><Edit2 size={16}/></button>
                                                <button onClick={() => handleDelete(loc.id)} className={`p-2 hover:bg-red-50 rounded-lg text-slate-500 hover:text-red-600 transition-colors`}><Trash2 size={16}/></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="flex-1">
                        <EmptyGrid 
                            title={searchTerm ? "No Match Identified" : "Global Site Registry Empty"}
                            description={searchTerm ? `The filter "${searchTerm}" returned zero geolocated results.` : "Initialize standardized site master data to enable field logistics."}
                            onAdd={() => handleOpenPanel()}
                            actionLabel="Provision Site"
                            icon={Globe}
                        />
                    </div>
                )}
            </div>

            <SidePanel
                isOpen={isPanelOpen}
                onClose={() => setIsPanelOpen(false)}
                title={editingLoc?.id ? "Edit Site Parameters" : "Register Enterprise Site"}
                width="md:w-[500px]"
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setIsPanelOpen(false)}>Cancel</Button>
                        <Button onClick={handleSave} icon={Save}>Commit Record</Button>
                    </>
                }
            >
                 <div className="space-y-6">
                    <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 ml-1">Friendly Label</label>
                        <Input value={editingLoc?.name} onChange={e => setEditingLoc({...editingLoc!, name: e.target.value})} placeholder="e.g. London Logistics Center" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 ml-1">Settlement / City</label>
                            <Input value={editingLoc?.city} onChange={e => setEditingLoc({...editingLoc!, city: e.target.value})} placeholder="City" />
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 ml-1">Sovereign State / Country</label>
                            <Input value={editingLoc?.country} onChange={e => setEditingLoc({...editingLoc!, country: e.target.value})} placeholder="Country" />
                        </div>
                    </div>
                    <div className="p-6 bg-slate-900 rounded-3xl text-white relative overflow-hidden shadow-xl">
                        <h4 className="text-[10px] font-black uppercase text-slate-500 mb-6 flex items-center gap-2">
                            <Navigation size={14} className="text-nexus-400"/> GIS Precision Parameters
                        </h4>
                        <div className="grid grid-cols-2 gap-6">
                             <div>
                                <label className="block text-[10px] text-slate-500 mb-2 font-bold uppercase tracking-wider">Latitude</label>
                                <input 
                                    type="number" 
                                    className="w-full bg-slate-800 border-slate-700 rounded-xl p-3 text-sm font-mono font-bold text-white outline-none focus:ring-1 focus:ring-nexus-500 shadow-inner"
                                    value={editingLoc?.coordinates?.lat ?? 0}
                                    onChange={e => {
                                        const coords = editingLoc?.coordinates || { lat: 0, lng: 0 };
                                        setEditingLoc({...editingLoc!, coordinates: { ...coords, lat: parseFloat(e.target.value) }})
                                    }}
                                />
                             </div>
                             <div>
                                <label className="block text-[10px] text-slate-500 mb-2 font-bold uppercase tracking-wider">Longitude</label>
                                <input 
                                    type="number" 
                                    className="w-full bg-slate-800 border-slate-700 rounded-xl p-3 text-sm font-mono font-bold text-white outline-none focus:ring-1 focus:ring-nexus-500 shadow-inner"
                                    value={editingLoc?.coordinates?.lng ?? 0}
                                    onChange={e => {
                                        const coords = editingLoc?.coordinates || { lat: 0, lng: 0 };
                                        setEditingLoc({...editingLoc!, coordinates: { ...coords, lng: parseFloat(e.target.value) }})
                                    }}
                                />
                             </div>
                        </div>
                        <Navigation size={120} className="absolute -right-8 -bottom-8 text-white/5 opacity-5 pointer-events-none" />
                    </div>
                </div>
            </SidePanel>
        </div>
    );
};

export default LocationSettings;