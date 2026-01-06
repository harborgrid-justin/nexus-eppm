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

const LocationSettings: React.FC = () => {
    const { state, dispatch } = useData();
    const theme = useTheme();
    const [searchTerm, setSearchTerm] = useState('');
    const deferredSearchTerm = useDeferredValue(searchTerm);

    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [editingLoc, setEditingLoc] = useState<Partial<Location> | null>(null);

    // Rule 8 & 12: Memoize filter with deferred term
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
        <div className="space-y-6 h-full flex flex-col">
            <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center ${theme.colors.background} p-4 rounded-xl border ${theme.colors.border} shadow-sm gap-4 shrink-0`}>
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-blue-600 text-white rounded-lg shadow-blue-200 shadow-lg">
                        <Globe size={22}/>
                    </div>
                    <div>
                        <h4 className={`font-bold ${theme.colors.text.primary}`}>Global Site Registry</h4>
                        <p className={`text-xs ${theme.colors.text.secondary}`}>Standardized geographical entities for field telemetry.</p>
                    </div>
                </div>
                <Button size="sm" icon={Plus} onClick={() => handleOpenPanel()} className="w-full sm:w-auto">Register New Site</Button>
            </div>

            <div className="flex items-center gap-4 mb-4 shrink-0">
                <div className="relative flex-1 max-w-md">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                    <input 
                        type="text" 
                        placeholder="Search sites by name, city, or country..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={`pl-10 pr-4 py-2 w-full border ${theme.colors.border} rounded-lg text-sm focus:ring-2 focus:ring-nexus-500 outline-none transition-all ${theme.colors.surface} ${theme.colors.text.primary}`}
                    />
                </div>
            </div>

            <div className={`${theme.components.card} overflow-hidden flex-1 overflow-auto`}>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className={`${theme.colors.background} sticky top-0`}>
                            <tr>
                                <th className={theme.components.table.header + " whitespace-nowrap"}>Site Name</th>
                                <th className={theme.components.table.header + " whitespace-nowrap"}>Region / City</th>
                                <th className={theme.components.table.header + " whitespace-nowrap"}>Coordinates</th>
                                <th className={theme.components.table.header + " text-right whitespace-nowrap"}>Actions</th>
                            </tr>
                        </thead>
                        <tbody className={`divide-y ${theme.colors.border.replace('border-', 'divide-')}`}>
                            {filteredLocations.map(loc => (
                                <tr key={loc.id} className={theme.components.table.row + " group"}>
                                    <td className={theme.components.table.cell}>
                                        <div className="flex items-center gap-3">
                                            <MapPin size={16} className={`${theme.colors.text.tertiary} group-hover:text-nexus-500 transition-colors`}/>
                                            <span className={`font-bold text-sm ${theme.colors.text.primary}`}>{loc.name}</span>
                                        </div>
                                    </td>
                                    <td className={theme.components.table.cell + ` text-sm ${theme.colors.text.secondary}`}>
                                        {loc.city}, {loc.country}
                                    </td>
                                    <td className={theme.components.table.cell + ` font-mono text-xs ${theme.colors.text.tertiary}`}>
                                        {loc.coordinates ? `${loc.coordinates.lat.toFixed(4)}, ${loc.coordinates.lng.toFixed(4)}` : 'Manual Entry'}
                                    </td>
                                    <td className={theme.components.table.cell + " text-right"}>
                                        <div className="flex justify-end gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => handleOpenPanel(loc)} className={`p-1.5 hover:${theme.colors.background} rounded ${theme.colors.text.secondary}`}><Edit2 size={16}/></button>
                                            <button onClick={() => handleDelete(loc.id)} className={`p-1.5 hover:bg-red-50 rounded ${theme.colors.text.secondary} hover:text-red-500`}><Trash2 size={16}/></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredLocations.length === 0 && (
                                <tr><td colSpan={4} className={`p-8 text-center ${theme.colors.text.tertiary} text-sm italic`}>No locations found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <SidePanel
                isOpen={isPanelOpen}
                onClose={() => setIsPanelOpen(false)}
                title={editingLoc?.id ? "Edit Site Record" : "Register New Site"}
                width="md:w-[450px]"
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setIsPanelOpen(false)}>Cancel</Button>
                        <Button onClick={handleSave} icon={Save}>Commit Changes</Button>
                    </>
                }
            >
                 <div className="space-y-6">
                    <div>
                        <label className={theme.typography.label + " block mb-1"}>Site Label</label>
                        <Input value={editingLoc?.name} onChange={e => setEditingLoc({...editingLoc, name: e.target.value})} placeholder="e.g. London Logistics Center" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={theme.typography.label + " block mb-1"}>City</label>
                            <Input value={editingLoc?.city} onChange={e => setEditingLoc({...editingLoc, city: e.target.value})} placeholder="City" />
                        </div>
                        <div>
                            <label className={theme.typography.label + " block mb-1"}>Country</label>
                            <Input value={editingLoc?.country} onChange={e => setEditingLoc({...editingLoc, country: e.target.value})} placeholder="Country" />
                        </div>
                    </div>
                    <div className="p-4 bg-slate-900 rounded-xl text-white">
                        <h4 className="text-[10px] font-black uppercase text-slate-400 mb-3 flex items-center gap-2">
                            <Navigation size={12} className="text-nexus-400"/> GIS Precision Data
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                             <div>
                                <label className="block text-[10px] text-slate-500 mb-1">Latitude</label>
                                <input 
                                    type="number" 
                                    className="w-full bg-slate-800 border-slate-700 rounded p-2 text-sm font-mono outline-none focus:ring-1 focus:ring-nexus-500"
                                    value={editingLoc?.coordinates?.lat ?? 0}
                                    onChange={e => {
                                        const coords = editingLoc?.coordinates || { lat: 0, lng: 0 };
                                        setEditingLoc({...editingLoc, coordinates: { ...coords, lat: parseFloat(e.target.value) }})
                                    }}
                                />
                             </div>
                             <div>
                                <label className="block text-[10px] text-slate-500 mb-1">Longitude</label>
                                <input 
                                    type="number" 
                                    className="w-full bg-slate-800 border-slate-700 rounded p-2 text-sm font-mono outline-none focus:ring-1 focus:ring-nexus-500"
                                    value={editingLoc?.coordinates?.lng ?? 0}
                                    onChange={e => {
                                        const coords = editingLoc?.coordinates || { lat: 0, lng: 0 };
                                        setEditingLoc({...editingLoc, coordinates: { ...coords, lng: parseFloat(e.target.value) }})
                                    }}
                                />
                             </div>
                        </div>
                    </div>
                </div>
            </SidePanel>
        </div>
    );
};

export default LocationSettings;
