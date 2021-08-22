import * as React from 'react';
import mergeDeepRight from 'ramda/src/mergeDeepRight';
import { Loader } from '@bit/scalez.savvy-ui.loader';
import { useRequest, useLazyRequest } from '@bit/scalez.savvy-ui.hooks';
import { getSearchParams } from '@bit/scalez.savvy-ui.utils';

/* Core */
import { getSavvyStylistId, isMobileApp } from 'core/utils';
import { history } from 'App/components/App';

/* Services */
import {
  analyticsService,
  TrackPageArgs,
  TrackEventArgs,
  EVENTS
} from 'services/analyticsService';
import { appInitializationService } from 'services/appInitializationService';

/* Api */
import {
  GQLGetContentTaskVars,
  getContentTaskQuery
} from 'App/api/task/getContentTask';
import { GQLGetStylistVars, getStylistQuery } from 'App/api/stylist/getStylist';

/* Types */
import {
  User,
  Stylist,
  TaskDefinition,
  CdeTask,
  StepData,
  ChargebeePaymentPlan,
  Step,
  UserProgress,
  CLIENT_TYPE
} from 'App/types';
import { FLOW_NAMES } from 'FlowBuilder/types';

export interface RootContextState {
  userData: User;
  homePageStylist: Stylist;
  isUserHasAllPersonalInfo: boolean;
  activeStepData: Partial<StepData>;
  activeTaskData: TaskDefinition;
  activeTaskResultData: CdeTask;
  activePaymentPlanData: ChargebeePaymentPlan;
  journeyInfo: Partial<{
    activeStepName: string;
    activeStepActionKey: string;
    recommendedChapterName: string;
    activeStepInfo: Step;
    userProgress: UserProgress;
  }>;
  isAbTesting: boolean;
  isPaymentTest: boolean;
  isMobileApp: boolean;
  isCreatorFlow: boolean;
  isAutomated: boolean;
  ratedOutfits: Set<string>;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  sender: string;
}

export interface RootContextActions {
  handleAppInit: () => void;
  trackPage: (args: TrackPageArgs) => void;
  trackEvent: (args: TrackEventArgs) => void;
  // TODO: fix ts for (data: Partial<StepData>) => void
  setActiveStepData: any;
  setActiveTaskData: (data: RootContextState['activeTaskData']) => void;
  setActiveTaskResultData: (
    data: RootContextState['activeTaskResultData']
  ) => void;
  setActivePaymentPlanData: (
    data: RootContextState['activePaymentPlanData']
  ) => void;
  /* Update User methods */
  setUserSubscribedToService: () => void;
  setUserBlockTask: () => void;
  setUserHomepageStylist: (stylistId: string) => void;
  setPartialUserData: (
    user: RootContextState['userData']
  ) => void /* TODO: Move to reducer */;
  setActiveJourneyInfo: (info: RootContextState['journeyInfo']) => void;
  setRatedOutfit: (string) => void;
}

export interface RootContextType {
  state: RootContextState;
  actions: RootContextActions;
}

export const RootContext = React.createContext<RootContextType>(null);

interface Props {
  children: string | JSX.Element | (string | JSX.Element)[];
}

