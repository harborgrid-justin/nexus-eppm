
import React from 'react';
import { BPRecord, BPDefinition } from '../../types/unifier';
import { BPRecordRow } from './BPRecordRow';
import { EmptyGrid } from '../common/EmptyGrid';
import { Briefcase } from 'lucide-react';

interface Props {
  records: BPRecord[];
  activeDefinition: BPDefinition | undefined;
  onEdit: (r: BPRecord) => void;
  onCreate: () => void;
}

export const BPList: React.FC<Props> = ({ records, activeDefinition, onEdit, onCreate }) => {
  if (!activeDefinition) {
      return (
          <div className="flex-1 flex items-center justify-center nexus-empty-pattern">
              <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Select a Process Schema...</p>
          </div>
      );
  }

  if (!records || records.length === 0) {
    return (
      <EmptyGrid 
        title={`${activeDefinition.name} Log is Empty`}
        description={`The business process registry for ${activeDefinition.name} has no records. Initialize a new ${activeDefinition.prefix} entry to begin the workflow.`}
        onAdd={onCreate}
        actionLabel={`Create ${activeDefinition.name}`}
        icon={Briefcase}
      />
    );
  }

  return (
    <div className="flex-1 overflow-auto bg-white animate-nexus-in">
      <table className="min-w-full divide-y divide-slate-200 border-separate border-spacing-0" role="grid">
        <thead className="bg-slate-50 sticky top-0 z-20 shadow-sm">
          <tr>
            <th className="px-6 py-3 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-200">ID Ref</th>
            <th className="px-6 py-3 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-200">Subject</th>
            <th className="px-6 py-3 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-200">Workflow Node</th>
            {activeDefinition.fields.slice(0, 2).map(f => (
              <th key={f.key} className="px-6 py-3 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-200">{String(f.label)}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {records.map(r => (
            <BPRecordRow 
                key={r.id} 
                record={r} 
                fields={activeDefinition.fields.slice(0, 2)} 
                onClick={() => onEdit(r)} 
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};
