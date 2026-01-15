
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { SupplierPerformanceReview } from '../../types';
import { generateId } from '../../utils/formatters';

export const useSupplierPerformanceLogic = (projectId: string) => {
    const { state, dispatch } = useData();
    const { user } = useAuth();
    
    const supplierReviews = state.supplierReviews.filter(r => r.projectId === projectId);
    const vendors = state.vendors;

    const handleLogReview = () => {
        // Pick first vendor with a contract on this project
        const contract = state.contracts.find(c => c.projectId === projectId);
        if (!contract) {
            alert("No active contracts found to review.");
            return;
        }

        const newReview: SupplierPerformanceReview = {
            id: generateId('SPR'),
            projectId,
            vendorId: contract.vendorId,
            date: new Date().toISOString().split('T')[0],
            rating: 5,
            reviewer: user?.name || 'Admin',
            comments: 'Performance evaluation.'
        };

        // Dispatch new action
        dispatch({ type: 'ADD_SUPPLIER_REVIEW', payload: newReview } as any);
    };

    return {
        supplierReviews,
        vendors,
        handleLogReview
    };
};
