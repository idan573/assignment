import * as React from 'react';
import { Switch, Route, Redirect, RouteComponentProps } from 'react-router-dom';
import TopBarProgress from 'react-topbar-progress-indicator';
import mergeDeepRight from 'ramda/src/mergeDeepRight';
import {
  usePrevious,
  useStateWithCallbackInstant
} from '@bit/scalez.savvy-ui.hooks';
import { HEADER_ITEM_TYPES } from '@bit/scalez.savvy-ui.header';

/* Core */
import { setDefaultHeaderConfig } from 'App/components/headerConfig';

/* Types */
import { FLOW_NAMES, FlowConfig, FlowStepConfig } from 'FlowBuilder/types';

/* Context */
import { RootContext, RootContextType } from 'App/components';
import { FlowContext, FlowContextType } from 'FlowBuilder/FlowProvider';

/* Components */
import { StandaloneFlowStep } from 'App/components/StandaloneFlowStep/StandaloneFlowStep';

/* Flows Config */
import { flows } from 'FlowBuilder/flows';
import { authService } from 'services/authService';
import { isFacebookApp } from 'core/utils';

type Props = RouteComponentProps<{
  flowName: string;
  pageNumber?: string;
}>;

interface StepState {
  index: number;
  state?: any;
}

const defaultStepState: StepState = {
  index: -1,
  state: {}
};

