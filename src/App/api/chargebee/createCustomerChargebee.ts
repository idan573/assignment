/* Services */
import { graphqlService } from 'services/graphqlService';

export type GQLСreateCustomerChargebeeVars = {
  userId: string;
  firstName?: string;
  lastName?: string;
  email?: string;
};

const СreateCustomerChargebee = `
  mutation createCustomerChargebee(
    $userId: String!
    $firstName: String
    $lastName: String
    $email: String
  ) {
    createCustomerChargebee(
      userId: $userId
      firstName: $firstName
      lastName: $lastName
      email: $email
    )
  }
`;

export const createCustomerChargebeeMutation = async (
  variables: GQLСreateCustomerChargebeeVars
): Promise<void> => {
  await graphqlService.graphqlOperation<GQLСreateCustomerChargebeeVars, void>(
    СreateCustomerChargebee,
    variables
  );
};
