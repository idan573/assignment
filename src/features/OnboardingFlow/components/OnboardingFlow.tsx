import * as React from 'react';
import { Switch, Route, RouteComponentProps } from 'react-router-dom';
import { getSearchParams, setQueryString } from '@bit/scalez.savvy-ui.utils';

/* Core */
import { getSavvyStylistId, isMobileApp } from 'core/utils';

/* Router Config */
import { onboardingFlowRoutes } from 'App/components/routerConfig';

/* Components */
import { RootContext, RootContextType } from 'App/components';
import { StandaloneFlowStep } from 'App/components/StandaloneFlowStep/StandaloneFlowStep';
import {
  ONBOARDING_TYPES,
  OnboardingFlowContext,
  OnboardingFlowContextType
} from './OnboardingFlowProvider';

export type OnboardingComponentProps = {
  onboardingRedirect: () => void;
};

type Props = RouteComponentProps<{
  pageName?: string;
}>;

const OnboardingFlow: React.FC<Props> = React.memo(
  ({ history, location }: Props) => {
    const { stepName } = React.useMemo(() => {
      const searchParams = new URLSearchParams(location.search);
      return {
        stepName: searchParams.get('stepName')
      };
    }, []);

    const {
      state: {
        userData,
        isUserHasAllPersonalInfo,
        activeTaskData,
        isAbTesting,
        isAutomated
      },
      actions: { setUserHomepageStylist }
    } = React.useContext<RootContextType>(RootContext);

    const {
      state: { isStepFree, onboardingType, isSeenHowItWorks },
      actions: { setOnboardingType }
    } = React.useContext<OnboardingFlowContextType>(OnboardingFlowContext);

    React.useEffect(() => {
      calcOnboardingRedirect();
    }, []);

    /* 
      No need to call redirect function
      you can only update relevant context data to preform redirect 
    */
    React.useEffect(() => {
      if (onboardingType === ONBOARDING_TYPES.SHORT) {
        onboardingRedirectShort();
        return;
      }

      if (onboardingType === ONBOARDING_TYPES.LONG) {
        onboardingRedirectLong();
        return;
      }
    }, [onboardingType, userData, isSeenHowItWorks]);

    const isNeedPayment = React.useMemo(() => {
      if (userData.subscribedToService) {
        return false;
      }

      /* If you didn't come from the journey you need to pay */
      if (!stepName) {
        return true;
      }

      /* If you're a new user and came from the app first task is free */
      if (!userData.tasksCount && isMobileApp()) {
        return false;
      }

      return !isStepFree;
    }, [isStepFree]);

    const calcOnboardingRedirect = React.useCallback(() => {
      const hasSavvyStylist = userData.homePageStylist === getSavvyStylistId();

      if (!isNeedPayment && hasSavvyStylist) {
        setOnboardingType(ONBOARDING_TYPES.SHORT);

        return;
      }

      if (!!isNeedPayment && hasSavvyStylist) {
        const resetedStylistId = '';

        setUserHomepageStylist(resetedStylistId);

        setOnboardingType(ONBOARDING_TYPES.LONG);

        return;
      }

      if (!!userData.subscribedToService && hasSavvyStylist) {
        const resetedStylistId = '';

        setUserHomepageStylist(resetedStylistId);

        setOnboardingType(ONBOARDING_TYPES.LONG);

        return;
      }

      if (!!isNeedPayment) {
        setOnboardingType(ONBOARDING_TYPES.LONG);

        return;
      }

      if (!!userData.homePageStylist && isUserHasAllPersonalInfo) {
        const search = setQueryString({
          ...getSearchParams(location.search),
          stepName: stepName === 'none' ? '' : stepName
        });

        history.push({
          pathname: `/task-chat/${activeTaskData?.taskName}`,
          search
        });

        return;
      }

      setOnboardingType(ONBOARDING_TYPES.LONG);
    }, [userData, isNeedPayment]);

    const onboardingRedirectShort = React.useCallback(() => {
      if (!userData.homePageStylist) {
        history.push({
          pathname: '/onboarding/stylist-matching',
          search: location.search
        });

        return;
      }

      if (
        !userData.phoneNumber &&
        /*AB testing */ !(isAutomated && isAbTesting)
      ) {
        history.push({
          pathname: '/onboarding/phone-number',
          search: location.search
        });

        return;
      }

      if (isNeedPayment) {
        putInitiatePayment({
          userId: userData?.userId,
          initiatePayment: {
            stylistId: userData.homePageStylist,
            taskName: activeTaskData.taskName,
            taskType: activeTaskData.taskType,
            tier: activeTaskData.tier,
            mustUseChosenStylist: userData?.clientType === 'follower',
            stepName
          }
        });

        history.push({
          pathname: '/payment/trial',
          search: location.search
        });

        return;
      }

      history.push({
        pathname: `/task-chat/${activeTaskData.taskName}`,
        search: location.search
      });
    }, [userData, isNeedPayment]);

    const onboardingRedirectLong = React.useCallback(() => {
      if (!isSeenHowItWorks) {
        history.push({
          pathname: '/onboarding/how-it-works',
          search: location.search
        });

        return;
      }

      if (!userData.homePageStylist) {
        history.push({
          pathname: '/onboarding/stylist-matching',
          search: location.search
        });

        return;
      }

      if (userData.subscribedToService && !isUserHasAllPersonalInfo) {
        history.push({
          pathname: '/onboarding/create-profile',
          search: location.search
        });

        return;
      }

      if (isNeedPayment) {
        history.push({
          pathname: '/payment/trial',
          search: location.search
        });

        return;
      }

      history.push({
        pathname: `/task-chat/${activeTaskData.taskName}`,
        search: location.search
      });
    }, [userData, isNeedPayment, isSeenHowItWorks]);

    const redirectFunctions = {
      [ONBOARDING_TYPES.SHORT]: onboardingRedirectShort,
      [ONBOARDING_TYPES.LONG]: onboardingRedirectLong
    };

    return (
      <Switch>
        {onboardingFlowRoutes.map(
          ({ pathname, component: Component, ...rest }: any, key) => (
            <Route
              key={key}
              path={pathname}
              render={props => (
                <StandaloneFlowStep {...rest}>
                  <Component
                    {...props}
                    onboardingRedirect={redirectFunctions[onboardingType]}
                  />
                </StandaloneFlowStep>
              )}
            />
          )
        )}
      </Switch>
    );
  }
);

export default OnboardingFlow;
function putInitiatePayment(arg0: {
  userId: string;
  initiatePayment: {
    stylistId: string;
    taskName: string;
    taskType: string;
    tier: string;
    mustUseChosenStylist: boolean;
    stepName: string;
  };
}) {
  throw new Error('Function not implemented.');
}