const FlowBuilder: React.FC<Props> = ({ match, history, location }: Props) => {
  const params = match.params;
  const pageNumber = +params.pageNumber || defaultStepState.index;
  const {
    steps: currentFlowSteps,
    defaultState: defaultFlowState = {},
    onStart,
    onDone,
    isRepeat
  }: FlowConfig = flows?.[params.flowName] ?? flows[FLOW_NAMES.BASE];

  const {
    state: { userData, isUserHasAllPersonalInfo },
    actions: { trackPage, setPartialUserData }
  } = React.useContext<RootContextType>(RootContext);

  const {
    state: flowContextState,
    actions: flowContextActions
  } = React.useContext<FlowContextType>(FlowContext);

  const [skipMap, setSkipMap] = React.useState<boolean[]>([]);

  const [currentStepState, setCurrentStepState] = useStateWithCallbackInstant<
    StepState
  >(
    {
      index: pageNumber,
      state: currentFlowSteps?.[pageNumber]?.props ?? defaultStepState.state
    },
    ({ index, state = defaultStepState.state }) => {
      if (index === prevStepState?.index) {
        return;
      }

      /* Done flow handler */
      if (index > currentFlowSteps.length - 1) {
        flowContextActions.setUserFinishFlow(params.flowName);

        if (!!onDone) {
          console.log('Done flow');

          onDone({
            state: {
              userData,
              isUserHasAllPersonalInfo,
              ...flowContextState
            },
            actions: { setPartialUserData, ...flowContextActions }
          });
        }

        history.push({
          pathname: '/homepage',
          search: location.search
        });

        return;
      }

      /* TODO: remove completely after testing */
      /* Handle restricted step */
      // const step = currentFlowSteps[index];
      // if (step?.restricted) {
      //   handleRestricted();
      // }

      /* Negative index handler */
      if (index < 0) {
        setCurrentStepState({
          index: 0,
          state
        });

        return;
      }

      /* Change step handler */
      changeStepHandler({
        index,
        state
      });
    }
  );

  const prevStepState = usePrevious<StepState>(currentStepState);

  React.useEffect(() => {
    window.addEventListener('popstate', () => {
      if (window.location.pathname.includes('flow')) {
        history.go(1);
      }
    });
  }, []);

  React.useEffect(() => {
    /* Set defalut flow state */
    flowContextActions.setFlowState(defaultFlowState);

    /* Set defalut skip map state */
    const initSkipMap = currentFlowSteps.map(({ skip }) =>
      !!skip
        ? skip({
            userData,
            isUserHasAllPersonalInfo,
            ...flowContextState
          })
        : false
    );

    setSkipMap(initSkipMap);

    onStart?.({
      state: {
        userData,
        isUserHasAllPersonalInfo,
        ...flowContextState
      },
      actions: {
        setPartialUserData,
        ...flowContextActions
      },
      route: {
        location,
        history,
        match
      }
    });
  }, []);

  React.useEffect(() => {
    const initSkipMap = currentFlowSteps.map(({ skip }) =>
      !!skip
        ? skip({
            userData,
            isUserHasAllPersonalInfo,
            ...flowContextState
          })
        : false
    );

    setSkipMap(initSkipMap);
  }, [currentStepState]);

  const handleRestricted = React.useCallback(async () => {
    if (!isFacebookApp() && !(await authService.isAuthenticated())) {
      authService.login();
    }
  }, []);

  React.useEffect(() => {
    /* Redirect to HomePage if current flow is done */
    if (!!userData?.doneUIFlows?.includes(params.flowName) && !isRepeat) {
      history.push({
        pathname: '/homepage',
        search: location.search
      });
    }
  }, [userData]);

  const onSkipStep = React.useCallback(
    ({ index, state }: StepState) => {
      /* Block "back" redirect to first step  */
      if (index === 0 && prevStepState.index !== defaultStepState.index) {
        setCurrentStepState({
          index: index + 1,
          state
        });
        return;
      }

      /* Recursively skip step on "next" and "back" redirect */
      setCurrentStepState({
        index: index + Math.sign(index - prevStepState.index),
        state
      });
    },
    [prevStepState]
  );

  const onChangeStep = React.useCallback(
    ({ index, state }: StepState, step: FlowStepConfig) => {
      const direction = Math.sign(index - prevStepState.index);
      const eventArg = {
        state: {
          userData,
          isUserHasAllPersonalInfo,
          ...flowContextState?.flowState[params.flowName]
        },
        actions: {
          setPartialUserData,
          onNext,
          onBack,
          ...flowContextActions
        }
      };

      /* TODO: refactor */
      if (prevStepState.index === -1) {
        /* track page on first step "onMount" event */
        if (step?.trackPage ?? true) {
          trackPage({
            name: step.name,
            properties: {
              isFlow: true,
              flowName: params.flowName
            }
          });
        }
      }

      /* Ignore initial state step change (-1 => 0) */
      if (prevStepState.index >= 0) {
        if (direction > 0) {
          const prevStep = currentFlowSteps[index - 1];
          prevStep?.onMoveNext && prevStep?.onMoveNext(eventArg);
        } else if (prevStepState.index > 0) {
          const nextStep = currentFlowSteps[index + 1];
          nextStep?.onMoveBack && nextStep.onMoveBack(eventArg);
        }

        /* track page "onMount" event */
        if (step?.trackPage ?? true) {
          trackPage({
            name: step.name,
            properties: {
              isFlow: true,
              flowName: params.flowName
            }
          });
        }
      }

      const nextPathname = `/flow/${params.flowName}/${index || 0}`;

      /* Prevent infinite redirect loop */
      if (location.pathname !== nextPathname) {
        history.push({
          pathname: nextPathname,
          search: location.search,
          state
        });
      }
    },
    [
      prevStepState,
      userData,
      isUserHasAllPersonalInfo,
      flowContextState.flowState
    ]
  );

  const changeStepHandler = React.useCallback(
    ({ index, state }: StepState) => {
      const step = currentFlowSteps[index];
      const isSkipStep = !!step?.skip
        ? step.skip({
            userData,
            isUserHasAllPersonalInfo,
            ...flowContextState
          })
        : false;

      /* Regular step change handler */
      if (index !== pageNumber) {
        if (isSkipStep) {
          onSkipStep({ index, state });
        } else {
          onChangeStep({ index, state }, step);
        }

        return;
      }

      /* Skip step on manual url change */
      if (isSkipStep) {
        setCurrentStepState({
          index: index + 1,
          state
        });
      }
    },
    [onSkipStep, flowContextState]
  );

  const onNext = React.useCallback((props: object = {}) => {
    //@ts-ignore
    setCurrentStepState(prevState => ({
      index: prevState.index + 1,
      state: mergeDeepRight(prevState?.state || {}, props)
    }));
  }, []);

  const onBack = React.useCallback((props: object = {}) => {
    //@ts-ignore
    setCurrentStepState(prevState => ({
      index: prevState.index - 1,
      state: mergeDeepRight(prevState?.state || {}, props)
    }));
  }, []);

  const isShowBackButton = React.useMemo(
    () =>
      [...skipMap].splice(0, currentStepState.index).some(isSkip => !isSkip),
    [skipMap, currentStepState.index]
  );

  const defaultFlowStepProps = React.useMemo(() => {
    return {
      renderNavbar: false,
      headerConfig: !!isShowBackButton
        ? setDefaultHeaderConfig({
            onClick: () => onBack()
          })
        : undefined
    };
  }, [isShowBackButton]);

  return (
    <React.Suspense fallback={<TopBarProgress />}>
      <Switch>
        {currentFlowSteps.map(
          (
            { component: Component, name, skip, trackPage, props, ...rest },
            key
          ) => (
            <Route
              key={key}
              path={`/flow/${params.flowName}/${key}`}
              render={routeProps => (
                <StandaloneFlowStep
                  stateName={name as any}
                  {...defaultFlowStepProps}
                  {...rest}
                >
                  <Component
                    {...routeProps}
                    {...props}
                    onBack={onBack}
                    onNext={onNext}
                    userData={userData}
                    currentFlowState={
                      flowContextState.flowState[params.flowName]
                    }
                  />
                </StandaloneFlowStep>
              )}
            />
          )
        )}

        <Redirect
          to={{
            pathname: `/flow/${params.flowName}/0`,
            state: location.state,
            search: location.search
          }}
        />
      </Switch>
    </React.Suspense>
  );
};

export { FlowBuilder };
