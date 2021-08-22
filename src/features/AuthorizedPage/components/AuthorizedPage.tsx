import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { Loader } from '@bit/scalez.savvy-ui.loader';

/* Services */
import { authService } from 'services/authService';
import { appInitializationService } from 'services/appInitializationService';

/* Context */
import { RootContext, RootContextType } from 'App/components/RootProvider';

const AuthorizedPage: React.FC<RouteComponentProps> = ({
  location
}: RouteComponentProps) => {
  const {
    actions: { handleAppInit }
  } = React.useContext<RootContextType>(RootContext);

  const handleAuth = React.useCallback(async () => {
    const searchParams = new URLSearchParams(location.search);

    const redirectFn = await authService.verifyAuthenticationFromProviderRedirect(
      searchParams
    );

    await handleAppInit();

    redirectFn();
  }, []);

  React.useEffect(() => {
    handleAuth();
  }, []);

  return <Loader />;
};

export default AuthorizedPage;
