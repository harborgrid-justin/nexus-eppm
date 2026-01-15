import { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { generateId } from '../../utils/formatters';
import { ResourceRequest } from '../../types/resource';

export const useResourceRequestLogic = () => {
    const { state, dispatch } = useData();
    const { user } = useAuth();
    
    const [formData, setFormData] = useState<Partial<ResourceRequest>>({
        projectId: '',
        role: '',
        quantity: 1,
        startDate: '',
        endDate: '',
        notes: ''
    });
    const [successMsg, setSuccessMsg] = useState('');

    const handleSubmit = () => {
        if (!formData.projectId || !formData.role || !formData.quantity || !formData.startDate) {
            return { error: "Please fill in required fields." };
        }
        
        const selectedProject = state.projects.find(p => p.id === formData.projectId);

        const request: ResourceRequest = {
            id: generateId('REQ'),
            projectId: formData.projectId || '',
            projectName: selectedProject?.name || 'Unknown Project',
            requesterName: user?.name || 'Unknown User', 
            role: formData.role || '',
            quantity: formData.quantity || 1,
            startDate: formData.startDate || '',
            endDate: formData.endDate || '',
            status: 'Pending',
            notes: formData.notes
        };

        dispatch({ type: 'RESOURCE_REQUEST_ADD', payload: request });
        
        setSuccessMsg(`Request ${request.id} submitted for approval.`);
        setTimeout(() => setSuccessMsg(''), 3000);
        setFormData({ projectId: '', role: '', quantity: 1, startDate: '', endDate: '', notes: '' });
        return { success: true };
    };

    const updateField = (field: keyof ResourceRequest, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return {
        formData,
        projects: state.projects,
        roles: state.roles,
        skills: state.skills,
        successMsg,
        updateField,
        handleSubmit
    };
};