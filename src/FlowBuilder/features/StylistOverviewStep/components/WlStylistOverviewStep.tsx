import * as React from 'react';
import { Loader } from '@bit/scalez.savvy-ui.loader';
import { Button } from '@bit/scalez.savvy-ui.button';
import { FloatWrapper } from '@bit/scalez.savvy-ui.float-wrapper';
import { useRequest, useLazyRequest } from '@bit/scalez.savvy-ui.hooks';

/* Context */
import { FlowContext, FlowContextType } from 'FlowBuilder/FlowProvider';

/* Services */
import { EVENTS } from 'services/analyticsService';

/* Api */
import { GQLGetStylistVars, getStylistQuery } from 'App/api/stylist/getStylist';
import {
  GQLSetUserStylistVars,
  setUserStylistMutation
} from 'App/api/user/setUserStylist';

import { Stylist, CLIENT_TYPE } from 'App/types';
import { FlowRouteProps } from 'FlowBuilder/types';

/* Components */
import { StylistOverviewComponent } from 'features/StylistOverviewPage/components/StylistOverviewComponent';
import { StylistOutfitsList } from 'features/StylistOverviewPage/components/StylistOutfitsList/StylistOutfitsList';

const WlStylistOverviewStep: React.FC<FlowRouteProps> = React.memo(
  ({ userData, onNext, currentFlowState }: FlowRouteProps) => {
    const {
      actions: { setPartialUserData, trackEvent }
    } = React.useContext<FlowContextType>(FlowContext);

    const stylistId = currentFlowState.stylistId;

    const { data: stylistData = {}, loading: loadingStylist } = useRequest<
      GQLGetStylistVars,
      Stylist
    >(getStylistQuery, {
      payload: {
        stylistId
      },
      skip: !stylistId
    });

    const [setUserStylist] = useLazyRequest<GQLSetUserStylistVars, void>(
      setUserStylistMutation
    );

    const handleChoose = React.useCallback(() => {
      setUserStylist({
        userId: userData.userId,
        stylistId: stylistData.stylistId
      });

      setPartialUserData({
        clientType: CLIENT_TYPE.FOLLOWER,
        homePageStylist: stylistData.stylistId
      });

      trackEvent({
        event: EVENTS.STYLIST_SELECTED,
        properties: {
          isFlow: true,
          selectionType: 'selected',
          stylistId: stylistData.stylistId,
          stylistFirstName: stylistData.firstName,
          stylistLastName: stylistData.lastName
        }
      });

      onNext();
    }, [stylistData]);

    return (
      <>
        <Loader render={loadingStylist} />

        {!loadingStylist && !!stylistId && (
          <>
            <StylistOverviewComponent stylistData={stylistData} />
            <StylistOutfitsList
              stylistId={stylistData.stylistId}
              isAllowRate={false}
            />
          </>
        )}

        <FloatWrapper
          render={!loadingStylist}
          position="bottom"
          transition="slide-bottom"
        >
          <Button onClick={handleChoose}>Continue</Button>
        </FloatWrapper>
      </>
    );
  }
);

export default WlStylistOverviewStep;
