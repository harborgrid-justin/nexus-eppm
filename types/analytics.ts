
export interface ReportDefinition {
    id: string;
    title: string;
    category: string;
    description: string;
    icon: string; // Lucide icon name
    type: 'Standard' | 'Custom';
    config?: any; // JSON config for columns/charts
}
