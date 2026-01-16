
import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { CostSheet } from './unifier/CostSheet';
import BusinessProcessForm from './unifier/BusinessProcessForm';
import { SidePanel } from './ui/SidePanel';
import { LayoutTemplate } from 'lucide-react';
import { ErrorBoundary } from './ErrorBoundary';
import { useUnifierLogic } from '../hooks/domain/useUnifierLogic';
import { BPSidebar } from './unifier/BPSidebar';
import { BPList } from './unifier/BPList';
import { UnifierToolbar } from './unifier/UnifierToolbar';
import { useI18n } from '../context/I18nContext';
import { TabbedLayout } from './layout/standard/TabbedLayout';

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
    <TabbedLayout
        title={t('nav.unifier', 'Unifier Controls')}
        subtitle={t('unifier.subtitle', 'Enterprise business process automation and cost control.')}
        icon={LayoutTemplate}
        navGroups={navGroups}
        activeGroup={activeGroup}
        activeItem={activeTab}
        onGroupChange={handleGroupChange}
        onItemChange={handleTabChange}
    >
        <div className={`flex-1 overflow-hidden relative h-full bg-white`}>
            <ErrorBoundary name="Unifier Workspace">
                {activeTab === 'CostSheet' ? (
                    <CostSheet projectId={projectId} />
                ) : activeTab === 'CashFlow' ? (
                     <div className="p-8 text-center text-slate-400">Cash Flow Module Loading...</div>
                ) : activeTab === 'Funding' ? (
                     <div className="p-8 text-center text-slate-400">Funding Manager Loading...</div>
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
    </TabbedLayout>
  );
};
export default UnifierModule;
