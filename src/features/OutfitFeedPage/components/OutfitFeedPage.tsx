import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { Button } from '@bit/scalez.savvy-ui.button';
import { useRequest } from '@bit/scalez.savvy-ui.hooks';
import {
  HEADER_ITEM_TYPES,
  HEADER_ITEM_POSITION_TYPES
} from '@bit/scalez.savvy-ui.header';
import { dateToISOString } from '@bit/scalez.savvy-ui.utils';

/* Analytics */
import { EVENTS } from 'services/analyticsService';

/* Api */
import {
  GQLRetrieveUserThreadsVars,
  getUnseenThreadsNumberQuery
} from 'App/api/thread/retrieveUserThreads';
import {
  GQLScrollOutfitsVars,
  ScrollOutfitsData,
  scrollOutfitsQuery
} from 'App/api/outfit/scrollOutfits';

/* Components */
import { RootContext, RootContextType } from 'App/components/RootProvider';
import { OutfitsList } from 'Layouts/OutfitsList/OutfitsList';
import TopBarProgress from 'react-topbar-progress-indicator';

/* Types */
import { APP_HEADER_ITEM_TYPES } from 'App/components/AppHeader/AppHeader';
import { CLIENT_TYPE, Outfit } from 'App/types';

/* Assets */
import img1 from '../assets/1.jpg';
import img2 from '../assets/2.jpg';
import img3 from '../assets/3.jpg';
import img4 from '../assets/4.jpg';
import img5 from '../assets/5.jpg';

/* Styles */
import { StyledOutfitFeedPage, StyledHappyUserImage } from './styles';

type Props = RouteComponentProps;

const listConfig = {
  /* Header + Navbar heights */
  screenContentHeight:
    +getComputedStyle(document.documentElement)
      .getPropertyValue('--headerHeight')
      .replace('px', '') * 2
};

const OutfitFeedPage: React.FC<Props> = ({ history, location }: Props) => {
  const {
    state: { userData, isAbTesting, isAutomated },
    actions: { setActiveStepData, trackPage, trackEvent }
  } = React.useContext<RootContextType>(RootContext);

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

  const previousMonth = React.useCallback((previousMonth: number) => {
    const date = new Date(); //Today;
    date.setMonth(date.getMonth() - previousMonth);

    return date;
  }, []);

  const { data: scrollOutfits = {}, loading: loadingOutfits } = useRequest<
    GQLScrollOutfitsVars,
    ScrollOutfitsData
  >(scrollOutfitsQuery, {
    initialState: {
      loading: true
    },
    payload: {
      userId: userData?.userId,
      fromDate: fromDate || dateToISOString({ date: previousMonth(2) }),
      toDate: toDate || dateToISOString() + 'T23:59:59',
      numberOfOutfits: 50
    }
  });

  const { data: unseenThreadsNumber } = useRequest<
    GQLRetrieveUserThreadsVars,
    number
  >(getUnseenThreadsNumberQuery, {
    payload: {
      userId: userData.userId
    }
  });

  React.useEffect(() => {
    trackPage({
      name: 'OutfitFeedPage'
    });

    trackEvent({
      event: EVENTS.OUTFIT_FEED_OPENED
    });
  }, []);

  React.useEffect(() => {
    setActiveStepData(prevState => ({
      ...prevState,
      headerConfig: [
        {
          type: HEADER_ITEM_TYPES.TITLE,
          props: {
            dataSelfPosition: HEADER_ITEM_POSITION_TYPES.LEFT,
            children: 'Outfeed'
          }
        },
        {
          type: APP_HEADER_ITEM_TYPES.NOTIFICATION,
          props: {
            notificationsCount: unseenThreadsNumber
          }
        },
        {
          type: HEADER_ITEM_TYPES.BUTTON,
          props: {
            dataSelfPosition: HEADER_ITEM_POSITION_TYPES.RIGHT,
            ['data-action']: 'menu'
          }
        }
      ]
    }));
  }, [unseenThreadsNumber]);

  const handleSubscribeClick = React.useCallback(() => {
    if (userData?.clientType === CLIENT_TYPE.FOLLOWER) {
      return !!userData?.tasksCount
        ? history.push({
            pathname: '/payment/chargebee',
            search: location.search
          })
        : history.push({
            pathname: '/payment/pre-payment',
            search: location.search
          });
    }

    history.push({
      pathname: '/payment/trial',
      search: location.search
    });
  }, []);

  return (
    <>
      {loadingOutfits ? (
        <TopBarProgress />
      ) : (
        <StyledOutfitFeedPage>
          <OutfitsList outfits={scrollOutfits.outfits} listConfig={listConfig}>
            <div className="list-header">
              <div className="images-block">
                {[img1, img2, img3, img4, img5].map((src, key) => (
                  <StyledHappyUserImage key={key} src={src} />
                ))}
              </div>

              <p className="message body">
                Browse looks from fashion creators on Savvy. ❤️ to save items to
                closet!
              </p>
            </div>

            {!userData.subscribedToService && (
              <div className="subscribe-block">
                <h4>Want outfits personalized to you by a pro stylist?</h4>
                <Button
                  data-action-position="center"
                  onClick={handleSubscribeClick}
                >
                  Subscribe Now
                </Button>
              </div>
            )}
          </OutfitsList>
        </StyledOutfitFeedPage>
      )}
    </>
  );
};

export default OutfitFeedPage;
