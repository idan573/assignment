import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';

/* Types */
import { Stylist } from 'App/types';

/* Components */
import { RootContext, RootContextType } from 'App/components';
import { StylistListComponent } from 'features/StylistListPage/components/StylistListComponent';

type Props = RouteComponentProps;

const StylistList: React.FC<Props> = React.memo(
  ({ history, location }: Props) => {
    const {
      actions: { trackPage }
    } = React.useContext<RootContextType>(RootContext);

    React.useEffect(() => {
      trackPage({
        name: 'StylistListPage'
      });
    }, []);

    const handleStylistClick = React.useCallback((stylist: Stylist) => {
      history.push({
        pathname: `/onboarding/stylist-overview/${stylist.stylistId}`,
        search: location.search
      });
    }, []);

    return <StylistListComponent onStylistClick={handleStylistClick} />;
  }
);

export default StylistList;
