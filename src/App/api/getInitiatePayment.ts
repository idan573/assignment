/* Services */
import { graphqlService } from 'services/graphqlService';

export interface GQLGetInitiatePaymentVars {
  userId: string;
}

export interface GQLInitiatePaymentData {
  stylistId: string;
  taskName: string;
  taskType: string;
  tier: string;
  mustUseChosenStylist: boolean;
  stepName?: string;
}

interface GQLGetInitiatePayment {
  getInitiatePayment: GQLInitiatePaymentData;
}

const GetInitiatePayment = `
  query getInitiatePayment($userId: String!) {
    getInitiatePayment(userId: $userId) {
      stylistId
      taskName
      taskType
      tier
      mustUseChosenStylist
      stepName
    }
  }
`;

export const getInitiatePaymentQuery = async (
  variables: GQLGetInitiatePaymentVars
): Promise<GQLInitiatePaymentData> => {
  const { getInitiatePayment } = await graphqlService.graphqlOperation<
    GQLGetInitiatePaymentVars,
    GQLGetInitiatePayment
  >(GetInitiatePayment, variables);

  return getInitiatePayment;
};
