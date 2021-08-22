import { getPlatform, isMobileApp } from 'core/utils';

export const EVENTS = {
  COMPLETE_PROFILE_LOADED: 'CompleteProfileLoaded',
  PAYMENT_PLAN_SELECTED: 'PaymentPlanSelected',
  PAYMENT_STARTED: 'PaymentStarted',
  PAYMENT_COMPLETED: 'PaymentCompleted',
  PRODUCT_CLICKED: 'ProductClicked',
  EXPERIENCE_FEEDBACK_REPLIED: 'ExperienceFeedbackReplied',
  TASK_VIEWED: 'TaskViewed',
  TASK_STARTED: 'TaskStarted',
  TASK_OVERVIEW_CLICKED: 'TaskOverviewClicked',
  TASK_RESPONSE_NEXT_CLICKED: 'TaskResponseNextClicked',
  TASK_RESULTS_DONE_CLICKED: 'TaskResultsDoneClicked',
  TASK_RESULTS_TALK_CLICKED: 'TaskResultsTalkClicked',
  TASK_RESULTS_OPENED: 'TaskResultsOpened',
  TASK_RATED: 'TaskRated',
  HOMEPAGE_CLICKED: 'HomepageClicked',
  RULES_EXPERIENCE_CLICKED: 'RulesExperienceClicked',
  IMAGE_UPLOAD_CLICKED: 'ImageUploadClicked',
  IMAGE_SELECTED: 'ImageSelected',
  IMAGE_UPLOADING: 'ImageUploading',
  IMAGE_UPLOADED: 'ImageUploaded',
  STYLIST_SELECTED: 'StylistSelected',
  STYLE_ADVICE_CLICKED: 'StyleAdviceClicked',
  STYLIST_VIDEO_CLICKED: 'StylistVideoPlayed',
  PROFILE_CREATED: 'ProfileCreated',
  JOURNEY_STARTED_TASK_CLICKED: 'JourneyStepStartClicked',
  JOURNEY_IN_PROGRESS_TASK_CLICKED: 'JourneyStepInProgressClicked',
  JOURNEY_DONE_TASK_CLICKED: 'JourneyStepDoneClicked',
  JOURNEY_START_STEP: 'JourneyStepStarted',
  FREE_STYLE_OPENED: 'FreeStyleOpened',
  PHONE_NUMBER_SUBMITTED: 'PhoneNumberSubmitted',
  STYLIST_MATCHING_VIDEO_CLICKED: 'StylistMatchingVideoClicked',
  DOWNLOAD_MODAL_CLICKED: 'DownloadModalClicked',
  TALK_TO_STYLIST_CLICKED: 'TalkToStylistClicked',
  THREAD_OPENED: 'ThreadOpened',
  OUTFIT_MATCH_OPENED: 'OutfitMatchOpened',
  PRODUCT_RATED: 'ProductRated',
  OUTFIT_RATED: 'OutfitRated',
  OUTFIT_FEED_OPENED: 'OutfitFeedOpened',
  PERCENTAGE_MATCH_CLICKED: 'PercentageMatchClicked',
  STYLIST_PROFILE_CLICKED: 'StylistProfileClicked',
  AUTOMATED_FLOW_STARTED: 'AutomatedFlowStarted',
  DOWNLOAD_APP_CLICKED: 'DownloadAppClicked',
  SUGGESTION_TIPS_CLICKED: 'SuggestionTipsClicked',
  SUGGESTION_FEED_CLICKED: 'SuggestionFeedClicked',
  CHAT_WITH_STYLIST_OPENED: 'ChatWithStylistOpened',
  VIDEO_UPLOAD_CLICKED: 'VideoUploadClicked',
  OUTFIT_SHARE_OPENED: 'OutfitShareOpened',
  OUTFIT_SHARE_CLICKED: 'OutfitShareClicked',
  NOTIFICATION_OPENED: 'NotificationOpened',
  TRIAL_STARTED: 'TrialStarted'
};

export interface TrackEventArgs {
  event: string;
  properties?: object;
  options?: SegmentAnalytics.SegmentOpts;
  callback?: () => void;
}

export interface TrackPageArgs {
  name: string;
  properties?: object;
}

export interface AnalyticsEventApp {
  action: string;
  event?: string;
  name?: string;
  userId?: string;
  properties?: object;
  traits?: object;
  callback?: () => void;
}

class AnalyticsService {
  private isAdminCheck() {
    return window.location?.search?.includes('isAdmin=true') ?? false;
  }

  public identify(args: {
    userId: string;
    traits?: object;
    callback?: () => void;
  }) {
    if (ENV === ENVIRONMENTS.DEV || this.isAdminCheck()) {
      if (!!args?.callback) {
        args?.callback();
      }
      return;
    }

    return !isMobileApp()
      ? window.analytics.identify(args.userId, args.traits, args?.callback)
      : this.postAppMessage({
          action: 'identify',
          userId: args?.userId,
          traits: args?.traits,
          callback: args?.callback
        });
  }

  public track(args: TrackEventArgs) {
    const properties = {
      userType: 'User',
      savvyPlatform: 'UserPlatform',
      platform: getPlatform(),
      ...args.properties
    };

    if (ENV === ENVIRONMENTS.DEV || this.isAdminCheck()) {
      console.log(args);

      if (!!args?.callback) {
        args?.callback();
      }

      return;
    }

    return !isMobileApp()
      ? window.analytics.track(
          args.event,
          properties,
          args.options,
          args?.callback
        )
      : this.postAppMessage({
          action: 'track',
          event: args.event,
          properties,
          callback: args?.callback
        });
  }

  public load(args: {
    writekey: string;
    options?: SegmentAnalytics.SegmentOpts;
  }) {
    if (ENV === ENVIRONMENTS.DEV || this.isAdminCheck()) {
      return;
    }
    return window.analytics.load(args.writekey, args.options);
  }

  public page(args: TrackPageArgs) {
    const properties = {
      userType: 'User',
      savvyPlatform: 'UserPlatform',
      platform: getPlatform(),
      ...args.properties
    };

    if (ENV === ENVIRONMENTS.DEV || this.isAdminCheck()) {
      console.log(args);
      return;
    }

    if (isMobileApp()) {
      this.postAppMessage({
        action: 'page',
        name: args.name,
        properties
      });

      this.postAppMessage({
        action: 'screen',
        name: args.name,
        properties
      });
      return;
    }
    return window.analytics.page(args.name, properties);
  }

  private postAppMessage(data: AnalyticsEventApp) {
    window?.webkit?.messageHandlers?.appInterface?.postMessage(data);
    window?.appInterface?.postMessage(JSON.stringify(data));
    if (!!data?.callback) {
      data?.callback();
    }
  }
}

export const analyticsService = new AnalyticsService();
