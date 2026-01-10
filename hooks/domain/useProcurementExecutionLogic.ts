
import { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { PurchaseOrder } from '../../types';
import { generateId } from '../../utils/formatters';

export const useProcurementExecutionLogic = (projectId: string) => {
    const { state, dispatch } = useData();
    const { user } = useAuth();
    
    // Create new PO
    const handleDraftPO = () => {
        // Find a valid vendor and contract for default
        const contract = state.contracts.find(c => c.projectId === projectId);
        const vendorId = contract?.vendorId || state.vendors[0]?.id;

        if (!vendorId) {
            alert("No vendors available. Please add vendors first.");
            return;
        }

        const newPO: PurchaseOrder = {
            id: generateId('PO'),
            projectId,
            contractId: contract?.id || 'NA',
            vendorId,
            number: `PO-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`,
            status: 'Draft',
            amount: 0,
            issueDate: new Date().toISOString().split('T')[0],
            description: 'New Purchase Order Draft'
        };

        dispatch({ type: 'ADD_PURCHASE_ORDER', payload: newPO });
    };

    return {
        purchaseOrders: state.purchaseOrders.filter(po => po.projectId === projectId),
        vendors: state.vendors,
        handleDraftPO
    };
};
