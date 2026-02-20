// ─── Distance Sale Pack – shared types ───────────────────────────────────────

export interface DealerDetails {
  businessName: string;
  tradingAddress: string;
  contactNumber: string;
  email: string;
  vatNumber: string;
  fcaNumber: string;
}

export interface DSSVehicleDetails {
  registration: string;
  vin: string;
  make: string;
  model: string;
  mileageAtSale: string;
  salePrice: string;
  dateOfSale: string;
  agreedDeliveryDate: string;
}

export interface PreSaleCondition {
  vehicleInspected: boolean;
  knownDefectsDisclosed: boolean;
  cosmeticImperfectionsDisclosed: boolean;
  warningLightsDeclared: boolean;
  serviceHistoryExplained: boolean;
  financeClearConfirmed: boolean;
  additionalDisclosures: string;
  inspectionTimestamp: string;
  dealerSignature: string;
}

export interface DistanceSaleTerms {
  // This step is read-only legal content; dealer just confirms they've presented it
  termsPresented: boolean;
}

export interface CoolingOffConfirmation {
  isDistanceSale: boolean;
  customerInformedOf14Days: boolean;
  coolingOffStartDate: string;
  returnConditionExplained: boolean;
  returnProcessExplained: boolean;
  customerAcknowledgesCoolingOff: boolean;
}

export interface DeliverySignOff {
  deliveryDate: string;
  deliveryMileage: string;
  deliveredBy: 'Dealer' | 'Third Party' | '';
  deliveredByName: string;
  customerConfirmsCondition: boolean;
  customerSignature: string;
  signatureTimestamp: string;
}

export interface RefundPolicyAck {
  refundTimelinesUnderstood: boolean;
  repairFirstApproachAgreed: boolean;
  diagnosticsAgreed: boolean;
  thirdPartyInspectionAgreed: boolean;
  transportCostPolicyUnderstood: boolean;
  confirmed: boolean;
}

export interface DistanceSaleForm {
  packId: string;
  createdAt: string;
  dealer: DealerDetails;
  vehicle: DSSVehicleDetails;
  preSale: PreSaleCondition;
  terms: DistanceSaleTerms;
  coolingOff: CoolingOffConfirmation;
  delivery: DeliverySignOff;
  refundPolicy: RefundPolicyAck;
}

export const AUTOSAVE_KEY = 'autoprov_dss_draft';

export function generatePackId(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `DSS-${y}${m}${d}-${rand}`;
}

export function defaultForm(): DistanceSaleForm {
  return {
    packId: generatePackId(),
    createdAt: new Date().toISOString(),
    dealer: {
      businessName: '',
      tradingAddress: '',
      contactNumber: '',
      email: '',
      vatNumber: '',
      fcaNumber: '',
    },
    vehicle: {
      registration: '',
      vin: '',
      make: '',
      model: '',
      mileageAtSale: '',
      salePrice: '',
      dateOfSale: '',
      agreedDeliveryDate: '',
    },
    preSale: {
      vehicleInspected: false,
      knownDefectsDisclosed: false,
      cosmeticImperfectionsDisclosed: false,
      warningLightsDeclared: false,
      serviceHistoryExplained: false,
      financeClearConfirmed: false,
      additionalDisclosures: '',
      inspectionTimestamp: '',
      dealerSignature: '',
    },
    terms: { termsPresented: false },
    coolingOff: {
      isDistanceSale: true,
      customerInformedOf14Days: false,
      coolingOffStartDate: '',
      returnConditionExplained: false,
      returnProcessExplained: false,
      customerAcknowledgesCoolingOff: false,
    },
    delivery: {
      deliveryDate: '',
      deliveryMileage: '',
      deliveredBy: '',
      deliveredByName: '',
      customerConfirmsCondition: false,
      customerSignature: '',
      signatureTimestamp: '',
    },
    refundPolicy: {
      refundTimelinesUnderstood: false,
      repairFirstApproachAgreed: false,
      diagnosticsAgreed: false,
      thirdPartyInspectionAgreed: false,
      transportCostPolicyUnderstood: false,
      confirmed: false,
    },
  };
}
