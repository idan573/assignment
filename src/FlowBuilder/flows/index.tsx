import { FLOW_NAMES, FlowConfig } from 'FlowBuilder/types';

import { appFlow, AppFlowState } from './appFlow';
import { baseFlow, BaseFlowState } from './baseFlow';
import { messengerFlow, MessengerFlowState } from './messengerFlow';
import { reFlow, REFlowState } from './reFlow';
import { webFlow, WebFlowState } from './webFlow';
import { whiteLabelFlow, WhiteLabelFlowState } from './whiteLabelFlow';
import { webBodyQuizFlow, WebBodyQuizFlowState } from './webFlowBodyQuiz';
import { messengerBFlow } from './messengerFlowB';
import {
  messengerAutomationFlow,
  MessengerAutomationFlowState
} from './messengerAutomationFlow';
import {
  messengerFreeTaskFlow,
  MessengerFreeTaskFlowState
} from './messengerFreeTask';
import { creatorFlow, CreatorFlowState } from './creatorFlow';

export type FlowState = Partial<{
  [FLOW_NAMES.BASE]: BaseFlowState;
  [FLOW_NAMES.APP]: AppFlowState;
  [FLOW_NAMES.WEB]: WebFlowState;
  [FLOW_NAMES.MESSENGER]: MessengerFlowState;
  [FLOW_NAMES.WHITE_LABEL]: WhiteLabelFlowState;
  [FLOW_NAMES.RULES_EXPERIENCE]: REFlowState;
  [FLOW_NAMES.WEB_BODY_QUIZ]: WebBodyQuizFlowState;
  [FLOW_NAMES.MESSENGER_AUTOMATION]: MessengerAutomationFlowState;
  [FLOW_NAMES.MESSENGER_FREE_TASK]: MessengerFreeTaskFlowState;
  [FLOW_NAMES.CREATOR]: CreatorFlowState;
}>;

export const flows: {
  [key in FLOW_NAMES]: FlowConfig;
} = {
  [FLOW_NAMES.BASE]: baseFlow,
  [FLOW_NAMES.APP]: appFlow,
  [FLOW_NAMES.MESSENGER]: messengerFlow,
  [FLOW_NAMES.MESSENGER_B]: messengerBFlow,
  [FLOW_NAMES.WEB]: webFlow,
  [FLOW_NAMES.WHITE_LABEL]: whiteLabelFlow,
  [FLOW_NAMES.RULES_EXPERIENCE]: reFlow,
  [FLOW_NAMES.WEB_BODY_QUIZ]: webBodyQuizFlow,
  [FLOW_NAMES.MESSENGER_AUTOMATION]: messengerAutomationFlow,
  [FLOW_NAMES.MESSENGER_FREE_TASK]: messengerFreeTaskFlow,
  [FLOW_NAMES.CREATOR]: creatorFlow
};
