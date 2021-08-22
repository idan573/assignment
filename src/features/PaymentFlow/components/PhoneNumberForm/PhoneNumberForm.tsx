import React from 'react';
import { RouteComponentProps } from 'react-router';

/* Components */
import { RootContext, RootContextType } from 'App/components';
import { PhoneNumberFormComponent } from 'features/PhoneNumberFormPage/components/PhoneNumberFormComponent';

type Props = RouteComponentProps;

const PhoneNumberForm: React.FC<Props> = ({ history }: Props) => {
  const {
    state: { isAutomated, isAbTesting },
    actions: { trackPage }
  } = React.useContext<RootContextType>(RootContext);

  React.useEffect(() => {
    trackPage({
      name: 'PhoneNumberFormPage'
    });
  }, []);

  const handleSubmit = React.useCallback(() => {
    /* AB Testing */
    if (isAbTesting && !isAutomated) {
      history.push({
        pathname: '/payment/trial',
        search: location.search
      });
      return;
    }
    history.push({
      pathname: '/payment/trial',
      search: location.search
    });
  }, []);

  return <PhoneNumberFormComponent onSubmit={handleSubmit} />;
};

export default PhoneNumberForm;
