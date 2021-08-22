import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';

/* Components */
import { RootContext, RootContextType } from 'App/components';
import { HowItWorksComponent } from './HowItWorksComponent';

const HowItWorksPage: React.FC<RouteComponentProps> = ({
  location,
  history
}: RouteComponentProps) => {
  const {
    actions: { trackPage }
  } = React.useContext<RootContextType>(RootContext);

  React.useEffect(() => {
    trackPage({
      name: 'HowItWorksPage'
    });
  }, []);

  const handleNextClick = React.useCallback(() => {
    history.push({
      pathname: '/create-profile',
      search: location.search
    });
  }, []);

  return <HowItWorksComponent onClick={handleNextClick} />;
};

export default HowItWorksPage;
