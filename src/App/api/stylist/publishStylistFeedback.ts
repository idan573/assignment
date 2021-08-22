/* Services */
import { graphqlService } from 'services/graphqlService';

/* Types */
import { GQLStylistFeedback } from './types';

export type GQLPublishStylistFeedbackVars = GQLStylistFeedback & {
  threadId: string;
};

const PublishStylistFeedback = `
  mutation publishStylistFeedback(
    $rate: Int!
    $stylistId: String!
    $taskId: String!
    $taskName: String!
    $threadId: String!
    $userId: String!
    $userName: String!
    $userProfileImage: String!
    $feedback: String
    $taskType: String
    $tier: String
  ) {
    publishStylistFeedback(
      threadId: $threadId
      userId: $userId
      stylistId: $stylistId
      taskId: $taskId
      taskName: $taskName
      taskType: $taskType
      tier: $tier
      rate: $rate
      feedback: $feedback
      userName: $userName
      userProfileImage: $userProfileImage
    ) {
      eventName
      timestamp
    }
  }
`;

export const publishStylistFeedbackMutation = async (
  variables: GQLPublishStylistFeedbackVars
): Promise<void> => {
  await graphqlService.graphqlOperation<GQLPublishStylistFeedbackVars, void>(
    PublishStylistFeedback,
    variables
  );
};
