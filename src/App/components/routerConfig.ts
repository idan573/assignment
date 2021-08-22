import { LazyExoticComponent, ComponentType, lazy } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import {
  HEADER_ITEM_TYPES,
  HEADER_ITEM_POSITION_TYPES,
  HEADER_ITEM_TEMPLATE_TYPES
} from '@bit/scalez.savvy-ui.header';

import {
  lazyLoadFeature,
  lazyLoadFeatureRoute,
  lazyLoadChatRoute,
  lazyLoadStylistOverviewRoute
} from 'core/utils';
import { STANDALONE_STATE_NAMES, StepData } from 'App/types';
import { RootContextState } from 'App/components/RootProvider';

import {
  logoHeaderConfig,
  setHeaderWithTitleConfig,
  setDefaultHeaderConfig,
  setHeaderWidthMenuConfig
} from 'App/components/headerConfig';

export interface StandaloneFlowRouteType extends Partial<StepData> {
  component: React.FC<RouteComponentProps>;
  pathname: string;
  stateName: STANDALONE_STATE_NAMES;
  restricted?: boolean;
}

export const standaloneFlowPathnames: {
  [key in keyof typeof STANDALONE_STATE_NAMES]?: string;
} = {
  /* Navbar pages */
  [STANDALONE_STATE_NAMES.HOMEPAGE_STATE]: '/homepage',
  [STANDALONE_STATE_NAMES.OUTFIT_FEED_STATE]: '/outfit-feed',
  [STANDALONE_STATE_NAMES.INBOX_STATE]: '/mystyleups',
  [STANDALONE_STATE_NAMES.CLOSET_STATE]: '/closet',

  /* UserProfile pages */
  [STANDALONE_STATE_NAMES.USER_PROFILE_STATE]: '/user-profile',

  /* Journey pages */
  [STANDALONE_STATE_NAMES.CHAPTER_TIMELINE_STATE]: '/chapter/:chapterName?',

  /* Onboarding flow pages */
  [STANDALONE_STATE_NAMES.ONBOARDING_PHONE_NUMBER_FORM_STATE]:
    '/onboarding/phone-number',
  [STANDALONE_STATE_NAMES.ONBOARDING_CREATE_PROFILE_FORM_STATE]:
    '/onboarding/create-profile',
  [STANDALONE_STATE_NAMES.ONBOARDING_HOW_IT_WORKS_STATE]:
    '/onboarding/how-it-works',
  [STANDALONE_STATE_NAMES.ONBOARDING_STYLIST_MATCHING_STATE]:
    '/onboarding/stylist-matching',
  [STANDALONE_STATE_NAMES.ONBOARDING_STYLIST_LIST_STATE]:
    '/onboarding/stylist-list',
  [STANDALONE_STATE_NAMES.ONBOARDING_STYLIST_OVERVIEW_STATE]:
    '/onboarding/stylist-overview/:stylistId',

  /* StyleUps flow pages */
  [STANDALONE_STATE_NAMES.THREADS_LIST_STATE]: '/styleups/list',
  [STANDALONE_STATE_NAMES.THREAD_EVENTS_LIST_STATE]:
    '/styleups/thread/:threadId',

  /* TaskResult pages */
  [STANDALONE_STATE_NAMES.TASK_RESULT_STATE]: '/task-result/task/:taskId',
  [STANDALONE_STATE_NAMES.TASK_RESULT_RATE_STATE]: '/task-result/rate/:taskId',
  [STANDALONE_STATE_NAMES.STYLIST_REPLACEMENT_STATE]:
    '/task-result/stylist-replacement/:taskId',
  [STANDALONE_STATE_NAMES.TASK_SUGGESTIONS_STATE]:
    '/task-result/suggestions/:taskId',

  /* Task Routing Flow */
  [STANDALONE_STATE_NAMES.TASK_ROUTING_STEP_STATE]:
    '/task-routing-step/:stepName',
  [STANDALONE_STATE_NAMES.TASK_ROUTING_OVERVIEW_STATE]:
    '/task-routing-step/overview/:stepName',
  [STANDALONE_STATE_NAMES.TASK_ROUTING_CATEGORIES_STATE]:
    '/task-routing-step/categories/:stepName',

  /* Payment flow pages */
  [STANDALONE_STATE_NAMES.PAYMENT_PLAN_STATE]: '/payment/plans',
  [STANDALONE_STATE_NAMES.TRIAL_STATE]: '/payment/trial',
  [STANDALONE_STATE_NAMES.PAYMENT_STATE]: '/payment/chargebee',
  [STANDALONE_STATE_NAMES.PAYMENT_SUCCESS_STATE]: '/payment/success',
  [STANDALONE_STATE_NAMES.PRE_PAYMENT_STATE]: '/payment/pre-payment',

  /* Task flow pages */
  [STANDALONE_STATE_NAMES.TASK_OVERVIEW_STATE]: '/task-overview/:taskName',
  [STANDALONE_STATE_NAMES.STYLIST_MATCHING_STATE]:
    '/stylist-matching/:taskName?',
  [STANDALONE_STATE_NAMES.STYLIST_LIST_STATE]: '/stylist-list/:taskName?',
  [STANDALONE_STATE_NAMES.HOMEPAGE_STYLIST_OVERVIEW_STATE]:
    '/homepage-stylist-overview',
  [STANDALONE_STATE_NAMES.STYLIST_OVERVIEW_STATE]:
    '/stylist-overview/:stylistId',
  [STANDALONE_STATE_NAMES.TASK_AWAIT_STATE]: '/task-await',

  /* Chat pages */
  [STANDALONE_STATE_NAMES.TASK_CHAT_STATE]: '/task-chat/:taskName',
  [STANDALONE_STATE_NAMES.FORM_CHAT_STATE]: '/form-chat/:forms?',

  /* Other */
  [STANDALONE_STATE_NAMES.WELCOME_PAGE]: '/welcome',
  [STANDALONE_STATE_NAMES.AUTORIZED_STATE]: '/authorized',
  [STANDALONE_STATE_NAMES.CREATE_PROFILE_STATE]: '/create-profile',
  [STANDALONE_STATE_NAMES.HOW_IT_WORKS_STATE]: '/how-it-works',
  [STANDALONE_STATE_NAMES.WL_STYLIST_STATE]: '/stylist-page/:userName',
  [STANDALONE_STATE_NAMES.FREE_RULES_EXPERIENCE_STATE]:
    '/free-rules-experience',
  [STANDALONE_STATE_NAMES.APP_DOWNLOAD_STATE]: '/download',
  [STANDALONE_STATE_NAMES.OUTFIT_MATCHING_STATE]: '/outfit-matching',
  [STANDALONE_STATE_NAMES.OUTFIT_SHARE_STATE]: '/outfit-share',
  [STANDALONE_STATE_NAMES.CHAT_WITH_STYLIST_STATE]: '/stylist-chat',
  [STANDALONE_STATE_NAMES.PHONE_NUMBER_FORM_STATE]: '/phone-form'
};

