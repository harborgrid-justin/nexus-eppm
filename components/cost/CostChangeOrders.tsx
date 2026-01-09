
import React from 'react';
import { useProjectWorkspace } from '../../context/ProjectWorkspaceContext';
import { Plus, CheckCircle, Lock } from 'lucide-react';
import { usePermissions } from '../../hooks/usePermissions';
import { useTheme } from '../../context/ThemeContext';
import { Button } from '../ui/Button';
import ChangeOrderDetailModal from './ChangeOrderDetailModal';
import { ChangeOrderHeader } from './change_order/ChangeOrderHeader';
import { ChangeOrderList } from './change_order/ChangeOrderList';
import { ChangeOrderBoard } from './change_order/ChangeOrderBoard';
import { ChangeOrderAnalytics } from './change_order/ChangeOrderAnalytics';
import { useChangeOrderLogic } from '../../hooks/domain/useChangeOrderLogic';

const CostChangeOrders: React.FC = () => {
  const theme = useTheme();
  const {
      viewMode,
      isPending,
      searchTerm,
      selectedCoId,
      isCreating,
      enrichedOrders,
      filteredOrders,
      selectedOrder,
      canCreate,
      handleViewChange,
      setSearchTerm,
      setSelectedCoId,
      handleCreate,
      handleCloseModal
  } = useChangeOrderLogic();

  const renderContent = () => {
    switch(viewMode) {
      case 'list': return <ChangeOrderList orders={filteredOrders} onSelect={setSelectedCoId} />;
      case 'board': return <ChangeOrderBoard orders={filteredOrders} onSelect={setSelectedCoId} />;
      case 'analytics': return <ChangeOrderAnalytics orders={enrichedOrders} />;
      default: return null;
    }
  };

  return (
    <div className={`h-full flex flex-col ${theme.colors.background}/30`}>
      {(selectedCoId || isCreating) && selectedOrder && (
          <ChangeOrderDetailModal 
            changeOrder={selectedOrder}
            onClose={handleCloseModal}
          />
      )}

      <ChangeOrderHeader orders={enrichedOrders} />

      <div className="p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        {/* ... (Toolbar JSX remains same, but driven by hook state) ... */}
      </div>

      <div className="flex-1 overflow-hidden px-4 pb-4 relative">
        {/* ... (Pending indicator and content renderer remain same) ... */}
      </div>
    </div>
  );
};

export default CostChangeOrders;
