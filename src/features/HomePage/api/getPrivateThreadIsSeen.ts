import { allSettled } from '@bit/scalez.savvy-ui.utils';

/* Api */
import {
  GQLGetUserThreadsVars,
  getUserThreadsQuery
} from 'App/api/thread/getUserThreads';
import {
  GQLRetrievePrivateThreadVars,
  retrievePrivateThreadQuery
} from 'App/api/thread/retrievePrivateThread';

import { Thread } from 'App/types';

export type GetPrivateThreadIsSeenVars = {
  userId: string;
};

export const getPrivateThreadIsSeenQuery = async (
  variables: GetPrivateThreadIsSeenVars
): Promise<boolean> => {
  const [userThreads, privateThread] = await allSettled([
    async () => await getUserThreadsQuery(variables),
    async () =>
      await retrievePrivateThreadQuery({
        ...variables,
        isOnlyThreadId: true
      })
  ]);

  const isSeen = userThreads.find(
    thread => thread.threadId === privateThread.threadId
  ).isThreadSeen;

  return isSeen;
};
