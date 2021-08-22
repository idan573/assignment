/* Services */
import { graphqlService } from 'services/graphqlService';

export type GQLHandleTokenChargebeeVars = {
  gatewayAccountId: string;
  userId: string;
  paymentType: string;
  tmpToken?: string;
};

interface GQLHandleTokenChargebee {
  handleTokenChargebee: string;
}

const HandleTokenChargebee = `
  mutation handleTokenChargebee(
    $userId: String!
    $gatewayAccountId: String!
    $paymentType: String!
    $tmpToken: String
  ) {
    handleTokenChargebee(
      userId: $userId
      gatewayAccountId: $gatewayAccountId
      paymentType: $paymentType
      tmpToken: $tmpToken
    )
  }
`;

export const handleTokenChargebeeMutation = async (
  variables: GQLHandleTokenChargebeeVars
): Promise<void> => {
  const {
    handleTokenChargebee: response
  } = await graphqlService.graphqlOperation<
    GQLHandleTokenChargebeeVars,
    GQLHandleTokenChargebee
  >(HandleTokenChargebee, variables);

  const errorMessage = response?.replace(/{|error=|}/g, '') ?? '';

  if (!!errorMessage) {
    throw {
      message: errorMessage
    };
  }
};
