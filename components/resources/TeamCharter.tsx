
import React from 'react';
import { FileText } from 'lucide-react';
import { Project } from '../../types';

interface TeamCharterProps {
    project: Project | undefined;
}

const TeamCharter: React.FC<TeamCharterProps> = ({ project }) => {
    return (
        <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-200 h-full overflow-y-auto">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2"><FileText className="text-nexus-600"/> Team Charter</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <h3 className="font-bold text-slate-700 mb-2">Team Values</h3>
                    <ul className="list-disc pl-5 text-sm text-slate-600 space-y-1">
                        {project?.teamCharter?.values.map((v, i) => <li key={i}>{v}</li>)}
                        {!project?.teamCharter?.values.length && <li className="italic text-slate-400">No values defined.</li>}
                    </ul>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <h3 className="font-bold text-slate-700 mb-2">Communication Guidelines</h3>
                    <p className="text-sm text-slate-600">{project?.teamCharter?.communicationGuidelines || 'None defined.'}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <h3 className="font-bold text-slate-700 mb-2">Decision-Making Process</h3>
                    <p className="text-sm text-slate-600">{project?.teamCharter?.decisionMakingProcess || 'None defined.'}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <h3 className="font-bold text-slate-700 mb-2">Conflict Resolution</h3>
                    <p className="text-sm text-slate-600">{project?.teamCharter?.conflictResolutionProcess || 'None defined.'}</p>
                </div>
            </div>
        </div>
    );
};

export default TeamCharter;
