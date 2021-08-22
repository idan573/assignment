/* Services */
import { graphqlService } from 'services/graphqlService';

/* Types */
import { GQLUserProgress } from './types';

/* Fragments */
import { userProgressFragment } from './fragments';

export type GQLStartStepVars = {
  userId: string;
  stepName: string;
  isRedoStep?: boolean;
  taskId?: string;
};

interface GQLStartStep {
  startStep: GQLUserProgress;
}

const StartStep = `
  mutation startStep(
    $userId: String!
    $stepName: String!
    $isRedoStep: Boolean
    $taskId: String
  ) {
    startStep(
      userId: $userId
      stepName: $stepName
      isRedoStep: $isRedoStep
      taskId: $taskId
    ) ${userProgressFragment}
  }
`;

export const startStepMutation = async (
  variables: GQLStartStepVars
): Promise<void> => {
  await graphqlService.graphqlOperation<GQLStartStepVars, void>(
    StartStep,
    variables
  );
};