export const onboardingFlowRoutes: StandaloneFlowRouteType[] = [
  {
    stateName: STANDALONE_STATE_NAMES.ONBOARDING_PHONE_NUMBER_FORM_STATE,
    pathname:
      standaloneFlowPathnames[
        STANDALONE_STATE_NAMES.ONBOARDING_PHONE_NUMBER_FORM_STATE
      ],
    component: lazyLoadFeatureRoute('OnboardingFlow', 'PhoneNumberForm'),
    headerConfig: logoHeaderConfig
  },
  {
    stateName: STANDALONE_STATE_NAMES.ONBOARDING_CREATE_PROFILE_FORM_STATE,
    pathname:
      standaloneFlowPathnames[
        STANDALONE_STATE_NAMES.ONBOARDING_CREATE_PROFILE_FORM_STATE
      ],
    component: lazyLoadFeatureRoute('OnboardingFlow', 'CreateProfileForm'),
    headerConfig: logoHeaderConfig
  },
  {
    stateName: STANDALONE_STATE_NAMES.ONBOARDING_STYLIST_MATCHING_STATE,
    pathname:
      standaloneFlowPathnames[
        STANDALONE_STATE_NAMES.ONBOARDING_STYLIST_MATCHING_STATE
      ],
    component: lazyLoadFeatureRoute('OnboardingFlow', 'StylistMatching')
  },
  {
    stateName: STANDALONE_STATE_NAMES.ONBOARDING_STYLIST_LIST_STATE,
    pathname:
      standaloneFlowPathnames[
        STANDALONE_STATE_NAMES.ONBOARDING_STYLIST_LIST_STATE
      ],
    component: lazyLoadFeatureRoute('OnboardingFlow', 'StylistList'),
    headerConfig: setHeaderWithTitleConfig('Select your Stylist')
  },
  {
    stateName: STANDALONE_STATE_NAMES.ONBOARDING_HOW_IT_WORKS_STATE,
    pathname:
      standaloneFlowPathnames[
        STANDALONE_STATE_NAMES.ONBOARDING_HOW_IT_WORKS_STATE
      ],
    component: lazyLoadFeatureRoute('OnboardingFlow', 'HowItWorks'),
    headerConfig: logoHeaderConfig
  },
  {
    stateName: STANDALONE_STATE_NAMES.ONBOARDING_STYLIST_OVERVIEW_STATE,
    pathname:
      standaloneFlowPathnames[
        STANDALONE_STATE_NAMES.ONBOARDING_STYLIST_OVERVIEW_STATE
      ],
    component: lazyLoadFeatureRoute('OnboardingFlow', 'StylistOverview'),
    headerConfig: setDefaultHeaderConfig()
  }
];

