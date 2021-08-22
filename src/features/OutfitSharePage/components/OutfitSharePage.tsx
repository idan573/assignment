import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { FloatWrapper } from '@bit/scalez.savvy-ui.float-wrapper';
import { Button } from '@bit/scalez.savvy-ui.button';
import { dateToISOString } from '@bit/scalez.savvy-ui.utils';
import TopBarProgress from 'react-topbar-progress-indicator';
import { useLazyRequest, useRequest } from '@bit/scalez.savvy-ui.hooks';

/* Analytics */
import { EVENTS } from 'services/analyticsService';

/* Types */
import { Outfit } from 'App/types';

/* Components */
import { RootContext, RootContextType } from 'App/components/RootProvider';
import { OutfitsList } from 'Layouts/OutfitsList/OutfitsList';

/* Api */
import { GQLUpdateUserVars, updateUserMutation } from 'App/api/user/updateUser';
import {
  GQLSuggestOutfitsVars,
  suggestOutfitsQuery
} from 'App/api/outfit/suggestOutfits';

/* Styles */
import { StyledOutfitSharePage } from './styles';

type Props = RouteComponentProps;

const listConfig = {
  /* Header + Navbar heights */
  screenContentHeight:
    +getComputedStyle(document.documentElement)
      .getPropertyValue('--headerHeight')
      .replace('px', '') * 2
};

//TODO: Unite all outfit pages to one folder and use common logic
const OutfitSharePage: React.FC<Props> = ({ location, history }: Props) => {
  const { stylesIds, scores, isBaseProduct } = React.useMemo(() => {
    const searchParams = new URLSearchParams(location.search);
    return {
      stylesIds: searchParams.get('stylesIds')?.split(','),
      scores: searchParams
        .get('scores')
        ?.split(',')
        .map(item => Number(item)),
      isBaseProduct: searchParams.get('isBaseProduct') === 'true'
    };
  }, []);

  const {
    state: { userData, utmSource, utmCampaign, utmMedium, sender },
    actions: { trackPage, trackEvent }
  } = React.useContext<RootContextType>(RootContext);

  const [updateUser, { loading: updateUserLoading }] = useLazyRequest<
    GQLUpdateUserVars,
    void
  >(updateUserMutation);

  const { data: outfits, loading: outfitLoading } = useRequest<
    GQLSuggestOutfitsVars,
    Outfit[]
  >(suggestOutfitsQuery, {
    payload: {
      stylesIds,
      userId: userData.userId,
      numberOfOutfits: 1
    },
    onCompleted: (outfits: Outfit[]) => {
      const outfit = outfits?.[0];

      if (!!outfit) {
        trackEvent({
          event: EVENTS.OUTFIT_SHARE_OPENED,
          properties: {
            stylistId: outfit.stylist?.stylistId,
            productIds: outfit.products?.map?.(product => product.productId),
            userId: userData?.userId,
            sharingUserId: sender,
            stylistFirstName: outfit.stylist?.firstName,
            stylistLastName: outfit.stylist?.lastName,
            utmSource,
            utmMedium,
            utmCampaign
          }
        });
      }
    }
  });

  React.useEffect(() => {
    trackPage({
      name: 'OutfitSharePage'
    });

    if (!!utmSource && !userData?.utmSource) {
      if (!userData?.userId) {
        return;
      }

      updateUser({
        userId: userData.userId,
        attributes: {
          utmSource,
          utmMedium,
          utmCampaign
        }
      });
    }
  }, []);

  const handleNextClick = React.useCallback(
    () =>
      history.push({
        pathname: '/homepage',
        search: location.search
      }),
    []
  );

  return (
    <>
      {outfitLoading ? (
        <TopBarProgress />
      ) : (
        <StyledOutfitSharePage>
          <OutfitsList
            scores={scores}
            outfits={outfits}
            listConfig={listConfig}
          >
            <h4 className="message body">Dress you best with Savvy.Style</h4>
            <p className="message body">Your very own personal Style Coach</p>
          </OutfitsList>
        </StyledOutfitSharePage>
      )}

      <FloatWrapper position="bottom" transition="slide-bottom" order={1}>
        <Button onClick={handleNextClick}>
          {!!userData?.userId ? 'Continue Your Journey' : 'Start Your Journey'}
        </Button>
      </FloatWrapper>
    </>
  );
};

export default OutfitSharePage;
