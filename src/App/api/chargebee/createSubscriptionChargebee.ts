/* Services */
import { graphqlService } from 'services/graphqlService';

export type GQLCreateSubscriptionChargebeeVars = {
  userId: string;
  planId?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  endTrial?: number;
  couponId?: string;
};

const CreateSubscriptionChargebee = `
  mutation createSubscriptionChargebee(
    $userId: String!
    $planId: String
    $firstName: String
    $lastName: String
    $email: String
    $endTrial: Int
    $couponId: String
  ) {
    createSubscriptionChargebee(
      userId: $userId
      planId: $planId
      firstName: $firstName
      lastName: $lastName
      email: $email
      endTrial: $endTrial
      couponId: $couponId
    )
  }
`;

export const createSubscriptionChargebeeMutation = async (
  variables: GQLCreateSubscriptionChargebeeVars
): Promise<void> => {
  await graphqlService.graphqlOperation<
    GQLCreateSubscriptionChargebeeVars,
    void
  >(CreateSubscriptionChargebee, variables);
};
