import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import mergeDeepRight from 'ramda/src/mergeDeepRight';
import { useLazyRequest } from '@bit/scalez.savvy-ui.hooks';

/* Services */
import { TrackEventArgs, TrackPageArgs } from 'services/analyticsService';

/* Api */
import { GQLUpdateUserVars, updateUserMutation } from 'App/api/user/updateUser';

/* Types */
import { FlowState } from 'FlowBuilder/flows';
import { User } from 'App/types';

/* Context */
import { RootContextType, RootContext } from 'App/components';

export interface FlowContextState {
  flowState: FlowState;
}

export interface FlowContextActions {
  setUserFinishFlow: (flowName: string) => void;
  setFlowState: (newState: object) => void;
  setPartialUserData: (user: User) => void;
  trackPage: (args: TrackPageArgs) => void;
  trackEvent: (args: TrackEventArgs) => void;
  setActiveStepData: (args: any) => void;
}

export interface FlowContextType {
  state: FlowContextState;
  actions?: FlowContextActions;
}

export const FlowContext = React.createContext<FlowContextType>({
  state: {
    flowState: {}
  }
});

interface Props
  extends RouteComponentProps<{
    flowName: string;
    pageNumber?: string;
  }> {
  children: string | JSX.Element | (string | JSX.Element)[];
}

const FlowProvider: React.FC<Props> = ({
  children,
  match: { params }
}: Props) => {
  const {
    state: { userData },
    actions: { setPartialUserData, trackPage, trackEvent, setActiveStepData }
  } = React.useContext<RootContextType>(RootContext);

  const [updateUser, { loading: updateUserLoading }] = useLazyRequest<
    GQLUpdateUserVars,
    void
  >(updateUserMutation);

  const [flowState, setFlowState] = React.useState<FlowState>({});

  const setUserFinishFlow = React.useCallback(
    (flowName: string) => {
      const doneUIFlows = [...(userData?.doneUIFlows ?? []), flowName];

      setPartialUserData({
        doneUIFlows: [...new Set(doneUIFlows)]
      });

      updateUser({
        userId: userData?.userId,
        attributes: {
          doneUIFlows
        }
      });
    },
    [userData]
  );

  const setCurrentFlowState = React.useCallback((newState: object) => {
    setFlowState(prevState =>
      mergeDeepRight(prevState, {
        [params.flowName]: newState
      })
    );
  }, []);

  return (
    <FlowContext.Provider
      value={{
        state: {
          flowState
        },
        actions: {
          setUserFinishFlow,
          setFlowState: setCurrentFlowState,
          setPartialUserData,
          trackPage,
          trackEvent,
          setActiveStepData
        }
      }}
    >
      {children}
    </FlowContext.Provider>
  );
};

export default FlowProvider;
