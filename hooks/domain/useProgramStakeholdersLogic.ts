
import { useState, useTransition } from 'react';
import { useProgramData } from '../../hooks/useProgramData';
import { useData } from '../../context/DataContext';
import { ProgramStakeholder, ProgramCommunicationItem } from '../../types';
import { generateId } from '../../utils/formatters';

export const useProgramStakeholdersLogic = (programId: string) => {
  const { programStakeholders, communicationPlan } = useProgramData(programId);
  const { dispatch } = useData();

  // State for Stakeholder Panel
  const [isStakeholderPanelOpen, setIsStakeholderPanelOpen] = useState(false);
  const [editingStakeholder, setEditingStakeholder] = useState<Partial<ProgramStakeholder> | null>(null);

  // State for Communication Panel
  const [isCommPanelOpen, setIsCommPanelOpen] = useState(false);
  const [editingCommItem, setEditingCommItem] = useState<Partial<ProgramCommunicationItem> | null>(null);
  
  const [isPending, startTransition] = useTransition();

  // --- Stakeholder CRUD Handlers ---
  const handleOpenStakeholderPanel = (stakeholder?: ProgramStakeholder) => {
    setEditingStakeholder(stakeholder || {
        name: '', role: '', category: 'Strategic', engagementLevel: 'Neutral', influence: 'Medium', interest: 'Medium', engagementStrategy: ''
    });
    setIsStakeholderPanelOpen(true);
  };

  const handleSaveStakeholder = (data: Partial<ProgramStakeholder>) => {
    if (!data.name) return;
    const stakeholderToSave: ProgramStakeholder = {
      id: data.id || generateId('PS'),
      programId,
      ...data,
    } as ProgramStakeholder;

    dispatch({
      type: data.id ? 'PROGRAM_UPDATE_STAKEHOLDER' : 'PROGRAM_ADD_STAKEHOLDER',
      payload: stakeholderToSave
    });
    setIsStakeholderPanelOpen(false);
  };

  const handleDeleteStakeholder = (id: string) => {
    if (window.confirm('Are you sure you want to delete this stakeholder?')) {
      dispatch({ type: 'PROGRAM_DELETE_STAKEHOLDER', payload: id });
    }
  };

  // --- Communication Item CRUD Handlers ---
  const handleOpenCommPanel = (item?: ProgramCommunicationItem) => {
    setEditingCommItem(item || { audience: '', content: '', frequency: 'Monthly', channel: 'Email', ownerId: '' });
    setIsCommPanelOpen(true);
  };

  const handleSaveCommItem = (data: Partial<ProgramCommunicationItem>) => {
    if (!data.audience || !data.content) return;
    const itemToSave: ProgramCommunicationItem = {
      id: data.id || generateId('PCI'),
      programId,
      ...data,
    } as ProgramCommunicationItem;
    
    dispatch({
        type: data.id ? 'PROGRAM_UPDATE_COMM_ITEM' : 'PROGRAM_ADD_COMM_ITEM',
        payload: itemToSave
    });
    setIsCommPanelOpen(false);
  };

  const handleDeleteCommItem = (id: string) => {
    if (window.confirm('Are you sure you want to delete this communication item?')) {
        dispatch({ type: 'PROGRAM_DELETE_COMM_ITEM', payload: id });
    }
  };

  return {
      programStakeholders,
      communicationPlan,
      isStakeholderPanelOpen,
      editingStakeholder,
      isCommPanelOpen,
      editingCommItem,
      setIsStakeholderPanelOpen,
      setIsCommPanelOpen,
      setEditingStakeholder,
      setEditingCommItem,
      handleOpenStakeholderPanel,
      handleSaveStakeholder,
      handleDeleteStakeholder,
      handleOpenCommPanel,
      handleSaveCommItem,
      handleDeleteCommItem,
      isPending
  };
};
