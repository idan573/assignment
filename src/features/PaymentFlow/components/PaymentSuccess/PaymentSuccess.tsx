import * as React from 'react';
import { useLocation, RouteComponentProps } from 'react-router-dom';
import TopBarProgress from 'react-topbar-progress-indicator';
import ReactPixel from 'react-facebook-pixel';
import { LocationState } from 'history';

import {
  REQUEST_STATUSES,
  useRequest,
  useLazyRequest
} from '@bit/scalez.savvy-ui.hooks';
import { Button } from '@bit/scalez.savvy-ui.button';

/* Core */
import { openAppStore, getCookie } from 'core/utils';

/* Analytics */
import { EVENTS } from 'services/analyticsService';

/* Api */
import { GQLGetStyledVars, getStyledMutation } from 'App/api/getStyled';
import {
  GQLGetInitiatePaymentVars,
  GQLInitiatePaymentData,
  getInitiatePaymentQuery
} from 'App/api/getInitiatePayment';
import {
  GQLGetContentTaskVars,
  getContentTaskQuery
} from 'App/api/task/getContentTask';
import {
  GQLRetrievePrivateThreadVars,
  retrievePrivateThreadQuery
} from 'App/api/thread/retrievePrivateThread';
import {
  GQLPostWebEventVars,
  postWebEventMutation,
  PostWebEventProperties
} from 'App/api/postWebEvent';

/* Types */
import {
  TaskDefinition,
  Thread,
  CHARGEBEE_PLAN_ID,
  ChargebeeCoupon
} from 'App/types';

/* Components */
import { RootContext, RootContextType } from 'App/components';
import { OrderSummaryBlock } from '../PaymentChargebee/OrderSummaryBlock/OrderSummaryBlock';

/* Styles */
import { StyledBgImage, StyledPaymentSuccessPage } from './styles';

type Props = RouteComponentProps<
  {},
  any,
  {
    coupon: ChargebeeCoupon;
  }
>;

