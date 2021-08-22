/* Services */
import { graphqlService } from 'services/graphqlService';

/* Types */
import { Thread } from 'App/types';
import { GQLUserThread as GQLThread } from './types';

/* Fragments */
import { userThreadFragment } from './fragments';

/* Mappers */
import { threadMapper } from './mappers';

export type GQLGetUserThreadsVars = {
  userId: string;
};

interface GQLGetUserThreads {
  getUserThreads: GQLThread[];
}

const GetUserThreads = `
  query getUserThreads($userId: String!) {
    getUserThreads(userId: $userId) ${userThreadFragment}
  }
`;

export const getUserThreadsQuery = async (
  variables: GQLGetUserThreadsVars
): Promise<Thread[]> => {
  const {
    getUserThreads: threads = []
  } = await graphqlService.graphqlOperation<
    GQLGetUserThreadsVars,
    GQLGetUserThreads
  >(GetUserThreads, variables);

  return threads?.map(threadMapper) ?? [];
};
