import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { Button } from '@bit/scalez.savvy-ui.button';

/* Utils */
import { openAppStore } from 'core/utils';

/* Services */
import { EVENTS } from 'services/analyticsService';

/* Context */
import { RootContext, RootContextType } from 'App/components/RootProvider';

/* Styles */
import { StyledAppDownloadPage, StyledBgImage } from './styles';

type Props = RouteComponentProps;

const AppDownloadPage: React.FC<Props> = ({ location, history }: Props) => {
  const {
    actions: { trackPage, trackEvent }
  } = React.useContext<RootContextType>(RootContext);

  React.useEffect(() => {
    trackPage({
      name: 'AppDownloadPage'
    });
  }, []);

  const handleSkip = React.useCallback(() => {
    history.push({
      pathname: '/task-await',
      search: location.search
    });
  }, []);

  const onDownloadAppClicked = React.useCallback(() => {
    trackEvent({ event: EVENTS.DOWNLOAD_APP_CLICKED });
    openAppStore();
  }, []);

  return (
    <StyledAppDownloadPage>
      <StyledBgImage />

      <h2>Download the App</h2>

      <p className="body">For the smoothest experience download the app.</p>

      <Button
        data-type="primary"
        data-size="small"
        onClick={onDownloadAppClicked}
      >
        Download the App
      </Button>

      <Button data-type="secondary" data-size="small" onClick={handleSkip}>
        Skip
      </Button>
    </StyledAppDownloadPage>
  );
};

export default AppDownloadPage;
