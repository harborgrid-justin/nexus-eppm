import React from 'react';
import {
  Users, Shield, BookOpen, BarChart2, Briefcase, FileText, ArrowRight, Layers
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { useTheme } from '../../context/ThemeContext';
import { useData } from '../../context/DataContext';
import { Project } from '../../types';

// --- Scoring Model Logic ---
const SCORING_MODEL = [
  { id: 'strategic', name: 'Strategic Contribution', weight: 0.4, description: 'Alignment with core business objectives.' },
  { id: 'financial', name: 'Financial Value (ROI)', weight: 0.3, description: 'Expected return on investment.' },
  { id: 'risk', name: 'Risk Level (Inverse)', weight: 0.2, description: 'Lower risk scores higher.' },
  { id: 'feasibility', name: 'Resource Feasibility', weight: 0.1, description: 'Availability of skills and resources.' },
];

const MOCK_PROJECT_SCORES: Record<string, Record<string, number>> = {
  'P1001': { strategic: 9, financial: 7, risk: 4, feasibility: 6 },
  'P1002': { strategic: 6, financial: 8, risk: 8, feasibility: 7 },
};

const calculateScore = (scores: Record<string, number>): number => {
  const totalScore = SCORING_MODEL.reduce((acc, criterion) => {
    // For 'risk', a lower input is better, so we invert it for scoring (10 - score)
    const score = criterion.id === 'risk' ? 10 - (scores[criterion.id] || 0) : (scores[criterion.id] || 0);
    return acc + (score / 10) * criterion.weight;
  }, 0);
  return Math.round(totalScore * 100);
};

// --- Portfolio Categories ---
const PORTFOLIO_CATEGORIES: Record<string, string[]> = {
  'Innovation & Growth': ['P1001'],
  'Operational Efficiency': ['P1002'],
  'Regulatory & Compliance': [],
  'Keep the Lights On': []
};

const PortfolioStrategyFramework: React.FC = () => {
  const theme = useTheme();
  const { state } = useData();

  const getProjectById = (id: string) => state.projects.find(p => p.id === id);

  return (
    <div className={`h-full overflow-y-auto ${theme.layout.pagePadding} space-y-8 animate-in fade-in duration-300`}>
      
      {/* 1. GOVERNANCE */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Shield className="text-nexus-600" size={20} />
          <h2 className={theme.typography.h2}>1. Portfolio Governance & Decision Rights</h2>
        </div>
        <Card className="p-6">
          <h3 className="font-bold text-slate-800 mb-2">Governance Structure & Roles</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
              <h4 className="font-bold flex items-center gap-2"><Users size={16}/> Governance Board</h4>
              <p className="text-xs text-slate-500 mt-1">CEO, CFO, CIO, COO</p>
              <p className="text-sm mt-2">Final authority on portfolio funding and strategic alignment.</p>
            </div>
             <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
              <h4 className="font-bold">Portfolio Sponsor</h4>
               <p className="text-xs text-slate-500 mt-1">Executive Leadership</p>
              <p className="text-sm mt-2">Champions the portfolio and secures resources.</p>
            </div>
             <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
              <h4 className="font-bold">Portfolio Manager</h4>
               <p className="text-xs text-slate-500 mt-1">Sarah Chen</p>
              <p className="text-sm mt-2">Monitors performance and balances the portfolio.</p>
            </div>
          </div>
          
          <h3 className="font-bold text-slate-800 mb-4">Decision & Escalation Path</h3>
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-600">
            <div className="p-2 bg-slate-100 rounded">Proposal</div>
            <ArrowRight size={16} className="text-slate-300" />
            <div className="p-2 bg-slate-100 rounded">Business Case Review</div>
            <ArrowRight size={16} className="text-slate-300" />
            <div className="p-2 bg-slate-100 rounded">Scoring & Prioritization</div>
             <ArrowRight size={16} className="text-slate-300" />
            <div className="p-2 bg-nexus-100 text-nexus-800 rounded">Board Approval</div>
             <ArrowRight size={16} className="text-slate-300" />
            <div className="p-2 bg-green-100 text-green-800 rounded">Execution</div>
          </div>
        </Card>
      </section>

      {/* 2. STRATEGY & ALIGNMENT */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="text-nexus-600" size={20} />
          <h2 className={theme.typography.h2}>2. Portfolio Strategy & Alignment Criteria</h2>
        </div>
        <Card className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="font-bold text-slate-800 mb-2">Strategic Objectives</h3>
              <ul className="space-y-2">
                <li className="p-2 bg-slate-50 rounded">Increase Market Share by 10% in EU</li>
                <li className="p-2 bg-slate-50 rounded">Achieve 15% Operational Efficiency Gain</li>
                <li className="p-2 bg-slate-50 rounded">Meet new ESG Compliance Standards</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-slate-800 mb-2">Portfolio Scoring Model</h3>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 text-left font-semibold">Criteria</th>
                    <th className="py-2 text-center font-semibold">Weight</th>
                  </tr>
                </thead>
                <tbody>
                  {SCORING_MODEL.map(c => (
                    <tr key={c.id} className="border-b border-slate-100">
                      <td className="py-2">{c.name}</td>
                      <td className="py-2 text-center font-mono">{c.weight * 100}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-slate-100">
            <h3 className="font-bold text-slate-800 mb-2">Example Project Evaluation</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 text-left font-semibold">Project</th>
                    {SCORING_MODEL.map(c => <th key={c.id} className="py-2 text-center font-semibold">{c.name}</th>)}
                    <th className="py-2 text-center font-bold bg-slate-100">Weighted Score</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(MOCK_PROJECT_SCORES).map(([projectId, scores]) => {
                    const project = getProjectById(projectId);
                    return (
                      <tr key={projectId} className="border-b border-slate-100">
                        <td className="py-2 font-medium">{project?.name || projectId}</td>
                        {SCORING_MODEL.map(c => <td key={c.id} className="py-2 text-center">{scores[c.id]} / 10</td>)}
                        <td className="py-2 text-center font-bold text-lg text-nexus-700 bg-slate-50">{calculateScore(scores)}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </Card>
      </section>

      {/* 3. COMPONENT STRUCTURE */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Layers className="text-nexus-600" size={20} />
          <h2 className={theme.typography.h2}>3. Portfolio Component Structure</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.entries(PORTFOLIO_CATEGORIES).map(([category, projectIds]) => (
            <Card key={category} className="p-0 overflow-hidden">
              <div className="p-4 bg-slate-50 border-b">
                <h3 className="font-bold text-slate-800">{category}</h3>
              </div>
              <div className="p-4 space-y-2 min-h-[100px]">
                {projectIds.length > 0 ? projectIds.map(id => {
                  const project = getProjectById(id);
                  if (!project) return null;
                  return (
                    <div key={id} className="p-2 border rounded-md bg-white">
                       <p className="text-sm font-medium">{project.name}</p>
                       <div className="flex justify-between items-center mt-1">
                          <span className="text-xs font-mono text-slate-500">{project.code}</span>
                          <Badge variant={project.health === 'Good' ? 'success' : project.health === 'Warning' ? 'warning' : 'danger'}>
                             {project.health}
                          </Badge>
                       </div>
                    </div>
                  )
                }) : <p className="text-sm text-slate-400 italic">No projects in this category.</p>}
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

export default PortfolioStrategyFramework;
