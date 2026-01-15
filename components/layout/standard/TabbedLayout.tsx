
import React from 'react';
import { PageLayout } from './PageLayout';
import { PanelContainer } from './PanelContainer';
import { ModuleNavigation, NavGroup } from '../../common/ModuleNavigation';
import { LucideIcon } from 'lucide-react';

interface TabbedLayoutProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  actions?: React.ReactNode;
  navGroups: NavGroup[];
  activeGroup: string;
  activeItem: string;
  onGroupChange: (group: string) => void;
  onItemChange: (item: string) => void;
  children: React.ReactNode;
}

export const TabbedLayout: React.FC<TabbedLayoutProps> = ({
  title,
  subtitle,
  icon,
  actions,
  navGroups,
  activeGroup,
  activeItem,
  onGroupChange,
  onItemChange,
  children
}) => {
  return (
    <PageLayout title={title} subtitle={subtitle} icon={icon} actions={actions}>
      <PanelContainer
        header={
          <ModuleNavigation 
            groups={navGroups}
            activeGroup={activeGroup}
            activeItem={activeItem}
            onGroupChange={onGroupChange}
            onItemChange={onItemChange}
            className="bg-transparent border-0 shadow-none"
          />
        }
      >
        {children}
      </PanelContainer>
    </PageLayout>
  );
};
