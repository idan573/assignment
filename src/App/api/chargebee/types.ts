export type GQLChargebeePaymentPlan = Partial<{
  id: string;
  description: string;
  period: number;
  name: string;
  periodUnit: string;
  price: number;
  trialPeriod: number;
  trialPeriodUnit: string;
  taskCount: number;
  freeQuantity: number;
}>;

export type GQLChargebeeCoupon = Partial<{
  name: string;
  id: string;
  discount_type: string;
  discount_percentage: number;
  redemptions: number;
  status: string;
}>;
