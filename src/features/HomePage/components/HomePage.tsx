import * as React from 'react';
import { RouteComponentProps, useLocation } from 'react-router-dom';
import TopBarProgress from 'react-topbar-progress-indicator';
import {
  HEADER_ITEM_TYPES,
  HEADER_ITEM_POSITION_TYPES,
  HEADER_ITEM_TEMPLATE_TYPES
} from '@bit/scalez.savvy-ui.header';
import { Tabs } from '@bit/scalez.savvy-ui.tabs';
import { Button } from '@bit/scalez.savvy-ui.button';
import { useRequest, useRequestAll } from '@bit/scalez.savvy-ui.hooks';

/* Secvices */
import { authService } from 'services/authService';

/* Api */
import {
  GQLRetrieveUserThreadsVars,
  getUnseenThreadsNumberQuery
} from 'App/api/thread/retrieveUserThreads';
import {
  GQLGetHomepageVars,
  HomepageCategory,
  getHomePageQuery
} from 'App/api/getHomePage';
import { GQLGetUserVars, getUserQuery } from 'App/api/user/getUser';
import {
  GQLGetUserThreadsVars,
  getUserThreadsQuery
} from 'App/api/thread/getUserThreads';
import {
  GetJourneyByUserIdVars,
  getJourneyByUserId
} from '../api/getJourneyByUserId';
import {
  GetPrivateThreadIsSeenVars,
  getPrivateThreadIsSeenQuery
} from '../api/getPrivateThreadIsSeen';

/* Types */
import { User, Journey, STYLIST_TIER } from 'App/types';
import { APP_HEADER_ITEM_TYPES } from 'App/components/AppHeader/AppHeader';
import { Thread } from 'App/types/thread';

/* Components */
import { RootContext, RootContextType } from 'App/components';
import { Journey as JourneyComponent } from './Journey/Journey';
import { StyleChallenges } from './StyleChallenges/StyleChallenges';
import { StyleAdvices } from './StyleAdvices/StyleAdvices';
import { CreatorStyleAdvices } from './CreatorStyleAdvices/CreatorStyleAdvices';

/* Styles */
import {
  GlobalPageStyles,
  StyledHomepage,
  StyledAddStylistHeaderItem,
  StyledVacationStylistHeaderItem
} from './styles';

type LocationState = {
  activeTabIndex?: number;
};

type Props = RouteComponentProps<{}, any, LocationState>;

