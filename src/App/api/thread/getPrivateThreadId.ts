/* Core */
import { getPartialFragment } from 'core/utils';

/* Services */
import { graphqlService } from 'services/graphqlService';

/* Types */
import { GQLThread } from './types';
import { GQLRetrievePrivateThreadVars } from './retrievePrivateThread';

/* Fragments */
import { threadFragment } from './fragments';

export type GQLRetrievePrivateThreadIdVars = GQLRetrievePrivateThreadVars;

interface GQLRetrievePrivateThread {
  retrievePrivateThread: GQLThread;
}

const RetrievePrivateThreadId = `
  query retrievePrivateThread(
    $userId: String!
  ) {
    retrievePrivateThread(
      userId: $userId
    ) ${getPartialFragment(threadFragment, ['threadId'])}
  }
`;

export const retrievePrivateThreadIdQuery = async (
  variables: GQLRetrievePrivateThreadIdVars
): Promise<string> => {
  const {
    retrievePrivateThread: { threadId } = {}
  } = await graphqlService.graphqlOperation<
    GQLRetrievePrivateThreadIdVars,
    GQLRetrievePrivateThread
  >(RetrievePrivateThreadId, variables);

  return threadId;
};
