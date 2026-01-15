
import React from 'react';
import { useData } from '../../../context/DataContext';
import { MapPin, Trash2, Edit2, Globe, Plus } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { EmptyGrid } from '../../common/EmptyGrid';

interface Props {
    onEdit: (loc: any) => void;
}

export const LocationList: React.FC<Props> = ({ onEdit }) => {
    const { state, dispatch } = useData();
    const theme = useTheme();
    const locations = state.locations || [];

    if (locations.length === 0) {
        return (
            <div className="h-full flex items-center justify-center p-12">
                <EmptyGrid 
                    title="Geospatial Registry Null" 
                    description="Register organizational site locations to enable field telemetry and localized project tracking."
                    onAdd={() => onEdit({})}
                    actionLabel="Register Site"
                    icon={MapPin}
                />
            </div>
        );
    }

    return (
        <div className={`p-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 ${theme.layout.gridGap} animate-nexus-in overflow-y-auto h-full scrollbar-thin`}>
            {locations.map(loc => (
                <div key={loc.id} className={`${theme.components.card} ${theme.layout.cardPadding} hover:border-nexus-300 hover:shadow-xl transition-all group relative overflow-hidden bg-white border-slate-200`}>
                    <div className="absolute top-0 right-0 p-8 bg-nexus-500/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="flex justify-between items-start mb-10 relative z-10">
                        <div className={`p-4 ${theme.colors.background} rounded-2xl ${theme.colors.text.tertiary} group-hover:bg-nexus-50 group-hover:text-nexus-600 transition-colors shadow-inner`}>
                            <MapPin size={28} />
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => onEdit(loc)} className={`p-2 hover:${theme.colors.background} rounded-xl text-slate-500 hover:text-nexus-600 transition-all`} title="Edit Location"><Edit2 size={16}/></button>
                            <button onClick={() => dispatch({type: 'ADMIN_DELETE_LOCATION', payload: loc.id})} className={`p-2 hover:bg-red-50 rounded-xl text-slate-500 hover:text-red-500 transition-all`} title="Delete Location"><Trash2 size={16}/></button>
                        </div>
                    </div>
                    <h4 className={`font-black text-xl ${theme.colors.text.primary} uppercase tracking-tighter mb-1 relative z-10`}>{loc.name}</h4>
                    <p className={`text-sm font-medium ${theme.colors.text.secondary} uppercase tracking-tight relative z-10`}>{loc.city}, {loc.country}</p>
                    <div className={`mt-10 pt-6 border-t ${theme.colors.border} flex items-center justify-between relative z-10`}>
                        <div className={`flex items-center gap-2 text-[10px] font-mono font-black text-slate-400 uppercase tracking-tighter ${theme.colors.background} px-2 py-1 rounded border ${theme.colors.border} shadow-sm`}>
                            <Globe size={12}/> {loc.coordinates?.lat.toFixed(4)}, {loc.coordinates?.lng.toFixed(4)}
                        </div>
                        <span className={`text-[10px] font-black text-nexus-600 uppercase tracking-widest`}>{loc.id}</span>
                    </div>
                </div>
            ))}
            {/* Visual Placeholder for Add */}
            <button 
                onClick={() => onEdit({})}
                className={`border-2 border-dashed ${theme.colors.border} rounded-[2.5rem] flex flex-col items-center justify-center text-slate-300 hover:text-nexus-500 hover:border-nexus-300 hover:bg-nexus-50/10 transition-all group`}
            >
                <div className={`p-4 rounded-full bg-slate-50 group-hover:bg-white group-hover:shadow-lg transition-all mb-4`}>
                    <Plus size={32} />
                </div>
                <span className="text-xs font-black uppercase tracking-widest">Register New Site</span>
            </button>
        </div>
    );
};
