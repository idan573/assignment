/* Services */
import { graphqlService } from 'services/graphqlService';

/* Types */
import { Product } from 'App/types';
import { GQLProduct } from './types';

/* Fragments */
import { productFragment } from './fragments';

/* Mappers */
import { productMapper } from './mappers';

export type GQLGetClosetVars = {
  userId: string;
  count?: number;
  nextToken?: string;
};

export type GetClosetData = Partial<{
  products: Product[];
  nextToken: string;
}>;

interface GQLGetCloset {
  getCloset: {
    products: GQLProduct[];
    nextToken: string;
  };
}

export const defaultClosetData: GetClosetData = {
  products: [],
  /* Keep initial value not empty for Grid interface */
  nextToken: 'init-token'
};

const GetCloset = `
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
      products ${productFragment}
      nextToken
    }
  }
`;

export const getClosetQuery = async (
  variables: GQLGetClosetVars
): Promise<GetClosetData> => {
  const {
    getCloset: closet = defaultClosetData
  } = await graphqlService.graphqlOperation<GQLGetClosetVars, GQLGetCloset>(
    GetCloset,
    variables
  );

  return {
    ...closet,
    // @ts-ignore
    products: closet?.products?.map(productMapper) ?? []
  };
};
