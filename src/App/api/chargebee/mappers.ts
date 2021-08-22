import {
  CHARGEBEE_PLAN_ID,
  ChargebeePaymentPlan,
  CHARGEBEE_COUPON_STATUS,
  ChargebeeCoupon
} from 'App/types';
import { GQLChargebeePaymentPlan, GQLChargebeeCoupon } from './types';

export const chargebeePaymentPlanMapper = ({
  id,
  price,
  freeQuantity,
  taskCount,
  ...gqlChargebeePaymentPlan
}: GQLChargebeePaymentPlan = {}): ChargebeePaymentPlan => {
  const periodPrice = +Number.parseFloat(
    (((price / 100) * taskCount) as any) as string
  ).toFixed(2);

  return {
    ...gqlChargebeePaymentPlan,
    id: id as CHARGEBEE_PLAN_ID,
    price: price / 100,
    freeQuantity: freeQuantity || 0,
    taskCount: taskCount || 0,
    periodPrice: periodPrice < 1 ? 1 : periodPrice
  };
};

export const chargebeeCouponMapper = ({
  discount_type,
  discount_percentage,
  status,
  ...gqlChargebeeCoupon
}: GQLChargebeeCoupon = {}): ChargebeeCoupon => ({
  ...gqlChargebeeCoupon,
  status: status as CHARGEBEE_COUPON_STATUS,
  discountPercentage: discount_percentage,
  discountType: discount_type
});
