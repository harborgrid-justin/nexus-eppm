
import { Document, Extension, QualityStandard, EnterpriseRole, EnterpriseSkill, StandardTemplate } from '../../types/index';

export const EXTENSIONS_REGISTRY: Extension[] = [
  { id: 'dod_suite', name: 'DoD Acquisition Suite', category: 'Compliance', description: 'DoD 5000.02 Lifecycle, EVMS-748, and Defense-grade Risk.', icon: 'Shield', status: 'Available', version: '1.0', viewType: 'dashboard' },
  { id: 'gov_budget', name: 'US Gov Budgeting (PPBE)', category: 'Financials', description: 'Planning, Programming, Budgeting, Execution & Funds Control.', icon: 'Banknote', status: 'Available', version: '1.0', viewType: 'dashboard' },
  { 
    id: 'construction_suite', 
    name: 'Construction Platform', 
    category: 'Industry', 
    description: 'Field management, Daily Logs, RFI/Submittals, Safety & BIM integration.', 
    icon: 'HardHat', 
    status: 'Active', 
    version: '2.4', 
    viewType: 'dashboard' 
  },
  { 
    id: 'finance_suite', 
    name: 'Financial Services', 
    category: 'Industry', 
    description: 'Capital Allocation, Regulatory Audit (SOX/Basel), and Cash Flow Hedging.', 
    icon: 'Landmark', 
    status: 'Active', 
    version: '3.1', 
    viewType: 'dashboard' 
  },
  { 
    id: 'fed_gov_platform', 
    name: 'Federal Gov Platform', 
    category: 'Public Sector', 
    description: 'Unified Executive Branch management: Treasury, Defense, Energy, DOT.', 
    icon: 'Landmark', 
    status: 'Active', 
    version: '2.0', 
    viewType: 'dashboard' 
  },
  { 
    id: 'state_gov_platform', 
    name: 'State Gov Platform', 
    category: 'Public Sector', 
    description: 'State-wide agency coordination: HHS, DOT, Revenue, and Education.', 
    icon: 'Map', 
    status: 'Active', 
    version: '1.5', 
    viewType: 'dashboard' 
  },
];

export const MOCK_QUALITY_STANDARDS: QualityStandard[] = [
    { id: 'QS-01', name: 'ISO 9001:2015', description: 'International standard for a quality management system (QMS).', category: 'General', source: 'External', enforcement: 'Mandatory' },
    { id: 'QS-02', name: 'Corporate QC Policy v3.2', description: 'Internal quality control procedures for all projects.', category: 'Process', source: 'Internal', enforcement: 'Mandatory' },
];

export const MOCK_ENTERPRISE_ROLES: EnterpriseRole[] = [
    { id: 'ER-01', title: 'Senior Engineer', description: 'Lead engineering role.', requiredSkills: ['SK-CIV-03', 'SK-AUTOCAD-02'] },
];

export const MOCK_ENTERPRISE_SKILLS: EnterpriseSkill[] = [
    { id: 'SK-CIV-03', name: 'Civil Engineering L3', category: 'Engineering' },
];

export const MOCK_DOCUMENTS: Document[] = [
    { id: 'D1', projectId: 'P1001', name: 'Project Charter.pdf', type: 'PDF', size: '1.2 MB', version: '1.0', uploadedBy: 'Justin Saadein', status: 'Final', url: '#' },
];

export const MOCK_TEMPLATES: StandardTemplate[] = [
    { id: 'TPL-01', category: 'Risk', name: 'Standard Risk Plan', description: 'Default risk management plan template.', content: {} },
];
