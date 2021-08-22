/* Service */
import { graphqlService } from 'services/graphqlService';

/* Types */
import { Product } from 'App/types';
import { GQLInputProduct } from './types';

/* Mappers */
import { inputProductMapper } from './mappers';

export type GQLAddProductToClosetVars = {
  userId: string;
  products?: Product[];
};

const AddProductToCloset = `
  mutation addProductToCloset(
    $userId: String!
    $products: [InputProduct]
  ) {
    addProductToCloset(
      userId: $userId
      products: $products
    )
  }
`;

export const addProductToClosetMutation = async (
  variables: GQLAddProductToClosetVars
): Promise<void> => {
  await graphqlService.graphqlOperation<
    {
      userId: string;
      products: GQLInputProduct[];
    },
    void
  >(AddProductToCloset, {
    ...variables,
    products: (variables.products || []).map(inputProductMapper)
  });
};
