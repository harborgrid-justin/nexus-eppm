
import { Project } from '../types';
import { flattenProjectsToCSV, generateP6XML, triggerDownload } from '../utils/dataExchangeUtils';

export type ExportFormat = 'P6 XML' | 'CSV' | 'JSON';

export const ExportService = {
  /**
   * Generates a file content string based on the format and triggers a browser download.
   */
  exportData: async <T extends Record<string, any>>(data: T[], fileName: string, format: ExportFormat): Promise<void> => {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 800));

    let content = '';
    let mimeType = '';
    let extension = '';

    switch(format) {
        case 'P6 XML':
            // XML export is specific to Projects currently
            content = generateP6XML(data as unknown as Project[]);
            mimeType = 'application/xml';
            extension = 'xml';
            break;
        case 'CSV':
            content = convertToCSV(data);
            mimeType = 'text/csv';
            extension = 'csv';
            break;
        case 'JSON':
            content = JSON.stringify(data, null, 2);
            mimeType = 'application/json';
            extension = 'json';
            break;
        default:
            throw new Error(`Unsupported export format: ${format}`);
    }

    triggerDownload(content, `${fileName}_${Date.now()}.${extension}`, mimeType);
  },

  // Legacy support alias
  exportProjects: async (projects: Project[], format: ExportFormat) => {
      return ExportService.exportData(projects, 'nexus_projects', format);
  }
};

// Generic CSV Converter
const convertToCSV = (objArray: any[]) => {
    if (!objArray || objArray.length === 0) return '';
    
    // Flatten objects if needed or just take top level keys
    // For simplicity, we take keys of the first object
    // In a real app, we might need a schema mapping
    const header = Object.keys(objArray[0]);
    const csv = [
        header.join(','), // Header row
        ...objArray.map(row => header.map(fieldName => {
            let val = row[fieldName];
            if (typeof val === 'object') val = JSON.stringify(val); // Simple serialization for complex props
            return JSON.stringify(val ?? ''); // Handles quotes/escaping
        }).join(','))
    ].join('\r\n');

    return csv;
};
