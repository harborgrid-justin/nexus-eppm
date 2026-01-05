
import React from 'react';

export type Industry = 'Construction' | 'Software' | 'Standard';

export type ActivityCodeScope = 'Global' | 'EPS' | 'Project';

export type UDFSubjectArea = 'Projects' | 'Tasks' | 'Resources' | 'Risks';

export interface DocumentHistory {
    version: string;
    date: string;
    user: string;
    notes: string;
}

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
  history?: DocumentHistory[];
}

export interface Integration {
  id: string;
  name: string;
  type: string; // e.g. ERP, Schedule, CRM
  status: 'Connected' | 'Disconnected' | 'Active' | 'Inactive' | 'Error';
  lastSync: string;
  logo: React.ReactNode | string; // Updated to allow string identifiers for dynamic icon lookup
  protocol?: 'REST API' | 'SOAP / WSDL' | 'OData' | 'JDBC' | 'OData v4';
  endpoint?: string;
  health?: 'Good' | 'Warning' | 'Critical' | 'Unknown';
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

export interface ActivityCode {
  id: string;
  name: string;
  scope: ActivityCodeScope;
  projectId?: string;
  values: ActivityCodeValue[];
}

export interface ActivityCodeValue {
  id: string;
  value: string;
  color?: string;
  description?: string;
}

export interface UserDefinedField {
  id: string;
  subjectArea: UDFSubjectArea;
  title: string;
  dataType: 'Text' | 'Number' | 'Date' | 'List';
  listValues?: string[];
}

export interface StandardTemplate {
    id: string;
    category: 'Risk' | 'Quality' | 'Scope' | 'Procurement' | 'Cost' | 'Schedule';
    name: string;
    description: string;
    content: any; // Flexible content structure
}

// --- NEW TYPES FOR ADVANCED ADMIN ---

export interface WorkflowStep {
    id: string;
    name: string;
    role: string;
    type: 'Review' | 'Approval' | 'Notification';
    requirements?: string[];
}

export interface WorkflowDefinition {
    id: string;
    name: string;
    trigger: 'ChangeOrder' | 'ScheduleBaseline' | 'RiskEscalation';
    steps: WorkflowStep[];
    status: 'Active' | 'Draft';
}

export interface GlobalChangeRule {
    id: string;
    field: string;
    operator: 'is' | 'contains' | 'is empty' | 'greater than';
    value: string;
    thenField: string;
    thenValue: string;
}

export interface AIAnalysisResult {
  summary: string;
  risks: string[];
  recommendations: string[];
}

export interface QualityStandard {
    id: string;
    name: string;
    description: string;
    category: 'General' | 'Process' | 'Material' | 'Safety' | 'Environmental';
    source: 'Internal' | 'External' | 'Regulatory';
    enforcement: 'Mandatory' | 'Guideline';
    linkedWbsIds?: string[];
}

export interface EtlMapping {
    id: number;
    source: string;
    target: string;
    transform: string;
    type: string;
}
