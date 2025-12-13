
import { Project } from '../types';

export const flattenProjectsToCSV = (projects: Project[]): string => {
  const headers = ['Project Code', 'Project Name', 'Manager', 'WBS', 'Task ID', 'Task Name', 'Start Date', 'End Date', 'Status', 'Progress', 'Budget', 'Spent'];
  const rows = projects.flatMap(p => 
    p.tasks.length > 0 ? p.tasks.map(t => [
      p.code,
      p.name,
      p.manager,
      t.wbsCode,
      t.id,
      t.name,
      t.startDate,
      t.endDate,
      t.status,
      t.progress + '%',
      p.budget,
      p.spent
    ]) : [[
      p.code,
      p.name,
      p.manager,
      '',
      '',
      '',
      p.startDate,
      p.endDate,
      p.health,
      '0%',
      p.budget,
      p.spent
    ]]
  );
  
  // Escape quotes and join
  const csvContent = [
    headers.join(','), 
    ...rows.map(r => r.map(c => `"${String(c || '').replace(/"/g, '""')}"`).join(','))
  ].join('\n');

  return csvContent;
};

export const generateP6XML = (projects: Project[]): string => {
  return `<?xml version="1.0" encoding="UTF-8"?>
<PLANT>
  <PROJECTS>
    ${projects.map(p => `
    <PROJECT>
      <ObjectId>${p.id}</ObjectId>
      <Id>${p.code}</Id>
      <Name>${p.name}</Name>
      <StartDate>${p.startDate}T00:00:00</StartDate>
      <FinishDate>${p.endDate}T00:00:00</FinishDate>
      <Status>${p.health}</Status>
      <TASKS>
        ${p.tasks.map(t => `
        <TASK>
          <ObjectId>${t.id}</ObjectId>
          <WBSCode>${t.wbsCode}</WBSCode>
          <Name>${t.name}</Name>
          <StartDate>${t.startDate}T08:00:00</StartDate>
          <FinishDate>${t.endDate}T17:00:00</FinishDate>
          <Status>${t.status}</Status>
          <PercentComplete>${t.progress}</PercentComplete>
        </TASK>`).join('')}
      </TASKS>
    </PROJECT>`).join('')}
  </PROJECTS>
</PLANT>`;
};

export const triggerDownload = (content: string, filename: string, mimeType: string) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const formatBytes = (bytes: number, decimals = 2) => {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};
