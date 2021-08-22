/* Core */
import {
  lazyLoadFlowBuilderRoute,
  lazyLoadStylistOverviewStep
} from 'core/utils';

/* Types */
import { FlowConfig, FlowStepConfig } from 'FlowBuilder/types';

export type MessengerFreeTaskFlowState = {};

const messengerFreeTaskSteps: FlowStepConfig[] = [
  {
    name: 'HowItWorksPage',
    component: lazyLoadFlowBuilderRoute('HowItWorksStep')
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
  },
  {
    name: 'OfferPage',
    component: lazyLoadFlowBuilderRoute('OfferStep'),
    restricted: true,
    skip: ({ userData }) => !!userData?.tasksCount
  },
  {
    name: 'CreateProfilePage',
    component: lazyLoadFlowBuilderRoute('CreateProfileStep'),
    skip: ({ isUserHasAllPersonalInfo }) => !!isUserHasAllPersonalInfo
  }
];

export const messengerFreeTaskFlow: FlowConfig<MessengerFreeTaskFlowState> = {
  steps: messengerFreeTaskSteps
};
