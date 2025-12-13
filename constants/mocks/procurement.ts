
import { ProcurementPlan, Vendor, ProcurementPackage, Solicitation, Contract, PurchaseOrder, SupplierPerformanceReview, ProcurementClaim } from '../../types';

export const MOCK_PROCUREMENT_PLANS: ProcurementPlan[] = [
  { id: 'PP-01', projectId: 'P1001', objectives: 'Ensure timely material delivery', scope: 'All raw materials', approach: 'Competitive Bid', procurementMethods: ['RFP'], status: 'Active', version: 1 }
];

export const MOCK_VENDORS: Vendor[] = [
  { id: 'V-01', name: 'Acme Steel', category: 'Materials', status: 'Preferred', performanceScore: 92, riskLevel: 'Low', contact: { name: 'John Doe', email: 'sales@acmesteel.com', phone: '555-0199' }, location: 'Pittsburgh, PA', lastAudit: '2023-11-15' }
];

export const MOCK_PROCUREMENT_PACKAGES: ProcurementPackage[] = [
  { id: 'PKG-01', projectId: 'P1001', name: 'Structural Steel', description: 'Beams and columns for Phase 1', wbsId: 'WBS-02', budget: 500000, status: 'Awarded', assignedBuyer: 'Procurement Mgr' }
];

export const MOCK_SOLICITATIONS: Solicitation[] = [
  { id: 'SOL-01', projectId: 'P1001', packageId: 'PKG-01', type: 'RFP', title: 'Steel Supply RFP', issueDate: '2024-02-01', deadline: '2024-03-01', status: 'Closed', invitedVendorIds: ['V-01'] }
];

export const MOCK_CONTRACTS: Contract[] = [
  { id: 'CTR-01', projectId: 'P1001', title: 'Steel Supply Contract', vendorId: 'V-01', solicitationId: 'SOL-01', contractValue: 480000, status: 'Active', startDate: '2024-03-15', endDate: '2024-09-15', type: 'Fixed Price' }
];

export const MOCK_PURCHASE_ORDERS: PurchaseOrder[] = [
  { id: 'PO-001', projectId: 'P1001', contractId: 'CTR-01', vendorId: 'V-01', number: 'PO-2024-001', status: 'Issued', amount: 120000, issueDate: '2024-03-20', description: 'Batch 1 Steel', expectedDeliveryDate: '2024-04-15' }
];

export const MOCK_SUPPLIER_REVIEWS: SupplierPerformanceReview[] = [
  { id: 'SPR-01', vendorId: 'V-01', projectId: 'P1001', date: '2024-05-01', rating: 5, reviewer: 'Site Mgr', comments: 'Excellent delivery time.' }
];

export const MOCK_CLAIMS: ProcurementClaim[] = [];
