
import { useMemo } from 'react';
import { useData } from '../context/DataContext';

export const usePhysicalResources = () => {
  const { state } = useData();

  const resources = state.resources;

  const equipment = useMemo(() => 
    resources.filter(r => r.type === 'Equipment'), 
  [resources]);

  const materials = useMemo(() => 
    resources.filter(r => r.type === 'Material'), 
  [resources]);

  const inventoryAlerts = useMemo(() => {
    return materials.filter(m => 
        m.availableQuantity !== undefined && 
        m.minQuantity !== undefined && 
        m.availableQuantity <= m.minQuantity
    );
  }, [materials]);

  const fleetMetrics = useMemo(() => {
    const total = equipment.length;
    const down = equipment.filter(e => e.maintenanceStatus === 'Down').length;
    const servicing = equipment.filter(e => e.maintenanceStatus === 'Service Required').length;
    const operational = equipment.filter(e => e.maintenanceStatus === 'Good').length;

    return {
        total,
        operational,
        servicing,
        down,
        availabilityRate: total > 0 ? (operational / total) * 100 : 0
    };
  }, [equipment]);

  const financialValuation = useMemo(() => {
      return materials.reduce((sum, m) => sum + ((m.availableQuantity || 0) * m.hourlyRate), 0);
  }, [materials]);

  return {
    equipment,
    materials,
    inventoryAlerts,
    fleetMetrics,
    financialValuation
  };
};
