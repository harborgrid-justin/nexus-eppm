import React, { useMemo } from 'react';
import { Database, Table as TableIcon, Server, Shield, HardDrive } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useI18n } from '../context/I18nContext';
import { PageHeader } from './common/PageHeader';
import { WarehouseExplorer } from './warehouse/WarehouseExplorer';
import { useData } from '../context/DataContext';
import StatCard from './shared/StatCard';

const DataWarehouse: React.FC = () => {
  const theme = useTheme();
  const { t } = useI18n();
  const { state } = useData();

  const totalRecords = useMemo(() => {
      return Object.entries(state).reduce((acc: number, [_, val]) => {
          if (Array.isArray(val)) return acc + val.length;
          return acc;
      }, 0);
  }, [state]);

  const metrics = state.systemMonitoring.metrics;
  const dbSizeMetric = metrics.find(m => m.id === 'm-db-size');
  const schemaMetric = metrics.find(m => m.id === 'm-schema');
  const backupMetric = metrics.find(m => m.id === 'm-backup');

  return (
    <div className={`h-full flex flex-col ${theme.layout.pagePadding} ${theme.colors.background}`}>
      <PageHeader 
        title={t('dw.title', 'Enterprise Data Warehouse')} 
        subtitle={t('dw.subtitle', 'Centralized immutable master record repository.')}
        icon={Database}
      />

      <div className={`mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 ${theme.layout.gridGap}`}>
          <StatCard title={t('dw.records', 'Total Records')} value={totalRecords.toLocaleString()} icon={TableIcon} />
          <StatCard title={t('dw.storage', 'Storage Used')} value={`${dbSizeMetric?.value || 0} GB`} icon={HardDrive} />
          <StatCard title={t('dw.status', 'System Status')} value={t('common.active', 'Active')} icon={Server} subtext={`${t('dw.heartbeat', 'Heartbeat')}: ${backupMetric?.value || '-'}`} />
          <StatCard title={t('dw.schema', 'Schema Version')} value={`v${schemaMetric?.value || '1.0'}`} icon={Shield} />
      </div>

      <div className={`mt-8 flex-1 flex flex-col ${theme.colors.surface} rounded-2xl border ${theme.colors.border} shadow-sm overflow-hidden`}>
         <WarehouseExplorer />
      </div>
    </div>
  );
};
export default DataWarehouse;