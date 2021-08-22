/* Services */
import { graphqlService } from 'services/graphqlService';

export type GQLRemoveProductFromClosetVars = {
  userId: string;
  productId: string;
};

const RemoveProductFromCloset = `
  mutation removeFromCloset($userId: String!, $productId: String!) {
    removeFromCloset(userId: $userId, productId: $productId)
  }
`;

export const removeProductFromClosetMutation = async (
  variables: GQLRemoveProductFromClosetVars
): Promise<void> => {
  await graphqlService.graphqlOperation<GQLRemoveProductFromClosetVars, void>(
    RemoveProductFromCloset,
    variables
  );
};