const HomePage: React.FC<Props> = React.memo(({ history, location }: Props) => {
  const { state: locationState = {} } = useLocation<LocationState>();

  const {
    state: {
      isCreatorFlow,
      isAutomated,
      userData,
      homePageStylist,
      activeStepData
    },
    actions: {
      trackPage,
      setActiveStepData,
      setActiveTaskData,
      setPartialUserData,
      setActiveJourneyInfo
    }
  } = React.useContext<RootContextType>(RootContext);

  const [isPrivateThreadSeenFlag, togglePrivateThreadSeenFlag] = React.useState<
    boolean
  >(true);

  useRequest<GetPrivateThreadIsSeenVars, boolean>(getPrivateThreadIsSeenQuery, {
    skip: !userData?.userId,
    payload: {
      userId: userData.userId
    },
    onCompleted: togglePrivateThreadSeenFlag
  });

  const { data: unseenThreadsNumber } = useRequest<
    GQLRetrieveUserThreadsVars,
    number
  >(getUnseenThreadsNumberQuery, {
    skip: !userData?.userId || isCreatorFlow,
    payload: {
      userId: userData.userId,
      isPrivate: false
    }
  });

  useRequest<GQLGetUserVars, User>(getUserQuery, {
    skip: !userData?.userId,
    payload: {
      userId: userData?.userId,
      isAddUploadImages: true
    },
    onCompleted: setPartialUserData
  });

  const {
    data: [[styleChallenges], [styleAdvices]] = [[], []],
    loading: loadingHomepageCategories
  } = useRequestAll<GQLGetHomepageVars, HomepageCategory[]>(getHomePageQuery, {
    initialState: {
      loading: true
    },
    payload: [
      {
        category: 'StyleChallenge'
      },
      {
        category: 'stylistRequest'
      }
    ]
  });

  const { data: journey, loading: loadingJourney } = useRequest<
    GetJourneyByUserIdVars,
    Journey
  >(getJourneyByUserId, {
    initialState: {
      loading: true,
      data: {
        levels: []
      }
    },
    skip: isCreatorFlow,
    payload: {
      userId: userData?.userId ?? 'public'
    },
    onCompleted({ levels, userProgress }) {
      setActiveJourneyInfo({
        userProgress,
        recommendedChapterName: levels
          .flatMap(l => l.chapters)
          .find(c => c.isRecommended).displayName
      });
    }
  });

  React.useEffect(() => {
    /* Reset location state */
    history.replace({ state: undefined });

    /* Reset task data */
    setActiveTaskData({});

    trackPage({
      name: 'HomePage'
    });
  }, []);

  const getHomepageHeader = React.useCallback(() => {
    if (isCreatorFlow) {
      return [
        {
          type: HEADER_ITEM_TYPES.LOGO,
          props: {
            dataSelfPosition: HEADER_ITEM_POSITION_TYPES.LEFT
          }
        },

        {
          type: HEADER_ITEM_TYPES.BUTTON,
          props: {
            ['data-action']: 'menu',
            dataSelfPosition: HEADER_ITEM_POSITION_TYPES.RIGHT
          }
        }
      ];
    }

    if (!userData?.homePageStylist || isAutomated) {
      if (authService.isAuthenticated) {
        return [
          {
            type: HEADER_ITEM_TYPES.CUSTOM,
            props: {
              dataGridTemplate: HEADER_ITEM_TEMPLATE_TYPES.MAX_CONTENT,
              dataSelfPosition: HEADER_ITEM_POSITION_TYPES.LEFT
            },
            render: () => (
              <StyledAddStylistHeaderItem>
                <Button
                  data-type="secondary"
                  data-form="circle"
                  data-action="userPlus"
                  data-action-position="center"
                  onClick={() => {
                    history.push({
                      pathname: '/stylist-matching',
                      search: location.search
                    });
                  }}
                />

                <h4>Stylist</h4>
              </StyledAddStylistHeaderItem>
            )
          },
          {
            type: HEADER_ITEM_TYPES.LOGO,
            props: {
              dataSelfPosition: HEADER_ITEM_POSITION_TYPES.CENTER
            }
          },
          {
            type: APP_HEADER_ITEM_TYPES.HOMEPAGE_STYLIST_CHAT,
            props: {
              showNotificationDot: !isPrivateThreadSeenFlag
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
              ['data-action']: 'menu',
              dataSelfPosition: HEADER_ITEM_POSITION_TYPES.RIGHT
            }
          }
        ];
      }

      return [
        {
          type: HEADER_ITEM_TYPES.LOGO,
          props: {
            dataGridTemplate: HEADER_ITEM_TEMPLATE_TYPES.AUTO,
            dataSelfPosition: HEADER_ITEM_POSITION_TYPES.LEFT
          }
        }
      ];
    }

    if (homePageStylist.stylistTier === STYLIST_TIER.VACATION) {
      return [
        {
          type: HEADER_ITEM_TYPES.CUSTOM,
          props: {
            dataGridTemplate: HEADER_ITEM_TEMPLATE_TYPES.MAX_CONTENT,
            dataSelfPosition: HEADER_ITEM_POSITION_TYPES.LEFT
          },

          render: () => (
            <StyledVacationStylistHeaderItem>
              <Button
                data-type="tertiary"
                data-form="circle"
                data-action="vacation"
                data-action-position="center"
                actionStyles={{
                  fill: 'white',
                  rotate: 10
                }}
                onClick={() => {
                  history.push({
                    pathname: `/homepage-stylist-overview`,
                    search: location.search
                  });
                }}
              />

              <h4>Stylist</h4>
              <span className="sbody">On vacation</span>
            </StyledVacationStylistHeaderItem>
          )
        },
        {
          type: HEADER_ITEM_TYPES.LOGO,
          props: {
            dataSelfPosition: HEADER_ITEM_POSITION_TYPES.CENTER
          }
        },
        {
          type: APP_HEADER_ITEM_TYPES.HOMEPAGE_STYLIST_CHAT,
          props: {
            showNotificationDot: !isPrivateThreadSeenFlag
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
            ['data-action']: 'menu',
            dataSelfPosition: HEADER_ITEM_POSITION_TYPES.RIGHT
          }
        }
      ];
    }

    return [
      {
        type: APP_HEADER_ITEM_TYPES.HOMEPAGE_STYLIST
      },
      {
        type: HEADER_ITEM_TYPES.LOGO,
        props: {
          dataSelfPosition: HEADER_ITEM_POSITION_TYPES.CENTER
        }
      },
      {
        type: APP_HEADER_ITEM_TYPES.HOMEPAGE_STYLIST_CHAT,
        props: {
          showNotificationDot: !isPrivateThreadSeenFlag
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
          ['data-action']: 'menu',
          dataSelfPosition: HEADER_ITEM_POSITION_TYPES.RIGHT
        }
      }
    ];
  }, [unseenThreadsNumber, isPrivateThreadSeenFlag]);

  React.useEffect(() => {
    setActiveStepData(prevState => ({
      ...prevState,
      headerConfig: getHomepageHeader()
    }));
  }, [unseenThreadsNumber, isPrivateThreadSeenFlag]);

  return isCreatorFlow ? (
    <>
      <GlobalPageStyles />

      {loadingHomepageCategories && <TopBarProgress />}

      <CreatorStyleAdvices styleAdviceTasks={styleAdvices?.tasks} />
    </>
  ) : (
    <>
      {loadingJourney && <TopBarProgress />}

      {!!journey.levels.length && (
        <StyledHomepage>
          <Tabs
            buttons={['My Journey', 'Style Advice']}
            activeIndex={locationState.activeTabIndex || 0}
          >
            <div>
              <JourneyComponent journey={journey} />

              <StyleChallenges
                isBlocked={journey.userProgress.currentLevelIndex === 0}
                isLoadingStyleChallenges={loadingHomepageCategories}
                styleChallenges={styleChallenges?.tasks}
              />
            </div>

            <StyleAdvices styleAdviceTasks={styleAdvices?.tasks} />
          </Tabs>
        </StyledHomepage>
      )}
    </>
  );
});

export default HomePage;
