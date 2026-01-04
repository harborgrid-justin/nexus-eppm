
import React, { useState } from 'react';
import { Database, Search, Table as TableIcon, Server, Shield, HardDrive } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { PageHeader } from './common/PageHeader';
import { WarehouseExplorer } from './warehouse/WarehouseExplorer';
import { useData } from '../context/DataContext';
import StatCard from './shared/StatCard';
import { formatCompactCurrency } from '../utils/formatters';

const DataWarehouse: React.FC = () => {
  const theme = useTheme();
  const { state } = useData();

  // Aggregate System Stats
  const totalRecords = Object.values(state).reduce((acc: number, val: any) => Array.isArray(val) ? acc + val.length : acc, 0);
  const dbSize = "42 MB"; // Mock calculation
  const lastBackup = "2 mins ago";

  return (
    <div className={`${theme.layout.pageContainer} ${theme.layout.pagePadding} ${theme.layout.sectionSpacing} flex flex-col h-full`}>
      <PageHeader 
        title="Nexus Data Warehouse" 
        subtitle="Centralized master record repository and immutable audit store."
        icon={Database}
      />

      {/* System Health Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard title="Total Records" value={totalRecords.toLocaleString()} icon={TableIcon} />
          <StatCard title="Storage Used" value={dbSize} icon={HardDrive} />
          <StatCard title="System Health" value="Healthy" icon={Server} subtext={`Last Backup: ${lastBackup}`} />
          <StatCard title="Schema Version" value="v2.4.0" icon={Shield} />
      </div>

      <div className={`${theme.colors.surface} border ${theme.colors.border} rounded-xl flex-1 flex flex-col overflow-hidden shadow-sm`}>
         <WarehouseExplorer />
      </div>
    </div>
  );
};

export default DataWarehouse;
