/* Core */
import {
  lazyLoadFlowBuilderRoute,
  lazyLoadStylistOverviewStep
} from 'core/utils';

/* Types */
import {
  FlowConfig,
  FlowEventArgument,
  FlowStepConfig
} from 'FlowBuilder/types';

export type WebBodyQuizFlowState = {};

const webBodyQuizSteps: FlowStepConfig[] = [
  {
    name: 'HowItWorksPage',
    component: lazyLoadFlowBuilderRoute('HowItWorksStep')
  },
  {
    name: 'ChatPage',
    component: lazyLoadFlowBuilderRoute('ChatStep'),
    props: {
      forms: [['WebIntroForm']],
      isAnonymous: true
    }
  },
  {
    name: 'CreateProfilePage',
    component: lazyLoadFlowBuilderRoute('CreateProfileStep'),
    skip: ({ isUserHasAllPersonalInfo }) => isUserHasAllPersonalInfo,
    restricted: true
  },

  {
    name: 'StylistMatchingPage',
    component: lazyLoadFlowBuilderRoute('StylistMatchingStep'),
    skip: ({ userData }) => !!userData?.homePageStylist,
    restricted: true
  },
  {
    name: 'ChooseStylistPage',
    component: lazyLoadFlowBuilderRoute('ChooseStylistStep'),
    skip: ({ userData }) => !!userData?.homePageStylist,
    restricted: true
  },
  {
    name: 'StylistOverviewPage',
    component: lazyLoadStylistOverviewStep('StylistOverviewStep'),
    skip: ({ userData }) => !!userData?.homePageStylist,
    restricted: true
  }
];

export const webBodyQuizFlow: FlowConfig<WebBodyQuizFlowState> = {
  steps: webBodyQuizSteps
};
