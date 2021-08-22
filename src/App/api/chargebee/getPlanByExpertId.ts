/* Services */
import { graphqlService } from 'services/graphqlService';

/* Types */
import { ChargebeePaymentPlan } from 'App/types';
import { GQLChargebeePaymentPlan } from './types';

/* Fragments */
import { chargebeePlanFragment } from './fragments';

/* Mappers */
import { chargebeePaymentPlanMapper } from './mappers';

export type GQLGetPlanByExpertIdChargebeeVars = {
  userId: string;
};

interface GQLGetPlanByExpertIdChargebee {
  getPlanByExpertId: GQLChargebeePaymentPlan;
}

const GetPlanByExpertId = `
  query getPlanByExpertId($userId: String!) {
    getPlanByExpertId(userId: $userId) ${chargebeePlanFragment}
  }
`;

export const getPlanByExpertIdChargebeeQuery = async (
  variables: GQLGetPlanByExpertIdChargebeeVars
): Promise<ChargebeePaymentPlan> => {
  const {
    getPlanByExpertId: plan = {}
  } = await graphqlService.graphqlOperation<
    GQLGetPlanByExpertIdChargebeeVars,
    GQLGetPlanByExpertIdChargebee
  >(GetPlanByExpertId, variables);

  return chargebeePaymentPlanMapper(plan || {});
};
