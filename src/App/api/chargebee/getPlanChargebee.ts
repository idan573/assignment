/* Services */
import { graphqlService } from 'services/graphqlService';

/* Types */
import { ChargebeePaymentPlan } from 'App/types';
import { GQLChargebeePaymentPlan } from './types';

/* Fragments */
import { chargebeePlanFragment } from './fragments';

/* Mappers */
import { chargebeePaymentPlanMapper } from './mappers';

export type GQLGetPlanChargebeeVars = {
  planId: string;
};

interface GQLGetPlanChargebee {
  getPlanChargebee: GQLChargebeePaymentPlan;
}

const GetPlanChargebee = `
  query getPlanChargebee($planId: String!) {
    getPlanChargebee(planId: $planId) ${chargebeePlanFragment}
  }
`;

export const getPlanChargebeeQuery = async (
  variables: GQLGetPlanChargebeeVars
): Promise<ChargebeePaymentPlan> => {
  const { getPlanChargebee: plan = {} } = await graphqlService.graphqlOperation<
    GQLGetPlanChargebeeVars,
    GQLGetPlanChargebee
  >(GetPlanChargebee, variables);

  return chargebeePaymentPlanMapper(plan || {});
};
