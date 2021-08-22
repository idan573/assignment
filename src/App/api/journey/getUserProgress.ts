/* Services */
import { graphqlService } from 'services/graphqlService';

/* Types */
import { UserProgress } from 'App/types';
import { GQLUserProgress } from './types';

/* Fragments */
import { userProgressFragment } from './fragments';

/* Mappers */
import { userProgressMapper } from './mappers';

export type GQLGetUserProgressVars = {
  userId: string;
};

interface GQLGetUserProgress {
  getUserProgress: GQLUserProgress[];
}

const GetUserProgress = `
  query getUserProgress($userId: String!) {
    getUserProgress(userId: $userId) ${userProgressFragment}
  }
`;

export const getUserProgressQuery = async (
  variables: GQLGetUserProgressVars
): Promise<UserProgress> => {
  const {
    getUserProgress: [progress] = []
  } = await graphqlService.graphqlOperation<
    GQLGetUserProgressVars,
    GQLGetUserProgress
  >(GetUserProgress, variables);

  return progress
    ? userProgressMapper(progress)
    : {
        currentLevelIndex: 0
      };
};