const RootProvider: React.FC<Props> = ({ children }: Props) => {
  const searchParams = new URLSearchParams(location.search);

  const {
    userId,
    stylistId,
    taskName,
    isAbTesting,
    isPaymentTest,
    utmSource,
    utmMedium,
    utmCampaign,
    sender,
    channel,
    taskId,
    taskTitle,
    threadId
  } = React.useMemo(() => {
    return {
      userId: searchParams.get('userId') || searchParams.get('id'),
      stylistId: searchParams.get('stylistId'),
      taskName: searchParams.get('taskName'),
      taskId: searchParams.get('taskId') || searchParams.get('task_id'),
      threadId: searchParams.get('threadId') || searchParams.get('thread_id'),
      taskTitle:
        searchParams.get('taskTilte') || searchParams.get('task_title'),
      isAbTesting: searchParams.get('test') === 'true',
      isPaymentTest: searchParams.get('paymentTest') === 'true',
      utmSource: searchParams.get('utm_source'),
      utmMedium: searchParams.get('utm_medium'),
      utmCampaign: searchParams.get('utm_campaign'),
      sender: searchParams.get('sender'),
      channel: searchParams.get('channel')
    };
  }, []);

  /* ----- State ----- */
  const [isAppInitialized, setIsAppInitialized] = React.useState<boolean>(
    false
  );

  const [userData, setUserData] = React.useState<RootContextState['userData']>(
    {}
  );
  const [homePageStylist, setHomepageStylist] = React.useState<
    RootContextState['homePageStylist']
  >({});
  const [activeStepData, setActiveStepData] = React.useState<
    RootContextState['activeStepData']
  >({});
  const [activeTaskData, setActiveTaskData] = React.useState<
    RootContextState['activeTaskData']
  >({});
  const [activeTaskResultData, setActiveTaskResultData] = React.useState<
    RootContextState['activeTaskResultData']
  >({});
  const [activePaymentPlanData, setActivePaymentPlanData] = React.useState<
    RootContextState['activePaymentPlanData']
  >({});
  const [journeyInfo, setJourneyInfo] = React.useState<
    RootContextState['journeyInfo']
  >({});
  const [ratedOutfits, setRatedOutfitsState] = React.useState<
    RootContextState['ratedOutfits']
  >(new Set([]));

  /* Api */
  const {
    loading: loadingTaskContent,
    data: taskContentData = activeTaskData || {}
  } = useRequest<GQLGetContentTaskVars, TaskDefinition>(getContentTaskQuery, {
    skip: !taskName || taskName === activeTaskData?.taskName,
    payload: {
      taskName
    },
    onCompleted: setActiveTaskData
  });

  const [getStylist, { loading: loadingHomepageStylist }] = useLazyRequest<
    GQLGetStylistVars,
    Stylist
  >(getStylistQuery, {
    onCompleted: setHomepageStylist
  });

  /* ----- Effects ----- */
  React.useEffect(() => {
    /* 
      '/authorized' page is not part of app
      it used to verify authentication from provider redirect 
    */
    if (!window.location.pathname.includes('/authorized')) {
      handleAppInit();
    }
  }, []);

  React.useEffect(() => {
    if (!!userData?.homePageStylist) {
      getStylist({
        stylistId: userData.homePageStylist
      });
    } else {
      setHomepageStylist({});
    }
  }, [userData?.homePageStylist]);

  /* ----- Actions ----- */

  function sendOpenNotification(userData: User, isAppInitialized: boolean) {
    if (!isAppInitialized) {
      return;
    }

    const redirectSearchParams = new URLSearchParams(searchParams.get('qs'));
    const redirectChannel = redirectSearchParams?.get('channel');

    if ((!channel && !redirectChannel) || !userData?.userId) {
      return;
    }

    trackEvent({
      event: EVENTS.NOTIFICATION_OPENED,
      properties: {
        path: location?.pathname,
        utmSource,
        utmCampaign,
        utmMedium,
        channel: channel ?? redirectChannel,
        taskId,
        threadId,
        taskName,
        taskTitle,
        stylistId
      }
    });

    searchParams.delete('channel');
    redirectSearchParams.delete('channel');

    history.push({
      pathname: location?.pathname,
      search: !!redirectChannel
        ? redirectSearchParams?.toString()
        : searchParams.toString()
    });
  }

  /* App init */
  const handleAppInit = React.useCallback(async () => {
    await appInitializationService.appInit();
    const userData = appInitializationService.getUserData();
    const isAppInitialized = appInitializationService.checkInitializationReady();

    setUserData(userData);
    setIsAppInitialized(isAppInitialized);
    sendOpenNotification(userData, isAppInitialized);
    console.log(`is App content initialized:`, isAppInitialized);
    console.log(`user data in context:`, userData);
    console.log('is AB testing:', isAbTesting);
  }, []);

  const trackPage = React.useCallback(
    (args: TrackPageArgs) => {
      const searchParams = getSearchParams(location.search);

      analyticsService.page(
        mergeDeepRight(
          {
            properties: {
              userId: userData.userId,
              ...searchParams
            }
          },
          args
        )
      );
    },
    [userData]
  );

  const trackEvent = React.useCallback(
    (args: TrackEventArgs) => {
      const searchParams = getSearchParams(location.search);

      analyticsService.track(
        mergeDeepRight(
          {
            properties: {
              userId: userData.userId,
              ...searchParams
            }
          },
          args
        )
      );
    },
    [userData]
  );

  const setPartialUserData = React.useCallback(
    (user: RootContextState['userData']) => {
      setUserData(prevState => ({
        ...prevState,
        ...user
      }));
    },
    []
  );

  const setUserBlockTask = React.useCallback(() => {
    setUserData(prevState => ({
      ...prevState,
      isHaveActiveTask: true,
      lastTaskSentTimestamp: new Date().toDateString()
    }));
  }, []);

  const setUserSubscribedToService = React.useCallback(() => {
    setUserData(prevState => ({
      ...prevState,
      subscribedToService: true
    }));
  }, []);

  const setUserHomepageStylist = React.useCallback((stylistId: string) => {
    setUserData(prevState => ({
      ...prevState,
      homePageStylist: stylistId
    }));
  }, []);

  const setActiveJourneyInfo = React.useCallback(
    (args: RootContextState['journeyInfo']) => {
      setJourneyInfo(mergeDeepRight(journeyInfo, args));
    },
    []
  );

  const toggleRatedOutfits = React.useCallback(
    (outfitId: string) => {
      if (ratedOutfits.has(outfitId)) {
        ratedOutfits.delete(outfitId);
        setRatedOutfitsState(new Set(ratedOutfits));
        return;
      }

      ratedOutfits.add(outfitId);
      setRatedOutfitsState(new Set(ratedOutfits));
    },
    [ratedOutfits]
  );

  /* ----- State ----- */
  const isUserHasAllPersonalInfo = React.useMemo(() => {
    return !!(
      userData?.firstName &&
      userData?.lastName &&
      userData?.profilePicture &&
      userData?.email
    );
  }, [userData]);

  return (
    <RootContext.Provider
      value={{
        state: {
          userData,
          homePageStylist,
          isUserHasAllPersonalInfo,
          activeStepData,
          activeTaskData,
          activeTaskResultData,
          activePaymentPlanData,
          journeyInfo,
          isAbTesting,
          isPaymentTest,
          isMobileApp: isMobileApp(),
          isCreatorFlow:
            !userData.doneUIFlows?.length ||
            userData.doneUIFlows?.includes(FLOW_NAMES.CREATOR) ||
            userData?.clientType === CLIENT_TYPE.FOLLOWER,
          isAutomated: userData?.homePageStylist === getSavvyStylistId(),
          ratedOutfits,
          utmSource,
          utmMedium,
          utmCampaign,
          sender
        },
        actions: {
          handleAppInit,
          trackPage,
          trackEvent,
          setActiveStepData,
          setActiveTaskData,
          setActiveTaskResultData,
          setActivePaymentPlanData,
          setActiveJourneyInfo,
          setRatedOutfit: toggleRatedOutfits,

          /* Update User methods */
          setUserBlockTask,
          setUserSubscribedToService,
          setUserHomepageStylist,
          setPartialUserData
        }
      }}
    >
      {/* 
        '/authorized' page is not part of app
        it used to verify authentication from provider redirect 
      */}
      {isAppInitialized || window.location.pathname.includes('/authorized') ? (
        children
      ) : (
        <Loader />
      )}
    </RootContext.Provider>
  );
};

export default RootProvider;
