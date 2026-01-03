
import { useState, useMemo, useTransition } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { BPRecord } from '../../types/unifier';
import { Table, Layers } from 'lucide-react';
import { NavGroup } from '../../components/common/ModuleNavigation';

export const useUnifierLogic = () => {
  const { state, dispatch } = useData();
  const { user } = useAuth();
  
  const [searchParams, setSearchParams] = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const activeGroup = searchParams.get('unifierGroup') || 'controls';
  const activeTab = (searchParams.get('view') as 'CostSheet' | 'BPs') || 'CostSheet';

  const [selectedBP, setSelectedBP] = useState<string>('bp_co'); // Keep local state for BP selection as it's a detail view
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<BPRecord | undefined>(undefined);

  // Mock Project Context for demo purposes
  const projectId = 'P1001'; 

  const activeDefinition = useMemo(() => 
    state.unifier.definitions.find(d => d.id === selectedBP), 
  [state.unifier.definitions, selectedBP]);

  const records = useMemo(() => 
    state.unifier.records.filter(r => r.bpDefId === selectedBP && r.projectId === projectId), 
  [state.unifier.records, selectedBP, projectId]);

  const navGroups: NavGroup[] = useMemo(() => [
      { id: 'controls', label: 'Project Controls', items: [
          { id: 'CostSheet', label: 'Master Cost Sheet', icon: Table },
          { id: 'BPs', label: 'Business Processes', icon: Layers },
      ]}
  ], []);

  const handleGroupChange = (groupId: string) => {
    // Single group, logical placeholder
  };

  const handleTabChange = (tabId: string) => {
      startTransition(() => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set('view', tabId);
        setSearchParams(newParams);
      });
  };

  const handleCreate = () => {
    setEditingRecord(undefined);
    setIsFormOpen(true);
  };

  const handleEdit = (rec: BPRecord) => {
    setEditingRecord(rec);
    setIsFormOpen(true);
  };

  const handleSaveRecord = (record: BPRecord, action: string) => {
     dispatch({ 
         type: 'UNIFIER_UPDATE_BP_RECORD', 
         payload: { record, action, user } 
     });
     setIsFormOpen(false);
  };

  return {
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
  };
};
