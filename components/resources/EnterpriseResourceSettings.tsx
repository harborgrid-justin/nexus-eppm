import React, { useState } from 'react';
import { UserCog, Plus, Book, Star } from 'lucide-react';

const EnterpriseResourceSettings: React.FC = () => {
    const [activeTab, setActiveTab] = useState('roles');

    return (
        <div className="space-y-6 max-w-4xl">
            <div>
                <h3 className="text-lg font-medium text-slate-900">Enterprise Resource Configuration</h3>
                <p className="text-sm text-slate-500 mt-1">Define standardized roles, skills, and calendars for your organization.</p>
            </div>
            
            <div className="border-b border-slate-200">
                <nav className="-mb-px flex space-x-6">
                    <button onClick={() => setActiveTab('roles')} className={`py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'roles' ? 'border-nexus-500 text-nexus-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>Roles & Competencies</button>
                    <button onClick={() => setActiveTab('skills')} className={`py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'skills' ? 'border-nexus-500 text-nexus-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>Skills Catalog</button>
                    <button onClick={() => setActiveTab('calendars')} className={`py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'calendars' ? 'border-nexus-500 text-nexus-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>Default Calendars</button>
                </nav>
            </div>

            <div className="pt-4">
                {activeTab === 'roles' && (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <p className="text-sm text-slate-600">Define standard job roles and their required skill sets.</p>
                            <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-300 text-sm rounded-md hover:bg-slate-50"><Plus size={14}/> Add Role</button>
                        </div>
                        {/* Mock data for roles */}
                        <div className="p-3 border rounded-md">
                            <p className="font-semibold">Senior Engineer</p>
                            <p className="text-xs text-slate-500">Required: <span className="font-mono bg-slate-100 p-1 rounded">SK-CIV-03</span>, <span className="font-mono bg-slate-100 p-1 rounded">SK-AUTOCAD-02</span></p>
                        </div>
                         <div className="p-3 border rounded-md">
                            <p className="font-semibold">Project Coordinator</p>
                             <p className="text-xs text-slate-500">Required: <span className="font-mono bg-slate-100 p-1 rounded">SK-ADMIN-01</span></p>
                        </div>
                    </div>
                )}
                 {activeTab === 'skills' && (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <p className="text-sm text-slate-600">Manage a central library of skills and certifications.</p>
                            <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-300 text-sm rounded-md hover:bg-slate-50"><Plus size={14}/> Add Skill</button>
                        </div>
                        {/* Mock data for skills */}
                        <div className="p-3 border rounded-md flex justify-between items-center">
                            <div>
                                <p className="font-semibold">AutoCAD Proficiency</p>
                                <p className="text-xs text-slate-500">Category: Software</p>
                            </div>
                            <p className="font-mono text-sm bg-slate-100 px-2 py-1 rounded">SK-AUTOCAD-02</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EnterpriseResourceSettings;
