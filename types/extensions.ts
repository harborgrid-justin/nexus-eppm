
export interface FinancialExtensionData {
    allocation: { name: string; size: number; color: string }[];
    cashFlow: { month: string; Operating: number; Investing: number; Financing: number }[];
    regulatoryAudits: { id: string; control: string; status: string; date: string }[];
}

export interface ConstructionExtensionData {
    submittals: { status: string; count: number }[];
}

export interface GovExtensionData {
    fundsFlow: { name: string; value: number }[];
    fiscalYears: { year: string; phase: string; status: string; color: string }[];
    appropriations: { type: string; years: string; exp: string; available: number }[];
}

export interface ExtensionDataState {
    financial: FinancialExtensionData;
    construction: ConstructionExtensionData;
    government: GovExtensionData;
}
