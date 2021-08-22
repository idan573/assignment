import * as React from 'react';
import { Switch, Route, RouteComponentProps } from 'react-router-dom';
import { Loader } from '@bit/scalez.savvy-ui.loader';
import { useRequest } from '@bit/scalez.savvy-ui.hooks';

/* Api */
import { GQLGetCdeTaskVars, getCdeTaskQuery } from 'App/api/task/getCdeTask';

/* Types */
import { CdeTask } from 'App/types';

/* Router Config */
import { taskResultFlowRoutes } from 'App/components/routerConfig';

/* Components */
import { RootContext, RootContextType } from 'App/components';
import { StandaloneFlowStep } from 'App/components/StandaloneFlowStep/StandaloneFlowStep';

type Props = RouteComponentProps<{ taskId: string }>;

const TaskResultFlow: React.FC<Props> = React.memo(({ match }: Props) => {
  const {
    state: { userData },
    actions: { setActiveTaskResultData }
  } = React.useContext<RootContextType>(RootContext);

  const { loading } = useRequest<GQLGetCdeTaskVars, CdeTask>(getCdeTaskQuery, {
    payload: {
      taskId: match.params.taskId
      /* TODO: clarify if we can remove it */
      // userId: userData.userId
    },
    onCompleted: setActiveTaskResultData
  });

  return loading ? (
    <Loader />
  ) : (
    <Switch>
      {taskResultFlowRoutes.map(
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

export default TaskResultFlow;
