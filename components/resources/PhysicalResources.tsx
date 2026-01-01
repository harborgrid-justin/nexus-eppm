
import React, { useState } from 'react';
import { Box, Truck, MapPin, AlertTriangle } from 'lucide-react';
import { usePhysicalResources } from '../../hooks/usePhysicalResources';
import { useTheme } from '../../context/ThemeContext';
import StatCard from '../shared/StatCard';
import { formatCompactCurrency } from '../../utils/formatters';
import { InventoryList } from './physical/InventoryList';
import { FleetList } from './physical/FleetList';
import { AssetMap } from './physical/AssetMap';

const PhysicalResources: React.FC = () => {
    const theme = useTheme();
    const { inventoryAlerts, fleetMetrics, financialValuation } = usePhysicalResources();
    const [activeTab, setActiveTab] = useState<'inventory' | 'fleet' | 'map'>('inventory');

    const renderContent = () => {
        switch(activeTab) {
            case 'inventory': return <InventoryList />;
            case 'fleet': return <FleetList />;
            case 'map': return <AssetMap />;
            default: return null;
        }
    };

    return (
        <div className="h-full flex flex-col bg-slate-50/30 overflow-hidden animate-in fade-in duration-300">
            <div className="bg-white border-b border-slate-200 p-6 flex-shrink-0 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard title="Fleet Availability" value={`${fleetMetrics.availabilityRate.toFixed(0)}%`} icon={Truck} />
                    <StatCard title="Inventory Value" value={formatCompactCurrency(financialValuation)} icon={Box} />
                    <StatCard title="Critical Shortages" value={inventoryAlerts.length} icon={AlertTriangle} trend={inventoryAlerts.length > 0 ? 'down' : 'up'} />
                    <StatCard title="Fleet Downtime" value={fleetMetrics.down} icon={Box} trend={fleetMetrics.down > 0 ? 'down' : 'up'} />
                </div>
            </div>
            <div className="px-6 border-b border-slate-200 bg-white flex-shrink-0">
                <nav className="flex space-x-8">
                    {[ { id: 'inventory', label: 'Material Stock', icon: Box }, { id: 'fleet', label: 'Fleet Mgmt', icon: Truck }, { id: 'map', label: 'Asset Map', icon: MapPin } ].map(tab => (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex items-center gap-2 py-4 px-1 border-b-2 text-sm font-bold ${activeTab === tab.id ? 'border-nexus-600 text-nexus-700' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>
                            <tab.icon size={16} /> {tab.label}
                        </button>
                    ))}
                </nav>
            </div>
            <div className="flex-1 overflow-hidden flex flex-col min-w-0 p-6 relative">
                {renderContent()}
            </div>
        </div>
    );
};

export default PhysicalResources;
