import * as React from 'react';
import TopBarProgress from 'react-topbar-progress-indicator';
import { RouteComponentProps } from 'react-router-dom';

import {
  HEADER_ITEM_TYPES,
  HEADER_ITEM_POSITION_TYPES
} from '@bit/scalez.savvy-ui.header';
import { Modal } from '@bit/scalez.savvy-ui.modal';
import { Button } from '@bit/scalez.savvy-ui.button';
import { FloatWrapper } from '@bit/scalez.savvy-ui.float-wrapper';
import { useLazyRequest } from '@bit/scalez.savvy-ui.hooks';
import { setQueryString } from '@bit/scalez.savvy-ui.utils';

/* Core */
import { openAppStore, isMobileApp } from 'core/utils';
import { setDefaultHeaderConfig } from 'App/components/headerConfig';

/* Analytics */
import { EVENTS } from 'services/analyticsService';

/* Types */
import { Stylist, ChargebeePaymentPlan, CHARGEBEE_PLAN_ID } from 'App/types';

/* Components */
import { RootContext, RootContextType } from 'App/components';

/* Styles */
import {
  StyledModalGif,
  StyledModalContent,
  StyledTrialPage,
  StyledStylistImage,
  StyledSubscriptionImage
} from './styles';
import {
  getPlanChargebeeQuery,
  GQLGetPlanChargebeeVars
} from 'App/api/chargebee/getPlanChargebee';

const TrialPage: React.FC<RouteComponentProps> = ({
  history,
  location
}: RouteComponentProps) => {
  const {
    state: {
      userData,
      homePageStylist,
      activePaymentPlanData,
      isAbTesting,
      isPaymentTest
    },
    actions: {
      trackPage,
      trackEvent,
      setActiveStepData,
      setActivePaymentPlanData
    }
  } = React.useContext<RootContextType>(RootContext);

  const [isModalActive, toggleModal] = React.useState<boolean>(false);
  const [isLoaderActive, toggleLoader] = React.useState<boolean>(false);

  const planId = React.useMemo(() => {
    if (ENV !== ENVIRONMENTS.PROD) {
      return 'cbdemo_hustle';
    }

    if (!isPaymentTest) {
      return CHARGEBEE_PLAN_ID.ONE_MONTH_TRIAL;
    }

    return isAbTesting
      ? CHARGEBEE_PLAN_ID.ONE_MONTH_TRIAL_1999
      : CHARGEBEE_PLAN_ID.ONE_MONTH_TRIAL_1499;
  }, [isPaymentTest, isAbTesting]);

  const [getPlanChargebee] = useLazyRequest<
    GQLGetPlanChargebeeVars,
    ChargebeePaymentPlan
  >(getPlanChargebeeQuery, {
    onCompleted: setActivePaymentPlanData
  });

  React.useEffect(() => {
    trackPage({
      name: 'TrialPage',
      properties: {
        planId
      }
    });

    console.log(`PlanId = ${planId}`);
    getPlanChargebee({ planId });

    setActiveStepData(prevState => ({
      ...prevState,
      headerConfig: setDefaultHeaderConfig({
        onClick: () => {
          if (!isMobileApp()) {
            toggleModal(true);
            return;
          }

          history.goBack();
        }
      })
    }));
  }, []);

  const handleSubscribe = React.useCallback(() => {
    toggleLoader(true);

    trackEvent({
      event: EVENTS.PAYMENT_STARTED,
      properties: {
        component: 'TrialPage',
        planId
      },
      callback: () => {
        history.push({
          pathname: '/payment/chargebee',
          search: location.search,
          state: location.state
        });
        toggleLoader(false);
      }
    });
  }, []);

  const subscriptionsList = React.useMemo(
    () => [
      'Analyze your shape, color, and style',
      'Build practical looks with your style coach',
      'Shop based on style goals and budget from 100s of brands',
      'Join to a community of strong, empowered women'
    ],
    []
  );

  return (
    <>
      {isLoaderActive && <TopBarProgress />}

      <Modal
        render={isModalActive}
        name="download-modal"
        onClickOutside={() => toggleModal(false)}
      >
        <StyledModalContent>
          <StyledModalGif />
          <span className="sbody">Not ready to subscribe? It's OK!</span>
          <h2>Get free outfit matches in the app!</h2>
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
            onClick={() => {
              trackEvent({
                event: EVENTS.DOWNLOAD_MODAL_CLICKED,
                properties: {
                  planId: CHARGEBEE_PLAN_ID.ONE_MONTH_TRIAL,
                  userId: userData?.userId
                },
                callback: () => {
                  openAppStore();
                }
              });
            }}
          >
            Download the App
          </Button>
          <span className="sbody">No credit card required</span>
        </StyledModalContent>
      </Modal>

      <StyledTrialPage>
        <div className="stylist-block">
          <StyledStylistImage src={homePageStylist?.profilePicture} />
          <span className="body-bold">{homePageStylist?.firstName}</span>
          <p className="sbody">
            {`Hey ${userData.firstName}, It’s your style coach,
            ${homePageStylist?.firstName}. I’d love to continue on this exciting
            journey together so I’m giving you a
            ${activePaymentPlanData.trialPeriod}
            ${activePaymentPlanData.trialPeriodUnit} trial with me!`}
          </p>
        </div>

        <div className="subscription-block">
          <div className="image-wrapper">
            <StyledSubscriptionImage />
          </div>

          <div className="content-wrapper">
            <h3 className="body-bold">
              {activePaymentPlanData.trialPeriod}{' '}
              {activePaymentPlanData.trialPeriodUnit} FREE trial
            </h3>

            <span className="price-block">
              <span className="sbody desc-block">After free trial</span>
              <span className="plan-block">
                <h3 data-period-unit={activePaymentPlanData.periodUnit}>
                  {activePaymentPlanData.price}
                </h3>
              </span>
            </span>

            <hr />

            <h3>Unlock your Personal Style</h3>
            <hr />
            <ul>
              {subscriptionsList.map((item, key) => (
                <li key={key}>
                  <p className="sbody">{item}</p>
                </li>
              ))}
            </ul>
          </div>
          <p className="xsbody info-block">
            At the end of your free trial period, you’ll automatically get
            charged the amount in your subscriptions terms.
          </p>
        </div>
      </StyledTrialPage>

      <FloatWrapper position="bottom" transition="slide-bottom" order={1}>
        <Button onClick={handleSubscribe}>Start Your FREE Trial</Button>
      </FloatWrapper>
    </>
  );
};

export default TrialPage;
