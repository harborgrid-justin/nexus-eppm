
import React from 'react';

const TemplatePlaceholder: React.FC<{ title: string }> = ({ title }) => (
    <div className="flex items-center justify-center h-full bg-slate-50 text-slate-400">
        <div className="text-center">
            <h3 className="font-bold text-slate-600">{title}</h3>
            <p className="text-xs">Component not implemented.</p>
        </div>
    </div>
);

export const TeamDirectoryTmpl: React.FC = () => <TemplatePlaceholder title="Team Directory" />;
export const ProjectWikiTmpl: React.FC = () => <TemplatePlaceholder title="Project Wiki" />;
export const DiscussionThreadTmpl: React.FC = () => <TemplatePlaceholder title="Discussion Thread" />;
export const NotificationCenterTmpl: React.FC = () => <TemplatePlaceholder title="Notification Center" />;
export const MeetingMinutesTmpl: React.FC = () => <TemplatePlaceholder title="Meeting Minutes" />;
export const WorkflowDesignerTmpl: React.FC = () => <TemplatePlaceholder title="Workflow Designer" />;
export const IntegrationStatusTmpl: React.FC = () => <TemplatePlaceholder title="Integration Status" />;
export const AuditLogViewerTmpl: React.FC = () => <TemplatePlaceholder title="Audit Log Viewer" />;
export const UserProvisioningTmpl: React.FC = () => <TemplatePlaceholder title="User Provisioning" />;
export const CustomFieldBuilderTmpl: React.FC = () => <TemplatePlaceholder title="Custom Field Builder" />;
