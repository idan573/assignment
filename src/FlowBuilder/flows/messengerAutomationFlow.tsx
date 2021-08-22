/* Core */
import { getSavvyStylistId } from 'core/utils';

/* Api */
import { setUserStylistMutation } from 'App/api/user/setUserStylist';
import { getSavvyStylistQuery } from 'App/api/stylist/retrieveSavvyStylist';

/* Types */
import { EVENTS } from 'services/analyticsService';
import {
  FlowConfig,
  FlowEventArgument,
  FlowStepConfig
} from 'FlowBuilder/types';

export type MessengerAutomationFlowState = {};

const messengerAutomationSteps: FlowStepConfig[] = [];

export const messengerAutomationFlow: FlowConfig<MessengerAutomationFlowState> = {
  steps: messengerAutomationSteps,
  onStart: ({
    state: { userData },
    actions: { trackEvent }
  }: FlowEventArgument) => {
    if (!!userData?.homePageStylist) {
      return;
    }

    getSavvyStylistQuery().then(stylist => {
      setUserStylistMutation({
        userId: userData?.userId,
        stylistId: stylist.stylistId
      }).then(() => {
        trackEvent({
          event: EVENTS.AUTOMATED_FLOW_STARTED,
          properties: {
            userId: userData?.userId
          }
        });
      });
    });
  }
};
