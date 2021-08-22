/* Services */
import { graphqlService } from 'root/src/services/graphqlService';

/* Types */
import { Product } from 'App/types';
import { GQLProduct } from 'App/api/closet/types';

/* Fragments */
import { productFragment } from 'App/api/closet/fragments';

/* Mappers */
import { productMapper } from 'App/api/closet/mappers';

export type GQLSuggestProductsVars = {
  userId: string;
  ruleId: string;
  isAgree: boolean;
  extraAttributes?: Partial<{
    key: string;
    value: string;
  }>[];
  numberOfProducts?: number;
  sessionId: string;
  experienceId: string;
};

interface GQLSuggestProducts {
  suggestProducts: GQLProduct[];
}

const SuggestProducts = `
  query suggestProducts(
    $userId: String!
    $ruleId: String!
    $isAgree: Boolean!
    $numberOfProducts: Int
    $extraAttributes: [ExtraAttribute]
    $sessionId: String!
    $experienceId: String!
  ) {
    suggestProducts(
      userId: $userId 
      ruleId: $ruleId
      isAgree: $isAgree
      extraAttributes: $extraAttributes
      numberOfProducts: $numberOfProducts
      sessionId: $sessionId
      experienceId: $experienceId
    ) 
    ${productFragment}
  }
`;

export const suggestProductsQuery = async (
  variables: GQLSuggestProductsVars
): Promise<Product[]> => {
  const {
    suggestProducts: products = []
  } = await graphqlService.graphqlOperation<
    GQLSuggestProductsVars,
    GQLSuggestProducts
  >(SuggestProducts, variables);

  return products?.map(productMapper) ?? [];
};
