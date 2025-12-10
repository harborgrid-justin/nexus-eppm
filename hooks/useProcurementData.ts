
import { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { LayoutDashboard, FileText, ShoppingCart, Users, Briefcase, FileCheck, DollarSign, Award, AlertTriangle } from 'lucide-react';

export const useProcurementData = (projectId: string) => {
  const { state } = useData();
  const [activeView, setActiveView] = useState('dashboard');

  const navItems = useMemo(() => [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'planning', label: 'Planning & Strategy', icon: FileText },
    { id: 'vendors', label: 'Vendor Registry', icon: Users },
    { id: 'sourcing', label: 'Sourcing & Bids', icon: ShoppingCart },
    { id: 'contracts', label: 'Contract Lifecycle', icon: Briefcase },
    { id: 'execution', label: 'POs & Execution', icon: DollarSign },
    { id: 'performance', label: 'Supplier Performance', icon: Award },
  ], []);

  const vendors = state.vendors;
  
  const projectPackages = useMemo(() => 
    state.procurementPackages.filter(p => p.projectId === projectId)
  , [state.procurementPackages, projectId]);

  const projectSolicitations = useMemo(() => 
    state.solicitations.filter(s => s.projectId === projectId)
  , [state.solicitations, projectId]);

  const projectContracts = useMemo(() => 
    state.contracts.filter(c => c.projectId === projectId)
  , [state.contracts, projectId]);

  const projectPOs = useMemo(() => 
    state.purchaseOrders.filter(po => po.projectId === projectId)
  , [state.purchaseOrders, projectId]);

  const projectClaims = useMemo(() => 
    state.claims.filter(c => c.projectId === projectId)
  , [state.claims, projectId]);

  const supplierReviews = useMemo(() => 
    state.supplierReviews.filter(r => r.projectId === projectId)
  , [state.supplierReviews, projectId]);

  return {
    activeView,
    setActiveView,
    navItems,
    vendors,
    projectPackages,
    projectSolicitations,
    projectContracts,
    projectPOs,
    projectClaims,
    supplierReviews
  };
};
