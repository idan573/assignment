import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';

/* Types */
import { Stylist } from 'App/types';

/* Components */
import { RootContext, RootContextType } from 'App/components';
import { StylistMatchingComponent } from 'features/StylistMatchingPage/components/StylistMatchingComponent';
import { OnboardingComponentProps } from '../OnboardingFlow';

type Props = RouteComponentProps & OnboardingComponentProps;

const StylistMatching: React.FC<Props> = React.memo(
  ({ history, location }: Props) => {
    const {
      state: { activeTaskData },
      actions: { trackPage }
    } = React.useContext<RootContextType>(RootContext);

    const [matchedStylist, setMatchedStylist] = React.useState<Stylist>({});

    React.useEffect(() => {
      trackPage({
        name: 'StylistMatchingPage'
      });
    }, []);

    const handleChooseOtherStylist = React.useCallback(() => {
      history.push({
        pathname: '/onboarding/stylist-list',
        search: location.search
      });
    }, []);

    return (
      <StylistMatchingComponent
        variables={{
          stylistsTiers: activeTaskData?.stylistsTiers
        }}
        onStylistGot={setMatchedStylist}
        onChooseOtherStylist={handleChooseOtherStylist}
      />
    );
  }
);

export default StylistMatching;
