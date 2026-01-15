
import React, { useState, useMemo, useTransition } from 'react';
import { useProjectWorkspace } from '../context/ProjectWorkspaceContext';
import { ErrorBoundary } from './ErrorBoundary';
import ProcurementDashboard from './procurement/ProcurementDashboard';
import VendorRegistry from './procurement/VendorRegistry';
import ContractLifecycle from './procurement/ContractLifecycle';
import ProcurementPlanning from './procurement/ProcurementPlanning';
import ProcurementSourcing from './procurement/ProcurementSourcing';
import ProcurementExecution from './procurement/ProcurementExecution';
import SupplierPerformance from './procurement/SupplierPerformance';
import { ShoppingCart, FileText, DollarSign, Award, Users, Briefcase, LayoutDashboard, Scale, ListChecks } from 'lucide-react';
import { EmptyGrid } from './common/EmptyGrid';
import { TabbedLayout } from './layout/standard/TabbedLayout';
import { NavGroup } from './common/ModuleNavigation';

const ProcurementManagement: React.FC = () => {
  const { project } = useProjectWorkspace();

  const [activeGroup, setActiveGroup] = useState('overview');
  const [activeView, setActiveView] = useState('dashboard');
  const [isPending, startTransition] = useTransition();

  if (!project) return (
    <div className="p-8 h-full flex flex-col items-center justify-center">
        <EmptyGrid 
            title="Procurement Context Restricted"
            description="Bridge this workspace to a procurement entity to manage supply chain logistics."
            icon={ShoppingCart}
        />
    </div>
  );

  const projectId = project.id;
  
  const navStructure: NavGroup[] = useMemo(() => [
    { id: 'overview', label: 'Overview', items: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard }
    ]},
    { id: 'pre-award', label: 'Pre-Award', items: [
      { id: 'planning', label: 'Planning', icon: FileText },
      { id: 'makebuy', label: 'Make-or-Buy', icon: Scale },
      { id: 'vendors', label: 'Vendor Registry', icon: Users },
      { id: 'criteria', label: 'Source Selection', icon: ListChecks },
      { id: 'sourcing', label: 'Sourcing', icon: ShoppingCart },
    ]},
    { id: 'post-award', label: 'Post-Award', items: [
      { id: 'contracts', label: 'Contracts', icon: Briefcase },
      { id: 'execution', label: 'Execution & POs', icon: DollarSign },
    ]},
    { id: 'analysis', label: 'Analysis', items: [
      { id: 'performance', label: 'Performance', icon: Award },
    ]}
  ], []);

  const handleGroupChange = (groupId: string) => {
    const newGroup = navStructure.find(g => g.id === groupId);
    if (newGroup?.items.length) {
      startTransition(() => {
        setActiveGroup(groupId);
        setActiveView(newGroup.items[0].id);
      });
    }
  };
  
  const handleViewChange = (viewId: string) => {
      startTransition(() => {
          setActiveView(viewId);
      });
  };

  const renderContent = () => {
    switch (activeView) {
        case 'dashboard': return <ProcurementDashboard />;
        case 'vendors': return <VendorRegistry projectId={projectId} />;
        case 'contracts': return <ContractLifecycle projectId={projectId} />;
        case 'makebuy': return (
            <div className="h-full flex items-center justify-center p-12">
                <EmptyGrid 
                    title="Make-or-Buy Analysis Undefined" 
                    description="Conduct strategic analysis to determine whether deliverables should be manufactured internally or outsourced."
                    icon={Scale}
                    actionLabel="Start Analysis"
                    onAdd={() => {}}
                />
            </div>
        );
        case 'criteria': return (
            <div className="h-full flex items-center justify-center p-12">
                <EmptyGrid 
                    title="Source Selection Criteria" 
                    description="Define weighted technical and financial criteria for evaluating vendor solicitations."
                    icon={ListChecks}
                    actionLabel="Define Criteria"
                    onAdd={() => {}}
                />
            </div>
        );
        case 'planning': return <ProcurementPlanning projectId={projectId} />;
        case 'sourcing': return <ProcurementSourcing projectId={projectId} />;
        case 'execution': return <ProcurementExecution projectId={projectId} />;
        case 'performance': return <SupplierPerformance projectId={projectId} />;
        default: return <ProcurementDashboard />;
    }
  };

  return (
    <TabbedLayout
        title="Procurement Management"
        subtitle="End-to-end procurement lifecycle from planning to performance."
        icon={ShoppingCart}
        navGroups={navStructure}
        activeGroup={activeGroup}
        activeItem={activeView}
        onGroupChange={handleGroupChange}
        onItemChange={handleViewChange}
    >
        <div className={`flex-1 overflow-hidden transition-opacity duration-200 ${isPending ? 'opacity-70' : 'opacity-100'}`}>
            <ErrorBoundary name="Procurement Module">
                {renderContent()}
            </ErrorBoundary>
        </div>
    </TabbedLayout>
  );
};

export default ProcurementManagement;
