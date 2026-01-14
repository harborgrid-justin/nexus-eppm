
import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Plus, Search, Filter, BarChart2, List, LayoutGrid, Loader2 } from 'lucide-react';
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
      stats,
      handleViewChange,
      setSearchTerm,
      setSelectedCoId,
      handleCreate,
      handleCloseModal
  } = useChangeOrderLogic();

  const renderContent = () => {
    switch(viewMode) {
      case 'list': return <ChangeOrderList orders={filteredOrders} onSelect={setSelectedCoId} onAdd={handleCreate} />;
      case 'board': return <ChangeOrderBoard orders={filteredOrders} onSelect={setSelectedCoId} />;
      case 'analytics': return <ChangeOrderAnalytics orders={enrichedOrders} />;
      default: return null;
    }
  };

  return (
    <div className={`h-full flex flex-col ${theme.layout.sectionSpacing} animate-in fade-in`}>
      {(selectedCoId || isCreating) && selectedOrder && (
          <ChangeOrderDetailModal 
            changeOrder={selectedOrder}
            onClose={handleCloseModal}
          />
      )}

      <ChangeOrderHeader stats={stats} />

      <div className={`mx-6 px-4 py-3 bg-white border ${theme.colors.border} rounded-2xl shadow-sm flex flex-col md:flex-row justify-between items-center gap-4`}>
        <div className="flex items-center gap-4 w-full md:w-auto">
            <div className={`flex ${theme.colors.background} p-1 rounded-lg border ${theme.colors.border}`}>
                <button onClick={() => handleViewChange('list')} className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-nexus-600' : 'text-slate-500 hover:bg-white/50'}`} title="List View"><List size={18}/></button>
                <button onClick={() => handleViewChange('board')} className={`p-2 rounded-md transition-all ${viewMode === 'board' ? 'bg-white shadow-sm text-nexus-600' : 'text-slate-500 hover:bg-white/50'}`} title="Board View"><LayoutGrid size={18}/></button>
                <button onClick={() => handleViewChange('analytics')} className={`p-2 rounded-md transition-all ${viewMode === 'analytics' ? 'bg-white shadow-sm text-nexus-600' : 'text-slate-500 hover:bg-white/50'}`} title="Analytics"><BarChart2 size={18}/></button>
            </div>
            <div className="relative flex-1 md:w-64">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                    type="text" 
                    placeholder="Search change logs..." 
                    className={`w-full pl-9 pr-4 py-1.5 text-sm border ${theme.colors.border} rounded-lg outline-none focus:ring-2 focus:ring-nexus-500 transition-all`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
            <Button variant="outline" size="sm" icon={Filter}>Advanced Filters</Button>
            {canCreate && <Button size="sm" icon={Plus} onClick={handleCreate}>New Change Order</Button>}
        </div>
      </div>

      <div className="flex-1 overflow-hidden px-6 pb-6 relative">
        {isPending && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/20 backdrop-blur-sm">
                <Loader2 size={32} className="animate-spin text-nexus-600"/>
            </div>
        )}
        <div className={`h-full bg-white border ${theme.colors.border} rounded-2xl overflow-hidden shadow-sm`}>
            {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default CostChangeOrders;
