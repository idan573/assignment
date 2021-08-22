import React from 'react';
import { RouteComponentProps } from 'react-router';

/* Components */
import { RootContext, RootContextType } from 'App/components';
import { PhoneNumberFormComponent } from 'features/PhoneNumberFormPage/components/PhoneNumberFormComponent';
import { OnboardingComponentProps } from '../OnboardingFlow';

type Props = RouteComponentProps & OnboardingComponentProps;

const PhoneNumberForm: React.FC<Props> = ({
  history,
  location,
  onboardingRedirect
}: Props) => {
  const {
    actions: { trackPage }
  } = React.useContext<RootContextType>(RootContext);

  React.useEffect(() => {
    trackPage({
      name: 'PhoneNumberFormPage'
    });
  }, []);

  return <PhoneNumberFormComponent />;
};

export default PhoneNumberForm;
