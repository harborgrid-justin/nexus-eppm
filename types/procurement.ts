
export interface ProcurementPackage {
  id: string;
  projectId: string;
  name: string;
  description: string;
  wbsId: string;
  budget: number;
  status: string;
  assignedBuyer: string;
  solicitationId?: string;
  contractId?: string;
}

export interface ProcurementPlan {
  id: string;
  projectId: string;
  objectives: string;
  scope: string;
  approach: string;
  procurementMethods: string[];
  status: string;
  version: number;
}

export interface Vendor {
  id: string;
  name: string;
  category: string;
  status: string;
  performanceScore: number;
  riskLevel: string;
  contact: { name: string; email: string; phone: string };
  location: string;
  lastAudit: string;
}

export interface Solicitation {
  id: string;
  projectId: string;
  packageId: string;
  type: string;
  title: string;
  issueDate: string;
  deadline: string;
  status: string;
  invitedVendorIds: string[];
  bids?: VendorBid[];
}

export interface VendorBid {
  vendorId: string;
  submittedDate: string;
  totalAmount: number;
  status: 'Pending' | 'Selected' | 'Rejected';
  lineItems: BidLineItem[];
}

export interface BidLineItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Contract {
  id: string;
  projectId: string;
  title: string;
  vendorId: string;
  solicitationId: string;
  contractValue: number;
  status: string;
  startDate: string;
  endDate: string;
  type: string;
  retainagePercent: number; // e.g., 10% withheld
  invoicedToDate: number;
  retainedToDate: number;
  paidToDate: number;
}

export interface PurchaseOrder {
  id: string;
  projectId: string;
  contractId: string;
  vendorId: string;
  number: string;
  status: string;
  amount: number;
  issueDate: string;
  description: string;
  linkedBudgetLineItemId?: string;
  expectedDeliveryDate?: string;
}

export interface SupplierPerformanceReview {
  id: string;
  vendorId: string;
  projectId: string;
  date: string;
  rating: number;
  reviewer: string;
  comments: string;
}

export interface ProcurementClaim {
  id: string;
  projectId: string;
  contractId: string;
  title: string;
  description: string;
  status: string;
  amount: number;
  filingDate: string;
  filedBy: string;
}

export interface MakeOrBuyAnalysis {
  id: string;
  projectId: string;
  item: string;
  makeCost: number;
  buyCost: number;
  rationale: string;
  decision: 'Make' | 'Buy';
}

export interface MaterialReceipt {
  id: string;
  projectId: string;
  vendorId: string;
  itemId: string;
  itemName: string;
  quantity: number;
  rejectedQuantity: number;
  status: 'Accepted' | 'Rejected' | 'Conditional';
  dateReceived: string;
  inspectorId: string;
}
