
import React, { useState, useMemo, useTransition } from 'react';
import { Users, BarChart2, Box, ArrowRightLeft } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useI18n } from '../context/I18nContext';
import { ErrorBoundary } from './ErrorBoundary';
import { TabbedLayout } from './layout/standard/TabbedLayout';
import { NavGroup } from './common/ModuleNavigation';

import ResourcePool from './resources/ResourcePool';
import ResourceCapacity from './resources/ResourceCapacity';
import PhysicalResources from './resources/PhysicalResources';
import ResourceNegotiationHub from './resources/ResourceNegotiationHub';

const EnterpriseResources: React.FC = () => {
    const { state } = useData();
    const { t } = useI18n();
    const [activeGroup, setActiveGroup] = useState('overview');
    const [activeView, setActiveView] = useState('pool');
    const [isPending, startTransition] = useTransition();

    const navGroups: NavGroup[] = useMemo(() => [
        { id: 'overview', label: t('res.human', 'Human Capital'), items: [
            { id: 'pool', label: t('res.pool', 'Global Pool'), icon: Users },
            { id: 'capacity', label: t('res.capacity', 'Capacity Heatmap'), icon: BarChart2 },
            { id: 'negotiation', label: t('res.negotiation', 'Negotiation Hub'), icon: ArrowRightLeft },
        ]},
        { id: 'assets', label: t('res.assets', 'Physical Assets'), items: [
            { id: 'physical', label: t('res.material', 'Equipment & Material'), icon: Box },
        ]}
    ], [t]);

    const handleGroupChange = (groupId: string) => {
        const group = navGroups.find(g => g.id === groupId);
        if (group?.items.length) {
            startTransition(() => {
                setActiveGroup(groupId);
                setActiveView(group.items[0].id);
            });
        }
    };

    const renderContent = () => {
        switch(activeView) {
            case 'pool': return <ResourcePool resources={state.resources} />;
            case 'capacity': return <ResourceCapacity projectResources={state.resources} />;
            case 'negotiation': return <ResourceNegotiationHub />;
            case 'physical': return <PhysicalResources />;
            default: return <ResourcePool resources={state.resources} />;
        }
    };

    return (
        <TabbedLayout
            title={t('nav.resources', 'Enterprise Resources')}
            subtitle={t('res.subtitle', 'Global registry of organizational capital.')}
            icon={Users}
            navGroups={navGroups}
            activeGroup={activeGroup}
            activeItem={activeView}
            onGroupChange={handleGroupChange}
            onItemChange={setActiveView}
        >
            <div className={`flex-1 overflow-hidden relative transition-opacity duration-200 ${isPending ? 'opacity-70' : 'opacity-100'}`}>
                <ErrorBoundary name="Global Resources">
                    {renderContent()}
                </ErrorBoundary>
            </div>
        </TabbedLayout>
    );
};
export default EnterpriseResources;
