
import React from 'react';

export type Industry = 'Construction' | 'Software' | 'Standard';

export type ActivityCodeScope = 'Global' | 'EPS' | 'Project';

export interface Document {
  id: string;
  projectId?: string;
  name: string;
  type: string;
  size: string;
  version: string;
  uploadedBy: string;
  status: string;
  url: string;
}

export interface Integration {
  id: string;
  name: string;
  type: string;
  status: 'Connected' | 'Disconnected';
  lastSync: string;
  logo: React.ReactNode; 
}

export interface DataJob {
  id: string;
  type: 'Import' | 'Export';
  format: 'P6 XML' | 'CSV' | 'MPP' | 'JSON';
  status: 'Completed' | 'In Progress' | 'Failed';
  submittedBy: string;
  timestamp: string;
  details: string;
  progress?: number;
  fileName?: string;
  fileSize?: string;
}

export interface Extension {
  id: string;
  name: string;
  category: string;
  description: string;
  icon: string;
  status: 'Available' | 'Installed' | 'Active';
  version: string;
  viewType: 'dashboard' | 'grid' | 'form' | 'viewer3d' | 'map';
  installedDate?: string;
}