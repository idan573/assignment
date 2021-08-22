/* Services */
import { graphqlService } from 'services/graphqlService';

/* Types */
import { Thread } from 'App/types';
import { GQLRetrieveUserThreadsResponse } from './types';

/* Fragments */
import { retrieveUserThreadsResponseFragment } from './fragments';

/* Mappers */
import { threadMapper } from './mappers';

export type GQLRetrieveUserThreadsVars = {
  userId: string;
  isPrivate?: boolean;
};

interface GQLRetrieveUserThreads {
  retrieveUserThreads: GQLRetrieveUserThreadsResponse[];
}

const RetrieveUserThreads = `
  query retrieveUserThreads(
    $userId: String!
    $isPrivate: Boolean
  ) {
    retrieveUserThreads(
      userId: $userId
      isPrivate: $isPrivate
    ) ${retrieveUserThreadsResponseFragment}
  }
`;

export const retrieveUserThreadsQuery = async (
  variables: GQLRetrieveUserThreadsVars
): Promise<Thread[]> => {
  const {
    retrieveUserThreads: threads = []
  } = await graphqlService.graphqlOperation<
    GQLRetrieveUserThreadsVars,
    GQLRetrieveUserThreads
  >(RetrieveUserThreads, variables);

  return (
    threads
      ?.map(threadMapper)
      ?.sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      ) ?? []
  );
};

export const getUnseenThreadsNumberQuery = async (
  variables: GQLRetrieveUserThreadsVars
): Promise<number> => {
  const {
    retrieveUserThreads: threads = []
  } = await graphqlService.graphqlOperation<
    GQLRetrieveUserThreadsVars,
    GQLRetrieveUserThreads
  >(RetrieveUserThreads, variables);

  return (
    threads?.map(threadMapper)?.filter(thread => !thread.isThreadSeen)
      ?.length ?? 0
  );
};
