
import React, { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import { formatCurrency } from '../../../utils/formatters';
import { SidePanel } from '../../ui/SidePanel';
import { Button } from '../../ui/Button';
import { useData } from '../../../context/DataContext';
import { useTheme } from '../../../context/ThemeContext';
import { CostBookItem } from '../../../types';

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
          title="Cost Item Lookup"
          width="md:w-[600px]"
          footer={<Button variant="secondary" onClick={onClose}>Close</Button>}
      >
          <div className="space-y-4">
              <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                  <input 
                    type="text" 
                    placeholder="Search cost items..." 
                    className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm"
                    value={lookupSearch}
                    onChange={e => setLookupSearch(e.target.value)}
                  />
              </div>
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-slate-200">
                      <thead className={`${theme.colors.background}`}>
                          <tr>
                              <th className="px-4 py-2 text-left text-xs font-bold text-slate-500 uppercase">Item</th>
                              <th className="px-4 py-2 text-left text-xs font-bold text-slate-500 uppercase">Unit</th>
                              <th className="px-4 py-2 text-right text-xs font-bold text-slate-500 uppercase">Rate</th>
                              <th className="w-10"></th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 bg-white">
                          {costBook.filter(i => i.description.toLowerCase().includes(lookupSearch.toLowerCase())).map(item => (
                              <tr key={item.id} className={`hover:${theme.colors.background} cursor-pointer`} onClick={() => onAddItem(item)}>
                                  <td className="px-4 py-2 text-sm text-slate-800">
                                      {item.description}
                                      <span className="ml-2 text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500">{item.type}</span>
                                  </td>
                                  <td className="px-4 py-2 text-sm text-slate-600 font-mono">{item.unit}</td>
                                  <td className="px-4 py-2 text-sm text-slate-900 font-bold text-right">{formatCurrency(item.rate)}</td>
                                  <td className="px-4 py-2 text-right">
                                      <Plus size={16} className="text-nexus-600"/>
                                  </td>
                              </tr>
                          ))}
                          {costBook.length === 0 && (
                              <tr><td colSpan={4} className="p-4 text-center text-slate-400 text-sm">No items in cost book.</td></tr>
                          )}
                      </tbody>
                  </table>
              </div>
          </div>
      </SidePanel>
  );
};
