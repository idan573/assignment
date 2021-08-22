import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { Modal } from '@bit/scalez.savvy-ui.modal';
import { Button } from '@bit/scalez.savvy-ui.button';
import { Loader } from '@bit/scalez.savvy-ui.loader';
import { setQueryString } from '@bit/scalez.savvy-ui.utils';

/* Core */
import { setUserIdCookie, openAppStore, isMobileApp } from 'core/utils';

/* Analytics */
import { EVENTS } from 'services/analyticsService';

/* Types */
import { ChargebeePaymentPlan, CHARGEBEE_PLAN_ID } from 'App/types';

/* Components */
import { RootContext, RootContextType } from 'App/components';

/* Styles */
import {
  StyledPaymentPlanPage,
  StyledModalGif,
  StyledModalContent,
  StyledSavvyLogo,
  StyledSubscriptionImage,
  StyledRadio
} from './styles';
import {
  getPlanChargebeeQuery,
  GQLGetPlanChargebeeVars
} from 'App/api/chargebee/getPlanChargebee';
import { useLazyRequest } from '@bit/scalez.savvy-ui.hooks';

type Props = RouteComponentProps;

enum CHARGEBEE_PLAN_ID_STAGE {
  YEAR = '7-day-free-on-yearly',
  THREE_MONTH = 'cbdemo_grow',
  ONE_MONTH_TRIAL = 'cbdemo_hustle',
  ONE_MONTH = 'testplan'
}

interface SubscriptionPlan {
  id: CHARGEBEE_PLAN_ID | CHARGEBEE_PLAN_ID_STAGE;
  meta: {
    price: string;
    period: string;
    priceDescription?: string;
    freePeriod?: string;
    periodDescription?: string;
  };
}

const subscriptionsList = [
  'Analyze your shape, color, and style',
  'Transform your look - appear more professional, slimmer, & sexier!',
  '1:1 Video advice from a PRO stylist',
  'Contribute to a community of empowered women'
];

const subscriptionPlansStage: SubscriptionPlan[] = [
  {
    id: CHARGEBEE_PLAN_ID_STAGE.YEAR,
    meta: {
      price: '$23.25',
      priceDescription: 'per month',
      period: '12 Months',
      freePeriod: '7 DAY Free trial',
      periodDescription: '$119.88 / year'
    }
  },
  {
    id: CHARGEBEE_PLAN_ID_STAGE.ONE_MONTH_TRIAL,
    meta: {
      price: '$49.00',
      period: '1 Month',
      freePeriod: '7 DAY Free trial'
    }
  },
  {
    id: CHARGEBEE_PLAN_ID_STAGE.THREE_MONTH,
    meta: {
      price: '$89.00',
      priceDescription: 'per month',
      period: '3 Months',
      periodDescription: '$29.67 / quarter year'
    }
  }
];

const subscriptionPlansProd: SubscriptionPlan[] = [
  {
    id: CHARGEBEE_PLAN_ID.ONE_MONTH_TRIAL_AB_TEST,
    meta: {
      price: '$14.99',
      period: 'Monthly',
      priceDescription: 'per month',
      freePeriod: '7 DAY Free trial'
    }
  },
  {
    id: CHARGEBEE_PLAN_ID.THREE_MONTH,
    meta: {
      price: '$12.99',
      priceDescription: 'per month',
      period: 'Quarterly',
      periodDescription: '$38.97 / quarter'
    }
  },
  {
    id: CHARGEBEE_PLAN_ID.YEAR,
    meta: {
      price: '$7.99',
      priceDescription: 'per month',
      period: 'Yearly',
      periodDescription: '$95.88 / year'
    }
  }
];

