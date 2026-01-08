
import React, { useMemo } from 'react';
import { Database, Table as TableIcon, Server, Shield, HardDrive } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { PageHeader } from './common/PageHeader';
import { WarehouseExplorer } from './warehouse/WarehouseExplorer';
import { useData } from '../context/DataContext';
import StatCard from './shared/StatCard';

const DataWarehouse: React.FC = () => {
  const theme = useTheme();
  const { state } = useData();

  // Aggregate System Stats from dynamic state
  const totalRecords = useMemo(() => {
      return Object.entries(state).reduce((acc: number, [key, val]) => {
          if (Array.isArray(val)) return acc + val.length;
          // Also check nested objects if necessary, but primary collections are at root
          return acc;
      }, 0);
  }, [state]);

  const metrics = state.systemMonitoring.metrics;
  const dbSizeMetric = metrics.find(m => m.id === 'm-db-size');
  const schemaMetric = metrics.find(m => m.id === 'm-schema');
  const backupMetric = metrics.find(m => m.id === 'm-backup');

  // Derived Values
  const dbSize = dbSizeMetric ? `${dbSizeMetric.value} ${dbSizeMetric.unit}` : '0 MB';
  const lastBackup = backupMetric ? `${backupMetric.value} ${backupMetric.unit}` : 'Never';
  const schemaVersion = schemaMetric ? `v${schemaMetric.value.toFixed(1)}` : 'v1.0';

  return (
    <div className={`${theme.layout.pageContainer} ${theme.layout.pagePadding} ${theme.layout.sectionSpacing} flex flex-col h-full`}>
      <PageHeader 
        title="Nexus Data Warehouse" 
        subtitle="Centralized master record repository and immutable audit store."
        icon={Database}
      />

      {/* System Health Stats - All Sourced from state.systemMonitoring */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard title="Total Records" value={totalRecords.toLocaleString()} icon={TableIcon} subtext="Across all domains" />
          <StatCard title="Storage Used" value={dbSize} icon={HardDrive} subtext="Blob & SQL Allocation" />
          <StatCard title="System Status" value="Active" icon={Server} subtext={`Heartbeat: ${lastBackup}`} />
          <StatCard title="Schema Version" value={schemaVersion} icon={Shield} subtext="Enterprise Stable" />
      </div>

      <div className={theme.layout.panelContainer}>
         <WarehouseExplorer />
      </div>
    </div>
  );
};

export default DataWarehouse;
