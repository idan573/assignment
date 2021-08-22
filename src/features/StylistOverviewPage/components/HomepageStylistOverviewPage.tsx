import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Button } from '@bit/scalez.savvy-ui.button';
import { FloatWrapper } from '@bit/scalez.savvy-ui.float-wrapper';

/* Types */
import { Stylist } from 'App/types';

/* Components */
import { RootContext, RootContextType } from 'App/components';
import { StylistOverviewComponent } from './StylistOverviewComponent';
import { StylistOutfitsList } from './StylistOutfitsList/StylistOutfitsList';

type Props = RouteComponentProps;

const HomepageStylistOverviewPage: React.FC<Props> = React.memo(
  ({ history, location }: Props) => {
    const {
      state: { homePageStylist, userData },
      actions: { trackPage }
    } = React.useContext<RootContextType>(RootContext);

    React.useEffect(() => {
      trackPage({
        name: 'HomepageStylistOverviewPage',
        properties: {
          stylistId: homePageStylist.stylistId
        }
      });
    }, []);

    const onSwitchStylist = React.useCallback(() => {
      history.push({
        pathname: '/stylist-list',
        search: location.search
      });
    }, []);

    return (
      <>
        <StylistOverviewComponent stylistData={homePageStylist} />

        <StylistOutfitsList stylistId={homePageStylist.stylistId} />

        <FloatWrapper
          position="bottom"
          transition="slide-bottom"
          render={!!userData?.userId && !userData?.subscribedToService}
        >
          <Button data-type="secondary" onClick={onSwitchStylist}>
            Switch Stylist
          </Button>
        </FloatWrapper>
      </>
    );
  }
);

export default HomepageStylistOverviewPage;
