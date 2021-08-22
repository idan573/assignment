/* Core */
import { getPartialFragment } from 'core/utils';

/* Services */
import { graphqlService } from 'services/graphqlService';

/* Types */
import { Product } from 'App/types';
import { GQLGetClosetVars } from './getCloset';

/* Fragments */
import { productFragment } from './fragments';

export type GQLGetClosetProductIdsVars = GQLGetClosetVars;

type GQLGetClosetProductIdsData = Partial<{
  products: Pick<Product, 'productId'>[];
}>;

interface GQLGetClosetProductIds {
  getCloset: GQLGetClosetProductIdsData;
}

const GetClosetProductIds = `
  query getCloset(
    $userId: String!
    $count: Int
    $nextToken: String
  ) {
    getCloset(
      userId: $userId
      count: $count
      nextToken: $nextToken
    ) {
      products ${getPartialFragment(productFragment, ['productId'])}
    }
  }
`;

export const getClosetProductIdsQuery = async (
  variables: GQLGetClosetProductIdsVars
): Promise<string[]> => {
  const { getCloset: closet = {} } = await graphqlService.graphqlOperation<
    GQLGetClosetProductIdsVars,
    GQLGetClosetProductIds
  >(GetClosetProductIds, variables);

  return closet?.products?.map?.(product => product.productId) ?? [];
};
