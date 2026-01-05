
import { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Integration } from '../../types';
import { generateId } from '../../utils/formatters';

export const useConnectorConfigLogic = () => {
    const { state, dispatch } = useData();
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [editingConn, setEditingConn] = useState<Partial<Integration> | null>(null);
    const [isTesting, setIsTesting] = useState(false);

    const handleOpen = (conn: Integration | null) => {
        setEditingConn(conn || { name: '', type: 'ERP', protocol: 'REST API', endpoint: '', health: 'Unknown' });
        setIsPanelOpen(true);
    };

    const handleSave = () => {
        if (!editingConn?.name) return;
        const connToSave = {
            ...editingConn,
            id: editingConn.id || generateId('INT'),
            status: editingConn.status || 'Active',
            lastSync: editingConn.lastSync || 'Never',
            logo: editingConn.logo || 'Server'
        } as Integration;

        if (editingConn.id) {
            dispatch({ type: 'SYSTEM_UPDATE_INTEGRATION', payload: connToSave });
        } else {
            dispatch({ type: 'SYSTEM_ADD_INTEGRATION', payload: connToSave });
        }
        setIsPanelOpen(false);
    };

    const handleTestConnection = () => {
        setIsTesting(true);
        // Simulate async handshake
        setTimeout(() => {
            setIsTesting(false);
            if (editingConn && editingConn.name) {
                 if(editingConn.id) {
                     dispatch({ 
                         type: 'SYSTEM_UPDATE_INTEGRATION', 
                         payload: { ...editingConn, health: 'Good', lastSync: 'Just now' } as Integration 
                     });
                 }
            }
        }, 1500);
    };

    const handleSync = (conn: Integration) => {
        dispatch({ 
             type: 'SYSTEM_UPDATE_INTEGRATION', 
             payload: { ...conn, lastSync: 'Syncing...', health: 'Unknown' } 
        });
        setTimeout(() => {
             dispatch({ 
                 type: 'SYSTEM_UPDATE_INTEGRATION', 
                 payload: { ...conn, lastSync: 'Just now', health: 'Good' } 
             });
        }, 2000);
    };

    return {
        integrations: state.integrations,
        isPanelOpen,
        setIsPanelOpen,
        editingConn,
        setEditingConn,
        isTesting,
        handleOpen,
        handleSave,
        handleTestConnection,
        handleSync
    };
};
