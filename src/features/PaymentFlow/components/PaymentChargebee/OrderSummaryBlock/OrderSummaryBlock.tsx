import * as React from 'react';
import { InputText } from '@bit/scalez.savvy-ui.input-text';
import { Button } from '@bit/scalez.savvy-ui.button';
import { REQUEST_STATUSES } from '@bit/scalez.savvy-ui.hooks';

/* Types */
import {
  CHARGEBEE_PLAN_ID,
  ChargebeeCoupon,
  CHARGEBEE_COUPON_STATUS
} from 'App/types';
import { FormData } from '../PaymentChargebee';

/* Components */
import { RootContext, RootContextType } from 'App/components';

/* Styles */
import { StyledOrderSummaryBlock, StyledSubscriptionImage } from './styles';

type Props = Partial<{
  coupon: Partial<{
    data: ChargebeeCoupon;
    status: REQUEST_STATUSES;
    loading: boolean;
    error: string;
  }>;
  formState: FormData;
  onChange: (e: React.FormEvent<HTMLInputElement>) => void;
  onSubmit: (data: FormData) => void;
}>;

const OrderSummaryBlock: React.FC<Props> = ({
  formState,
  coupon = {},
  onChange,
  onSubmit
}: Props) => {
  const {
    state: { activePaymentPlanData }
  } = React.useContext<RootContextType>(RootContext);

  const [isSummarySectionExpanded, toggleSummarySection] = React.useState<
    boolean
  >(false);

  const [isCouponGot, toggleCoupon] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (coupon.status === REQUEST_STATUSES.GOT) {
      toggleCoupon(true);
    }
  }, [coupon.status]);

  const discountPrice = React.useMemo(() => {
    if (coupon.data?.status === CHARGEBEE_COUPON_STATUS.ACTIVE) {
      return (
        activePaymentPlanData.periodPrice -
        (activePaymentPlanData.periodPrice * coupon.data?.discountPercentage) /
          100
      );
    }

    return activePaymentPlanData.periodPrice;
  }, [activePaymentPlanData, coupon]);

  return (
    <StyledOrderSummaryBlock
      data-is-expanded={isSummarySectionExpanded}
      onClick={() => toggleSummarySection(!isSummarySectionExpanded)}
    >
      <div className="image-wrapper">
        <StyledSubscriptionImage />
      </div>

      <div className="order-info-block" data-has-input={!!onChange}>
        <p className="title body-bold">Order Summary</p>

        {!!activePaymentPlanData.trialPeriod ||
        (coupon.data?.discountPercentage &&
          coupon.data?.status === CHARGEBEE_COUPON_STATUS.ACTIVE) ? (
          <span className="price-top body-bold">{`$${discountPrice}`}</span>
        ) : (
          <span className="price-top">{`$${discountPrice}`} </span>
        )}

        <hr />

        <p className="description sbody">{activePaymentPlanData.description}</p>

        <span
          className="price-bottom sbody"
          data-is-free={!!activePaymentPlanData.trialPeriod}
        >
          ${discountPrice}
        </span>

        {!!onChange && (
          <>
            <hr />

            {isCouponGot ? (
              <div className="coupon-block">
                <p className="sbody-bold">Your Coupon Code:</p>
                <h1>{formState.couponId}</h1>
                <p className="body">
                  discount {coupon.data?.discountPercentage ?? 0}%
                </p>
              </div>
            ) : (
              <InputText
                className="coupon-input"
                title="Yes, we are making giveaways!"
                type="text"
                name="couponId"
                value={formState.couponId}
                label="Coupon Code"
                required={false}
                placeholder="Enter Text"
                error={coupon.error}
                onClick={e => {
                  /* Prevent section collapsing */
                  e.stopPropagation();
                }}
                onChange={onChange}
              />
            )}

            <Button
              data-type={isCouponGot ? 'secondary' : 'primary'}
              data-action={coupon.loading ? 'spinner' : ''}
              onClick={(e: React.FormEvent<HTMLButtonElement>) => {
                /* Prevent section collapsing */
                e.stopPropagation();

                isCouponGot ? toggleCoupon(false) : onSubmit(formState);
              }}
            >
              {isCouponGot ? 'Edit' : 'Apply'}
            </Button>
          </>
        )}
      </div>
    </StyledOrderSummaryBlock>
  );
};

export { OrderSummaryBlock };
