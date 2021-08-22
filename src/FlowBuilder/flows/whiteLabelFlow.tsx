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

/* Api */
import { getStylistByUsernameQuery } from 'App/api/stylist/getStylistByUsername';
import { setUserStylistMutation } from 'App/api/user/setUserStylist';

export type WhiteLabelFlowState = {
  stylistUserName: string;
};

/* Flow functions */
function onStart(config: FlowEventArgument) {
  const userName = new URLSearchParams(location.search)?.get('userName');

  getStylistByUsernameQuery({ userName }).then(async res => {
    const { stylistId } = res;
    const setflowState = config?.actions?.setFlowState;
    setflowState({ stylistId });
    console.log(`set stylist id (White label) to ${stylistId}`);
    config?.actions?.setPartialUserData({ homePageStylist: stylistId });

    const userId = config?.state.userData.userId;
    await setUserStylistMutation({ userId, stylistId });
    console.log(`updated stylist to ${stylistId}`);
  });
}

const whiteLabelSteps: FlowStepConfig[] = [
  {
    name: 'StylistOverviewPage',
    component: lazyLoadStylistOverviewStep('WlStylistOverviewStep')
  },
  {
    name: 'HowItWorksPage',
    component: lazyLoadFlowBuilderRoute('HowItWorksStep'),
    restricted: true
  },
  {
    name: 'CreateProfilePage',
    component: lazyLoadFlowBuilderRoute('CreateProfileStep'),
    skip: ({ isUserHasAllPersonalInfo }) => !!isUserHasAllPersonalInfo,
    restricted: true
  }
];

export const whiteLabelFlow: FlowConfig<WhiteLabelFlowState> = {
  steps: whiteLabelSteps,
  defaultState: {
    stylistUserName: new URLSearchParams(location.search)?.get('userName')
  },
  isRepeat: true,
  onStart: onStart
};
