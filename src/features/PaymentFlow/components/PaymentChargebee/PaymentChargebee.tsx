import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Notification } from '@bit/scalez.savvy-ui.notification';
import {
  REQUEST_STATUSES,
  useLazyRequest,
  useNotification
} from '@bit/scalez.savvy-ui.hooks';

/* Api */
import {
  METRIC_NAMES,
  GQLReportMetricVars,
  reportMetricMutation
} from 'App/api/reportMetric';
import { updateUserMutation } from 'App/api/user/updateUser';
import { createCustomerChargebeeMutation } from 'App/api/chargebee/createCustomerChargebee';
import { createSubscriptionChargebeeMutation } from 'App/api/chargebee/createSubscriptionChargebee';
import { handleTokenChargebeeMutation } from 'App/api/chargebee/handleTokenChargebee';
import {
  GQLRetrieveCouponByIdChargebeeVars,
  retrieveCouponByIdChargebeeQuery
} from 'App/api/chargebee/retrieveCouponById';

/* Types */
import { ChargebeeCoupon } from 'App/types';

/* Components */
import { RootContext, RootContextType } from 'App/components';
import { OrderSummaryBlock } from './OrderSummaryBlock/OrderSummaryBlock';
import { ProfileSection } from './ProfileSection/ProfileSection';
import { BillingSection } from './BillingSection/BillingSection';

/* Styles */
import { GlobalPageStyles, StyledPaymentPage } from './styles';

type Props = RouteComponentProps<
  {},
  any,
  {
    coupon: ChargebeeCoupon;
  }
>;

export type FormData = Partial<{
  firstName: string;
  lastName: string;
  email: string;
  cardHolderName: string;
  couponId: string;
}>;

