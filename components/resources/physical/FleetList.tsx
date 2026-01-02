import React from 'react';
import { usePhysicalResources } from '../../../hooks/usePhysicalResources';
import { Truck, Wrench, AlertTriangle, CheckCircle } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { Badge } from '../../ui/Badge';

export const FleetList: React.FC = () => {
    const { equipment } = usePhysicalResources();
    const theme = useTheme();

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {equipment.map(eq => (
                <div key={eq.id} className={`${theme.components.card} p-5 hover:border-nexus-300 transition-colors`}>
                    <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-slate-100 rounded-lg text-slate-600"><Truck size={20}/></div>
                            <div>
                                <h4 className="font-bold text-slate-800">{eq.name}</h4>
                                <p className="text-xs text-slate-500 font-mono">{eq.serialNumber}</p>
                            </div>
                        </div>
                        <Badge variant={eq.maintenanceStatus === 'Good' ? 'success' : eq.maintenanceStatus === 'Down' ? 'danger' : 'warning'}>
                            {eq.maintenanceStatus}
                        </Badge>
                    </div>
                    <div className="flex justify-between items-center text-sm pt-3 border-t border-slate-100">
                         <span className="text-slate-500 flex items-center gap-1"><Wrench size={12}/> Last Service</span>
                         <span className="font-medium text-slate-700">{eq.lastMaintenanceDate || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm mt-1">
                         <span className="text-slate-500">Location</span>
                         <span className="font-medium text-slate-700">{eq.location}</span>
                    </div>
                </div>
            ))}
        </div>
    );
};
