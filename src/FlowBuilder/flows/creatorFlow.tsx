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
  FlowStepConfig
} from 'FlowBuilder/types';
import { CLIENT_TYPE } from 'App/types';

/* Api */
import { getStylistByUsernameQuery } from 'App/api/stylist/getStylistByUsername';
import { switchUserStylistMutation } from 'App/api/stylist/switchUserStylist';

export type CreatorFlowState = {
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
    if (!config?.state.userData.userId) {
      return;
    }
    config?.actions?.setPartialUserData({
      homePageStylist: stylistId,
      clientType: CLIENT_TYPE.FOLLOWER
    });

    const userId = config?.state.userData.userId;
    await switchUserStylistMutation({ userId, stylistId });
    console.log(`updated stylist to ${stylistId}`);
  });
}

const creatorFlowSteps: FlowStepConfig[] = [
  {
    name: 'StylistOverviewPage',
    component: lazyLoadStylistOverviewStep('CreatorStylistOverviewStep')
  },
  {
    name: 'CreateProfilePage',
    component: lazyLoadCreateProfileStep('CreateProfileCreatorStep'),
    skip: ({ isUserHasAllPersonalInfo }) => !!isUserHasAllPersonalInfo,
    restricted: true
  }
];

export const creatorFlow: FlowConfig<CreatorFlowState> = {
  steps: creatorFlowSteps,
  defaultState: {
    stylistUserName: new URLSearchParams(location.search)?.get('userName')
  },
  isRepeat: true,
  onStart: onStart
};
