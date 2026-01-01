
import React, { useState, useMemo, useTransition } from 'react';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';
import { Scale, FileSignature, AlertCircle, ArrowRight, DollarSign, Check, X, ChevronDown, ChevronUp } from 'lucide-react';
import { formatCurrency, formatCompactCurrency, formatPercentage } from '../../utils/formatters';
import { Solicitation, Vendor, VendorBid } from '../../types';
import { ProgressBar } from '../common/ProgressBar';

interface CostProcurementProps {
  projectId: string;
}

const CostProcurement: React.FC<CostProcurementProps> = ({ projectId }) => {
  const { state } = useData();
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState<'pre-award' | 'post-award'>('pre-award');
  const [expandedBidId, setExpandedBidId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // --- Pre-Award Logic ---
  const solicitations = useMemo(() => 
    state.solicitations.filter(s => s.projectId === projectId && s.bids && s.bids.length > 0), 
  [state.solicitations, projectId]);

  const getVendorName = (id: string) => state.vendors.find(v => v.id === id)?.name || id;

  // --- Post-Award Logic ---
  const contracts = useMemo(() => 
    state.contracts.filter(c => c.projectId === projectId), 
  [state.contracts, projectId]);

  const financials = useMemo(() => {
      const committed = contracts.reduce((sum, c) => sum + c.contractValue, 0);
      const invoiced = contracts.reduce((sum, c) => sum + c.invoicedToDate, 0);
      const retained = contracts.reduce((sum, c) => sum + c.retainedToDate, 0);
      const paid = contracts.reduce((sum, c) => sum + c.paidToDate, 0);
      return { committed, invoiced, retained, paid };
  }, [contracts]);

  const handleTabChange = (tab: 'pre-award' | 'post-award') => {
      startTransition(() => {
          setActiveTab(tab);
      });
  };

  const renderBidLeveling = (solicitation: Solicitation) => {
      const budget = state.procurementPackages.find(p => p.id === solicitation.packageId)?.budget || 0;
      const sortedBids = [...(solicitation.bids || [])].sort((a,b) => a.totalAmount - b.totalAmount);
      const lowBid = sortedBids[0]?.totalAmount || 0;

      return (
          <div key={solicitation.id} className="bg-white rounded-xl border border-slate-200 shadow-sm mb-6 overflow-hidden">
              <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center cursor-pointer" onClick={() => setExpandedBidId(expandedBidId === solicitation.id ? null : solicitation.id)}>
                  <div>
                      <h4 className="font-bold text-slate-800 flex items-center gap-2">
                          <Scale size={16} className="text-nexus-600"/> 
                          {solicitation.title} 
                          <span className="text-xs font-normal text-slate-500 ml-2">({solicitation.type})</span>
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">Package Budget: <span className="font-mono font-medium text-slate-700">{formatCurrency(budget)}</span></p>
                  </div>
                  <div className="flex items-center gap-4">
                      <div className="text-right">
                          <p className="text-xs text-slate-500 uppercase font-bold">Low Bid</p>
                          <p className={`font-mono font-bold ${lowBid > budget ? 'text-red-600' : 'text-green-600'}`}>
                              {formatCurrency(lowBid)}
                          </p>
                      </div>
                      {expandedBidId === solicitation.id ? <ChevronUp size={18} className="text-slate-400"/> : <ChevronDown size={18} className="text-slate-400"/>}
                  </div>
              </div>

              {expandedBidId === solicitation.id && (
                  <div className="p-0 overflow-x-auto">
                      <table className="min-w-full divide-y divide-slate-100">
                          <thead className="bg-white">
                              <tr>
                                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Vendor</th>
                                  <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase">Bid Amount</th>
                                  <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase">Variance (Budget)</th>
                                  <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase">Delta (Low)</th>
                                  <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase">Status</th>
                              </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-50">
                              {sortedBids.map((bid, idx) => {
                                  const variance = bid.totalAmount - budget;
                                  const deltaLow = bid.totalAmount - lowBid;
                                  const isLow = idx === 0;

                                  return (
                                      <tr key={bid.vendorId} className={isLow ? 'bg-green-50/30' : ''}>
                                          <td className="px-4 py-3 text-sm font-medium text-slate-800">
                                              {getVendorName(bid.vendorId)}
                                              {isLow && <span className="ml-2 text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-bold">LOW</span>}
                                          </td>
                                          <td className="px-4 py-3 text-sm text-right font-mono font-bold">{formatCurrency(bid.totalAmount)}</td>
                                          <td className={`px-4 py-3 text-sm text-right font-mono ${variance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                              {variance > 0 ? '+' : ''}{formatCurrency(variance)} ({formatPercentage((variance/budget)*100, 1)})
                                          </td>
                                          <td className="px-4 py-3 text-sm text-right font-mono text-slate-500">
                                              {deltaLow === 0 ? '-' : `+${formatCurrency(deltaLow)}`}
                                          </td>
                                          <td className="px-4 py-3 text-center">
                                              <span className={`px-2 py-1 text-xs rounded-full ${
                                                  bid.status === 'Selected' ? 'bg-nexus-100 text-nexus-700 font-bold' : 
                                                  bid.status === 'Rejected' ? 'bg-slate-100 text-slate-500' : 'bg-yellow-50 text-yellow-700'
                                              }`}>{bid.status}</span>
                                          </td>
                                      </tr>
                                  );
                              })}
                          </tbody>
                      </table>
                  </div>
              )}
          </div>
      );
  };

  return (
    <div className="h-full flex flex-col bg-slate-50/50">
        {/* Toggle Header */}
        <div className="p-4 border-b border-slate-200 flex justify-center">
            <div className="bg-white border border-slate-200 p-1 rounded-lg flex shadow-sm">
                <button 
                    onClick={() => handleTabChange('pre-award')}
                    className={`px-6 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-2 ${
                        activeTab === 'pre-award' ? 'bg-nexus-50 text-nexus-700 shadow-sm border border-nexus-200' : 'text-slate-500 hover:text-slate-800'
                    }`}
                >
                    <Scale size={16}/> Pre-Award (Bid Leveling)
                </button>
                <button 
                    onClick={() => handleTabChange('post-award')}
                    className={`px-6 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-2 ${
                        activeTab === 'post-award' ? 'bg-nexus-50 text-nexus-700 shadow-sm border border-nexus-200' : 'text-slate-500 hover:text-slate-800'
                    }`}
                >
                    <FileSignature size={16}/> Post-Award (Financials)
                </button>
            </div>
        </div>

        <div className={`flex-1 overflow-y-auto p-6 ${isPending ? 'opacity-50' : 'opacity-100'} transition-opacity`}>
            {activeTab === 'pre-award' && (
                <div className="max-w-5xl mx-auto">
                    {solicitations.length > 0 ? (
                        solicitations.map(s => renderBidLeveling(s))
                    ) : (
                        <div className="text-center p-12 text-slate-400">
                            <Scale size={48} className="mx-auto mb-4 opacity-20"/>
                            <p>No active solicitations with bids found.</p>
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'post-award' && (
                <div className="space-y-6">
                    {/* Financial Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                            <p className="text-xs text-slate-500 uppercase font-bold">Committed Value</p>
                            <p className="text-2xl font-bold text-slate-900">{formatCompactCurrency(financials.committed)}</p>
                            <p className="text-xs text-slate-400 mt-1">Total Contract Sums</p>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                            <p className="text-xs text-slate-500 uppercase font-bold">Invoiced (Gross)</p>
                            <p className="text-2xl font-bold text-blue-600">{formatCompactCurrency(financials.invoiced)}</p>
                            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
                                <div className="bg-blue-500 h-full" style={{width: `${(financials.invoiced/financials.committed)*100}%`}}></div>
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                            <p className="text-xs text-slate-500 uppercase font-bold">Retainage Held</p>
                            <p className="text-2xl font-bold text-orange-600">{formatCompactCurrency(financials.retained)}</p>
                            <p className="text-xs text-slate-400 mt-1">Withheld for Quality</p>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                            <p className="text-xs text-slate-500 uppercase font-bold">Net Paid</p>
                            <p className="text-2xl font-bold text-green-600">{formatCompactCurrency(financials.paid)}</p>
                            <p className="text-xs text-slate-400 mt-1">Cash Out</p>
                        </div>
                    </div>

                    {/* Contract Ledger */}
                    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                        <div className="p-4 border-b border-slate-200 bg-slate-50">
                            <h3 className="font-bold text-slate-800">Contract Financial Ledger</h3>
                        </div>
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-white">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Contract / Vendor</th>
                                    <th className="px-6 py-3 text-right text-xs font-bold text-slate-500 uppercase">Commitment</th>
                                    <th className="px-6 py-3 text-right text-xs font-bold text-slate-500 uppercase">Invoiced (Gross)</th>
                                    <th className="px-6 py-3 text-right text-xs font-bold text-slate-500 uppercase text-orange-600">Retainage</th>
                                    <th className="px-6 py-3 text-right text-xs font-bold text-slate-500 uppercase text-green-600">Net Paid</th>
                                    <th className="px-6 py-3 text-right text-xs font-bold text-slate-500 uppercase">Remaining</th>
                                    <th className="px-6 py-3 text-center text-xs font-bold text-slate-500 uppercase">Burn</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {contracts.map(contract => {
                                    const percentInvoiced = (contract.invoicedToDate / contract.contractValue) * 100;
                                    const remaining = contract.contractValue - contract.invoicedToDate;
                                    
                                    return (
                                        <tr key={contract.id} className="hover:bg-slate-50">
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-slate-900 text-sm">{contract.title}</div>
                                                <div className="text-xs text-slate-500 font-mono mt-0.5">{getVendorName(contract.vendorId)} • {contract.id}</div>
                                            </td>
                                            <td className="px-6 py-4 text-right text-sm font-medium text-slate-900">{formatCurrency(contract.contractValue)}</td>
                                            <td className="px-6 py-4 text-right text-sm text-blue-700">{formatCurrency(contract.invoicedToDate)}</td>
                                            <td className="px-6 py-4 text-right text-sm text-orange-700 bg-orange-50/30">{formatCurrency(contract.retainedToDate)}</td>
                                            <td className="px-6 py-4 text-right text-sm text-green-700 font-bold">{formatCurrency(contract.paidToDate)}</td>
                                            <td className="px-6 py-4 text-right text-sm text-slate-500">{formatCurrency(remaining)}</td>
                                            <td className="px-6 py-4 w-32">
                                                <div className="flex items-center gap-2">
                                                    <div className="flex-1 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                                                        <div className={`h-full ${percentInvoiced > 90 ? 'bg-red-500' : 'bg-blue-500'}`} style={{width: `${percentInvoiced}%`}}></div>
                                                    </div>
                                                    <span className="text-[10px] text-slate-500 font-medium">{percentInvoiced.toFixed(0)}%</span>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    </div>
  );
};

export default CostProcurement;
