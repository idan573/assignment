export enum CHARGEBEE_PLAN_ID {
  TEST = '7-day-free-on-yearly',
  YEAR = 'yearly-plan',
  THREE_MONTH = 'quarterly-plan',
  ONE_MONTH_TRIAL_AB_TEST = '3planABtest7dmonthly0321',
  ONE_MONTH = 'monthly0321',
  ONE_MONTH_TRIAL = '7dmonthly0321',
  ONE_MONTH_TRIAL_1499 = '1499_test_7dmonthly0321',
  ONE_MONTH_TRIAL_1999 = '1999_test_7dmonthly0321'
}

export type ChargebeePaymentPlan = Partial<{
  id: CHARGEBEE_PLAN_ID | string;
  name: string;
  description: string;
  period: number;
  periodUnit: string;
  price: number;
  trialPeriod: number;
  trialPeriodUnit: string;
  taskCount: number;
  freeQuantity: number;
  periodPrice: number;
}>;

export enum CHARGEBEE_COUPON_STATUS {
  ACTIVE = 'active'
}

export type ChargebeeCoupon = Partial<{
  name: string;
  id: string;
  discountType: string;
  discountPercentage: number;
  redemptions: number;
  status: CHARGEBEE_COUPON_STATUS;
}>;
