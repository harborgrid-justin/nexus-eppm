
import { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { ProgramChangeRequest } from '../../types';
import { generateId } from '../../utils/formatters';

export const useProgramScopeLogic = (programId: string) => {
    const { state, dispatch } = useData();
    const { user } = useAuth();
    
    // Filter Program Data
    const programOutcomes = useMemo(() => 
        state.programOutcomes.filter(o => o.programId === programId),
    [state.programOutcomes, programId]);
    
    const projects = useMemo(() => 
        state.projects.filter(p => p.programId === programId),
    [state.projects, programId]);

    const changeRequests = useMemo(() => 
        state.programChangeRequests.filter(c => c.programId === programId), // Now we can filter!
    [state.programChangeRequests, programId]);

    // UI State
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [editingRequest, setEditingRequest] = useState<Partial<ProgramChangeRequest> | null>(null);

    // Actions
    const handleOpenPanel = (request?: ProgramChangeRequest) => {
        setEditingRequest(request ? { ...request } : {
            title: '',
            description: '',
            status: 'Pending PCCB',
            impact: { cost: 0, schedule: 0, risk: 'Low' }
        });
        setIsPanelOpen(true);
    };

    const handleClosePanel = () => {
        setIsPanelOpen(false);
        setEditingRequest(null);
    };

    const handleSaveRequest = (requestData: Partial<ProgramChangeRequest>) => {
        if (!requestData.title) return;

        const request: ProgramChangeRequest = {
            id: requestData.id || generateId('PCR'),
            programId,
            title: requestData.title,
            description: requestData.description || '',
            submittedDate: requestData.submittedDate || new Date().toISOString().split('T')[0],
            submitterId: requestData.submitterId || user?.name || 'Unknown',
            status: requestData.status || 'Pending PCCB',
            impact: {
                cost: requestData.impact?.cost || 0,
                schedule: requestData.impact?.schedule || 0,
                risk: requestData.impact?.risk || 'Low'
            }
        };

        if (requestData.id) {
            dispatch({ type: 'UPDATE_PROGRAM_CHANGE_REQUEST', payload: request });
        } else {
            dispatch({ type: 'ADD_PROGRAM_CHANGE_REQUEST', payload: request });
        }
        handleClosePanel();
    };

    const handleDeleteRequest = (id: string) => {
        if(confirm("Delete this Change Request?")) {
            dispatch({ type: 'DELETE_PROGRAM_CHANGE_REQUEST', payload: id });
        }
    };

    const handleApprove = (request: ProgramChangeRequest) => {
        dispatch({ type: 'UPDATE_PROGRAM_CHANGE_REQUEST', payload: { ...request, status: 'Approved' } });
    };

    const handleReject = (request: ProgramChangeRequest) => {
        dispatch({ type: 'UPDATE_PROGRAM_CHANGE_REQUEST', payload: { ...request, status: 'Rejected' } });
    };

    return {
        programOutcomes,
        projects,
        changeRequests,
        isPanelOpen,
        editingRequest,
        handleOpenPanel,
        handleClosePanel,
        handleSaveRequest,
        handleDeleteRequest,
        handleApprove,
        handleReject
    };
};
