
import React, { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Settings, Users, Server, Shield, Bell, CreditCard, UserCog, Tag, 
  Receipt, FileWarning, Banknote, Edit3, Calendar, GitPullRequest, 
  Terminal, Globe, Layers, MapPin, History, RefreshCw, Search, X 
} from 'lucide-react';
import EnterpriseResourceSettings from '../resources/EnterpriseResourceSettings';
import { ActivityCodeSettings } from './ActivityCodeSettings';
import { IssueCodeSettings } from './IssueCodeSettings';
import { ExpenseCategorySettings } from './ExpenseCategorySettings';
import { FundingSourceSettings } from './FundingSourceSettings';
import { UdfSettings } from './UdfSettings';
import UserManagement from './UserManagement';
import SystemConfigPanel from './SystemConfig';
import CalendarEditor from './CalendarEditor';
import WorkflowDesigner from './WorkflowDesigner';
import GlobalChangeWorkbench from './GlobalChangeWorkbench';
import CurrencyRegistry from './CurrencyRegistry';
import GeneralSettings from './GeneralSettings';
import SecuritySettings from './SecuritySettings';
import BillingSettings from './BillingSettings';
import NotificationSettings from './NotificationSettings';
import EpsObsSettings from './EpsObsSettings';
import LocationSettings from './LocationSettings';
import AuditLog from './AuditLog';
import { useTheme } from '../../context/ThemeContext';
import { Button } from '../ui/Button';
import { ErrorBoundary } from '../ErrorBoundary';

const AdminSettings: React.FC = () => {
  const { section = 'general' } = useParams<{ section: string }>();
  const [isApplying, setIsApplying] = useState(false);
  const theme = useTheme();

  const handleGlobalApply = () => {
      setIsApplying(true);
      setTimeout(() => {
          setIsApplying(false);
          alert("Global enterprise parameters synchronized across all projects and programs.");
      }, 1500);
  };

  const navItems = [
    { id: 'general', label: 'General' },
    { id: 'users', label: 'Users & Roles' },
    { id: 'system', label: 'System Config' },
    { id: 'epsobs', label: 'EPS & OBS' },
    { id: 'locations', label: 'Global Locations' },
    { id: 'currencies', label: 'Currencies' },
    { id: 'globalChange', label: 'Global Change' },
    { id: 'calendars', label: 'Enterprise Calendars' },
    { id: 'workflows', label: 'Workflows' },
    { id: 'activityCodes', label: 'Activity Codes' },
    { id: 'udfs', label: 'User-Defined Fields' },
    { id: 'issueCodes', label: 'Issue Codes' },
    { id: 'expenseCategories', label: 'Expense Categories' },
    { id: 'fundingSources', label: 'Funding Sources' },
    { id: 'resources', label: 'Resource Settings'},
    { id: 'security', label: 'Security' },
    { id: 'billing', label: 'Billing' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'audit', label: 'System Audit Log' },
  ];

  const renderContent = () => {
    switch(section) {
      case 'general': return <GeneralSettings />;
      case 'users': return <UserManagement />;
      case 'system': return <SystemConfigPanel />;
      case 'epsobs': return <EpsObsSettings />;
      case 'locations': return <LocationSettings />;
      case 'calendars': return <CalendarEditor />;
      case 'currencies': return <CurrencyRegistry />;
      case 'globalChange': return <GlobalChangeWorkbench />;
      case 'workflows': return <WorkflowDesigner />;
      case 'activityCodes': return <ActivityCodeSettings />;
      case 'udfs': return <UdfSettings />;
      case 'issueCodes': return <IssueCodeSettings />;
      case 'expenseCategories': return <ExpenseCategorySettings />;
      case 'fundingSources': return <FundingSourceSettings />;
      case 'resources': return <EnterpriseResourceSettings />;
      case 'security': return <SecuritySettings />;
      case 'billing': return <BillingSettings />;
      case 'notifications': return <NotificationSettings />;
      case 'audit': return <AuditLog />;
      default: return <GeneralSettings />;
    }
  };

  const currentLabel = navItems.find(n => n.id === section)?.label;

  return (
    <div className={`h-full flex flex-col ${theme.layout.pagePadding}`}>
      <div className={`${theme.components.card} flex-1 flex flex-col overflow-hidden h-full`}>
        
        <header className={`px-8 py-6 border-b border-slate-100 flex justify-between items-center ${theme.colors.surface} sticky top-0 z-10 shrink-0`}>
            <div>
              <h1 className={theme.typography.heading}>{currentLabel}</h1>
              <p className={theme.typography.subtext}>Configure global system logic and enterprise data definitions.</p>
            </div>
            <Button 
              onClick={handleGlobalApply}
              isLoading={isApplying}
              variant="secondary"
              icon={RefreshCw}
            >
              Apply Global Changes
            </Button>
          </header>
          
          <div className={`flex-1 overflow-y-auto p-8 scrollbar-thin ${theme.colors.surface}`}>
            <div className="max-w-6xl mx-auto h-full">
              <ErrorBoundary name={`Admin Section: ${currentLabel}`}>
                  {renderContent()}
              </ErrorBoundary>
            </div>
          </div>
      </div>
    </div>
  );
};

export default AdminSettings;
