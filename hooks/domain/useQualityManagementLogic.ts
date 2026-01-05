import { useMemo, useTransition } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
    LayoutDashboard, FileText, BadgeCheck, ClipboardList, Bug, Truck, Coins 
} from 'lucide-react';
import { NavGroup } from '../../components/common/ModuleNavigation';

export const useQualityManagementLogic = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [isPending, startTransition] = useTransition();
    
    const activeGroup = searchParams.get('qualityGroup') || 'overview';
    const activeView = searchParams.get('view') || 'dashboard';

    const navGroups: NavGroup[] = useMemo(() => [
        { id: 'overview', label: 'Overview', items: [
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard }
        ]},
        { id: 'planning', label: 'Planning', items: [
          { id: 'plan', label: 'Quality Plan', icon: FileText },
          { id: 'standards', label: 'Standards Registry', icon: BadgeCheck },
          { id: 'coq', label: 'Cost of Quality', icon: Coins },
        ]},
        { id: 'assurance', label: 'Assurance & Control', items: [
          { id: 'control', label: 'Control Log', icon: ClipboardList },
          { id: 'supplier', label: 'Supplier Quality', icon: Truck },
        ]},
        { id: 'issues', label: 'Issue Tracking', items: [
          { id: 'defects', label: 'Defect Log (NCR)', icon: Bug },
        ]}
    ], []);

    const handleGroupChange = (groupId: string) => {
        const newGroup = navGroups.find(g => g.id === groupId);
        if (newGroup?.items.length) {
          startTransition(() => {
            const newParams = new URLSearchParams(searchParams);
            newParams.set('qualityGroup', groupId);
            newParams.set('view', newGroup.items[0].id);
            setSearchParams(newParams);
          });
        }
    };
    
    const handleViewChange = (viewId: string) => {
        startTransition(() => {
            const newParams = new URLSearchParams(searchParams);
            newParams.set('view', viewId);
            setSearchParams(newParams);
        });
    };

    return {
        activeGroup,
        activeView,
        isPending,
        navGroups,
        handleGroupChange,
        handleViewChange
    };
};