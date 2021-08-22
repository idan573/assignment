/* Services */
import { graphqlService } from 'services/graphqlService';

export type GQLProvideProductsTypesVars = Partial<{
  userType: string;
  isOnlyNames: boolean;
}>;

interface GQLProvideProductsTypes {
  provideProductsTypes: Partial<{
    name: string;
    isVisibleOnPersonalPlatform: boolean;
    isVisibleOnStylistPlatform: boolean;
  }>[];
}

const ProvideProductsTypes = `
  query provideProductsTypes(
    $userType: String
    $isOnlyNames: Boolean
  ) {
    provideProductsTypes(
      userType: $userType
      isOnlyNames: $isOnlyNames
    ) {
      name
      isVisibleOnPersonalPlatform
      isVisibleOnStylistPlatform
    }
  }
`;

export const provideProductsTypesQuery = async (
  variables: GQLProvideProductsTypesVars
): Promise<string[]> => {
  const {
    provideProductsTypes: productsTypes = []
  } = await graphqlService.graphqlOperation<
    GQLProvideProductsTypesVars,
    GQLProvideProductsTypes
  >(ProvideProductsTypes, variables);

  return productsTypes?.map(c => c.name);
};
