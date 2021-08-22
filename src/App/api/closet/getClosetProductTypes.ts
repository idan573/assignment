/* Services */
import { graphqlService } from 'services/graphqlService';

/* Types */
import { ClosetProductTypes } from 'App/types';

/* Mappers */
import { closetProductTypesMapper } from './mappers';

export type GQLGetClosetProductTypesVars = {
  userId: string;
};

interface GQLGetClosetProductTypes {
  getClosetProductTypes: string[];
}

const GetClosetProductTypes = `
  query getClosetProductTypes($userId: String!) {
    getClosetProductTypes(userId: $userId)
  }
`;

export const getClosetProductTypesQuery = async (
  variables: GQLGetClosetProductTypesVars
): Promise<ClosetProductTypes> => {
  const {
    getClosetProductTypes: productTypes = []
  } = await graphqlService.graphqlOperation<
    GQLGetClosetProductTypesVars,
    GQLGetClosetProductTypes
  >(GetClosetProductTypes, variables);

  return closetProductTypesMapper(productTypes);
};
