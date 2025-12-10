import React from 'react';
import { Project } from '../types';
import { ChevronRight, MoreHorizontal, Calendar, DollarSign, TrendingUp, AlertCircle } from 'lucide-react';
import { calculateProjectProgress } from '../utils/calculations';
import { usePortfolioState } from '../hooks';

interface ProjectListProps {
  onSelectProject: (projectId: string) => void;
}

const ProjectList: React.FC<ProjectListProps> = ({ onSelectProject }) => {
  const { projects } = usePortfolioState();

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-full overflow-hidden flex flex-col">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Projects</h1>
          <p className="text-slate-500">Manage and monitor all active projects across the enterprise.</p>
        </div>
        <div className="flex gap-2">
           <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">Filter</button>
           <button className="px-4 py-2 bg-nexus-600 rounded-lg text-sm font-medium text-white hover:bg-nexus-700">Create Project</button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
          <div className="flex items-center gap-2">
             <span className="text-sm font-semibold text-slate-600">View:</span>
             <select className="bg-white border border-slate-300 text-slate-700 text-sm rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-nexus-500">
               <option>All Projects</option>
               <option>My Projects</option>
               <option>Critical Health</option>
             </select>
          </div>
          <div className="relative">
             <input type="text" placeholder="Search by name or code..." className="pl-3 pr-8 py-1.5 border border-slate-300 rounded-md text-sm focus:ring-1 focus:ring-nexus-500 focus:outline-none w-64" />
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50 sticky top-0 z-10 shadow-sm">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider w-16">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Project Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Manager</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Schedule</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider w-48">Progress</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Budget</th>
                <th scope="col" className="px-6 py-3 w-10"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
              {projects.map((project) => {
                const progress = calculateProjectProgress(project);
                return (
                  <tr 
                    key={project.id} 
                    className="hover:bg-slate-50 group cursor-pointer transition-colors"
                    onClick={() => onSelectProject(project.id)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                       <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                         project.health === 'Good' ? 'bg-green-100 text-green-800 border-green-200' :
                         project.health === 'Warning' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                         'bg-red-100 text-red-800 border-red-200'
                       }`}>
                         {project.health}
                       </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-slate-900 group-hover:text-nexus-700 transition-colors">{project.name}</span>
                        <span className="text-xs text-slate-500 font-mono">{project.code}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                       <div className="flex items-center gap-2">
                         <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                            {project.manager.split(' ').map(n => n[0]).join('')}
                         </div>
                         <span className="text-sm text-slate-700">{project.manager}</span>
                       </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col text-sm text-slate-600">
                        <span className="flex items-center gap-1.5"><Calendar size={12} className="text-slate-400"/> {new Date(project.startDate).toLocaleDateString()}</span>
                        <span className="flex items-center gap-1.5"><ChevronRight size={12} className="text-slate-400"/> {new Date(project.endDate).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 align-middle">
                      <div className="w-full">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="font-medium text-slate-700">{progress}% Complete</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div 
                            className={`h-2 rounded-full ${project.health === 'Critical' ? 'bg-red-500' : 'bg-nexus-500'}`} 
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                       <div className="text-sm font-medium text-slate-900">${(project.budget / 1000000).toFixed(1)}M</div>
                       <div className="text-xs text-slate-500">${(project.spent / 1000000).toFixed(1)}M spent</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-slate-400">
                       <button className="p-1 hover:bg-slate-200 rounded text-slate-500">
                         <MoreHorizontal size={16} />
                       </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {/* Footer Pagination (Mock) */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-3 flex items-center justify-between">
           <span className="text-xs text-slate-500">Showing 1 to {projects.length} of {projects.length} projects</span>
           <div className="flex gap-1">
              <button className="px-2 py-1 border border-slate-300 bg-white rounded text-xs text-slate-600 disabled:opacity-50" disabled>Previous</button>
              <button className="px-2 py-1 border border-slate-300 bg-white rounded text-xs text-slate-600 disabled:opacity-50" disabled>Next</button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectList;