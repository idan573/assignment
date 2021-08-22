/* Core */
import {
  lazyLoadFlowBuilderRoute,
  lazyLoadStylistOverviewStep
} from 'core/utils';

/* Types */
import { FlowConfig, FlowStepConfig } from 'FlowBuilder/types';

export type MessengerBFlowState = {};

const messengerBSteps: FlowStepConfig[] = [
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

export const messengerBFlow: FlowConfig<MessengerBFlowState> = {
  steps: messengerBSteps
};
