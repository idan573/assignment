import * as React from 'react';
import { Loader } from '@bit/scalez.savvy-ui.loader';
import { Button } from '@bit/scalez.savvy-ui.button';
import { FloatWrapper } from '@bit/scalez.savvy-ui.float-wrapper';
import { useRequest } from '@bit/scalez.savvy-ui.hooks';
import { StylistProfileOverview } from '@bit/scalez.savvy-ui.stylist-profile-overview';

/* Context */
import { FlowContext, FlowContextType } from 'FlowBuilder/FlowProvider';

/* Api */
import { GQLGetStylistVars, getStylistQuery } from 'App/api/stylist/getStylist';
import {
  GQLGetPlanByExpertIdChargebeeVars,
  getPlanByExpertIdChargebeeQuery
} from 'App/api/chargebee/getPlanByExpertId';

/* Types */
import { Stylist, ChargebeePaymentPlan } from 'App/types';
import { FlowRouteProps } from 'FlowBuilder/types';

/* Components */
import { StylistOutfitsList } from 'features/StylistOverviewPage/components/StylistOutfitsList/StylistOutfitsList';

const CreatorStylistOverviewStep: React.FC<FlowRouteProps> = React.memo(
  ({ onNext, currentFlowState: { stylistId } }: FlowRouteProps) => {
    const { data: stylistData = {}, loading: loadingStylist } = useRequest<
      GQLGetStylistVars,
      Stylist
    >(getStylistQuery, {
      payload: {
        stylistId
      },
      skip: !stylistId
    });

    const { data: plan, loading: loadingChargebeePlan } = useRequest<
      GQLGetPlanByExpertIdChargebeeVars,
      ChargebeePaymentPlan
    >(getPlanByExpertIdChargebeeQuery, {
      payload: {
        userId: stylistId
      },
      skip: !stylistId
    });

    const stylistProfile = React.useMemo(
      () => ({
        firstName: stylistData.firstName,
        lastName: stylistData.lastName,
        userName: stylistData.userName,
        profilePicture: stylistData.profilePicture,
        greetingMessage: stylistData.stylistAttributes?.greetingMessage,
        bio: stylistData.stylistAttributes?.bio,
        bioVideo: stylistData.stylistAttributes?.bioVideo,
        benefits: stylistData.stylistAttributes?.benefits ?? []
      }),
      [stylistData]
    );

    return (
      <>
        <Loader render={loadingStylist} />

        {!loadingStylist && !!stylistId && (
          <section style={{ paddingBottom: '100px' }}>
            <StylistProfileOverview
              subscriptionPlan={plan}
              stylist={stylistProfile}
            />
            <StylistOutfitsList
              stylistId={stylistData.stylistId}
              isAllowRate={false}
            />
          </section>
        )}

        <FloatWrapper
          render={!loadingStylist}
          position="bottom"
          transition="slide-bottom"
        >
          <Button onClick={() => onNext()}>Continue</Button>
        </FloatWrapper>
      </>
    );
  }
);

export default CreatorStylistOverviewStep;
