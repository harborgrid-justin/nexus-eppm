
import { Project } from '../types';
import { flattenProjectsToCSV, generateP6XML, triggerDownload } from '../utils/dataExchangeUtils';

export type ExportFormat = 'P6 XML' | 'CSV' | 'JSON';

export const ExportService = {
  /**
   * Generates a file content string based on the format and triggers a browser download.
   */
  exportProjects: async (projects: Project[], format: ExportFormat): Promise<void> => {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 800));

    let content = '';
    let mimeType = '';
    let extension = '';

    switch(format) {
        case 'P6 XML':
            content = generateP6XML(projects);
            mimeType = 'application/xml';
            extension = 'xml';
            break;
        case 'CSV':
            content = flattenProjectsToCSV(projects);
            mimeType = 'text/csv';
            extension = 'csv';
            break;
        case 'JSON':
            content = JSON.stringify(projects, null, 2);
            mimeType = 'application/json';
            extension = 'json';
            break;
        default:
            throw new Error(`Unsupported export format: ${format}`);
    }

    triggerDownload(content, `nexus_export_${Date.now()}.${extension}`, mimeType);
  }
};
