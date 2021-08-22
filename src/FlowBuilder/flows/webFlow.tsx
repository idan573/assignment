/* Core */
import { lazyLoadFlowBuilderRoute } from 'core/utils';

/* Types */
import {
  FlowConfig,
  FlowEventArgument,
  FlowStepConfig,
  FLOW_NAMES
} from 'FlowBuilder/types';

export type WebFlowState = {};

const webSteps: FlowStepConfig[] = [
  {
    name: 'HowItWorksPage',
    component: lazyLoadFlowBuilderRoute('HowItWorksStep')
  },
  {
    name: 'CreateProfilePage',
    component: lazyLoadFlowBuilderRoute('CreateProfileStep'),
    skip: ({ isUserHasAllPersonalInfo }) => isUserHasAllPersonalInfo,
    restricted: true
  },
  {
    name: 'ChatPage',
    component: lazyLoadFlowBuilderRoute('ChatStep'),
    props: {
      forms: [['WebIntroForm']]
    },
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
    component: lazyLoadFlowBuilderRoute('StylistOverviewStep'),
    skip: ({ userData }) => !!userData?.homePageStylist,
    restricted: true
  }
];

export const webFlow: FlowConfig<WebFlowState> = {
  steps: webSteps,
  onStart: ({
    state: { isUserHasAllPersonalInfo, userData },
    route: { history, location }
  }: FlowEventArgument) => {
    if (userData?.doneUIFlows?.includes(FLOW_NAMES.MESSENGER)) {
      history.push({ pathname: '/homepage' });
      return;
    }

    if (isUserHasAllPersonalInfo && userData?.homePageStylist) {
      history.push({
        pathname: '/homepage',
        search: location.search
      });
    }
  }
};