export const paymentFlowRoutes: StandaloneFlowRouteType[] = [
  {
    restricted: true,
    stateName: STANDALONE_STATE_NAMES.PAYMENT_PLAN_STATE,
    pathname:
      standaloneFlowPathnames[STANDALONE_STATE_NAMES.PAYMENT_PLAN_STATE],
    component: lazyLoadFeatureRoute('PaymentFlow', 'PaymentPlan')
  },
  {
    restricted: true,
    stateName: STANDALONE_STATE_NAMES.TRIAL_STATE,
    pathname: standaloneFlowPathnames[STANDALONE_STATE_NAMES.TRIAL_STATE],
    component: lazyLoadFeatureRoute('PaymentFlow', 'PaymentTrial'),
    headerConfig: setDefaultHeaderConfig()
  },
  {
    restricted: true,
    stateName: STANDALONE_STATE_NAMES.PAYMENT_STATE,
    pathname: standaloneFlowPathnames[STANDALONE_STATE_NAMES.PAYMENT_STATE],
    component: lazyLoadFeatureRoute('PaymentFlow', 'PaymentChargebee'),
    headerConfig: setDefaultHeaderConfig()
  },
  {
    restricted: true,
    stateName: STANDALONE_STATE_NAMES.PAYMENT_SUCCESS_STATE,
    pathname:
      standaloneFlowPathnames[STANDALONE_STATE_NAMES.PAYMENT_SUCCESS_STATE],
    component: lazyLoadFeatureRoute('PaymentFlow', 'PaymentSuccess')
  },
  {
    restricted: true,
    stateName: STANDALONE_STATE_NAMES.PRE_PAYMENT_STATE,
    pathname: standaloneFlowPathnames[STANDALONE_STATE_NAMES.PRE_PAYMENT_STATE],
    component: lazyLoadFeatureRoute('PaymentFlow', 'PrePayment')
  }
];

export const styleUpsFlowRoutes: StandaloneFlowRouteType[] = [
  {
    stateName: STANDALONE_STATE_NAMES.THREADS_LIST_STATE,
    pathname:
      standaloneFlowPathnames[STANDALONE_STATE_NAMES.THREADS_LIST_STATE],
    component: lazyLoadFeatureRoute('StyleUpsFlow', 'ThreadsList'),
    renderNavbar: true,
    restricted: true,
    defaultBack: standaloneFlowPathnames[STANDALONE_STATE_NAMES.HOMEPAGE_STATE],
    headerConfig: setHeaderWithTitleConfig('Style Sessions')
  },
  {
    stateName: STANDALONE_STATE_NAMES.THREAD_EVENTS_LIST_STATE,
    pathname:
      standaloneFlowPathnames[STANDALONE_STATE_NAMES.THREAD_EVENTS_LIST_STATE],
    component: lazyLoadFeatureRoute('StyleUpsFlow', 'ThreadEventsList'),
    restricted: true,
    defaultBack: standaloneFlowPathnames[STANDALONE_STATE_NAMES.HOMEPAGE_STATE],
    headerConfig: setDefaultHeaderConfig()
  }
];

