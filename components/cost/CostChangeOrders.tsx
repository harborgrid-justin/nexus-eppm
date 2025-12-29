
import React, { useState, useMemo } from 'react';
import { useProjectState } from '../../hooks';
import { useData } from '../../context/DataContext';
import { Plus, CheckCircle, Lock, Filter, FileText, AlertOctagon, LayoutGrid, List as ListIcon, BarChart2, DollarSign, Calendar } from 'lucide-react';
import { usePermissions } from '../../hooks/usePermissions';
import { useTheme } from '../../context/ThemeContext';
import { formatCompactCurrency, formatCurrency } from '../../utils/formatters';
import { Badge } from '../ui/Badge';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import DataTable, { Column } from '../common/DataTable';
import ChangeOrderDetailModal from './ChangeOrderDetailModal';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import StatCard from '../shared/StatCard';
import { ChangeOrder } from '../../types';
import { generateId } from '../../utils/formatters';

interface CostChangeOrdersProps {
  projectId: string;
}

const CostChangeOrders: React.FC<CostChangeOrdersProps> = ({ projectId }) => {
  const { changeOrders } = useProjectState(projectId);
  const { dispatch } = useData();
  const theme = useTheme();
  const { hasPermission, user } = usePermissions();

  const [viewMode, setViewMode] = useState<'list' | 'board' | 'analytics'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCoId, setSelectedCoId] = useState<string | null>(null);
  
  // State for creating new CO
  const [isCreating, setIsCreating] = useState(false);
  const [newCo, setNewCo] = useState<ChangeOrder | null>(null);
  
  // Permissions Check
  const canApprove = hasPermission('financials:approve');
  const canCreate = hasPermission('financials:write');

  // Enriched Data (filling in mock gaps if necessary)
  const enrichedOrders = useMemo(() => {
      return changeOrders.map(co => ({
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

  // KPIs
  const stats = useMemo(() => {
      const totalVolume = enrichedOrders.length;
      const pendingVolume = enrichedOrders.filter(c => c.status === 'Pending Approval').length;
      const approvedCost = enrichedOrders.filter(c => c.status === 'Approved').reduce((s, c) => s + c.amount, 0);
      const pendingCost = enrichedOrders.filter(c => c.status === 'Pending Approval').reduce((s, c) => s + c.amount, 0);
      const scheduleDrift = enrichedOrders.filter(c => c.status === 'Approved').reduce((s, c) => s + c.scheduleImpactDays, 0);
      
      return { totalVolume, pendingVolume, approvedCost, pendingCost, scheduleDrift };
  }, [enrichedOrders]);

  // Chart Data
  const categoryData = useMemo(() => {
      const counts: Record<string, number> = {};
      enrichedOrders.forEach(co => counts[co.category] = (counts[co.category] || 0) + 1);
      return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [enrichedOrders]);

  const COLORS = ['#0ea5e9', '#22c55e', '#eab308', '#ef4444'];

  const handleCreate = () => {
      const draftCo: ChangeOrder = {
          id: generateId('CO'),
          projectId,
          title: 'New Change Request',
          description: '',
          amount: 0,
          scheduleImpactDays: 0,
          status: 'Draft',
          stage: 'Initiation',
          priority: 'Medium',
          category: 'Client Request',
          submittedBy: user?.name || 'Current User',
          dateSubmitted: new Date().toISOString().split('T')[0],
          history: [{
              date: new Date().toISOString().split('T')[0],
              user: user?.name || 'System',
              action: 'Draft Created'
          }]
      };
      setNewCo(draftCo);
      setIsCreating(true);
  };

  // Columns for List View
  const columns: Column<typeof enrichedOrders[0]>[] = [
    { key: 'id', header: 'ID', width: 'w-24', render: (co) => <span className="font-mono text-xs text-slate-500">{co.id}</span>, sortable: true },
    { key: 'title', header: 'Title', render: (co) => (
        <div>
            <div className="text-sm font-medium text-slate-900">{co.title}</div>
            <div className="text-xs text-slate-500">{co.category}</div>
        </div>
    ), sortable: true },
    { key: 'priority', header: 'Priority', width: 'w-24', render: (co) => (
        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
            co.priority === 'Critical' ? 'bg-red-100 text-red-700' : 
            co.priority === 'High' ? 'bg-orange-100 text-orange-700' : 'bg-blue-50 text-blue-700'
        }`}>{co.priority}</span>
    ), sortable: true },
    { key: 'amount', header: 'Cost Impact', align: 'right', render: (co) => (
        <span className={`font-mono text-sm font-bold ${co.amount >= 0 ? 'text-slate-800' : 'text-green-600'}`}>{formatCurrency(co.amount)}</span>
    ), sortable: true },
    { key: 'scheduleImpactDays', header: 'Schedule', align: 'center', render: (co) => (
        <span className="text-xs text-slate-600">{co.scheduleImpactDays > 0 ? `+${co.scheduleImpactDays}d` : '-'}</span>
    ) },
    { key: 'status', header: 'Status', render: (co) => (
        <Badge variant={co.status === 'Approved' ? 'success' : co.status === 'Rejected' ? 'danger' : 'warning'}>{co.status}</Badge>
    ), sortable: true },
    { key: 'actions', header: '', width: 'w-20', render: (co) => (
        co.status === 'Pending Approval' && canApprove ? (
            <button onClick={(e) => { e.stopPropagation(); if(confirm('Quick Approve?')) dispatch({type: 'APPROVE_CHANGE_ORDER', payload: {projectId, changeOrderId: co.id}}); }} className="text-green-600 hover:bg-green-50 p-1 rounded"><CheckCircle size={16}/></button>
        ) : null
    ) }
  ];

  return (
    <div className="h-full flex flex-col bg-slate-50/30">
      {/* Existing CO Detail */}
      {selectedCoId && filteredOrders.find(co => co.id === selectedCoId) && (
          <ChangeOrderDetailModal 
            changeOrder={filteredOrders.find(co => co.id === selectedCoId)!}
            onClose={() => setSelectedCoId(null)}
          />
      )}

      {/* New CO Creation */}
      {isCreating && newCo && (
          <ChangeOrderDetailModal 
            changeOrder={newCo}
            onClose={() => { setIsCreating(false); setNewCo(null); }}
          />
      )}

      {/* KPI Header */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 pb-0">
          <StatCard title="Approved Changes" value={formatCompactCurrency(stats.approvedCost)} subtext="Impact to Budget" icon={DollarSign} />
          <StatCard title="Pending Exposure" value={formatCompactCurrency(stats.pendingCost)} subtext={`${stats.pendingVolume} requests pending`} icon={AlertOctagon} trend="down" />
          <StatCard title="Schedule Drift" value={`+${stats.scheduleDrift} Days`} subtext="Cumulative Impact" icon={Calendar} trend={stats.scheduleDrift > 10 ? 'down' : 'up'} />
          <StatCard title="Total Volume" value={stats.totalVolume} subtext="Change Requests" icon={FileText} />
      </div>

      {/* Toolbar */}
      <div className="p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="flex bg-white border border-slate-200 rounded-lg p-1">
                <button onClick={() => setViewMode('list')} className={`p-2 rounded ${viewMode === 'list' ? 'bg-nexus-100 text-nexus-700' : 'text-slate-500'}`}><ListIcon size={16}/></button>
                <button onClick={() => setViewMode('board')} className={`p-2 rounded ${viewMode === 'board' ? 'bg-nexus-100 text-nexus-700' : 'text-slate-500'}`}><LayoutGrid size={16}/></button>
                <button onClick={() => setViewMode('analytics')} className={`p-2 rounded ${viewMode === 'analytics' ? 'bg-nexus-100 text-nexus-700' : 'text-slate-500'}`}><BarChart2 size={16}/></button>
            </div>
            <Input isSearch placeholder="Search changes..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-64" />
            <Button variant="secondary" size="sm" icon={Filter}>Filter</Button>
        </div>
        {canCreate ? (
            <Button variant="primary" icon={Plus} onClick={handleCreate}>Create Request</Button>
        ) : (
            <div className="flex items-center gap-2 text-xs text-slate-400 bg-white px-3 py-2 rounded-lg border border-slate-200">
                <Lock size={14} /> Read Only
            </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden px-4 pb-4">
        {viewMode === 'list' && (
            <DataTable 
                data={filteredOrders}
                columns={columns}
                keyField="id"
                onRowClick={(co) => setSelectedCoId(co.id)}
            />
        )}

        {viewMode === 'board' && (
            <div className="flex h-full gap-4 overflow-x-auto pb-2">
                {['Initiation', 'Technical Review', 'CCB Review', 'Execution'].map(stage => (
                    <div key={stage} className="flex-1 min-w-[280px] flex flex-col bg-slate-100 rounded-xl border border-slate-200">
                        <div className="p-3 border-b border-slate-200 font-bold text-slate-700 text-sm flex justify-between">
                            {stage}
                            <span className="bg-white px-2 rounded-full text-xs text-slate-500 border">{filteredOrders.filter(c => c.stage === stage).length}</span>
                        </div>
                        <div className="flex-1 p-2 space-y-2 overflow-y-auto">
                            {filteredOrders.filter(c => c.stage === stage).map(co => (
                                <div key={co.id} onClick={() => setSelectedCoId(co.id)} className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm cursor-pointer hover:shadow-md hover:border-nexus-300 transition-all">
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="text-xs font-mono text-slate-400">{co.id}</span>
                                        <Badge variant={co.priority === 'Critical' ? 'danger' : 'neutral'}>{co.priority}</Badge>
                                    </div>
                                    <h4 className="font-bold text-sm text-slate-800 mb-2">{co.title}</h4>
                                    <div className="flex justify-between text-xs text-slate-500 border-t border-slate-50 pt-2">
                                        <span>{formatCompactCurrency(co.amount)}</span>
                                        <span className={co.scheduleImpactDays > 0 ? 'text-red-500' : ''}>{co.scheduleImpactDays > 0 ? `+${co.scheduleImpactDays}d` : '-'}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        )}

        {viewMode === 'analytics' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full overflow-y-auto">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-[400px]">
                    <h3 className="font-bold text-slate-800 mb-4">Change Volume by Category</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={categoryData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {categoryData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-[400px]">
                    <h3 className="font-bold text-slate-800 mb-4">Cumulative Cost Impact</h3>
                    <div className="flex items-center justify-center h-full text-slate-400">
                        <p>Cumulative step chart coming soon.</p>
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default CostChangeOrders;
