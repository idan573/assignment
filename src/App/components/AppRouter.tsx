import * as React from 'react';
import {
  Redirect,
  Route,
  Switch,
  useHistory,
  useLocation
} from 'react-router-dom';
import TopBarProgress from 'react-topbar-progress-indicator';

/* Router Config */
import { standaloneFlowRoutes } from './routerConfig';

/* Components */
import { StandaloneFlowStep } from './StandaloneFlowStep/StandaloneFlowStep';
import FlowProvider from 'FlowBuilder/FlowProvider';
import { FlowBuilder } from 'FlowBuilder/FlowBuilder';
import OnboardingFlowProvider from 'features/OnboardingFlow/components/OnboardingFlowProvider';
import OnboardingFlow from 'features/OnboardingFlow/components/OnboardingFlow';
import TaskResultFlow from 'features/TaskResultFlow/components/TaskResultFlow';
import TaskRoutingFlow from 'features/TaskRoutingFlow/components/TaskRoutingFlow';
import StyleUpsFlow from 'features/StyleUpsFlow/components/StyleUpsFlow';
import PaymentFlow from 'features/PaymentFlow/components/PaymentFlow';
import StandaloneChatPage from 'features/ChatPage/components/StandaloneChatPage';

const AppRouter = () => {
  return (
    <React.Suspense fallback={<TopBarProgress />}>
      <Switch>
        <Route
          exact
          path="/"
          render={({ location }) => (
            <Redirect
              to={{
                pathname: '/homepage',
                state: location.state,
                search: location.search
              }}
            />
          )}
        />

        {/* Standаlone Chat for Test purpose */}
        <Route
          path="/qa/chat"
          render={props => (
            <StandaloneFlowStep {...(props as any)}>
              <StandaloneChatPage {...props} />
            </StandaloneFlowStep>
          )}
        />

        {/* old url redirects */}
        <Route
          exact
          path="/mystyleups/threads"
          render={({ location }) => (
            <Redirect
              to={{
                pathname: '/styleups/list',
                search: location.search,
                state: location.state
              }}
            />
          )}
        />
        <Route
          path="/mystyleups/threads/:threadId"
          render={({ location, match }) => (
            <Redirect
              to={{
                pathname: `/styleups/thread/${match.params.threadId}`,
                search: location.search,
                state: location.state
              }}
            />
          )}
        />
        <Route
          path="/mystyleups/task/:taskId"
          render={({ location, match }) => (
            <Redirect
              to={{
                pathname: `/task-result/task/${match.params.taskId}`,
                search: location.search,
                state: location.state
              }}
            />
          )}
        />
        <Route
          exact
          path="/payment-success"
          render={({ location }) => (
            <Redirect
              to={{
                pathname: '/payment/success',
                search: location.search,
                state: location.state
              }}
            />
          )}
        />

        {/* App Flows */}
        <Route
          path="/onboarding/:pageName?/:taskName?"
          render={props => (
            <OnboardingFlowProvider>
              <OnboardingFlow {...props} />
            </OnboardingFlowProvider>
          )}
        />

        <Route
          path="/task-result/:pageName/:taskId"
          render={props => <TaskResultFlow {...props} />}
        />

        <Route
          path="/styleups/:pageName/:threadId?"
          render={props => <StyleUpsFlow {...props} />}
        />

        <Route
          path="/task-routing-step/:pageName/:stepName"
          render={props => <TaskRoutingFlow {...props} />}
        />

        <Route
          path="/payment/:pageName"
          render={props => <PaymentFlow {...props} />}
        />

        <Route
          exact
          path="/flow/:flowName/:pageNumber?"
          render={props => (
            <FlowProvider {...props}>
              <FlowBuilder {...props} />
            </FlowProvider>
          )}
        />

        {standaloneFlowRoutes.map(
          ({ pathname, component: Component, ...rest }, key) => (
            <Route
              key={key}
              path={pathname}
              render={props => (
                <StandaloneFlowStep {...rest}>
                  <Component {...props} />
                </StandaloneFlowStep>
              )}
            />
          )
        )}
      </Switch>
    </React.Suspense>
  );
};

export default AppRouter;
