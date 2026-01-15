import React from 'react';
import { BPRecord, BPDefinition } from '../../types/unifier';
import { BPRecordRow } from './BPRecordRow';
import { EmptyGrid } from '../common/EmptyGrid';
import { Briefcase, Layers, Table } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useI18n } from '../../context/I18nContext';

interface Props {
  records: BPRecord[];
  activeDefinition: BPDefinition | undefined;
  onEdit: (r: BPRecord) => void;
  onCreate: () => void;
}

export const BPList: React.FC<Props> = ({ records, activeDefinition, onEdit, onCreate }) => {
  const theme = useTheme();
  const { t } = useI18n();

  if (!activeDefinition) {
      return (
          <div className={`flex-1 flex flex-col items-center justify-center nexus-empty-pattern bg-white p-12`}>
              <div className="w-20 h-20 bg-slate-50 rounded-3xl border border-slate-200 shadow-xl flex items-center justify-center text-slate-300 mb-8 rotate-3 hover:rotate-0 transition-transform duration-500">
                  <Table size={40} strokeWidth={1}/>
              </div>
              <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter mb-2">Schema Not Loaded</h3>
              <p className={`text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px] max-w-xs text-center leading-relaxed`}>{t('unifier.select_schema', 'Select a process schema from the orchestrator to initialize the record buffer.')}</p>
          </div>
      );
  }

  if (!records || records.length === 0) {
    return (
      <EmptyGrid 
        title={t('unifier.empty_log', `${activeDefinition.name} Ledger Empty`)}
        description={t('unifier.empty_log_desc', `The transactional log for the ${activeDefinition.prefix} sequence contains zero records in this project partition.`)}
        onAdd={onCreate}
        actionLabel={t('unifier.create_record', `Initialize New ${activeDefinition.prefix}`)}
        icon={Briefcase}
      />
    );
  }

  return (
    <div className={`flex-1 overflow-auto bg-white animate-nexus-in scrollbar-thin`}>
      <table className="min-w-full divide-y divide-slate-100 border-separate border-spacing-0">
        <thead className={`bg-slate-50 sticky top-0 z-20 shadow-sm border-b`}>
          <tr>
            <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{t('unifier.col_id', 'Record ID')}</th>
            <th className="px-6 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{t('unifier.col_subject', 'Subject Narrative')}</th>
            <th className="px-6 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{t('unifier.col_workflow', 'Workflow Status')}</th>
            {activeDefinition.fields.slice(0, 3).map(f => (
              <th key={f.key} className="px-6 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{String(f.label)}</th>
            ))}
          </tr>
        </thead>
        <tbody className={`divide-y divide-slate-50`}>
          {records.map(r => (
            <BPRecordRow 
                key={r.id} record={r} 
                fields={activeDefinition.fields.slice(0, 3)} 
                onClick={() => onEdit(r)} 
            />
          ))}
          {[...Array(5)].map((_, i) => (
              <tr key={`pad-${i}`} className="nexus-empty-pattern opacity-10 h-16 pointer-events-none">
                  <td colSpan={10}></td>
              </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};