const PaymentSuccessPage: React.FC<Props> = ({ history, location }: Props) => {
  const { stepName: stepNameParam } = React.useMemo(() => {
    const searchParams = new URLSearchParams(location.search);
    return {
      stepName: searchParams.get('stepName')
    };
  }, []);

  const { state: locationState = {} } = useLocation<LocationState>();

  const {
    state: {
      isMobileApp,
      userData,
      homePageStylist,
      activePaymentPlanData,
      activeTaskData,
      journeyInfo
    },
    actions: {
      trackPage,
      trackEvent,
      setUserSubscribedToService,
      setActiveJourneyInfo,
      setActiveTaskData
    }
  } = React.useContext<RootContextType>(RootContext);

  const [postWebEvent, {}] = useLazyRequest<GQLPostWebEventVars, void>(
    postWebEventMutation,
    {}
  );

  const [getStyled, { loading: loadingGetStyled }] = useLazyRequest<
    GQLGetStyledVars,
    string
  >(getStyledMutation, {
    onCompleted: () => {
      history.push({
        pathname: '/homepage',
        search: location.search
      });
    }
  });

  const [
    getTaskContent,
    { loading: loadingTaskDefinition, data: taskDefinition }
  ] = useLazyRequest<GQLGetContentTaskVars, TaskDefinition>(
    getContentTaskQuery
  );

  const {
    loading: loadingInitiatePayment,
    data: initiatePaymentData
  } = useRequest<GQLGetInitiatePaymentVars, GQLInitiatePaymentData>(
    getInitiatePaymentQuery,
    {
      payload: {
        userId: userData?.userId
      },
      onCompleted: getInitiatePayment => {
        if (!!getInitiatePayment?.stepName) {
          setActiveJourneyInfo({
            activeStepName: getInitiatePayment.stepName
          });
        }

        if (!!getInitiatePayment?.taskName) {
          getTaskContent({
            taskName: getInitiatePayment.taskName
          });
        }
      }
    }
  );

  React.useEffect(() => {
    /* By retrieving private thread we create chat with the stylist after the user paid */
    if (!!userData.subscribedToService && !!userData?.homePageStylist) {
      retrievePrivateThreadQuery({
        userId: userData.userId,
        stylistId: userData.homePageStylist,
        isAddEvents: true
      });
    }

    trackPage({
      name: 'PaymentSuccessPage'
    });

    setUserSubscribedToService();
  }, []);

  React.useEffect(() => {
    const fbp = getCookie('_fbp');
    const fbc = getCookie('_fbc');

    let properties: PostWebEventProperties = {
      url: window?.location?.href,
      userAgent: window?.navigator?.userAgent
    };

    if (fbp) {
      properties = { ...properties, fbp };
    }
    if (fbc) {
      properties = { ...properties, fbc };
    }

    console.log(`PostWebEvent.properties before ${JSON.stringify(properties)}`);
    if (userData?.userId && !userData?.subscribedToService) {
      trackEvent({
        event: EVENTS.PAYMENT_COMPLETED,
        properties: {
          component: 'PaymentSuccessPage',
          planId: activePaymentPlanData?.id,
          taskCount: activePaymentPlanData?.taskCount,
          couponId: location.state?.coupon?.id
        }
      });
      fetch('https://api.ipify.org?format=json')
        .then(response => response.json())
        .then(data => {
          const userIp = data?.ip;
          console.log('PostWebEvent.ip', userIp);
          properties = { ...properties, userIp };
          console.log('PostWebEvent.proerties', properties);

          console.log('ReactPixel.track StartTrial');
          ReactPixel.track('StartTrial', {});

          postWebEvent({
            userId: userData.userId,
            event: EVENTS.TRIAL_STARTED,
            properties
          });
        });
    }
  }, [userData?.userId]);

  const handleNextClick = React.useCallback(() => {
    const stepName = stepNameParam;
    //@ts-ignore
    const taskName = locationState?.taskName ?? activeTaskData.taskName;

    const stylistId = userData.homePageStylist;

    const journeySearch =
      !!stepName && !location.search.includes('stepName')
        ? location.search + `?stepName=${stepName}`
        : location.search;

    if (!stepName && !taskName) {
      history.push({
        pathname: '/homepage'
      });

      return;
    }

    if (!stylistId) {
      /* Save task data again after recurly redirect */
      setActiveTaskData(taskDefinition);

      history.push({
        pathname: `/stylist-matching/${taskName}`,
        search: journeySearch
      });

      return;
    }

    /* Has questions form (redirect to /task-chat) */
    if (taskDefinition?.forms) {
      history.push({
        pathname: `/task-chat/${taskName}`,
        search: journeySearch,
        state: {
          stylistId: stylistId,
          taskForms: taskDefinition.forms,
          taskType: taskDefinition.taskType,
          taskTier: taskDefinition.tier,
          mustUseChosenStylist: initiatePaymentData?.mustUseChosenStylist
        } as any
      });
    } else {
      /* Has no questions form (getStyled -> /homepage) */
      const variables: GQLGetStyledVars = {
        userId: userData?.userId,
        ...initiatePaymentData
      };

      trackEvent({
        event: EVENTS.TASK_STARTED,
        properties: {
          component: 'PaymentSuccessPage',
          isChatUI: false,
          ...variables
        },
        callback: () => getStyled(variables)
      });
    }
  }, [initiatePaymentData, taskDefinition]);

  return (
    <>
      {(loadingGetStyled ||
        loadingInitiatePayment ||
        loadingTaskDefinition) && <TopBarProgress />}

      <StyledPaymentSuccessPage>
        <StyledBgImage />
        <h2>Welcome to the Club!</h2>
        <p className="body">
          Your membership is active. You can now request StyleUps and chat with{' '}
          {homePageStylist.firstName}!
        </p>

        <OrderSummaryBlock
          coupon={{
            data: location.state?.coupon,
            status: !!location.state?.coupon ? REQUEST_STATUSES.GOT : undefined
          }}
        />

        {!isMobileApp && (
          <Button data-type="secondary" onClick={openAppStore}>
            Continue in the App
          </Button>
        )}

        <Button onClick={handleNextClick}>Continue</Button>
      </StyledPaymentSuccessPage>
    </>
  );
};

export default PaymentSuccessPage;
