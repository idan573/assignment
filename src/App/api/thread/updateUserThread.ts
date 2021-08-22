/* Services */
import { graphqlService } from 'services/graphqlService';

export type GQLUpdateUserThreadVars = {
  threadId: string;
  userId: string;
  isThreadSeen?: boolean;
};

interface GQLUpdateUserThread {
  updateUserThread: string;
}

const UpdateUserThread = `
  mutation updateUserThread(
    $threadId: String!
    $userId: String!
    $isThreadSeen: Boolean
  ) {
    updateUserThread(
      threadId: $threadId
      userId: $userId
      isThreadSeen: $isThreadSeen
    )
  }
`;

export const updateUserThreadMutation = async (
  variables: GQLUpdateUserThreadVars
): Promise<void> => {
  await graphqlService.graphqlOperation<
    GQLUpdateUserThreadVars,
    GQLUpdateUserThread
  >(UpdateUserThread, variables);
};
