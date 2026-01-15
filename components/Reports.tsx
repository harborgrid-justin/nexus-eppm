
import React, { useState } from 'react';
import { FileText, Library, Columns, Presentation } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import PivotAnalytics from './reports/PivotAnalytics';
import { ExecutiveBriefing } from './reports/ExecutiveBriefing';
import { StandardReportLibrary } from './reports/StandardReportLibrary';
import { PageLayout } from './layout/standard/PageLayout';
import { PanelContainer } from './layout/standard/PanelContainer';

const Reports: React.FC = () => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState<'briefing' | 'library' | 'analytics'>('briefing');

  const actions = (
      <div className={`flex ${theme.colors.background} p-1 rounded-lg border ${theme.colors.border}`}>
          <button 
              onClick={() => setActiveTab('briefing')}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-md transition-all ${activeTab === 'briefing' ? `bg-white shadow text-nexus-700` : `${theme.colors.text.secondary} hover:${theme.colors.text.primary}`}`}
          >
              <Presentation size={14}/> Briefing Mode
          </button>
          <button 
              onClick={() => setActiveTab('library')}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-md transition-all ${activeTab === 'library' ? `bg-white shadow text-nexus-700` : `${theme.colors.text.secondary} hover:${theme.colors.text.primary}`}`}
          >
              <Library size={14}/> Standard Reports
          </button>
          <button 
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-md transition-all ${activeTab === 'analytics' ? `bg-white shadow text-nexus-700` : `${theme.colors.text.secondary} hover:${theme.colors.text.primary}`}`}
          >
              <Columns size={14}/> Pivot Analysis
          </button>
      </div>
  );

  return (
    <PageLayout
        title="Intelligence & Reporting"
        subtitle="Executive insights, formal documentation, and ad-hoc analysis."
        icon={FileText}
        actions={actions}
    >
        <PanelContainer>
            <div className="flex-1 overflow-hidden relative h-full">
                {activeTab === 'briefing' && <ExecutiveBriefing />}
                {activeTab === 'library' && <StandardReportLibrary />}
                {activeTab === 'analytics' && <PivotAnalytics />}
            </div>
        </PanelContainer>
    </PageLayout>
  );
};

export default Reports;
