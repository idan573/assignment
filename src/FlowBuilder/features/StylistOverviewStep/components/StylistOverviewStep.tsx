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

const StylistOverviewStep: React.FC<FlowRouteProps> = React.memo(
  ({ userData, currentFlowState, onNext }: FlowRouteProps) => {
    const {
      actions: { setPartialUserData, trackPage, trackEvent }
    } = React.useContext<FlowContextType>(FlowContext);

    const {
      data: stylistData = {} as Stylist,
      loading: loadingStylist
    } = useRequest<GQLGetStylistVars, Stylist>(getStylistQuery, {
      skip: !currentFlowState?.stylistId,
      payload: {
        stylistId: currentFlowState?.stylistId
      }
    });

    const [setUserStylist] = useLazyRequest<GQLSetUserStylistVars, void>(
      setUserStylistMutation
    );

    React.useEffect(() => {
      trackPage({
        name: 'StylistOverviewPage',
        properties: {
          stylistId: currentFlowState?.stylistId
        }
      });
    }, []);

    const handleChoose = React.useCallback(() => {
      setUserStylist({
        userId: userData.userId,
        stylistId: stylistData.stylistId
      });

      setPartialUserData({
        clientType: CLIENT_TYPE.SAVVY,
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

        {!loadingStylist && (
          <StylistOverviewComponent stylistData={stylistData} />
        )}

        <FloatWrapper
          render={!loadingStylist}
          position="bottom"
          transition="slide-bottom"
        >
          <Button onClick={handleChoose}>
            {`Choose ${stylistData.firstName}`}
          </Button>
        </FloatWrapper>
      </>
    );
  }
);

export default StylistOverviewStep;
