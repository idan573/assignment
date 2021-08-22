/* Services */
import { graphqlService } from 'services/graphqlService';

/* Types */
import { UserResult } from 'App/types';
import { GQLUserResult } from './types';

/* Fragments */
import { userResultFragment } from './fragments';

/* Mappers */
import { userResultMapper } from './mappers';

export type GQLGetUserResultsVars = {
  userId: string;
  stepName?: string;
};

interface GQLGetUserResults {
  getUserResults: GQLUserResult[];
}

const GetUserResults = `
  query getUserResults($userId: String!, $stepName: String) {
    getUserResults(userId: $userId, stepName: $stepName) ${userResultFragment}
  }
`;

export const getUserResultsQuery = async (
  variables: GQLGetUserResultsVars
): Promise<UserResult[]> => {
  const {
    getUserResults: results = []
  } = await graphqlService.graphqlOperation<
    GQLGetUserResultsVars,
    GQLGetUserResults
  >(GetUserResults, variables);

  return results?.map(userResultMapper) ?? [];
};
