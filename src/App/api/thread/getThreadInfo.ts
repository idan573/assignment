/* Services */
import { graphqlService } from 'services/graphqlService';

/* Types */
import { Thread } from 'App/types';
import { GQLThread } from './types';

/* Fragments */
import { threadFragment } from './fragments';

/* Mappers */
import { threadMapper } from './mappers';

export type GQLGetThreadInfoVars = {
  threadId: string;
};

interface GQLGetThreadInfo {
  getThreadInfo: GQLThread[];
}

const GetThreadEvents = `
  query getThreadInfo($threadId: String!) {
    getThreadInfo(threadId: $threadId) ${threadFragment}
  }
`;

export const getThreadInfoQuery = async (
  variables: GQLGetThreadInfoVars
): Promise<Thread> => {
  const {
    getThreadInfo: [thread] = []
  } = await graphqlService.graphqlOperation<
    GQLGetThreadInfoVars,
    GQLGetThreadInfo
  >(GetThreadEvents, variables);

  return threadMapper(thread);
};
