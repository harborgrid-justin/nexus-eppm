
// FIX: Correctly import all necessary procurement-related types.
import { ProcurementPlan, Vendor, ProcurementPackage, Solicitation, Contract, PurchaseOrder, SupplierPerformanceReview, ProcurementClaim, VendorBid, BidLineItem } from '../../types/index';

export const MOCK_PROCUREMENT_PLANS: ProcurementPlan[] = [
  { id: 'PP-01', projectId: 'P1001', objectives: 'Ensure timely material delivery', scope: 'All raw materials', approach: 'Competitive Bid', procurementMethods: ['RFP'], status: 'Active', version: 1 }
];

export const MOCK_VENDORS: Vendor[] = [
  { id: 'V-01', name: 'Acme Steel', category: 'Materials', status: 'Preferred', performanceScore: 92, riskLevel: 'Low', contact: { name: 'John Doe', email: 'sales@acmesteel.com', phone: '555-0199' }, location: 'Pittsburgh, PA', lastAudit: '2023-11-15' },
  { id: 'V-02', name: 'Global Foundations', category: 'Subcontractor', status: 'Approved', performanceScore: 85, riskLevel: 'Medium', contact: { name: 'Jane Smith', email: 'bids@globalfoundations.com', phone: '555-0200' }, location: 'Chicago, IL', lastAudit: '2024-01-10' },
  { id: 'V-03', name: 'BuildRight Inc.', category: 'Subcontractor', status: 'Approved', performanceScore: 78, riskLevel: 'High', contact: { name: 'Bill Turner', email: 'bill@buildright.com', phone: '555-0300' }, location: 'Detroit, MI', lastAudit: '2023-09-01' },
  { id: 'V-04', name: 'SolarTech Solutions', category: 'Equipment', status: 'Preferred', performanceScore: 88, riskLevel: 'Low', contact: { name: 'Sun Li', email: 'sales@solartech.com', phone: '555-0400' }, location: 'San Jose, CA', lastAudit: '2024-03-20' }
];

export const MOCK_PROCUREMENT_PACKAGES: ProcurementPackage[] = [
  { id: 'PKG-01', projectId: 'P1001', name: 'Structural Steel', description: 'Beams and columns for Phase 1', wbsId: 'WBS-02', budget: 500000, status: 'Awarded', assignedBuyer: 'Procurement Mgr' },
  { id: 'PKG-02', projectId: 'P1001', name: 'Concrete Foundations', description: 'Pour and finish', wbsId: 'WBS-03', budget: 1200000, status: 'Out for Bid', assignedBuyer: 'Senior Buyer' },
  { id: 'PKG-03', projectId: 'P1003', name: 'Solar Panels', description: 'PV Modules 400W', wbsId: 'WBS-03-02', budget: 2000000, status: 'Awarded', assignedBuyer: 'Mike Ross' }
];

export const MOCK_SOLICITATIONS: Solicitation[] = [
  { 
    id: 'SOL-01', projectId: 'P1001', packageId: 'PKG-01', type: 'RFP', title: 'Steel Supply RFP', issueDate: '2024-02-01', deadline: '2024-03-01', status: 'Closed', invitedVendorIds: ['V-01'],
    bids: [{ vendorId: 'V-01', submittedDate: '2024-02-28', totalAmount: 480000, status: 'Selected', lineItems: [ { description: 'W12x40 Beams', quantity: 100, unitPrice: 2000, total: 200000 } ] }]
  },
  {
      id: 'SOL-03', projectId: 'P1003', packageId: 'PKG-03', type: 'RFP', title: 'PV Module Supply', issueDate: '2023-10-01', deadline: '2023-11-01', status: 'Closed', invitedVendorIds: ['V-04'],
      bids: [{ vendorId: 'V-04', submittedDate: '2023-10-25', totalAmount: 1950000, status: 'Selected', lineItems: [] }]
  }
];

export const MOCK_CONTRACTS: Contract[] = [
  { id: 'CTR-01', projectId: 'P1001', title: 'Steel Supply Contract', vendorId: 'V-01', solicitationId: 'SOL-01', contractValue: 480000, status: 'Active', startDate: '2024-03-15', endDate: '2024-09-15', type: 'Fixed Price', retainagePercent: 10, invoicedToDate: 240000, retainedToDate: 24000, paidToDate: 216000 },
  { id: 'CTR-03', projectId: 'P1003', title: 'Panel Supply Agreement', vendorId: 'V-04', solicitationId: 'SOL-03', contractValue: 1950000, status: 'Active', startDate: '2024-01-01', endDate: '2024-12-31', type: 'Fixed Price', retainagePercent: 5, invoicedToDate: 1000000, retainedToDate: 50000, paidToDate: 950000 }
];

export const MOCK_PURCHASE_ORDERS: PurchaseOrder[] = [
  { id: 'PO-001', projectId: 'P1001', contractId: 'CTR-01', vendorId: 'V-01', number: 'PO-2024-001', status: 'Issued', amount: 120000, issueDate: '2024-03-20', description: 'Batch 1 Steel', expectedDeliveryDate: '2024-04-15' },
  { id: 'PO-003', projectId: 'P1003', contractId: 'CTR-03', vendorId: 'V-04', number: 'PO-2024-050', status: 'Issued', amount: 500000, issueDate: '2024-02-10', description: '5000 Panels', expectedDeliveryDate: '2024-05-01' }
];

export const MOCK_SUPPLIER_REVIEWS: SupplierPerformanceReview[] = [
  { id: 'SPR-01', vendorId: 'V-01', projectId: 'P1001', date: '2024-05-01', rating: 5, reviewer: 'Site Mgr', comments: 'Excellent delivery time.' },
  { id: 'SPR-02', vendorId: 'V-04', projectId: 'P1003', date: '2024-04-15', rating: 4, reviewer: 'Procurement', comments: 'Good quality, slight delay.' }
];

export const MOCK_CLAIMS: ProcurementClaim[] = [
    { id: 'CLM-01', projectId: 'P1003', contractId: 'CTR-03', title: 'Damage in Transit', description: '10 panels broken upon arrival.', status: 'Open', amount: 2500, filingDate: '2024-05-05', filedBy: 'Site Super' }
];
