import React from 'react';
export * from './list/StandardGridTmpl';
export * from './list/TreeHierarchyTmpl';

export const KanbanBoardTmpl: React.FC = () => <div className="p-8 text-center text-slate-400">Agile Board Template</div>;
export const MasterDetailTmpl: React.FC = () => <div className="p-8 text-center text-slate-400">Master-Detail Template</div>;
export const SplitPaneTmpl: React.FC = () => <div className="p-8 text-center text-slate-400">Split-Pane Template</div>;