export const taskResultFlowRoutes: StandaloneFlowRouteType[] = [
  {
    stateName: STANDALONE_STATE_NAMES.TASK_RESULT_STATE,
    pathname: standaloneFlowPathnames[STANDALONE_STATE_NAMES.TASK_RESULT_STATE],
    component: lazyLoadFeatureRoute('TaskResultFlow', 'Task'),
    renderNavbar: false,
    headerConfig: setDefaultHeaderConfig(),
    restricted: true
  },
  {
    stateName: STANDALONE_STATE_NAMES.TASK_RESULT_RATE_STATE,
    pathname:
      standaloneFlowPathnames[STANDALONE_STATE_NAMES.TASK_RESULT_RATE_STATE],
    component: lazyLoadFeatureRoute('TaskResultFlow', 'Rate'),
    renderNavbar: true,
    headerConfig: setDefaultHeaderConfig()
  },
  {
    stateName: STANDALONE_STATE_NAMES.STYLIST_REPLACEMENT_STATE,
    pathname:
      standaloneFlowPathnames[STANDALONE_STATE_NAMES.STYLIST_REPLACEMENT_STATE],
    component: lazyLoadFeatureRoute('TaskResultFlow', 'StylistReplacement'),
    renderNavbar: true,
    headerConfig: setDefaultHeaderConfig()
  },
  {
    stateName: STANDALONE_STATE_NAMES.TASK_SUGGESTIONS_STATE,
    pathname:
      standaloneFlowPathnames[STANDALONE_STATE_NAMES.TASK_SUGGESTIONS_STATE],
    component: lazyLoadFeatureRoute('TaskResultFlow', 'TaskSuggestions'),
    renderNavbar: true,
    headerConfig: setDefaultHeaderConfig()
  }
];

export const taskRoutingStepFlowRoutes: StandaloneFlowRouteType[] = [
  {
    stateName: STANDALONE_STATE_NAMES.TASK_ROUTING_CATEGORIES_STATE,
    pathname:
      standaloneFlowPathnames[
        STANDALONE_STATE_NAMES.TASK_ROUTING_CATEGORIES_STATE
      ],
    component: lazyLoadFeatureRoute('TaskRoutingFlow', 'ChooseCategories'),
    renderNavbar: false,
    headerConfig: setDefaultHeaderConfig()
  },
  {
    stateName: STANDALONE_STATE_NAMES.TASK_ROUTING_OVERVIEW_STATE,
    pathname:
      standaloneFlowPathnames[
        STANDALONE_STATE_NAMES.TASK_ROUTING_OVERVIEW_STATE
      ],
    component: lazyLoadFeatureRoute('TaskRoutingFlow', 'TaskRoutingOverview'),
    renderNavbar: false,
    headerConfig: setDefaultHeaderConfig()
  }
];

