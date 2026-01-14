
import React from 'react';
import { BPRecord, BPDefinition } from '../../types/unifier';
import { BPRecordRow } from './BPRecordRow';
import { EmptyGrid } from '../common/EmptyGrid';
import { Briefcase } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface Props {
  records: BPRecord[];
  activeDefinition: BPDefinition | undefined;
  onEdit: (r: BPRecord) => void;
  onCreate: () => void;
}

export const BPList: React.FC<Props> = ({ records, activeDefinition, onEdit, onCreate }) => {
  const theme = useTheme();

  if (!activeDefinition) {
      return (
          <div className="flex-1 flex items-center justify-center nexus-empty-pattern">
              <p className={`text-slate-400 font-bold uppercase tracking-widest text-xs`}>Select a Process Schema...</p>
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
    <div className={`flex-1 overflow-auto ${theme.colors.surface} animate-nexus-in`}>
      <table className="min-w-full divide-y divide-slate-200 border-separate border-spacing-0" role="grid">
        <thead className={`${theme.colors.background} sticky top-0 z-20 shadow-sm`}>
          <tr>
            <th className={theme.components.table.header}>ID Ref</th>
            <th className={theme.components.table.header}>Subject</th>
            <th className={theme.components.table.header}>Workflow Node</th>
            {activeDefinition.fields.slice(0, 2).map(f => (
              <th key={f.key} className={theme.components.table.header}>{String(f.label)}</th>
            ))}
          </tr>
        </thead>
        <tbody className={`divide-y ${theme.colors.border.replace('border-','divide-')}`}>
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
