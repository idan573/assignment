import * as React from 'react';
import { Switch, Route, RouteComponentProps } from 'react-router-dom';

/* Router Config */
import { styleUpsFlowRoutes } from 'App/components/routerConfig';

/* Components */
import { StandaloneFlowStep } from 'App/components/StandaloneFlowStep/StandaloneFlowStep';

const StyleUpsFlow: React.FC<RouteComponentProps> = React.memo(() => {
  return (
    <Switch>
      {styleUpsFlowRoutes.map(
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
  );
});

export default StyleUpsFlow;