const PaymentPage: React.FC<Props> = ({ history, location }: Props) => {
  const chargebeeCardRef = React.useRef<any>();

  const {
    state: {
      isCreatorFlow,
      userData,
      activePaymentPlanData,
      isUserHasAllPersonalInfo
    },
    actions: { trackPage, setPartialUserData }
  } = React.useContext<RootContextType>(RootContext);

  const [isCustomerCreated, setCustomerCreated] = React.useState<boolean>(
    false
  );
  const [isProfileSectionExpanded, toggleProfileSection] = React.useState<
    boolean
  >(!isUserHasAllPersonalInfo);
  const [isBillingSectionExpanded, toggleBillingSection] = React.useState<
    boolean
  >(isUserHasAllPersonalInfo);

  const [formState, setFormState] = React.useState<FormData>({
    firstName: userData?.firstName ?? '',
    lastName: userData?.lastName ?? '',
    email: userData?.email ?? '',
    cardHolderName: `${userData.firstName} ${userData.lastName}`,
    couponId: location.state?.coupon?.id ?? ''
  });

  const [
    isCouponNotificationActive,
    toggleCouponNotification
  ] = useNotification({
    delay: 2500
  });

  const [
    retrieveCouponById,
    {
      data: coupon = location.state?.coupon,
      loading: loadingCoupon,
      error: couponError,
      status: couponStatus
    }
  ] = useLazyRequest<GQLRetrieveCouponByIdChargebeeVars, ChargebeeCoupon>(
    retrieveCouponByIdChargebeeQuery,
    {
      onCompleted(data) {
        history.replace({
          state: {
            coupon: data
          }
        });
        toggleCouponNotification(true);
      },
      onError(data) {
        history.replace({
          state: undefined
        });
      }
    }
  );

  const [
    tokenizeAndSubscribe,
    { loading: loadingTokenizeAndSubscribe, error: tokenizeAndSubscribeError },
    dispatchTokenizeAndSubscribe
  ] = useLazyRequest<FormData, void>(
    async ({ cardHolderName, couponId }) => {
      let tokens = {} as any;

      try {
        tokens = await chargebeeCardRef.current.tokenize({
          firstName: cardHolderName
        });
      } catch (error) {
        throw {
          message: 'Cannot verify card - please check your details'
        };
      }

      if (!isCustomerCreated) {
        await createCustomerChargebeeMutation({
          userId: userData.userId,
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email
        });

        setCustomerCreated(true);
      }

      await handleTokenChargebeeMutation({
        userId: userData.userId,
        gatewayAccountId:
          ENV === ENVIRONMENTS.PROD
            ? 'gw_Azqdt5SRuLLTX5sm'
            : 'gw_AzZhVBSS2fxQPxTW',
        paymentType: 'card',
        tmpToken: tokens.vaultToken
      });

      await createSubscriptionChargebeeMutation({
        userId: userData.userId,
        planId: activePaymentPlanData.id,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        couponId
      });

      reportMetricMutation({
        metricName: METRIC_NAMES.TRIAL_STARTED,
        value: 1,
        unit: 'Count',
        valueType: 'count'
      });
    },
    {
      delay: 6000,
      onCompleted() {
        history.push({
          pathname: '/payment/success',
          search: location.search,
          state: location.state
        });
      },
      onError() {
        setTimeout(
          () =>
            dispatchTokenizeAndSubscribe({
              status: REQUEST_STATUSES.NONE
            }),
          10000
        );
      }
    }
  );

  React.useEffect(() => {
    trackPage({
      name: 'PaymentPage'
    });
  }, []);

  const handleFormChange = React.useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      const { name, value } = e.currentTarget;

      setFormState(prevState => ({
        ...prevState,
        [name]: value,
        ...(name === 'firstName'
          ? { cardHolderName: `${value} ${userData.lastName}` }
          : name === 'lastName'
          ? { cardHolderName: `${userData.firstName} ${value}` }
          : {})
      }));
    },
    []
  );

  const handleCouponSubmit = React.useCallback((formState: FormData) => {
    retrieveCouponById({
      couponId: formState.couponId
    });
  }, []);

  const handleProfileSectionSubmit = React.useCallback(
    (formState: FormData) => {
      const attributes = {
        firstName: formState.firstName,
        lastName: formState.lastName,
        email: formState.email
      };

      /* Save client user data */
      setPartialUserData(attributes);

      /* Save server user data */
      updateUserMutation({
        userId: userData.userId,
        attributes
      });

      toggleProfileSection(false);
      toggleBillingSection(true);
    },
    []
  );

  const handleBillingSectionSubmit = React.useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      tokenizeAndSubscribe({
        cardHolderName: formState.cardHolderName,
        couponId: !!couponError ? undefined : formState.couponId
      });
    },
    [couponError, formState, tokenizeAndSubscribe]
  );

  return (
    <>
      <GlobalPageStyles />

      <Notification render={isCouponNotificationActive}>
        Coupon Added! Yay!
      </Notification>

      <StyledPaymentPage>
        <form onSubmit={handleBillingSectionSubmit}>
          <section className="order-summary-section">
            <OrderSummaryBlock
              coupon={{
                data: coupon,
                status: !!location.state?.coupon
                  ? REQUEST_STATUSES.GOT
                  : couponStatus,
                error: couponError,
                loading: loadingCoupon
              }}
              formState={{ couponId: formState.couponId }}
              onChange={handleFormChange}
              onSubmit={handleCouponSubmit}
            />
          </section>

          <div className="padding-block">
            <ProfileSection
              isSectionExpanded={isProfileSectionExpanded}
              formState={{
                firstName: formState.firstName,
                lastName: formState.lastName,
                email: formState.email
              }}
              openSection={() => {
                toggleProfileSection(true);
                toggleBillingSection(false);
              }}
              onChange={handleFormChange}
              onSubmit={handleProfileSectionSubmit}
            />

            <hr />

            <BillingSection
              //@ts-ignore
              ref={chargebeeCardRef}
              isSectionExpanded={isBillingSectionExpanded}
              error={tokenizeAndSubscribeError}
              loading={loadingTokenizeAndSubscribe}
              formState={{
                cardHolderName: formState.cardHolderName
              }}
              openSection={() => {
                toggleProfileSection(false);
                toggleBillingSection(true);
              }}
              onChange={handleFormChange}
            />

            <hr />

            <div className="terms-block">
              <a href="https://savvy.style/privacy-policy">
                <span className="xsbody-bold">Privacy Policy</span>
              </a>
              <a href="https://savvy.style/terms-of-use">
                <span className="xsbody-bold">Terms of Use</span>
              </a>
            </div>
          </div>
        </form>
      </StyledPaymentPage>
    </>
  );
};

export default PaymentPage;
