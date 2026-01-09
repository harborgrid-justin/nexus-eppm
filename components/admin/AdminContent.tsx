
import React from 'react';
import GeneralSettings from './GeneralSettings';
import UserManagement from './UserManagement';
import SecuritySettings from './SecuritySettings';
import NotificationSettings from './NotificationSettings';
import BillingSettings from './BillingSettings';
import AuditLog from './AuditLog';
import EpsObsSettings from './EpsObsSettings';
import CalendarEditor from './CalendarEditor';
import LocationSettings from './LocationSettings';
import EnterpriseResourceSettings from '../resources/EnterpriseResourceSettings';
import { ActivityCodeSettings } from './ActivityCodeSettings';
import { UdfSettings } from './UdfSettings';
import { IssueCodeSettings } from './IssueCodeSettings';
import { ExpenseCategorySettings } from './ExpenseCategorySettings';
import { FundingSourceSettings } from './FundingSourceSettings';
import WorkflowDesigner from './WorkflowDesigner';
import GlobalChangeWorkbench from './GlobalChangeWorkbench';

interface AdminContentProps {
    activeView: string;
}

export const AdminContent: React.FC<AdminContentProps> = ({ activeView }) => {
    switch(activeView) {
      // System
      case 'general': return <GeneralSettings />;
      case 'users': return <UserManagement />;
      case 'security': return <SecuritySettings />;
      case 'notifications': return <NotificationSettings />;
      case 'billing': return <BillingSettings />;
      case 'audit': return <AuditLog />;
      
      // Enterprise
      case 'epsobs': return <EpsObsSettings />;
      case 'calendars': return <CalendarEditor />;
      case 'locations': return <LocationSettings />;
      case 'resources': return <EnterpriseResourceSettings />;

      // Dictionaries
      case 'activityCodes': return <ActivityCodeSettings />;
      case 'udfs': return <UdfSettings />;
      case 'issueCodes': return <IssueCodeSettings />;
      case 'expenseCategories': return <ExpenseCategorySettings />;
      case 'fundingSources': return <FundingSourceSettings />;

      // Automation
      case 'workflows': return <WorkflowDesigner />;
      case 'globalChange': return <GlobalChangeWorkbench />;
      
      default: return <div>Select a setting to configure.</div>;
    }
};
