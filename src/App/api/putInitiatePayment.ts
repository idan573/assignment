/* Services */
import { graphqlService } from 'services/graphqlService';

/* Types */
import { GQLInitiatePaymentData } from './getInitiatePayment';

export interface GQLPutInitiatePaymentVars {
  userId: string;
  initiatePayment?: GQLInitiatePaymentData;
}

const PutInitiatePayment = `
  mutation putInitiatePayment(
    $userId: String!
    $initiatePayment: InitiatePaymentInput
  ) {
    putInitiatePayment(userId: $userId, initiatePayment: $initiatePayment)
  }
`;

export const putInitiatePaymentMutation = async (
  variables: GQLPutInitiatePaymentVars
): Promise<void> => {
  await graphqlService.graphqlOperation<GQLPutInitiatePaymentVars, void>(
    PutInitiatePayment,
    variables
  );
};
