
import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import {
  Search, Download, CheckCircle, Package, Box, Radio, Calculator, Receipt,
  Banknote, TrendingUp, ShoppingCart, Truck, Clipboard, CheckSquare,
  MessageSquare, FileInput, Shield, Leaf, Award, ScatterChart, BarChart2,
  PieChart, Users, Camera, BookOpen, Umbrella, Scale, Watch, CloudRain,
  AlertOctagon, PenTool, LayoutGrid, Filter, Lock
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { usePermissions } from '../hooks/usePermissions';

const iconMap: Record<string, any> = {
  Box, Radio, Calculator, Receipt, Banknote, TrendingUp, ShoppingCart, 
  Package: Package, Truck, Clipboard, CheckSquare, MessageSquare, FileInput, 
  Shield, FileBadge: FileInput, Leaf, Award, ScatterChart, BarChart2, PieChart, 
  Users, Camera, BookOpen, Umbrella, Scale, Watch, CloudRain, AlertOctagon, PenTool
};

const ExtensionMarketplace: React.FC = () => {
  const { state, dispatch } = useData();
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const theme = useTheme();
  const { hasPermission } = usePermissions();
  const canManageExtensions = hasPermission('system:configure');

  const categories: string[] = ['All', ...Array.from(new Set<string>(state.extensions.map((e: { category: string }) => e.category)))];

  const filteredExtensions = state.extensions.filter(ext => {
    const matchesCategory = categoryFilter === 'All' || ext.category === categoryFilter;
    const matchesSearch = ext.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          ext.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className={`${theme.layout.pageContainer} ${theme.layout.pagePadding} ${theme.layout.sectionSpacing}`}>
      <div className={theme.layout.header}>
        <div>
          <h1 className={theme.typography.h1}>
            <LayoutGrid className="text-nexus-600" /> Extension Marketplace
          </h1>
          <p className={theme.typography.small}>Discover and install powerful engines to expand your platform.</p>
        </div>
        <div className="relative">
             <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
             <input 
               type="text" 
               placeholder="Search extensions..." 
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-1 focus:ring-nexus-500 w-64" 
             />
          </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              categoryFilter === cat 
                ? `${theme.colors.accentBg} text-white` 
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto pr-2">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredExtensions.map(ext => {
            const IconComponent = iconMap[ext.icon] || Package;
            const isInstalled = ext.status === 'Installed' || ext.status === 'Active';

            return (
              <div key={ext.id} className={`${theme.colors.surface} border ${theme.colors.border} rounded-xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col group`}>
                 <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-nexus-600 group-hover:bg-nexus-50 transition-colors">
                       <IconComponent size={24} />
                    </div>
                    {isInstalled ? (
                      <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1">
                        <CheckCircle size={12} /> Installed
                      </span>
                    ) : (
                      <span className="bg-slate-100 text-slate-500 text-xs px-2 py-1 rounded-full font-medium">
                        v{ext.version}
                      </span>
                    )}
                 </div>
                 
                 <h3 className={`${theme.typography.h3} mb-1 text-base`}>{ext.name}</h3>
                 <p className={`${theme.typography.body} text-slate-500 mb-4 line-clamp-2 min-h-[40px]`}>{ext.description}</p>
                 
                 <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">{ext.category}</span>
                    {canManageExtensions ? (
                        <button 
                        onClick={() => {
                            if (isInstalled) {
                            if (ext.status === 'Installed') dispatch({ type: 'ACTIVATE_EXTENSION', payload: ext.id });
                            } else {
                            dispatch({ type: 'INSTALL_EXTENSION', payload: ext.id });
                            }
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            ext.status === 'Active'
                            ? 'bg-slate-100 text-slate-400 cursor-default'
                            : isInstalled
                                ? 'bg-nexus-100 text-nexus-700 hover:bg-nexus-200'
                                : 'bg-slate-900 text-white hover:bg-slate-700'
                        }`}
                        disabled={ext.status === 'Active'}
                        >
                        {ext.status === 'Active' ? 'Active' : isInstalled ? 'Activate' : 'Install'}
                        </button>
                    ) : (
                        <div title="Only administrators can manage extensions">
                            <Lock size={16} className="text-slate-400"/>
                        </div>
                    )}
                 </div>
              </div>
            );
          })}
        </div>
        
        {filteredExtensions.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64 text-slate-400">
            <Package size={48} className="mb-4 opacity-50" />
            <p>No extensions found for this category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExtensionMarketplace;
