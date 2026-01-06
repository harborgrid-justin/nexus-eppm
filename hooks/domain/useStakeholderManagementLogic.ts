
import { useState, useMemo } from 'react';
import { useProjectWorkspace } from '../../context/ProjectWorkspaceContext';
import { EnrichedStakeholder, EngagementLevel } from '../../types/index';

export const useStakeholderManagementLogic = () => {
    const { project, stakeholders: rawStakeholders } = useProjectWorkspace();
    const [activeTab, setActiveTab] = useState<'dashboard' | 'register' | 'analysis' | 'engagement' | 'financial'>('dashboard');
    
    const stakeholders: EnrichedStakeholder[] = useMemo(() => {
        return (rawStakeholders || []).map((s, i) => ({
          id: s.id,
          name: s.name,
          role: s.role,
          organization: i % 2 === 0 ? 'Internal' : 'Client Corp',
          category: i === 0 ? 'Internal' : 'External',
          interest: s.interest === 'High' ? 9 : s.interest === 'Medium' ? 5 : 2,
          power: s.influence === 'High' ? 9 : s.influence === 'Medium' ? 5 : 2,
          support: s.engagementStrategy === 'Manage Closely' ? 2 : 4,
          engagement: {
            current: project?.stakeholderEngagement?.find(e => e.stakeholderId === s.id)?.currentLevel || 'Neutral',
            desired: project?.stakeholderEngagement?.find(e => e.stakeholderId === s.id)?.desiredLevel || 'Supportive',
          },
          financialAuthority: {
            limit: s.influence === 'High' ? 500000 : 10000,
            ccbMember: s.influence === 'High',
            costInfluence: s.influence as 'High' | 'Medium' | 'Low'
          }
        }));
    }, [rawStakeholders, project]);

    return {
        project,
        activeTab,
        setActiveTab,
        stakeholders
    };
};
