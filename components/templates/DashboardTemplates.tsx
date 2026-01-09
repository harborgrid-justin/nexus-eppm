
import React from 'react';

export * from './dashboards/ExecutiveDashboardTmpl';
export * from './dashboards/ProjectHealthTmpl';
export * from './dashboards/PersonalWorkspaceTmpl';

export const FinancialControllerTmpl: React.FC = () => {
    return <div className="p-12 text-center text-slate-400">Template uses live financial data (see Cost Management module).</div>;
};

export const ResourceCenterTmpl: React.FC = () => {
    return <div className="p-12 text-center text-slate-400">Template uses live resource data (see Resource Management module).</div>;
};
