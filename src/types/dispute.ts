// ─── Dispute Response Builder – Type Definitions ───────────────────────────

export const DISPUTE_AUTOSAVE_KEY = 'autoprov_dispute_draft';

export function generateCaseId(): string {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `DRB-${ts}-${rand}`;
}

// Step 1 – Sale Overview
export interface SaleOverview {
  vehicleRegistration: string;
  saleDate: string;
  salePrice: string;
  distanceSale: boolean | null;
  warrantyProvided: boolean | null;
  financeInvolved: boolean | null;
  mileageAtSale: string;
}

// Step 2 – Complaint Details
export type ComplaintType =
  | 'mechanical-fault'
  | 'electrical-fault'
  | 'cosmetic-complaint'
  | 'not-as-described'
  | 'rejection-under-30'
  | 'rejection-over-30'
  | 'refund-demand'
  | 'finance-escalation'
  | 'general-dissatisfaction'
  | '';

export interface ComplaintDetails {
  complaintType: ComplaintType;
  customerComplaintText: string;
}

// Step 3 – Time & Usage Factors
export interface TimeUsageFactors {
  currentDate: string;      // ISO date
  currentMileage: string;
  vehicleDrivable: boolean | null;
  repairAttempted: boolean | null;
}

// Step 4 – Evidence & Documentation
export interface EvidenceDocumentation {
  signedPdiAvailable: boolean;
  distanceSalePackCompleted: boolean;
  provenanceReportProvided: boolean;
  serviceHistoryDisclosed: boolean;
  faultInspectionReportAvailable: boolean;
  independentInspectionRequested: boolean;
  customerRefusedInspection: boolean;
  additionalNotes: string;
}

// Step 5 – AI Response (generated)
export interface GeneratedResponse {
  emailResponse: string;
  smsVersion: string;
  internalSummary: string;
  riskLevel: 'low' | 'moderate' | 'high' | null;
  legalTimeline: 'under-30' | '30-to-6-months' | 'over-6-months' | null;
  suggestedNextSteps: string[];
}

// Step 7 – Export meta
export interface ExportMeta {
  dealerName: string;
  dealerEmail: string;
}

// Root form
export interface DisputeForm {
  caseId: string;
  createdAt: string;
  saleOverview: SaleOverview;
  complaintDetails: ComplaintDetails;
  timeUsage: TimeUsageFactors;
  evidence: EvidenceDocumentation;
  generated: GeneratedResponse;
  exportMeta: ExportMeta;
}

export function defaultDisputeForm(): DisputeForm {
  return {
    caseId: generateCaseId(),
    createdAt: new Date().toISOString(),
    saleOverview: {
      vehicleRegistration: '',
      saleDate: '',
      salePrice: '',
      distanceSale: null,
      warrantyProvided: null,
      financeInvolved: null,
      mileageAtSale: '',
    },
    complaintDetails: {
      complaintType: '',
      customerComplaintText: '',
    },
    timeUsage: {
      currentDate: new Date().toISOString().slice(0, 10),
      currentMileage: '',
      vehicleDrivable: null,
      repairAttempted: null,
    },
    evidence: {
      signedPdiAvailable: false,
      distanceSalePackCompleted: false,
      provenanceReportProvided: false,
      serviceHistoryDisclosed: false,
      faultInspectionReportAvailable: false,
      independentInspectionRequested: false,
      customerRefusedInspection: false,
      additionalNotes: '',
    },
    generated: {
      emailResponse: '',
      smsVersion: '',
      internalSummary: '',
      riskLevel: null,
      legalTimeline: null,
      suggestedNextSteps: [],
    },
    exportMeta: {
      dealerName: '',
      dealerEmail: '',
    },
  };
}

// Computed helpers
export function daysSinceSale(saleDate: string): number {
  if (!saleDate) return 0;
  const sale = new Date(saleDate);
  const now = new Date();
  return Math.floor((now.getTime() - sale.getTime()) / (1000 * 60 * 60 * 24));
}

export function mileageSinceSale(atSale: string, current: string): number {
  const a = parseInt(atSale.replace(/,/g, ''), 10) || 0;
  const b = parseInt(current.replace(/,/g, ''), 10) || 0;
  return Math.max(0, b - a);
}

export function legalTimeline(days: number): 'under-30' | '30-to-6-months' | 'over-6-months' {
  if (days <= 30) return 'under-30';
  if (days <= 180) return '30-to-6-months';
  return 'over-6-months';
}
