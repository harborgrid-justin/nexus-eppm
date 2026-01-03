
import React from 'react';
import { useData } from '../context/DataContext';
import { useTheme } from '../context/ThemeContext';
import { CostSheet } from './unifier/CostSheet';
import { BusinessProcessForm } from './unifier/BusinessProcessForm';
import { SidePanel } from './ui/SidePanel';
import { Plus, Briefcase, LayoutTemplate } from 'lucide-react';
import { PageHeader } from './common/PageHeader';
import { ModuleNavigation } from './common/ModuleNavigation';
import { ErrorBoundary } from './ErrorBoundary';
import { useUnifierLogic } from '../hooks/domain/useUnifierLogic';

const UnifierModule: React.FC = () => {
  const { state } = useData();
  const theme = useTheme();
  
  const {
      activeGroup,
      activeTab,
      selectedBP,
      isFormOpen,
      editingRecord,
      isPending,
      projectId,
      activeDefinition,
      records,
      navGroups,
      handleGroupChange,
      handleTabChange,
      handleCreate,
      handleEdit,
      handleSaveRecord,
      setSelectedBP,
      setIsFormOpen
  } = useUnifierLogic();

  return (
    <div className={`${theme.layout.pageContainer} ${theme.layout.pagePadding} ${theme.layout.sectionSpacing} flex flex-col h-full`}>
        <PageHeader 
            title="Unifier Controls" 
            subtitle="Advanced cost controls, funding management, and business process automation."
            icon={LayoutTemplate}
        />

        <div className={theme.layout.panelContainer}>
            <div className={`flex-shrink-0 z-10 rounded-t-xl overflow-hidden ${theme.layout.headerBorder} bg-slate-50/50`}>
                <ModuleNavigation 
                    groups={navGroups}
                    activeGroup={activeGroup}
                    activeItem={activeTab}
                    onGroupChange={handleGroupChange}
                    onItemChange={handleTabChange}
                    className="bg-transparent border-0 shadow-none"
                />
            </div>

            <div className={`flex-1 overflow-hidden relative transition-opacity duration-200 ${isPending ? 'opacity-70' : 'opacity-100'}`}>
                <ErrorBoundary name="Unifier Module">
                    {activeTab === 'CostSheet' ? (
                        <CostSheet projectId={projectId} />
                    ) : (
                        <div className="flex h-full">
                            {/* BP Selector Sidebar */}
                            <div className="w-64 bg-slate-50 border-r border-slate-200 flex flex-col overflow-hidden">
                                <div className="p-4 border-b border-slate-200 font-bold text-xs uppercase text-slate-500 tracking-wider">
                                    Process Registry
                                </div>
                                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                                    {state.unifier.definitions.map(def => (
                                        <button 
                                            key={def.id}
                                            onClick={() => setSelectedBP(def.id)}
                                            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-3 transition-colors ${selectedBP === def.id ? 'bg-white shadow text-nexus-700' : 'text-slate-600 hover:bg-slate-100'}`}
                                        >
                                            <div className={`w-2 h-2 rounded-full ${selectedBP === def.id ? 'bg-nexus-600' : 'bg-slate-300'}`}></div>
                                            {def.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* BP Log Grid */}
                            <div className="flex-1 flex flex-col bg-white overflow-hidden">
                                <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/30">
                                    <div className="flex items-center gap-2">
                                        <Briefcase size={16} className="text-slate-500"/>
                                        <h3 className="font-bold text-slate-800">{activeDefinition?.name} Log</h3>
                                    </div>
                                    <button onClick={handleCreate} className={`px-3 py-1.5 ${theme.colors.primary} text-white rounded-lg text-xs font-bold flex items-center gap-2 hover:opacity-90 shadow-sm`}>
                                        <Plus size={14}/> Create Record
                                    </button>
                                </div>
                                <div className="flex-1 overflow-auto">
                                    <table className="min-w-full divide-y divide-slate-200">
                                        <thead className="bg-slate-50 sticky top-0">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Record No.</th>
                                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Title</th>
                                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                                {activeDefinition?.fields.slice(0, 3).map(f => (
                                                    <th key={f.key} className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">{f.label}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {records.map(r => (
                                                <tr key={r.id} onClick={() => handleEdit(r)} className="hover:bg-slate-50 cursor-pointer transition-colors">
                                                    <td className="px-6 py-4 text-sm font-mono text-slate-600">{r.id}</td>
                                                    <td className="px-6 py-4 text-sm font-bold text-slate-800">{r.title}</td>
                                                    <td className="px-6 py-4 text-sm"><span className="bg-slate-100 px-2 py-1 rounded text-xs font-bold text-slate-600 border border-slate-200">{r.status}</span></td>
                                                    {activeDefinition?.fields.slice(0, 3).map(f => (
                                                        <td key={f.key} className="px-6 py-4 text-sm text-slate-600">
                                                            {typeof r.data[f.key] === 'object' ? JSON.stringify(r.data[f.key]) : r.data[f.key]}
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))}
                                            {records.length === 0 && (
                                                <tr>
                                                    <td colSpan={6} className="p-12 text-center text-slate-400 italic">No records found.</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                </ErrorBoundary>
            </div>
        </div>

        {/* BP Form Side Panel */}
        {isFormOpen && activeDefinition && (
            <SidePanel
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                title={editingRecord ? `Edit ${editingRecord.id}` : `New ${activeDefinition.name}`}
                width="md:w-[600px]"
                footer={null} // Handled by form internal
            >
                <BusinessProcessForm 
                    definition={activeDefinition} 
                    record={editingRecord} 
                    projectId={projectId}
                    onClose={() => setIsFormOpen(false)}
                    onSave={handleSaveRecord}
                />
            </SidePanel>
        )}
    </div>
  );
};

export default UnifierModule;
