/* Services */
import { graphqlService } from 'services/graphqlService';

/* Types */
import { TASK_TYPE } from 'App/types';

export type GQLPublishTaskVars = {
  userId: string;
  stylistId: string;
  taskName: string;
  taskType: TASK_TYPE;
  tier?: string;
  mustUseChosenStylist?: boolean;
  userResponse?: string;
  userResponseImages?: string[];
  sourceTaskId?: string;
  stepName?: string;
  taskImages?: string[];
  isSourcePrivateThread?: boolean;
};

interface GQLPublishTask {
  publishTask: {
    taskId: string;
  };
}

const PublishTask = `
  mutation publishTask(
    $userId: String!
    $stylistId: String!
    $taskName: String!
    $taskType: String!
    $tier: String
    $mustUseChosenStylist: Boolean
    $userResponse: String
    $userResponseImages: [String]
    $sourceTaskId: String
    $stepName: String
    $taskImages: [String]
    $isSourcePrivateThread: Boolean
  ) {
    publishTask(
      userId: $userId
      stylistId: $stylistId
      taskName: $taskName
      taskType: $taskType
      tier: $tier
      mustUseChosenStylist: $mustUseChosenStylist
      userResponse: $userResponse
      userResponseImages: $userResponseImages
      sourceTaskId: $sourceTaskId
      stepName: $stepName
      taskImages: $taskImages
      isSourcePrivateThread: $isSourcePrivateThread
    )
  }
`;

export const publishTaskMutation = async (
  variables: GQLPublishTaskVars
): Promise<any> => {
  const { publishTask } = await graphqlService.graphqlOperation<
    GQLPublishTaskVars,
    GQLPublishTask
  >(PublishTask, variables);

  return publishTask;
};