const PaymentPlanPage: React.FC<Props> = ({ history, location }: Props) => {
  const {
    state: { userData, activePaymentPlanData },
    actions: { trackPage, trackEvent, setActivePaymentPlanData }
  } = React.useContext<RootContextType>(RootContext);

  React.useEffect(() => {
    trackPage({
      name: 'PaymentPlanPage'
    });
  }, []);

  const subscriptionPlans = React.useMemo(() => {
    return ENV === ENVIRONMENTS.PROD
      ? subscriptionPlansProd
      : subscriptionPlansStage;
  }, []);

  const [planInfo, setPaymentPlanInfo] = React.useState<SubscriptionPlan>({
    id: CHARGEBEE_PLAN_ID.ONE_MONTH_TRIAL_AB_TEST,
    meta:
      subscriptionPlans.find(plan => plan.id === CHARGEBEE_PLAN_ID.YEAR)
        ?.meta ?? ({} as any)
  });

  const [getPlanChargebee] = useLazyRequest<
    GQLGetPlanChargebeeVars,
    ChargebeePaymentPlan
  >(getPlanChargebeeQuery, {
    onCompleted: setActivePaymentPlanData
  });

  const [isModalActive, toggleModal] = React.useState<boolean>(false);

  const handleSubscribe = React.useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      trackEvent({
        event: EVENTS.PAYMENT_STARTED,
        properties: {
          component: 'PaymentPlanPage',
          planId: planInfo.id
        },
        callback: () => {
          getPlanChargebee({ planId: planInfo?.id });

          history.push({
            pathname: '/payment/trial',
            search: location.search
          });
        }
      });
    },
    [planInfo]
  );

  const handleChoosePlan = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const planInfo =
        subscriptionPlans.find(plan => plan.id === e.target.value)?.meta ??
        ({} as any);

      setPaymentPlanInfo({
        id: e.target.value as CHARGEBEE_PLAN_ID,
        meta: planInfo
      });
    },
    [subscriptionPlans]
  );

  return (
    <>
      <Modal
        render={isModalActive}
        name="download-modal"
        onClickOutside={() => toggleModal(false)}
      >
        <StyledModalContent>
          <StyledModalGif />
          <span className="sbody">Not ready to subscribe? It's OK!</span>
          <h2>Receive Your FREE Body Shape Analysis</h2>
          <Button
            data-type="secondary"
            onClick={() =>
              history.push({
                pathname: '/homepage',
                search: location.search
              })
            }
          >
            Back to the Journey
          </Button>
          <Button
            onClick={() =>
              trackEvent({
                event: EVENTS.DOWNLOAD_MODAL_CLICKED,
                properties: {
                  planId: planInfo.id,
                  userId: userData?.userId
                },
                callback: openAppStore
              })
            }
          >
            Download the App
          </Button>
          <span className="sbody">No credit card required</span>
        </StyledModalContent>
      </Modal>

      <StyledPaymentPlanPage>
        <div className="image-wrapper">
          <Button
            className="back-button"
            data-type="secondary"
            data-size="small"
            data-form="circle"
            data-action="back"
            data-action-position="center"
            onClick={() =>
              isMobileApp() ? history.goBack() : toggleModal(true)
            }
          />
          <StyledSubscriptionImage />
        </div>

        <StyledSavvyLogo />

        <h2>Dress Your Best Every Day</h2>

        <p className="sub-header">
          Connect with your stylist and get a personalized makeover, all in the
          palm of your hand
        </p>

        <form onSubmit={handleSubscribe}>
          <fieldset>
            {subscriptionPlans.map((plan: any, key) => (
              <React.Fragment key={key}>
                <StyledRadio
                  key={planInfo.id}
                  id={plan.id}
                  name="subscription-plan"
                  value={plan.id}
                  checked={plan.id === planInfo.id}
                  onChange={handleChoosePlan}
                />

                <label
                  htmlFor={plan.id}
                  className="checkbox-label"
                  data-prefix={plan.meta.freePeriod}
                >
                  <h4 className="body-bold">{plan.meta.period}</h4>

                  {plan.meta?.periodDescription && (
                    <p className="xsbody">{plan.meta.periodDescription}</p>
                  )}

                  <h3>{plan.meta.price}</h3>

                  {plan.meta?.priceDescription && (
                    <span className="xsbody">{plan.meta.priceDescription}</span>
                  )}
                </label>
              </React.Fragment>
            ))}
          </fieldset>

          <Button type="submit" disabled={!planInfo.id}>
            Try Now
          </Button>
        </form>
      </StyledPaymentPlanPage>
    </>
  );
};

export default PaymentPlanPage;
