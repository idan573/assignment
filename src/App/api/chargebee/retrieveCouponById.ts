/* Services */
import { graphqlService } from 'services/graphqlService';

/* Types */
import { CHARGEBEE_COUPON_STATUS, ChargebeeCoupon } from 'App/types';
import { GQLChargebeeCoupon } from './types';

/* Fragments */
import { chargebeeCouponFragment } from './fragments';

/* Mappers */
import { chargebeeCouponMapper } from './mappers';

export type GQLRetrieveCouponByIdChargebeeVars = {
  couponId: string;
};

interface GQLRetrieveCouponByIdChargebee {
  retrieveCouponById: GQLChargebeeCoupon;
}

const GetPlanByExpertId = `
  query retrieveCouponById($couponId: String!) {
    retrieveCouponById(couponId: $couponId) ${chargebeeCouponFragment}
  }
`;

export const retrieveCouponByIdChargebeeQuery = async (
  variables: GQLRetrieveCouponByIdChargebeeVars
): Promise<ChargebeeCoupon> => {
  try {
    const {
      retrieveCouponById: coupon = {}
    } = await graphqlService.graphqlOperation<
      GQLRetrieveCouponByIdChargebeeVars,
      GQLRetrieveCouponByIdChargebee
    >(GetPlanByExpertId, variables);

    const mappedCoupon = chargebeeCouponMapper(coupon || {});

    if (mappedCoupon.status !== CHARGEBEE_COUPON_STATUS.ACTIVE) {
      throw {
        message: 'Coupon already redeemed'
      };
    }

    return mappedCoupon;
  } catch (error) {
    throw {
      message: 'Invalid coupon'
    };
  }
};
