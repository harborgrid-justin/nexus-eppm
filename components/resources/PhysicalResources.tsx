import React, { useState } from 'react';
import { Box, Truck, MapPin, AlertTriangle, Plus, HardHat } from 'lucide-react';
import { usePhysicalResources } from '../../hooks/usePhysicalResources';
import { useTheme } from '../../context/ThemeContext';
import { useData } from '../../context/DataContext';
import StatCard from '../shared/StatCard';
import { formatCompactCurrency, generateId } from '../../utils/formatters';
import { InventoryList } from './physical/InventoryList';
import { FleetList } from './physical/FleetList';
import { AssetMap } from './physical/AssetMap';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Resource } from '../../types';
import { EmptyGrid } from '../common/EmptyGrid';

const PhysicalResources: React.FC = () => {
    const theme = useTheme();
    const { dispatch, state } = useData();
    const { inventoryAlerts, fleetMetrics, financialValuation, equipment, materials } = usePhysicalResources();
    const [activeTab, setActiveTab] = useState<'inventory' | 'fleet' | 'map'>('inventory');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    
    const [newAsset, setNewAsset] = useState<Partial<Resource>>({
        name: '',
        type: activeTab === 'fleet' ? 'Equipment' : 'Material',
        role: '',
        status: 'Active',
        location: '',
        unitOfMeasure: ''
    });

    const handleAddAsset = () => {
        if (!newAsset.name) return;
        const asset: Resource = {
            id: generateId(activeTab === 'fleet' ? 'EQ' : 'MAT'),
            name: newAsset.name,
            type: (activeTab === 'fleet' ? 'Equipment' : 'Material') as any,
            role: newAsset.role || 'Uncategorized',
            status: 'Active',
            capacity: 0,
            allocated: 0,
            hourlyRate: 0,
            skills: [],
            costRates: [],
            calendarId: 'CAL-STD',
            location: newAsset.location,
            unitOfMeasure: newAsset.unitOfMeasure,
            availableQuantity: activeTab === 'inventory' ? 0 : undefined,
            minQuantity: activeTab === 'inventory' ? 10 : undefined,
            maintenanceStatus: activeTab === 'fleet' ? 'Good' : undefined
        };
        dispatch({ type: 'RESOURCE_ADD', payload: asset });
        setIsAddModalOpen(false);
        setNewAsset({ name: '', type: activeTab === 'fleet' ? 'Equipment' : 'Material', role: '', status: 'Active', location: '', unitOfMeasure: '' });
    };

    const renderContent = () => {
        if (activeTab === 'inventory' && materials.length === 0) {
            return (
                <EmptyGrid 
                    title="No Material Stock" 
                    description="Standardize your inventory catalog by provisioning materials like steel, concrete, or hardware."
                    onAdd={() => { setNewAsset(prev => ({...prev, type: 'Material'})); setIsAddModalOpen(true); }}
                    actionLabel="Add Material"
                    icon={Box}
                />
            );
        }
        if (activeTab === 'fleet' && equipment.length === 0) {
            return (
                <EmptyGrid 
                    title="Fleet Registry Empty" 
                    description="Register heavy machinery, vehicles, and specialized equipment to enable site logistics tracking."
                    onAdd={() => { setNewAsset(prev => ({...prev, type: 'Equipment'})); setIsAddModalOpen(true); }}
                    actionLabel="Provision Asset"
                    icon={Truck}
                />
            );
        }

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
            <div className="px-6 border-b border-slate-200 bg-white flex-shrink-0 flex justify-between items-center">
                <nav className="flex space-x-8">
                    {[ 
                        { id: 'inventory', label: 'Material Stock', icon: Box }, 
                        { id: 'fleet', label: 'Fleet Mgmt', icon: Truck }, 
                        { id: 'map', label: 'Asset Map', icon: MapPin } 
                    ].map(tab => (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex items-center gap-2 py-4 px-1 border-b-2 text-sm font-bold ${activeTab === tab.id ? 'border-nexus-600 text-nexus-700' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>
                            <tab.icon size={16} /> {tab.label}
                        </button>
                    ))}
                </nav>
                <div className="py-2">
                    <Button size="sm" icon={Plus} onClick={() => setIsAddModalOpen(true)}>Add {activeTab === 'fleet' ? 'Equipment' : 'Material'}</Button>
                </div>
            </div>
            <div className="flex-1 overflow-hidden flex flex-col min-w-0 p-6 relative">
                {renderContent()}
            </div>

            <Modal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                title={`Provision New ${activeTab === 'fleet' ? 'Equipment Asset' : 'Material Stock'}`}
                footer={<Button onClick={handleAddAsset}>Register Asset</Button>}
            >
                <div className="space-y-4">
                    <Input 
                        label="Asset Name" 
                        value={newAsset.name} 
                        onChange={e => setNewAsset({...newAsset, name: e.target.value})} 
                        placeholder={activeTab === 'fleet' ? "e.g. Caterpillar 320 GC" : "e.g. Structural Steel Beams"}
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <Input 
                            label="Category / Classification" 
                            value={newAsset.role} 
                            onChange={e => setNewAsset({...newAsset, role: e.target.value})} 
                            placeholder="e.g. Earthmover"
                        />
                        <Input 
                            label="Site Location" 
                            value={newAsset.location} 
                            onChange={e => setNewAsset({...newAsset, location: e.target.value})} 
                            placeholder="e.g. Sector A-4"
                        />
                    </div>
                    {activeTab === 'inventory' && (
                        <Input 
                            label="Unit of Measure (UOM)" 
                            value={newAsset.unitOfMeasure} 
                            onChange={e => setNewAsset({...newAsset, unitOfMeasure: e.target.value})} 
                            placeholder="e.g. TONS, CY, EA"
                        />
                    )}
                </div>
            </Modal>
        </div>
    );
};

export default PhysicalResources;