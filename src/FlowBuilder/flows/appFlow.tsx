/* Core */
import {
  lazyLoadCreateProfileStep,
  lazyLoadFlowBuilderRoute,
  lazyLoadStylistOverviewStep
} from 'core/utils';

/* Types */
import {
  FlowConfig,
  FlowEventArgument,
  FlowStepConfig,
  FLOW_NAMES
} from 'FlowBuilder/types';

export type AppFlowState = {};

export const appSteps: FlowStepConfig[] = [
  {
    name: 'WelcomePage',
    trackPage: true,
    component: lazyLoadFlowBuilderRoute('WelcomeStep'),
    skip: ({ userData }) => !!userData?.userId,
    renderNavbar: false
  },
  {
    name: 'CreateProfilePage',
    component: lazyLoadCreateProfileStep('CreateProfileCreatorStep'),
    skip: ({ isUserHasAllPersonalInfo }) => !!isUserHasAllPersonalInfo,
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

export const appFlow: FlowConfig<AppFlowState> = {
  steps: appSteps,
  onStart: ({
    state: { isUserHasAllPersonalInfo, userData },
    actions,
    route: { history, location }
  }: FlowEventArgument) => {
    if (userData?.doneUIFlows?.includes(FLOW_NAMES.MESSENGER)) {
      history.push({ pathname: '/homepage' });
      return;
    }

    if (userData?.doneUIFlows?.includes(FLOW_NAMES.CREATOR)) {
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
