import * as React from 'react';
import { Switch, RouteComponentProps, Route } from 'react-router-dom';
import { RootContext, RootContextType } from 'App/components';
import { useRequest } from '@bit/scalez.savvy-ui.hooks';

/* Router Config */
import { taskRoutingStepFlowRoutes } from 'App/components/routerConfig';

/* Api */
import { getStepQuery, GQLGetStepVars } from 'App/api/journey/getStep';

/* Components */
import { StandaloneFlowStep } from 'App/components/StandaloneFlowStep/StandaloneFlowStep';

/* Types */
import { Step } from 'App/types';

type Props = RouteComponentProps<{ stepName: string }>;

const TaskRoutingFlow: React.FC<Props> = React.memo(({ match }: Props) => {
  const {
    actions: { setActiveJourneyInfo }
  } = React.useContext<RootContextType>(RootContext);

  useRequest<GQLGetStepVars, Step>(getStepQuery, {
    payload: {
      stepName: match.params.stepName
    },
    onCompleted(data) {
      setActiveJourneyInfo({ activeStepInfo: data });
    }
  });

  return (
    <Switch>
      {taskRoutingStepFlowRoutes.map(
        ({ pathname, component: Component, restricted, ...rest }, key) => (
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
  );
});

export default TaskRoutingFlow;
