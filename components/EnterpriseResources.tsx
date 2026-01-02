
import React, { useState, useMemo, useTransition } from 'react';
import { Users, BarChart2, Box } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useTheme } from '../context/ThemeContext';
import { PageHeader } from './common/PageHeader';
import { ModuleNavigation, NavGroup } from './common/ModuleNavigation';
import { ErrorBoundary } from './ErrorBoundary';

import ResourcePool from './resources/ResourcePool';
import ResourceCapacity from './resources/ResourceCapacity';
import PhysicalResources from './resources/PhysicalResources';

const EnterpriseResources: React.FC = () => {
    const { state } = useData();
    const theme = useTheme();
    const [activeGroup, setActiveGroup] = useState('overview');
    const [activeView, setActiveView] = useState('pool');
    const [isPending, startTransition] = useTransition();

    const navGroups: NavGroup[] = useMemo(() => [
        { id: 'overview', label: 'Human Resources', items: [
            { id: 'pool', label: 'Global Pool', icon: Users },
            { id: 'capacity', label: 'Capacity Heatmap', icon: BarChart2 },
        ]},
        { id: 'assets', label: 'Physical Assets', items: [
            { id: 'physical', label: 'Equipment & Material', icon: Box },
        ]}
    ], []);

    const handleGroupChange = (groupId: string) => {
        const newGroup = navGroups.find(g => g.id === groupId);
        if (newGroup?.items.length) {
            startTransition(() => {
                setActiveGroup(groupId);
                setActiveView(newGroup.items[0].id);
            });
        }
    };

    const handleItemChange = (itemId: string) => {
        startTransition(() => {
            setActiveView(itemId);
        });
    };

    const renderContent = () => {
        switch(activeView) {
            case 'pool': return <ResourcePool resources={state.resources} />;
            case 'capacity': return <ResourceCapacity projectResources={state.resources} />;
            case 'physical': return <PhysicalResources />;
            default: return <ResourcePool resources={state.resources} />;
        }
    };

    return (
        <div className={`${theme.layout.pageContainer} ${theme.layout.pagePadding} ${theme.layout.sectionSpacing} flex flex-col h-full`}>
            <PageHeader 
                title="Enterprise Resources" 
                subtitle="Global registry of human capital, equipment, and material assets."
                icon={Users}
            />
            
            <div className={theme.layout.panelContainer}>
                <div className={`flex-shrink-0 z-10 rounded-t-xl overflow-hidden ${theme.layout.headerBorder} bg-slate-50/50`}>
                    <ModuleNavigation 
                        groups={navGroups}
                        activeGroup={activeGroup}
                        activeItem={activeView}
                        onGroupChange={handleGroupChange} 
                        onItemChange={handleItemChange}
                        className="bg-transparent border-0 shadow-none"
                    />
                </div>
                <div className={`flex-1 overflow-hidden relative transition-opacity duration-200 ${isPending ? 'opacity-70' : 'opacity-100'}`}>
                    <ErrorBoundary name="Global Resources">
                        {renderContent()}
                    </ErrorBoundary>
                </div>
            </div>
        </div>
    );
};

export default EnterpriseResources;
