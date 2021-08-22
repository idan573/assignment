import * as React from 'react';
import { Loader } from '@bit/scalez.savvy-ui.loader';
import { useRequest } from '@bit/scalez.savvy-ui.hooks';

/* Api */
import { GQLGetStepVars, getStepQuery } from 'App/api/journey/getStep';

/* Types */
import { Step } from 'App/types';

/* Components */
import { RootContext, RootContextType } from 'App/components';

export enum ONBOARDING_TYPES {
  SHORT = 'short',
  LONG = 'long'
}

type OnboardingFlowContextState = Partial<{
  isStepFree: boolean;
  isSeenHowItWorks: boolean;
  onboardingType: ONBOARDING_TYPES;
}>;

type OnboardingFlowContextActions = Partial<{
  toggleIsSeenHowItWorks: (flag: boolean) => void;
  setOnboardingType: (type: ONBOARDING_TYPES) => void;
}>;

export type OnboardingFlowContextType = {
  state: OnboardingFlowContextState;
  actions: OnboardingFlowContextActions;
};

export const OnboardingFlowContext = React.createContext<
  OnboardingFlowContextType
>({
  state: {
    isSeenHowItWorks: false
  },
  actions: {}
});

type Props = {
  children: string | JSX.Element | (string | JSX.Element)[];
};

const OnboardingFlowProvider: React.FC<Props> = React.memo(
  ({ children }: Props) => {
    const { stepName } = React.useMemo(() => {
      const searchParams = new URLSearchParams(location.search);
      return {
        stepName: searchParams.get('stepName')
      };
    }, []);

    const {
      state: { userData, isUserHasAllPersonalInfo }
    } = React.useContext<RootContextType>(RootContext);

    const [onboardingType, setOnboardingType] = React.useState<
      ONBOARDING_TYPES
    >();

    const [isSeenHowItWorks, toggleIsSeenHowItWorks] = React.useState<boolean>(
      false
    );

    const { data: stepInfo, loading: loadingStepInfo } = useRequest<
      GQLGetStepVars,
      Step
    >(getStepQuery, {
      initialState: {
        loading: !!stepName
      },
      skip: !stepName,
      payload: {
        stepName
      }
    });

    return (
      <>
        {loadingStepInfo ? (
          <Loader />
        ) : (
          <OnboardingFlowContext.Provider
            value={{
              state: {
                onboardingType,
                isSeenHowItWorks,
                isStepFree: !!stepInfo?.isFree
              },
              actions: {
                toggleIsSeenHowItWorks,
                setOnboardingType
              }
            }}
          >
            {children}
          </OnboardingFlowContext.Provider>
        )}
      </>
    );
  }
);

export default OnboardingFlowProvider;
