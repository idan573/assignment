/* Services */
import { graphqlService } from 'services/graphqlService';

/* Types */
import { Thread, THREAD_EVENT_TYPES } from 'App/types';
import { GQLThread } from './types';

/* Fragments */
import { threadFragment } from './fragments';

/* Mappers */
import { threadMapper } from './mappers';

export type GQLRetrievePrivateThreadVars = Partial<{
  threadId: string;
  userId: string;
  stylistId: string;
  isAddEvents: boolean;
  isOnlyThreadId: boolean;
}>;

interface GQLRetrievePrivateThread {
  retrievePrivateThread: GQLThread;
}

const RetrievePrivateThread = `
  query retrievePrivateThread(
    $threadId: String
    $userId: String
    $stylistId: String
    $isAddEvents: Boolean
    $isOnlyThreadId: Boolean
  ) {
    retrievePrivateThread(
      threadId: $threadId
      stylistId: $stylistId
      userId: $userId
      isAddEvents: $isAddEvents
      isOnlyThreadId: $isOnlyThreadId
    ) ${threadFragment}
  }
`;

export const retrievePrivateThreadQuery = async (
  variables: GQLRetrievePrivateThreadVars
): Promise<Thread> => {
  const {
    retrievePrivateThread: thread = {}
  } = await graphqlService.graphqlOperation<
    GQLRetrievePrivateThreadVars,
    GQLRetrievePrivateThread
  >(RetrievePrivateThread, variables);

  return threadMapper(thread);
};
