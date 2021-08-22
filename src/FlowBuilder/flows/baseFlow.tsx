/* Core */
import {
  lazyLoadFlowBuilderRoute,
  lazyLoadStylistOverviewStep
} from 'core/utils';

/* Types */
import { FlowConfig, FlowStepConfig } from 'FlowBuilder/types';
import { User } from 'App/types';

export type BaseFlowState = {
  userData?: User;
};

const baseSteps: FlowStepConfig[] = [
  {
    name: 'CreateProfilePage',
    component: lazyLoadFlowBuilderRoute('UploadImageStep')
    //skip: ({ isUserHasAllPersonalInfo }) => !!isUserHasAllPersonalInfo
  }
];

export const baseFlow: FlowConfig<BaseFlowState> = {
  steps: baseSteps,
  defaultState: {
    stylistId: ''
  }
};
