import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { FloatWrapper } from '@bit/scalez.savvy-ui.float-wrapper';
import { Button } from '@bit/scalez.savvy-ui.button';
import { dateToISOString } from '@bit/scalez.savvy-ui.utils';
import TopBarProgress from 'react-topbar-progress-indicator';
import { useLazyRequest, useRequest } from '@bit/scalez.savvy-ui.hooks';

/* Analytics */
import { EVENTS } from 'services/analyticsService';

/* Api */
import { GQLUpdateUserVars, updateUserMutation } from 'App/api/user/updateUser';
import {
  GQLSuggestOutfitsVars,
  suggestOutfitsQuery
} from 'App/api/outfit/suggestOutfits';

/* Types */
import { Outfit } from 'App/types';

/* Components */
import { RootContext, RootContextType } from 'App/components/RootProvider';
import { OutfitsList } from 'Layouts/OutfitsList/OutfitsList';

/* Styles */
import { StyledOutfitMatchingPage } from './styles';

type Props = RouteComponentProps;

const listConfig = {
  /* Header + Navbar heights */
  screenContentHeight:
    +getComputedStyle(document.documentElement)
      .getPropertyValue('--headerHeight')
      .replace('px', '') * 2
};

const OutfitMatchingPage: React.FC<Props> = ({ location, history }: Props) => {
  const {
    stylesIds,
    fromDate,
    toDate,
    scores,
    isBaseProduct
  } = React.useMemo(() => {
    const searchParams = new URLSearchParams(location.search);
    return {
      stylesIds: searchParams.get('stylesIds')?.split(','),
      fromDate: searchParams.get('fromDate'),
      toDate: searchParams.get('toDate'),
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

  const { data: outfits = [], loading: loadingOutfit } = useRequest<
    GQLSuggestOutfitsVars,
    Outfit[]
  >(suggestOutfitsQuery, {
    payload: {
      stylesIds,
      userId: userData.userId,
      fromDate: fromDate || dateToISOString({ date: new Date(0) }),
      toDate: toDate || dateToISOString() + 'T23:59:59',
      numberOfOutfits: 1
    },
    onCompleted: (outfits: Outfit[]) => {
      const outfit = outfits?.[0];

      if (!!outfit) {
        trackEvent({
          event: EVENTS.OUTFIT_MATCH_OPENED,
          properties: {
            stylistId: outfit?.stylist?.stylistId,
            score: scores ? scores[0] : outfit?.score,
            productIds: outfit?.products?.map?.(product => product.productId)
          }
        });
      }
    }
  });

  React.useEffect(() => {
    trackPage({
      name: 'OutfitMatchingPage'
    });

    if (!!utmSource && !userData?.utmSource) {
      if (!userData?.userId) {
        return;
      }

      trackEvent({
        event: EVENTS.OUTFIT_SHARE_OPENED,
        properties: {
          properties: {
            utmSource,
            userId: userData?.userId,
            utmMedium,
            sender,
            utmCampaign
          }
        }
      });

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
      {loadingOutfit ? (
        <TopBarProgress />
      ) : (
        <StyledOutfitMatchingPage>
          <OutfitsList
            scores={scores}
            outfits={outfits}
            listConfig={listConfig}
          >
            <p className="message body">
              {isBaseProduct
                ? 'Here’s outfit inspo from your closet. Want more? Continue your journey with a pro!'
                : utmSource === 'share'
                ? 'What do you think about this look?'
                : 'Savvy matched you with this look!'}
            </p>
          </OutfitsList>
        </StyledOutfitMatchingPage>
      )}

      <FloatWrapper position="bottom" transition="slide-bottom" order={1}>
        <Button onClick={handleNextClick}>
          {!!userData?.userId ? 'Continue Your Journey' : 'Start Your Journey'}
        </Button>
      </FloatWrapper>
    </>
  );
};

export default OutfitMatchingPage;
