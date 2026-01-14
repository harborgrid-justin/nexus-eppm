import React, { useState } from 'react';
import { Search, Plus, Book, Database } from 'lucide-react';
import { formatCurrency } from '../../../utils/formatters';
import { SidePanel } from '../../ui/SidePanel';
import { Button } from '../../ui/Button';
import { useData } from '../../../context/DataContext';
import { useTheme } from '../../../context/ThemeContext';
import { CostBookItem } from '../../../types/index';
import { EmptyGrid } from '../../common/EmptyGrid';

interface CostItemLookupProps {
  isOpen: boolean;
  onClose: () => void;
  onAddItem: (item: CostBookItem) => void;
}

export const CostItemLookup: React.FC<CostItemLookupProps> = ({ isOpen, onClose, onAddItem }) => {
  const { state } = useData();
  const theme = useTheme();
  const [lookupSearch, setLookupSearch] = useState('');

  const costBook = state.costBook || [];

  return (
    <SidePanel
          isOpen={isOpen}
          onClose={onClose}
          title={<span className="font-black text-sm uppercase tracking-[0.2em] text-slate-500">Corporate Cost Dictionary</span>}
          width="md:w-[650px]"
          footer={<Button variant="secondary" onClick={onClose} className="font-black text-[10px] uppercase tracking-widest">Close Catalog</Button>}
      >
          <div className="space-y-8 animate-nexus-in">
              <div className="relative group">
                  <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-nexus-600 transition-colors"/>
                  <input 
                    type="text" 
                    placeholder="Search master cost book by description or CSI code..." 
                    className={`w-full pl-12 pr-4 py-4 border-2 ${theme.colors.border} rounded-2xl text-base font-bold focus:ring-8 focus:ring-nexus-500/5 focus:border-nexus-500 outline-none transition-all shadow-sm bg-slate-50/30`}
                    value={lookupSearch}
                    onChange={e => setLookupSearch(e.target.value)}
                  />
              </div>

              <div className={`border ${theme.colors.border} rounded-3xl overflow-hidden shadow-xl bg-white`}>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-100 border-separate border-spacing-0">
                        <thead className={`${theme.colors.background} sticky top-0 z-10 shadow-sm border-b`}>
                            <tr>
                                <th className={theme.components.table.header + " pl-8 py-5"}>Standard Narrative</th>
                                <th className={theme.components.table.header}>UoM</th>
                                <th className={`${theme.components.table.header} text-right`}>Unit Rate</th>
                                <th className="w-16 px-4 py-3 border-b border-slate-100"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 bg-white">
                            {costBook.filter(i => i.description.toLowerCase().includes(lookupSearch.toLowerCase())).map(item => (
                                <tr key={item.id} className={`hover:bg-slate-50 cursor-pointer group transition-colors`} onClick={() => onAddItem(item)}>
                                    <td className="px-8 py-4">
                                        <div className="font-bold text-slate-800 text-sm group-hover:text-nexus-700 transition-colors uppercase tracking-tight">{item.description}</div>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-[9px] font-mono font-black text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200">{item.id}</span>
                                            <span className="text-[9px] font-black uppercase text-nexus-600 bg-nexus-50 px-1.5 py-0.5 rounded border border-nexus-100">{item.type}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-xs font-black text-slate-400 uppercase font-mono">{item.unit}</td>
                                    <td className="px-6 py-4 text-sm text-slate-900 font-black text-right font-mono">{formatCurrency(item.rate)}</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-nexus-600 group-hover:text-white group-hover:shadow-lg transition-all active:scale-90">
                                            <Plus size={16}/>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {costBook.length === 0 && (
                                <div className="h-40">
                                    <EmptyGrid title="Cost Book Offline" description="The master dictionary is currently unpopulated." icon={Database} />
                                </div>
                            )}
                        </tbody>
                    </table>
                  </div>
              </div>
              
              <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl flex gap-3 items-center">
                  <Book size={18} className="text-blue-600"/>
                  <p className="text-[10px] text-blue-800 font-bold uppercase tracking-widest leading-relaxed">
                      Rates are derived from the global corporate baseline. Local overrides must be documented in the Basis of Estimate.
                  </p>
              </div>
          </div>
      </SidePanel>
  );
};