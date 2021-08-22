/* Services */
import { graphqlService } from 'services/graphqlService';

/* Types */
import { UserProgress } from 'App/types';
import { GQLUserProgress } from './types';

/* Fragments */
import { userProgressFragment } from './fragments';

/* Mappers */
import { userProgressMapper } from './mappers';

export type GQLFinishStepVars = {
  userId: string;
  stepName: string;
};

interface GQLFinishStep {
  finishStep: GQLUserProgress;
}

const FinishStep = `
  mutation finishStep(
    $userId: String!
    $stepName: String!
  ) {
    finishStep(
      userId: $userId
      stepName: $stepName
    ) ${userProgressFragment}
  }
`;

export const finishStepMutation = async (
  variables: GQLFinishStepVars
): Promise<UserProgress> => {
  const { finishStep: userProgress } = await graphqlService.graphqlOperation<
    GQLFinishStepVars,
    GQLFinishStep
  >(FinishStep, variables);

  return userProgress ? userProgressMapper(userProgress) : undefined;
};
