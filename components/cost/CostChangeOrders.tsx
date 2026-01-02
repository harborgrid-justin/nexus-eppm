
import React, { useMemo, useState, useTransition } from 'react';
import { useProjectWorkspace } from '../../context/ProjectWorkspaceContext';
import { useData } from '../../context/DataContext';
import { Plus, CheckCircle, Lock, Filter, FileText, AlertOctagon, LayoutGrid, List as ListIcon, BarChart2, DollarSign, Calendar, Loader2 } from 'lucide-react';
import { usePermissions } from '../../hooks/usePermissions';
import { useTheme } from '../../context/ThemeContext';
import { formatCompactCurrency, formatCurrency } from '../../utils/formatters';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import ChangeOrderDetailModal from './ChangeOrderDetailModal';
import { ChangeOrder } from '../../types/index';
import { generateId } from '../../utils/formatters';
import { ChangeOrderHeader } from './change_order/ChangeOrderHeader';
import { ChangeOrderList } from './change_order/ChangeOrderList';
import { ChangeOrderBoard } from './change_order/ChangeOrderBoard';
import { ChangeOrderAnalytics } from './change_order/ChangeOrderAnalytics';

const CostChangeOrders: React.FC = () => {
  const { project, changeOrders } = useProjectWorkspace();
  const projectId = project.id;
  const theme = useTheme();
  const { hasPermission, user } = usePermissions();

  const [viewMode, setViewMode] = useState<'list' | 'board' | 'analytics'>('list');
  const [isPending, startTransition] = useTransition();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCoId, setSelectedCoId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const canCreate = hasPermission('financials:write');

  const enrichedOrders = useMemo(() => {
      return (changeOrders || []).map(co => ({
          ...co,
          priority: co.priority || 'Medium',
          category: co.category || 'Unforeseen Condition',
          scheduleImpactDays: co.scheduleImpactDays || 0,
          stage: co.stage || (co.status === 'Pending Approval' ? 'CCB Review' : co.status === 'Approved' ? 'Execution' : 'Initiation')
      }));
  }, [changeOrders]);

  const filteredOrders = useMemo(() => {
      return enrichedOrders.filter(co => 
        co.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        co.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [enrichedOrders, searchTerm]);

  const handleCreate = () => {
      setIsCreating(true);
  };

  const renderContent = () => {
    switch(viewMode) {
      case 'list': return <ChangeOrderList orders={filteredOrders} onSelect={setSelectedCoId} />;
      case 'board': return <ChangeOrderBoard orders={filteredOrders} onSelect={setSelectedCoId} />;
      case 'analytics': return <ChangeOrderAnalytics orders={enrichedOrders} />;
      default: return null;
    }
  };
  
  const selectedOrder = filteredOrders.find(co => co.id === selectedCoId) || (isCreating ? {
      id: generateId('CO'), projectId, title: 'New Change Request', description: '', amount: 0,
      scheduleImpactDays: 0, status: 'Draft', stage: 'Initiation', priority: 'Medium',
      category: 'Client Request', submitterId: user?.id || 'System',
      dateSubmitted: new Date().toISOString().split('T')[0], history: []
  } : null);

  return (
    <div className={`h-full flex flex-col ${theme.colors.background}/30`}>
      {(selectedCoId || isCreating) && selectedOrder && (
          <ChangeOrderDetailModal 
            changeOrder={selectedOrder}
            onClose={() => { setSelectedCoId(null); setIsCreating(false); }}
          />
      )}

      <ChangeOrderHeader orders={enrichedOrders} />

      <div className="p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className={`flex ${theme.colors.surface} border ${theme.colors.border} rounded-lg p-1`}>
                <button onClick={() => startTransition(() => setViewMode('list'))} className={`p-2 rounded ${viewMode === 'list' ? 'bg-nexus-100 text-nexus-700' : 'text-slate-500'}`}><ListIcon size={16}/></button>
                <button onClick={() => startTransition(() => setViewMode('board'))} className={`p-2 rounded ${viewMode === 'board' ? 'bg-nexus-100 text-nexus-700' : 'text-slate-500'}`}><LayoutGrid size={16}/></button>
                <button onClick={() => startTransition(() => setViewMode('analytics'))} className={`p-2 rounded ${viewMode === 'analytics' ? 'bg-nexus-100 text-nexus-700' : 'text-slate-500'}`}><BarChart2 size={16}/></button>
            </div>
            <Input isSearch placeholder="Search changes..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-64" />
        </div>
        {canCreate && <Button variant="primary" icon={Plus} onClick={handleCreate}>Create Request</Button>}
      </div>

      <div className="flex-1 overflow-hidden px-4 pb-4 relative">
        {isPending && <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center"><Loader2 className="animate-spin text-nexus-500" /></div>}
        {renderContent()}
      </div>
    </div>
  );
};
export default CostChangeOrders;
