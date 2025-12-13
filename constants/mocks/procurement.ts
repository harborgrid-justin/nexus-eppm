
import { ProcurementPlan, Vendor, ProcurementPackage, Solicitation, Contract, PurchaseOrder, SupplierPerformanceReview, ProcurementClaim } from '../../types';

export const MOCK_PROCUREMENT_PLANS: ProcurementPlan[] = [
  { id: 'PP-01', projectId: 'P1001', objectives: 'Ensure timely material delivery', scope: 'All raw materials', approach: 'Competitive Bid', procurementMethods: ['RFP'], status: 'Active', version: 1 }
];

export const MOCK_VENDORS: Vendor[] = [
  { id: 'V-01', name: 'Acme Steel', category: 'Materials', status: 'Preferred', performanceScore: 92, riskLevel: 'Low', contact: { name: 'John Doe', email: 'sales@acmesteel.com', phone: '555-0199' }, location: 'Pittsburgh, PA', lastAudit: '2023-11-15' },
  { id: 'V-02', name: 'Global Foundations', category: 'Subcontractor', status: 'Approved', performanceScore: 85, riskLevel: 'Medium', contact: { name: 'Jane Smith', email: 'bids@globalfoundations.com', phone: '555-0200' }, location: 'Chicago, IL', lastAudit: '2024-01-10' },
  { id: 'V-03', name: 'BuildRight Inc.', category: 'Subcontractor', status: 'Approved', performanceScore: 78, riskLevel: 'High', contact: { name: 'Bill Turner', email: 'bill@buildright.com', phone: '555-0300' }, location: 'Detroit, MI', lastAudit: '2023-09-01' }
];

export const MOCK_PROCUREMENT_PACKAGES: ProcurementPackage[] = [
  { id: 'PKG-01', projectId: 'P1001', name: 'Structural Steel', description: 'Beams and columns for Phase 1', wbsId: 'WBS-02', budget: 500000, status: 'Awarded', assignedBuyer: 'Procurement Mgr' },
  { id: 'PKG-02', projectId: 'P1001', name: 'Concrete Foundations', description: 'Pour and finish for main terminal', wbsId: 'WBS-03', budget: 1200000, status: 'Out for Bid', assignedBuyer: 'Senior Buyer' }
];

export const MOCK_SOLICITATIONS: Solicitation[] = [
  { 
    id: 'SOL-01', projectId: 'P1001', packageId: 'PKG-01', type: 'RFP', title: 'Steel Supply RFP', issueDate: '2024-02-01', deadline: '2024-03-01', status: 'Closed', invitedVendorIds: ['V-01'],
    bids: [
      { vendorId: 'V-01', submittedDate: '2024-02-28', totalAmount: 480000, status: 'Selected', lineItems: [ { description: 'W12x40 Beams', quantity: 100, unitPrice: 2000, total: 200000 }, { description: 'HSS Columns', quantity: 50, unitPrice: 5600, total: 280000 } ] }
    ]
  },
  { 
    id: 'SOL-02', projectId: 'P1001', packageId: 'PKG-02', type: 'RFP', title: 'Foundation Services', issueDate: '2024-04-01', deadline: '2024-04-30', status: 'Review', invitedVendorIds: ['V-02', 'V-03'],
    bids: [
      { vendorId: 'V-02', submittedDate: '2024-04-25', totalAmount: 1150000, status: 'Pending', lineItems: [ { description: 'Excavation', quantity: 1, unitPrice: 150000, total: 150000 }, { description: 'Pour & Finish', quantity: 1, unitPrice: 1000000, total: 1000000 } ] },
      { vendorId: 'V-03', submittedDate: '2024-04-28', totalAmount: 1250000, status: 'Pending', lineItems: [ { description: 'Excavation', quantity: 1, unitPrice: 100000, total: 100000 }, { description: 'Pour & Finish', quantity: 1, unitPrice: 1150000, total: 1150000 } ] }
    ]
  }
];

export const MOCK_CONTRACTS: Contract[] = [
  { id: 'CTR-01', projectId: 'P1001', title: 'Steel Supply Contract', vendorId: 'V-01', solicitationId: 'SOL-01', contractValue: 480000, status: 'Active', startDate: '2024-03-15', endDate: '2024-09-15', type: 'Fixed Price', retainagePercent: 10, invoicedToDate: 240000, retainedToDate: 24000, paidToDate: 216000 },
  { id: 'CTR-02', projectId: 'P1001', title: 'Site Services', vendorId: 'V-03', solicitationId: '', contractValue: 50000, status: 'Closed', startDate: '2024-01-01', endDate: '2024-02-01', type: 'Time & Materials', retainagePercent: 0, invoicedToDate: 50000, retainedToDate: 0, paidToDate: 50000 }
];

export const MOCK_PURCHASE_ORDERS: PurchaseOrder[] = [
  { id: 'PO-001', projectId: 'P1001', contractId: 'CTR-01', vendorId: 'V-01', number: 'PO-2024-001', status: 'Issued', amount: 120000, issueDate: '2024-03-20', description: 'Batch 1 Steel', expectedDeliveryDate: '2024-04-15' }
];

export const MOCK_SUPPLIER_REVIEWS: SupplierPerformanceReview[] = [
  { id: 'SPR-01', vendorId: 'V-01', projectId: 'P1001', date: '2024-05-01', rating: 5, reviewer: 'Site Mgr', comments: 'Excellent delivery time.' }
];

export const MOCK_CLAIMS: ProcurementClaim[] = [];
