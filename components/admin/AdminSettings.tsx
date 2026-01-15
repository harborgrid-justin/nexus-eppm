
import React from 'react';
import { Settings, RefreshCw, Database } from 'lucide-react';
import { ErrorBoundary } from '../ErrorBoundary';
import { useAdminSettingsLogic } from '../../hooks/domain/useAdminSettingsLogic';
import { useTheme } from '../../context/ThemeContext';
import { AdminContent } from './AdminContent';
import { TabbedLayout } from '../layout/standard/TabbedLayout';

const AdminSettings: React.FC = () => {
  const theme = useTheme();
  const {
      activeGroup, activeView, isApplying, isPending, navGroups,
      handleGlobalApply, handleGroupChange, handleItemChange, handleResetSystem
  } = useAdminSettingsLogic();

  return (
    <TabbedLayout
        title="Enterprise Administration"
        subtitle="Configure global system logic and enterprise data definitions."
        icon={Settings}
        actions={
            <div className="flex gap-2">
                <button 
                  onClick={handleResetSystem}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-red-200 text-red-600 hover:bg-red-50 rounded-lg font-bold shadow-sm transition-all active:scale-95"
                  title="Restore Factory Defaults"
                >
                  <Database size={16} />
                  Reset Database
                </button>
                <button 
                  onClick={handleGlobalApply}
                  className={`flex items-center gap-2 px-4 py-2 ${theme.colors.primary} text-white rounded-lg font-bold shadow-md hover:shadow-lg transition-all active:scale-95`}
                >
                  <RefreshCw size={16} className={isApplying ? 'animate-spin' : ''}/>
                  {isApplying ? 'Synchronizing...' : 'Apply Global Changes'}
                </button>
            </div>
        }
        navGroups={navGroups}
        activeGroup={activeGroup}
        activeItem={activeView}
        onGroupChange={handleGroupChange}
        onItemChange={handleItemChange}
    >
        <div className={`flex-1 overflow-hidden relative transition-opacity duration-200 ${isPending ? 'opacity-70' : 'opacity-100'}`}>
            <ErrorBoundary name="Admin Settings">
                <div className="h-full overflow-y-auto">
                    <AdminContent activeView={activeView} />
                </div>
            </ErrorBoundary>
        </div>
    </TabbedLayout>
  );
};

export default AdminSettings;
