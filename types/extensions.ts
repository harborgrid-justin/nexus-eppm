
export interface FinancialExtensionData {
    allocation: { name: string; size: number; color: string }[];
    cashFlow: { month: string; Operating: number; Investing: number; Financing: number }[];
    regulatoryAudits: { id: string; control: string; status: string; date: string }[];
    initiatives: { name: string; budget: number; npv: number }[];
}

export interface ConstructionExtensionData {
    submittals: { status: string; count: number }[];
}

export interface GovExtensionData {
    fundsFlow: { name: string; value: number }[];
    fiscalYears: { year: string; phase: string; status: string; color: string }[];
    appropriations: { type: string; years: string; exp: string; available: number }[];
    treasuryStats: { year: string; revenue: number; outlay: number }[];
    acquisitionPrograms: { name: string; milestone: string; costVariance: number }[];
    defenseStats: {
        readiness: string;
        personnel: string;
        budget: string;
        cyberStatus: string;
        logisticsStatus: string;
    };
    energyStats: {
        gridLoad: string;
        capacity: string;
        reserve: string;
        renewablePercent: number;
        renewableTarget: number;
        mix: { source: string; output: number; target: number }[];
    };
}

export interface QuadChartData {
    performance: { label: string; value: string; color?: string }[];
    schedule: { label: string; date: string }[];
    cost: { label: string; value: string; color?: string }[];
    technical: { label: string; value: string; color?: string }[];
}

export interface DoDExtensionData {
    milestones: { id: string; name: string; date: string; status: string; desc: string }[];
    phases: { name: string; duration: string; status: string }[];
    evmsData: { period: string; BCWS: number; BCWP: number; ACWP: number }[];
    quadChart: QuadChartData;
}

export interface ErpTransaction {
    id: string;
    type: string;
    amount: number | string; // string for masked or dash
    status: 'Success' | 'Failed' | 'Pending';
    response: string;
}

export interface BimModelNode {
    id: string;
    name: string;
    visible: boolean;
    children?: BimModelNode[];
}

export interface GisFeature {
    id: string;
    name: string;
    type: 'Polygon' | 'Point';
    coordinates: string; // SVG points or Lat/Lng string
    properties: any;
}

export interface ExtensionDataState {
    financial: FinancialExtensionData;
    construction: ConstructionExtensionData;
    government: GovExtensionData;
    dod: DoDExtensionData;
    erpTransactions: ErpTransaction[];
    bim: { tree: BimModelNode[] };
    gis: { features: GisFeature[] };
}
