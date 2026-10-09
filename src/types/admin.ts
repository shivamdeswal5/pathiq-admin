export type PlanSlug = 'STARTER' | 'GROWTH' | 'SCALE';
export type BillingCycle = 'MONTHLY' | 'YEARLY';
export type SubscriptionStatus = 'TRIALING' | 'ACTIVE' | 'GRACE_PERIOD' | 'LOCKED';

export interface AdminTenantListItem {
  labId: string;
  labName: string;
  city: string;
  phone: string;
  ownerName: string;
  ownerEmail: string;
  planSlug: PlanSlug;
  planName: string;
  status: SubscriptionStatus;
  billingCycle: BillingCycle;
  trialStart: string;
  trialEnd: string;
  currentPeriodEnd: string | null;
  daysRemaining: number;
  createdAt: string;
}

export interface AdminPaymentDetails {
  approvedBy?: string;
  utr?: string;
  notes?: string;
  [key: string]: unknown;
}

export interface AdminPaymentListItem {
  id: string;
  labId: string;
  provider: string;
  method: string | null;
  amountInr: number;
  currency: string;
  status: string;
  providerPaymentId: string | null;
  providerOrderId: string | null;
  planName: string | null;
  billingCycle: string | null;
  createdAt: string;
  details: AdminPaymentDetails;
}

export interface AdminGetPaymentsResponse {
  items: AdminPaymentListItem[];
  total: number;
}

export interface ManualActivationPayload {
  labId: string;
  planSlug: PlanSlug;
  billingCycle: BillingCycle;
  utrNumber: string;
  notes?: string;
}

export interface ManualActivationResponse {
  success: boolean;
  paymentId: string;
  subscriptionId: string;
  invoiceNumber: string;
  planName: string;
  periodEnd: string;
}

export interface AdminCreateTenantDto {
  labName: string;
  city: string;
  phoneNumber: string;
  ownerFullName: string;
  ownerEmail: string;
  ownerPassword?: string;
  planSlug: PlanSlug;
  billingCycle: BillingCycle;
  paymentStatus: 'TRIAL' | 'PAID';
  utrNumber?: string;
  notes?: string;
}

export interface AdminCreateTenantResponse {
  success: boolean;
  labId: string;
  labName: string;
  ownerEmail: string;
  tempPassword?: string;
  planSlug: string;
  status: string;
  invoiceNumber?: string;
}
