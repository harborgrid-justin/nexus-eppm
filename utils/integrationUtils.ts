
export * from './integrations/cost';
export * from './integrations/schedule';
export * from './integrations/risk';
export * from './integrations/quality';
export * from './integrations/procurement';
export * from './integrations/resource';
export * from './integrations/stakeholder';
export * from './integrations/program';

export const checkOpenRFIsForTask = (taskId: string, communicationLogs: any[]): { blocked: boolean, count: number } => {
  const count = communicationLogs.filter(log => log.linkedTaskId === taskId && log.type === 'RFI' && log.status === 'Open').length;
  return { blocked: count > 0, count: count };
};
