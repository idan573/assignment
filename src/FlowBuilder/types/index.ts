import { RouteComponentProps } from 'react-router';

/* Types */
import { RootContextState, RootContextActions } from 'App/components';
import { StepData, User } from 'App/types';
import { FlowContextActions, FlowContextState } from 'FlowBuilder/FlowProvider';
import { FlowState } from 'FlowBuilder/flows';

export enum FLOW_NAMES {
  BASE = 'base',
  APP = 'app',
  MESSENGER = 'messenger',
  MESSENGER_B = 'messenger-b',
  MESSENGER_FREE_TASK = 'messenger-free-task',
  MESSENGER_AUTOMATION = 'messenger-auto',
  WEB = 'web',
  WEB_BODY_QUIZ = 'webBodyQuiz',
  WHITE_LABEL = 'wl',
  RULES_EXPERIENCE = 're',
  CREATOR = 'creator'
}

export type FlowEventArgument<> = {
  state: Partial<
    any & Pick<RootContextState, 'userData' | 'isUserHasAllPersonalInfo'>
  >;
  actions: FlowContextActions &
    Pick<RootContextActions, 'setPartialUserData'> &
    Pick<FlowRouteProps, 'onNext' | 'onBack'>;
  route?: RouteComponentProps;
};

export interface CommonFlowState {
  stylistId?: string;
}

export interface FlowConfig<T = any> {
  steps: FlowStepConfig[];
  defaultState?: T & CommonFlowState;
  onStart?: (context: FlowEventArgument) => void;
  onDone?: (context: FlowEventArgument) => void;
  isRepeat?: boolean;
}

export interface FlowStepConfig
  extends Partial<Pick<StepData, 'renderNavbar' | 'headerConfig'>> {
  name: string;
  component: any;
  props?: object;
  trackPage?: boolean;
  skip?: (contextState: FlowEventArgument['state']) => boolean;
  onMoveNext?: (context: FlowEventArgument) => void;
  onMoveBack?: (context: FlowEventArgument) => void;
  restricted?: boolean;
}

export interface FlowRouteProps extends RouteComponentProps {
  userData: User;
  onNext?: (props?: object) => void;
  onBack?: (props?: object) => void;
  currentFlowState: FlowState[keyof FlowState] & CommonFlowState & any;
}
