
import React from 'react';
import { BPRecord, BPDefinition } from '../../types/unifier';
import { BPRecordRow } from './BPRecordRow';
import { EmptyGrid } from '../common/EmptyGrid';
import { Briefcase, Layers } from 'lucide-react';
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
          <div className={`flex-1 flex flex-col items-center justify-center nexus-empty-pattern ${theme.colors.background}`}>
              <Layers size={48} className={`${theme.colors.text.tertiary} mb-4 opacity-20`} />
              <p className={`${theme.colors.text.tertiary} font-bold uppercase tracking-widest text-xs`}>{t('unifier.select_schema', 'Select Schema...')}</p>
          </div>
      );
  }

  if (!records || records.length === 0) {
    return (
      <EmptyGrid 
        title={t('unifier.empty_log', `${activeDefinition.name} Log Empty`)}
        description={t('unifier.empty_log_desc', 'Registry unpopulated.')}
        onAdd={onCreate}
        actionLabel={t('unifier.create_record', 'Initialize')}
        icon={Briefcase}
      />
    );
  }

  return (
    <div className={`flex-1 overflow-auto ${theme.colors.surface} animate-nexus-in`}>
      <table className="min-w-full divide-y divide-slate-200 border-separate border-spacing-0">
        <thead className={`${theme.colors.background} sticky top-0 z-20 shadow-sm`}>
          <tr>
            <th className={theme.components.table.header}>{t('unifier.col_id', 'ID Ref')}</th>
            <th className={theme.components.table.header}>{t('unifier.col_subject', 'Subject')}</th>
            <th className={theme.components.table.header}>{t('unifier.col_workflow', 'Workflow')}</th>
            {activeDefinition.fields.slice(0, 2).map(f => (
              <th key={f.key} className={theme.components.table.header}>{String(f.label)}</th>
            ))}
          </tr>
        </thead>
        <tbody className={`divide-y ${theme.colors.border.replace('border-','divide-')}`}>
          {records.map(r => (
            <BPRecordRow 
                key={r.id} record={r} 
                fields={activeDefinition.fields.slice(0, 2)} 
                onClick={() => onEdit(r)} 
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};
