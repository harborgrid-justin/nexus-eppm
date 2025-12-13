
import { ActivityCode } from '../../types';

export const MOCK_ACTIVITY_CODES: ActivityCode[] = [
  // --- GLOBAL: PHASES ---
  {
    id: 'AC-PHASE',
    name: 'Project Phase',
    scope: 'Global',
    values: [
      { id: 'PH-00', value: 'Initiation', color: '#94a3b8', description: 'Project Setup & Charter' },
      { id: 'PH-01', value: 'Planning', color: '#64748b', description: 'Schedule & Cost Planning' },
      { id: 'PH-02', value: 'Design - Conceptual', color: '#bae6fd', description: '10-30% Design' },
      { id: 'PH-03', value: 'Design - Basic', color: '#7dd3fc', description: '30-60% Design' },
      { id: 'PH-04', value: 'Design - Detailed', color: '#38bdf8', description: '60-90% Design' },
      { id: 'PH-05', value: 'Design - IFC', color: '#0ea5e9', description: 'Issued for Construction' },
      { id: 'PH-06', value: 'Procurement', color: '#fcd34d', description: 'Purchasing & Logistics' },
      { id: 'PH-07', value: 'Construction - Civil', color: '#fca5a5', description: 'Site Work & Foundations' },
      { id: 'PH-08', value: 'Construction - MEPI', color: '#f87171', description: 'Mech, Elec, Piping, Install' },
      { id: 'PH-09', value: 'Commissioning', color: '#86efac', description: 'Testing & Turnover' },
      { id: 'PH-10', value: 'Closeout', color: '#4ade80', description: 'Final Handover' },
    ]
  },

  // --- GLOBAL: DISCIPLINES ---
  {
    id: 'AC-DISC',
    name: 'Discipline',
    scope: 'Global',
    values: [
      { id: 'DISC-ADM', value: 'Project Management', color: '#e2e8f0', description: 'Admin & PMO' },
      { id: 'DISC-CIV', value: 'Civil', color: '#d1d5db', description: 'Civil Works' },
      { id: 'DISC-CON', value: 'Concrete', color: '#9ca3af', description: 'Concrete Works' },
      { id: 'DISC-STR', value: 'Structural', color: '#6b7280', description: 'Structural Steel' },
      { id: 'DISC-ARC', value: 'Architectural', color: '#fde047', description: 'Finishes & Envelopes' },
      { id: 'DISC-MEC', value: 'Mechanical', color: '#fb923c', description: 'HVAC & Rotating Equipment' },
      { id: 'DISC-PIP', value: 'Piping', color: '#fdba74', description: 'Pipe Racks & Install' },
      { id: 'DISC-ELE', value: 'Electrical', color: '#ef4444', description: 'Power & Lighting' },
      { id: 'DISC-INS', value: 'Instrumentation', color: '#fca5a5', description: 'Controls & Sensors' },
      { id: 'DISC-SAF', value: 'Safety', color: '#22c55e', description: 'HSE' },
      { id: 'DISC-QUA', value: 'Quality', color: '#3b82f6', description: 'QA/QC' },
      { id: 'DISC-LGL', value: 'Legal', color: '#a8a29e', description: 'Permitting & Contracts' },
    ]
  },

  // --- GLOBAL: RESPONSIBILITY (RACI) ---
  {
    id: 'AC-RESP',
    name: 'Responsibility',
    scope: 'Global',
    values: [
      { id: 'R-OWN', value: 'Owner', description: 'Client / Sponsor' },
      { id: 'R-PMC', value: 'PM Consultant', description: 'Project Management Consultant' },
      { id: 'R-GC', value: 'General Contractor', description: 'Prime Contractor' },
      { id: 'R-ENG', value: 'Engineering Firm', description: 'Design Authority' },
      { id: 'R-SUB', value: 'Subcontractor', description: 'General Subcontractor' },
      { id: 'R-VEN', value: 'Vendor', description: 'Material Supplier' },
      { id: 'R-GOV', value: 'Government', description: 'Regulatory Body' },
    ]
  },

  // --- GLOBAL: CSI MASTERFORMAT (DIV 01-48) ---
  {
    id: 'AC-CSI',
    name: 'CSI MasterFormat',
    scope: 'Global',
    values: [
      { id: 'CSI-01', value: 'Div 01 - General Req', description: 'General Requirements' },
      { id: 'CSI-02', value: 'Div 02 - Existing Cond', description: 'Existing Conditions' },
      { id: 'CSI-03', value: 'Div 03 - Concrete', description: 'Concrete' },
      { id: 'CSI-04', value: 'Div 04 - Masonry', description: 'Masonry' },
      { id: 'CSI-05', value: 'Div 05 - Metals', description: 'Metals' },
      { id: 'CSI-06', value: 'Div 06 - Wood/Plastic', description: 'Woods, Plastics, Composites' },
      { id: 'CSI-07', value: 'Div 07 - Thermal/Moisture', description: 'Thermal & Moisture Protection' },
      { id: 'CSI-08', value: 'Div 08 - Openings', description: 'Openings (Doors/Windows)' },
      { id: 'CSI-09', value: 'Div 09 - Finishes', description: 'Finishes' },
      { id: 'CSI-10', value: 'Div 10 - Specialties', description: 'Specialties' },
      { id: 'CSI-11', value: 'Div 11 - Equipment', description: 'Equipment' },
      { id: 'CSI-12', value: 'Div 12 - Furnishings', description: 'Furnishings' },
      { id: 'CSI-13', value: 'Div 13 - Special Const', description: 'Special Construction' },
      { id: 'CSI-14', value: 'Div 14 - Conveying', description: 'Conveying Equipment' },
      { id: 'CSI-21', value: 'Div 21 - Fire Supp', description: 'Fire Suppression' },
      { id: 'CSI-22', value: 'Div 22 - Plumbing', description: 'Plumbing' },
      { id: 'CSI-23', value: 'Div 23 - HVAC', description: 'Heating, Ventilating, AC' },
      { id: 'CSI-25', value: 'Div 25 - Automation', description: 'Integrated Automation' },
      { id: 'CSI-26', value: 'Div 26 - Electrical', description: 'Electrical' },
      { id: 'CSI-27', value: 'Div 27 - Comms', description: 'Communications' },
      { id: 'CSI-28', value: 'Div 28 - Safety/Security', description: 'Electronic Safety & Security' },
      { id: 'CSI-31', value: 'Div 31 - Earthwork', description: 'Earthwork' },
      { id: 'CSI-32', value: 'Div 32 - Ext. Imp', description: 'Exterior Improvements' },
      { id: 'CSI-33', value: 'Div 33 - Utilities', description: 'Utilities' },
      { id: 'CSI-34', value: 'Div 34 - Transportation', description: 'Transportation' },
      { id: 'CSI-35', value: 'Div 35 - Waterway/Marine', description: 'Waterway & Marine Construction' },
      { id: 'CSI-40', value: 'Div 40 - Process Int', description: 'Process Integration' },
      { id: 'CSI-41', value: 'Div 41 - Material Proc', description: 'Material Processing Equipment' },
      { id: 'CSI-42', value: 'Div 42 - Process Heat', description: 'Process Heating/Cooling' },
      { id: 'CSI-43', value: 'Div 43 - Gas/Liquid', description: 'Process Gas & Liquid Handling' },
      { id: 'CSI-44', value: 'Div 44 - Pollution Ctrl', description: 'Pollution & Waste Control' },
      { id: 'CSI-48', value: 'Div 48 - Electrical Gen', description: 'Electrical Power Generation' },
    ]
  },

  // --- PROJECT SPECIFIC: AREA / LOCATION (P1001) ---
  {
    id: 'AC-AREA',
    name: 'Area / Location',
    scope: 'Project',
    projectId: 'P1001',
    values: [
      { id: 'LOC-Z1', value: 'Zone 1 - North Terminal', color: '#bfdbfe' },
      { id: 'LOC-Z1-L1', value: 'Z1 - Level 1 (Foyer)', color: '#dbeafe' },
      { id: 'LOC-Z1-L2', value: 'Z1 - Level 2 (Retail)', color: '#eff6ff' },
      { id: 'LOC-Z2', value: 'Zone 2 - South Platform', color: '#bbf7d0' },
      { id: 'LOC-Z2-UG', value: 'Z2 - Underground Utility', color: '#dcfce7' },
      { id: 'LOC-Z2-TR', value: 'Z2 - Track Access', color: '#f0fdf4' },
      { id: 'LOC-Z3', value: 'Zone 3 - Parking Struct', color: '#fed7aa' },
      { id: 'LOC-Z3-FD', value: 'Z3 - Foundations', color: '#ffedd5' },
      { id: 'LOC-Z3-DK', value: 'Z3 - Decks 1-4', color: '#fff7ed' },
      { id: 'LOC-OFF', value: 'Offsite / Laydown', color: '#f1f5f9' },
    ]
  },

  // --- PROJECT SPECIFIC: PROCUREMENT PACKAGES (P1001) ---
  {
    id: 'AC-PKG',
    name: 'Procurement Package',
    scope: 'Project',
    projectId: 'P1001',
    values: [
      { id: 'PKG-001', value: 'Site Prep & Excavation', description: 'Earthworks Vendor' },
      { id: 'PKG-002', value: 'Structural Steel', description: 'Long Lead Item' },
      { id: 'PKG-003', value: 'Concrete Supply', description: 'Ready Mix' },
      { id: 'PKG-004', value: 'MEP Systems', description: 'Design-Build Sub' },
      { id: 'PKG-005', value: 'Elevators / Conveyance', description: 'Specialty Sub' },
      { id: 'PKG-006', value: 'Glazing & Facade', description: 'Building Envelope' },
      { id: 'PKG-007', value: 'Roofing', description: 'Waterproofing' },
      { id: 'PKG-008', value: 'Interior Fitout', description: 'Drywall, Paint, Flooring' },
      { id: 'PKG-009', value: 'Signage & Wayfinding', description: 'Final Finishes' },
      { id: 'PKG-010', value: 'Security Systems', description: 'IT & Access Control' },
    ]
  },

  // --- GLOBAL: CRITICALITY / PRIORITY ---
  {
    id: 'AC-PRIO',
    name: 'Priority Level',
    scope: 'Global',
    values: [
      { id: 'P-1', value: 'Critical Path', color: '#ef4444', description: 'Zero Float' },
      { id: 'P-2', value: 'Near Critical', color: '#f97316', description: 'Float < 10 days' },
      { id: 'P-3', value: 'Standard', color: '#3b82f6', description: 'Standard Workflow' },
      { id: 'P-4', value: 'Low Priority', color: '#64748b', description: 'Fill-in Work' },
      { id: 'P-5', value: 'Level of Effort', color: '#94a3b8', description: 'Overhead / Support' },
    ]
  },

  // --- GLOBAL: COST ACCOUNT TYPE ---
  {
    id: 'AC-COST',
    name: 'Cost Account Type',
    scope: 'Global',
    values: [
      { id: 'CAT-L', value: 'Labor - Direct', description: 'Internal Staff' },
      { id: 'CAT-S', value: 'Subcontract', description: 'External Labor' },
      { id: 'CAT-M', value: 'Material', description: 'Permanent Materials' },
      { id: 'CAT-E', value: 'Equipment', description: 'Construction Plant' },
      { id: 'CAT-O', value: 'ODC', description: 'Other Direct Costs' },
      { id: 'CAT-I', value: 'Indirect', description: 'Overhead / G&A' },
    ]
  },

  // --- PROJECT: SYSTEMS (P1001) ---
  {
    id: 'AC-SYS',
    name: 'System',
    scope: 'Project',
    projectId: 'P1001',
    values: [
      { id: 'SYS-01', value: 'Power Distribution', description: 'MV/LV' },
      { id: 'SYS-02', value: 'Lighting', description: 'Emergency & General' },
      { id: 'SYS-03', value: 'HVAC - Cooling', description: 'Chillers' },
      { id: 'SYS-04', value: 'HVAC - Ventilation', description: 'AHUs / Fans' },
      { id: 'SYS-05', value: 'Fire Alarm', description: 'Detection' },
      { id: 'SYS-06', value: 'Fire Suppression', description: 'Sprinklers' },
      { id: 'SYS-07', value: 'Data / IT', description: 'Backbone & Wifi' },
      { id: 'SYS-08', value: 'Water Supply', description: 'Domestic Water' },
      { id: 'SYS-09', value: 'Waste Water', description: 'Sanitary Sewer' },
      { id: 'SYS-10', value: 'Storm Water', description: 'Drainage' },
    ]
  }
];
