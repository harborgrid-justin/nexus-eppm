import React, { useState, useMemo, useTransition } from 'react';
import { Users, BarChart2, Box, ArrowRightLeft } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useTheme } from '../context/ThemeContext';
import { useI18n } from '../context/I18nContext';
import { PageHeader } from './common/PageHeader';
import { ModuleNavigation, NavGroup } from './common/ModuleNavigation';
import { ErrorBoundary } from './ErrorBoundary';

import ResourcePool from './resources/ResourcePool';
import ResourceCapacity from './resources/ResourceCapacity';
import PhysicalResources from './resources/PhysicalResources';
import ResourceNegotiationHub from './resources/ResourceNegotiationHub';

const EnterpriseResources: React.FC = () => {
    const { state } = useData();
    const theme = useTheme();
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
        <div className={`h-full flex flex-col ${theme.layout.pagePadding} ${theme.colors.background}`}>
            <PageHeader 
                title={t('nav.resources', 'Enterprise Resources')} 
                subtitle={t('res.subtitle', 'Global registry of organizational capital.')}
                icon={Users}
            />
            
            <div className={`mt-8 flex-1 flex flex-col ${theme.colors.surface} rounded-2xl border ${theme.colors.border} shadow-sm overflow-hidden`}>
                <div className={`flex-shrink-0 z-10 border-b ${theme.colors.border} bg-slate-50/50`}>
                    <ModuleNavigation 
                        groups={navGroups} activeGroup={activeGroup} activeItem={activeView}
                        onGroupChange={handleGroupChange} onItemChange={setActiveView}
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