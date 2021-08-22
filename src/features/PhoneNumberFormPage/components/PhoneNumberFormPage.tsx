import * as React from 'react';
import { RouteComponentProps, useLocation } from 'react-router';

/* Components */
import { RootContext, RootContextType } from 'App/components';
import { PhoneNumberFormComponent } from './PhoneNumberFormComponent';
import { FORM_ACTIONS } from 'App/api/serveForm';

/* Utils */
import { isMobileApp } from 'core/utils';

type Props = RouteComponentProps;
interface LocationState {
  action: FORM_ACTIONS;
}

const PhoneNumberFormPage: React.FC<Props> = ({ history }: Props) => {
  const { state: locationState } = useLocation<LocationState>();

  const {
    state: { isAbTesting, isAutomated },
    actions: { trackPage }
  } = React.useContext<RootContextType>(RootContext);

  React.useEffect(() => {
    trackPage({
      name: 'PhoneNumberFormPage'
    });
  }, []);

  const handleSubmit = React.useCallback(() => {
    if (isAbTesting && isAutomated && !!locationState?.action) {
      switch (locationState?.action) {
        case FORM_ACTIONS.DOWNLOAD:
          history.push({
            pathname: isMobileApp() ? '/homepage' : '/download',
            search: location.search
          });
          return;
        case FORM_ACTIONS.SUGGEST:
          history.push({
            pathname: '/task-await',
            search: location.search
          });
          return;
        default:
          history.push({
            pathname: '/homepage'
          });
          return;
      }
    }

    history.push({
      pathname: '/homepage'
    });
  }, []);

  return <PhoneNumberFormComponent onSubmit={handleSubmit} />;
};

export default PhoneNumberFormPage;
