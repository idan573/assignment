import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';

/* Components */
import { RootContext, RootContextType } from 'App/components';
import { HowItWorksComponent } from 'features/HowItWorksPage/components/HowItWorksComponent';
import {
  OnboardingFlowContext,
  OnboardingFlowContextType
} from '../OnboardingFlowProvider';
import { OnboardingComponentProps } from '../OnboardingFlow';

type Props = RouteComponentProps & OnboardingComponentProps;

const HowItWorks: React.FC<Props> = React.memo(() => {
  const {
    actions: { trackPage }
  } = React.useContext<RootContextType>(RootContext);

  const {
    actions: { toggleIsSeenHowItWorks }
  } = React.useContext<OnboardingFlowContextType>(OnboardingFlowContext);

  React.useEffect(() => {
    trackPage({
      name: 'HowItWorksPage'
    });
  }, []);

  return (
    <HowItWorksComponent
      onClick={() => {
        toggleIsSeenHowItWorks(true);
      }}
    />
  );
});

export default HowItWorks;
