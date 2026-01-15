
import { useState, useMemo, useTransition } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { BPRecord } from '../../types/unifier';
import { Table, Layers, TrendingUp, Banknote, Edit3, Settings } from 'lucide-react';

export const useUnifierLogic = () => {
  const { state, dispatch } = useData();
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const activeGroup = searchParams.get('unifierGroup') || 'controls';
  const activeTab = searchParams.get('view') || 'CostSheet';
  const [selectedBP, setSelectedBP] = useState<string>('bp_co'); 
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<BPRecord | undefined>(undefined);

  const projectId = useMemo(() => state.projects[0]?.id || 'UNSET', [state.projects]); 

  const definitions = useMemo(() => state.unifier?.definitions || [], [state.unifier.definitions]);
  const activeDefinition = useMemo(() => definitions.find(d => d.id === selectedBP), [definitions, selectedBP]);
  const records = useMemo(() => state.unifier.records.filter(r => r.bpDefId === selectedBP && r.projectId === projectId), [state.unifier.records, selectedBP, projectId]);

  const navGroups = useMemo(() => [
      { id: 'controls', label: 'Cost Controls', items: [
          { id: 'CostSheet', label: 'Master Cost Sheet', icon: Table },
          { id: 'CashFlow', label: 'Cash Flow', icon: TrendingUp },
          { id: 'Funding', label: 'Funding Manager', icon: Banknote },
      ]},
      { id: 'automation', label: 'Business Processes', items: [
          { id: 'BPs', label: 'Logs & Records', icon: Layers },
      ]},
      { id: 'admin', label: 'Configuration', items: [
          { id: 'uDesigner', label: 'uDesigner', icon: Edit3 },
          { id: 'Admin', label: 'Admin', icon: Settings },
      ]}
  ], []);

  const handleTabChange = (tabId: string) => {
      startTransition(() => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set('view', tabId);
        setSearchParams(newParams);
      });
  };

  const handleSaveRecord = (record: BPRecord, action: string) => {
      dispatch({ type: 'UNIFIER_UPDATE_BP_RECORD', payload: { record, action, user } });
      setIsFormOpen(false);
  };

  return {
    activeGroup, activeTab, selectedBP, isFormOpen, editingRecord,
    projectId, definitions, activeDefinition, records, navGroups,
    handleGroupChange: (g: string) => {}, handleTabChange,
    handleCreate: () => { setEditingRecord(undefined); setIsFormOpen(true); },
    handleEdit: (r: BPRecord) => { setEditingRecord(r); setIsFormOpen(true); },
    handleSaveRecord, setSelectedBP, setIsFormOpen
  };
};
