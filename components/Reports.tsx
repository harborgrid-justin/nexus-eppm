import React, { useState } from 'react';
import { Project } from '../types';
import { generatePortfolioReport } from '../services/geminiService';
import { MOCK_PROJECTS } from '../constants';
import { FileText, Loader2, Sparkles } from 'lucide-react';

interface ReportsProps {
  projects: Project[];
}

const Reports: React.FC<ReportsProps> = ({ projects }) => {
  const [report, setReport] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateReport = async () => {
    setIsLoading(true);
    setError(null);
    setReport(null);
    try {
      const generatedReport = await generatePortfolioReport(projects);
      setReport(generatedReport);
    } catch (e: any) {
      console.error("Failed to generate report:", e);
      setError(`Failed to generate report: ${e.message || 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-full overflow-hidden flex flex-col">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Portfolio Reports</h1>
          <p className="text-slate-500">Generate executive summaries and strategic insights.</p>
        </div>
        <div className="flex gap-2">
           <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">Custom Report Builder</button>
           <button 
             onClick={handleGenerateReport}
             disabled={isLoading}
             className="px-4 py-2 bg-nexus-600 rounded-lg text-sm font-medium text-white hover:bg-nexus-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
           >
             {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
             {isLoading ? "Generating Report..." : "Generate AI Portfolio Report"}
           </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex-1 flex flex-col">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center gap-2 text-slate-700 font-semibold">
          <FileText size={16} /> AI Executive Summary
        </div>
        <div className="flex-1 overflow-y-auto p-6 text-sm text-slate-700 leading-relaxed">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded-lg mb-4">
              <p className="font-medium">Error:</p>
              <p>{error}</p>
            </div>
          )}

          {isLoading && (
            <div className="flex items-center justify-center h-full text-nexus-500">
              <Loader2 className="animate-spin mr-2" size={20} />
              Generating comprehensive portfolio insights... This may take a moment.
            </div>
          )}

          {report ? (
            <div className="prose prose-sm max-w-none">
              <pre className="whitespace-pre-wrap font-sans text-sm">{report}</pre>
            </div>
          ) : !isLoading && !error && (
            <div className="flex items-center justify-center h-full text-slate-400">
              <div className="text-center">
                 <h2 className="text-xl font-bold mb-2">Ready for Insights?</h2>
                 <p>Click "Generate AI Portfolio Report" to get a comprehensive overview.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;
