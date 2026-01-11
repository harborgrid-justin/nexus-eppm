
import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { CostSheet } from './unifier/CostSheet';
import BusinessProcessForm from './unifier/BusinessProcessForm';
import { SidePanel } from './ui/SidePanel';
import { LayoutTemplate } from 'lucide-react';
import { PageHeader } from './common/PageHeader';
import { ModuleNavigation } from './common/ModuleNavigation';
import { ErrorBoundary } from './ErrorBoundary';
import { useUnifierLogic } from '../hooks/domain/useUnifierLogic';
import { BPSidebar } from './unifier/BPSidebar';
import { BPList } from './unifier/BPList';
import { UnifierToolbar } from './unifier/UnifierToolbar';
import { useI18n } from '../context/I18nContext';

const UnifierModule: React.FC = () => {
  const theme = useTheme();
  const { t } = useI18n();
  const {
      activeGroup, activeTab, selectedBP, isFormOpen, editingRecord,
      projectId, definitions, activeDefinition, records, navGroups,
      handleGroupChange, handleTabChange, handleCreate, handleEdit,
      handleSaveRecord, setSelectedBP, setIsFormOpen
  } = useUnifierLogic();

  return (
    <div className={`${theme.layout.pageContainer} ${theme.layout.pagePadding} space-y-4 flex flex-col h-full`}>
        <PageHeader 
            title={t('nav.unifier', 'Unifier Controls')} 
            subtitle={t('unifier.subtitle', 'Enterprise business process automation and cost control.')} 
            icon={LayoutTemplate} 
        />

        <div className={theme.layout.panelContainer}>
            <div className={`flex-shrink-0 z-10 rounded-t-xl overflow-hidden border-b ${theme.colors.border} bg-slate-50/50`}>
                <ModuleNavigation 
                    groups={navGroups} activeGroup={activeGroup} activeItem={activeTab}
                    onGroupChange={handleGroupChange} onItemChange={handleTabChange}
                    className="bg-transparent border-0 shadow-none"
                />
            </div>

            <div className="flex-1 overflow-hidden relative">
                <ErrorBoundary name="Unifier Workspace">
                    {activeTab === 'CostSheet' ? (
                        <CostSheet projectId={projectId} />
                    ) : (
                        <div className="flex h-full bg-white">
                            <BPSidebar 
                                definitions={definitions} 
                                selectedId={selectedBP} 
                                onSelect={setSelectedBP}
                                onProvision={() => handleTabChange('uDesigner')}
                            />
                            <div className="flex-1 flex flex-col overflow-hidden">
                                <UnifierToolbar 
                                    title={activeDefinition ? `${activeDefinition.name} Registry` : t('unifier.no_def', 'Process Definition Required')} 
                                    onCreate={handleCreate} 
                                    onRefresh={() => {}} 
                                    disabled={!activeDefinition}
                                />
                                <BPList 
                                    records={records} 
                                    activeDefinition={activeDefinition} 
                                    onEdit={handleEdit} 
                                    onCreate={handleCreate} 
                                />
                            </div>
                        </div>
                    )}
                </ErrorBoundary>
            </div>
        </div>

        {isFormOpen && activeDefinition && (
            <SidePanel
                isOpen={isFormOpen} onClose={() => setIsFormOpen(false)}
                title={editingRecord ? `Edit ${editingRecord.id}` : `New ${activeDefinition.name}`}
                width="max-w-4xl"
            >
                <BusinessProcessForm 
                    definition={activeDefinition} record={editingRecord} 
                    projectId={projectId} onClose={() => setIsFormOpen(false)} onSave={handleSaveRecord}
                />
            </SidePanel>
        )}
    </div>
  );
};
export default UnifierModule;