export const standaloneFlowRoutes: StandaloneFlowRouteType[] = [
  /* Auth pages */
  {
    stateName: STANDALONE_STATE_NAMES.WELCOME_PAGE,
    pathname: standaloneFlowPathnames[STANDALONE_STATE_NAMES.WELCOME_PAGE],
    component: lazyLoadFeature('WelcomePage')
  },
  {
    restricted: true,
    stateName: STANDALONE_STATE_NAMES.CREATE_PROFILE_STATE,
    pathname:
      standaloneFlowPathnames[STANDALONE_STATE_NAMES.CREATE_PROFILE_STATE],
    component: lazyLoadFeature('CreateProfilePage'),
    headerConfig: setDefaultHeaderConfig()
  },

  /* Navbar pages */
  {
    stateName: STANDALONE_STATE_NAMES.HOMEPAGE_STATE,
    pathname: standaloneFlowPathnames[STANDALONE_STATE_NAMES.HOMEPAGE_STATE],
    component: lazyLoadFeature('HomePage'),
    renderNavbar: true
  },
  {
    stateName: STANDALONE_STATE_NAMES.OUTFIT_FEED_STATE,
    pathname: standaloneFlowPathnames[STANDALONE_STATE_NAMES.OUTFIT_FEED_STATE],
    component: lazyLoadFeature('OutfitFeedPage'),
    renderNavbar: true
  },
  {
    stateName: STANDALONE_STATE_NAMES.FREE_RULES_EXPERIENCE_STATE,
    pathname:
      standaloneFlowPathnames[
        STANDALONE_STATE_NAMES.FREE_RULES_EXPERIENCE_STATE
      ],
    component: lazyLoadFeature('FreeRulesExperience'),
    renderNavbar: true,
    restricted: true
  },
  {
    restricted: true,
    stateName: STANDALONE_STATE_NAMES.CLOSET_STATE,
    pathname: standaloneFlowPathnames[STANDALONE_STATE_NAMES.CLOSET_STATE],
    component: lazyLoadFeature('ClosetPage'),
    renderNavbar: true,
    defaultBack: standaloneFlowPathnames[STANDALONE_STATE_NAMES.HOMEPAGE_STATE]
  },

  /* UserProfile pages */
  {
    restricted: true,
    stateName: STANDALONE_STATE_NAMES.USER_PROFILE_STATE,
    pathname:
      standaloneFlowPathnames[STANDALONE_STATE_NAMES.USER_PROFILE_STATE],
    component: lazyLoadFeature('UserProfilePage'),
    headerConfig: setHeaderWidthMenuConfig()
  },

  /* Journey pages */
  {
    restricted: true,
    stateName: STANDALONE_STATE_NAMES.CHAPTER_TIMELINE_STATE,
    pathname:
      standaloneFlowPathnames[STANDALONE_STATE_NAMES.CHAPTER_TIMELINE_STATE],
    component: lazyLoadFeature('ChapterTimelinePage'),
    renderNavbar: true,
    headerConfig: setDefaultHeaderConfig()
  },
  {
    restricted: true,
    stateName: STANDALONE_STATE_NAMES.TASK_ROUTING_STEP_STATE,
    pathname:
      standaloneFlowPathnames[STANDALONE_STATE_NAMES.TASK_ROUTING_STEP_STATE],
    component: lazyLoadFeature('ChapterTimelinePage'),
    renderNavbar: true,
    defaultBack: standaloneFlowPathnames[STANDALONE_STATE_NAMES.HOMEPAGE_STATE]
  },

  /* Task flow pages */
  {
    restricted: true,
    stateName: STANDALONE_STATE_NAMES.TASK_OVERVIEW_STATE,
    pathname:
      standaloneFlowPathnames[STANDALONE_STATE_NAMES.TASK_OVERVIEW_STATE],
    component: lazyLoadFeature('TaskOverviewPage'),
    defaultBack: standaloneFlowPathnames[STANDALONE_STATE_NAMES.HOMEPAGE_STATE],
    headerConfig: setDefaultHeaderConfig()
  },
  {
    restricted: true,
    stateName: STANDALONE_STATE_NAMES.STYLIST_MATCHING_STATE,
    pathname:
      standaloneFlowPathnames[STANDALONE_STATE_NAMES.STYLIST_MATCHING_STATE],
    component: lazyLoadFeature('StylistMatchingPage')
  },
  {
    restricted: true,
    stateName: STANDALONE_STATE_NAMES.STYLIST_LIST_STATE,
    pathname:
      standaloneFlowPathnames[STANDALONE_STATE_NAMES.STYLIST_LIST_STATE],
    component: lazyLoadFeature('StylistListPage'),
    renderNavbar: true,
    headerConfig: setHeaderWithTitleConfig('Select your Stylist')
  },

  {
    stateName: STANDALONE_STATE_NAMES.STYLIST_OVERVIEW_STATE,
    pathname:
      standaloneFlowPathnames[STANDALONE_STATE_NAMES.STYLIST_OVERVIEW_STATE],
    component: lazyLoadStylistOverviewRoute('StylistOverviewPage'),
    renderNavbar: true,
    headerConfig: setDefaultHeaderConfig()
  },
  {
    stateName: STANDALONE_STATE_NAMES.HOMEPAGE_STYLIST_OVERVIEW_STATE,
    pathname:
      standaloneFlowPathnames[
        STANDALONE_STATE_NAMES.HOMEPAGE_STYLIST_OVERVIEW_STATE
      ],
    component: lazyLoadStylistOverviewRoute('HomepageStylistOverviewPage'),
    headerConfig: setDefaultHeaderConfig()
  },
  {
    restricted: true,
    stateName: STANDALONE_STATE_NAMES.TASK_AWAIT_STATE,
    pathname: standaloneFlowPathnames[STANDALONE_STATE_NAMES.TASK_AWAIT_STATE],
    component: lazyLoadFeature('TaskAwaitPage'),
    renderNavbar: true
  },

  /* Chat pages */
  {
    restricted: true,
    stateName: STANDALONE_STATE_NAMES.TASK_CHAT_STATE,
    pathname: standaloneFlowPathnames[STANDALONE_STATE_NAMES.TASK_CHAT_STATE],
    component: lazyLoadChatRoute('ChatPageTask'),
    renderNavbar: false
  },
  {
    restricted: true,
    stateName: STANDALONE_STATE_NAMES.FORM_CHAT_STATE,
    pathname: standaloneFlowPathnames[STANDALONE_STATE_NAMES.FORM_CHAT_STATE],
    component: lazyLoadChatRoute('ChatPageForm'),
    renderNavbar: false
  },

  /* Other */

  {
    stateName: STANDALONE_STATE_NAMES.HOW_IT_WORKS_STATE,
    pathname:
      standaloneFlowPathnames[STANDALONE_STATE_NAMES.HOW_IT_WORKS_STATE],
    component: lazyLoadFeature('HowItWorksPage'),
    renderNavbar: false,
    headerConfig: logoHeaderConfig
  },
  {
    stateName: STANDALONE_STATE_NAMES.WL_STYLIST_STATE,
    pathname: standaloneFlowPathnames[STANDALONE_STATE_NAMES.WL_STYLIST_STATE],
    component: lazyLoadFeature('StylistPage'),
    renderNavbar: false,
    headerConfig: logoHeaderConfig
  },
  {
    stateName: STANDALONE_STATE_NAMES.AUTORIZED_STATE,
    pathname: standaloneFlowPathnames[STANDALONE_STATE_NAMES.AUTORIZED_STATE],
    component: lazyLoadFeature('AuthorizedPage'),
    renderNavbar: false,
    headerConfig: logoHeaderConfig
  },

  {
    stateName: STANDALONE_STATE_NAMES.APP_DOWNLOAD_STATE,
    pathname:
      standaloneFlowPathnames[STANDALONE_STATE_NAMES.APP_DOWNLOAD_STATE],
    component: lazyLoadFeature('AppDownloadPage')
  },
  {
    stateName: STANDALONE_STATE_NAMES.OUTFIT_MATCHING_STATE,
    pathname:
      standaloneFlowPathnames[STANDALONE_STATE_NAMES.OUTFIT_MATCHING_STATE],
    component: lazyLoadFeature('OutfitMatchingPage'),
    renderNavbar: true,
    headerConfig: [
      {
        type: HEADER_ITEM_TYPES.TITLE,
        props: {
          dataSelfPosition: HEADER_ITEM_POSITION_TYPES.CENTER,
          children: 'My Style Match!'
        }
      }
    ]
  },
  {
    stateName: STANDALONE_STATE_NAMES.OUTFIT_SHARE_STATE,
    pathname:
      standaloneFlowPathnames[STANDALONE_STATE_NAMES.OUTFIT_SHARE_STATE],
    component: lazyLoadFeature('OutfitSharePage'),
    renderNavbar: true,
    headerConfig: logoHeaderConfig
  },
  {
    restricted: false,
    stateName: STANDALONE_STATE_NAMES.CHAT_WITH_STYLIST_STATE,
    pathname:
      standaloneFlowPathnames[STANDALONE_STATE_NAMES.CHAT_WITH_STYLIST_STATE],
    component: lazyLoadFeature('ChatWithStylistPage')
  },
  {
    stateName: STANDALONE_STATE_NAMES.PHONE_NUMBER_FORM_STATE,
    pathname:
      standaloneFlowPathnames[STANDALONE_STATE_NAMES.PHONE_NUMBER_FORM_STATE],
    component: lazyLoadFeature('PhoneNumberFormPage'),
    renderNavbar: true
  }
];
