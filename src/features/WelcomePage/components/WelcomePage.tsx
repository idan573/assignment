import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';

/* Services */
import { authService } from 'services/authService';

/* Context */
import { RootContext, RootContextType } from 'App/components';

/* Components */
import { WelcomeComponent } from './WelcomeComponent';

type Props = RouteComponentProps;

const WelcomePage: React.FC<Props> = React.memo(
  ({ history, location }: Props) => {
    const {
      state: { isUserHasAllPersonalInfo },
      actions: { trackPage }
    } = React.useContext<RootContextType>(RootContext);

    React.useEffect(() => {
      trackPage({
        name: 'WelcomePage'
      });
    }, []);

    const handleRedirectNext = React.useCallback(async () => {
      const isAuthenticated = await authService.isAuthenticated();

      if (isAuthenticated) {
        history.push({
          pathname: isUserHasAllPersonalInfo ? '/homepage' : `/create-profile`,
          search: location.search
        });
      } else {
        authService.login();
      }
    }, []);

    return <WelcomeComponent onClick={handleRedirectNext} />;
  }
);

export default WelcomePage;
