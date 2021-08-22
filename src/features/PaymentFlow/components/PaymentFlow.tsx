import * as React from 'react';
import { Switch, Route, RouteComponentProps } from 'react-router-dom';
import { useRequest } from '@bit/scalez.savvy-ui.hooks';
import { Loader } from '@bit/scalez.savvy-ui.loader';

/* Api */
import {
  GQLGetPlanChargebeeVars,
  getPlanChargebeeQuery
} from 'App/api/chargebee/getPlanChargebee';
import {
  GQLGetPlanByExpertIdChargebeeVars,
  getPlanByExpertIdChargebeeQuery
} from 'App/api/chargebee/getPlanByExpertId';

/* Types */
import { ChargebeePaymentPlan, CHARGEBEE_PLAN_ID } from 'App/types';

/* Router Config */
import { paymentFlowRoutes } from 'App/components/routerConfig';

/* Components */
import { RootContext, RootContextType } from 'App/components';
import { StandaloneFlowStep } from 'App/components/StandaloneFlowStep/StandaloneFlowStep';

const PaymentFlow: React.FC<RouteComponentProps> = React.memo(
  ({ location }) => {
    const { paramsPlanId } = React.useMemo(() => {
      const searchParams = new URLSearchParams(location.search);
      return {
        paramsPlanId: searchParams.get('planId')
      };
    }, []);

    const {
      state: { userData, isCreatorFlow, activePaymentPlanData },
      actions: { setActivePaymentPlanData }
    } = React.useContext<RootContextType>(RootContext);

    const planId =
      paramsPlanId ||
      (ENV === ENVIRONMENTS.PROD
        ? CHARGEBEE_PLAN_ID.ONE_MONTH_TRIAL
        : CHARGEBEE_PLAN_ID.TEST);

    const { loading: loadingPlan } = useRequest<
      GQLGetPlanChargebeeVars,
      ChargebeePaymentPlan
    >(getPlanChargebeeQuery, {
      skip: !planId || isCreatorFlow,
      payload: {
        planId: activePaymentPlanData.id || planId
      },
      onCompleted: setActivePaymentPlanData
    });

    const { loading: loadingPlanById } = useRequest<
      GQLGetPlanByExpertIdChargebeeVars,
      ChargebeePaymentPlan
    >(getPlanByExpertIdChargebeeQuery, {
      skip: !isCreatorFlow,
      payload: {
        userId: userData.homePageStylist
      },
      onCompleted: setActivePaymentPlanData
    });

    return (
      <>
        <Loader render={loadingPlan || loadingPlanById} />

        <Switch>
          {paymentFlowRoutes.map(
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
      </>
    );
  }
);

export default PaymentFlow;
