
import React, { useState } from 'react';
import { FileText, Eye, Download, Play, ListFilter, Columns, FileSearch, Presentation, Library } from 'lucide-react';
import { PageHeader } from './common/PageHeader';
import { useTheme } from '../context/ThemeContext';
import { Button } from './ui/Button';
import PivotAnalytics from './reports/PivotAnalytics';
import { ExecutiveBriefing } from './reports/ExecutiveBriefing';
import { StandardReportLibrary } from './reports/StandardReportLibrary';

const Reports: React.FC = () => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState<'briefing' | 'library' | 'analytics'>('briefing');

  return (
    <div className={`${theme.layout.pageContainer} ${theme.layout.pagePadding} space-y-4 flex flex-col h-full`}>
      <PageHeader 
        title="Intelligence & Reporting" 
        subtitle="Executive insights, formal documentation, and ad-hoc analysis."
        icon={FileText}
        actions={
            <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
                <button 
                    onClick={() => setActiveTab('briefing')}
                    className={`flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-md transition-all ${activeTab === 'briefing' ? 'bg-white shadow text-nexus-700' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    <Presentation size={14}/> Briefing Mode
                </button>
                <button 
                    onClick={() => setActiveTab('library')}
                    className={`flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-md transition-all ${activeTab === 'library' ? 'bg-white shadow text-nexus-700' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    <Library size={14}/> Standard Reports
                </button>
                <button 
                    onClick={() => setActiveTab('analytics')}
                    className={`flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-md transition-all ${activeTab === 'analytics' ? 'bg-white shadow text-nexus-700' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    <Columns size={14}/> Pivot Analysis
                </button>
            </div>
        }
      />
      
      <div className={theme.layout.panelContainer}>
          <div className="flex-1 overflow-hidden relative">
            {activeTab === 'briefing' && <ExecutiveBriefing />}
            {activeTab === 'library' && <StandardReportLibrary />}
            {activeTab === 'analytics' && <PivotAnalytics />}
          </div>
      </div>
    </div>
  );
};

export default Reports;
