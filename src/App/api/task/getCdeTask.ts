import { arrayToDictionary } from '@bit/scalez.savvy-ui.utils';

/* Services */
import { graphqlService } from 'services/graphqlService';

/* Business logic */
import { retrieveAnalysisGroups } from './bl/retrieveAnalysisGroups';

/* Api */
import { getClosetProductIdsQuery } from 'App/api/closet/getClosetProductIds';

/* Types */
import { CdeTask } from 'App/types';
import { GQLCdeTask } from './types';

/* Fragments */
import { cdeTaskFragment } from './fragments';

/* Mappers */
import { cdeTaskMapper } from './mappers';

export type GQLGetCdeTaskVars = {
  taskId: string;
  /* 
    userId is not part of gql query, 
    we use it to get closet products and update "inWishlist" prop 
  */
  userId?: string;
};

interface GQLGetCdeTask {
  getCdeTask: GQLCdeTask[];
}

const GetCdeTask = `
  query getCdeTask($taskId: String!) {
    getCdeTask(taskId: $taskId) ${cdeTaskFragment}
  }
`;

export const getCdeTaskQuery = async ({
  userId,
  ...variables
}: GQLGetCdeTaskVars): Promise<CdeTask> => {
  const { getCdeTask: [cdeTask] = [] } = await graphqlService.graphqlOperation<
    GQLGetCdeTaskVars,
    GQLGetCdeTask
  >(GetCdeTask, variables);

  const closetIds = userId
    ? await getClosetProductIdsQuery({
        userId: userId
      })
    : [];

  const mappedTask = cdeTaskMapper(cdeTask, closetIds);
  let analysisGroups = [];

  if (
    !!mappedTask.taskResults?.statements?.length ||
    !!mappedTask.taskResults?.analysisEntries?.length
  ) {
    analysisGroups = await retrieveAnalysisGroups(mappedTask);
  }

  return {
    ...mappedTask,
    taskResults: {
      ...mappedTask.taskResults,
      analysisGroups
    }
  };
};

/* Cde tasks dictionary */

export type CdeTasksDictionary = { [key: string]: CdeTask };

export const getCdeTasksDictionary = async (
  variables: GQLGetCdeTaskVars[]
): Promise<CdeTasksDictionary> => {
  const tasks: CdeTask[] = await Promise.all(
    variables.map(requestData => getCdeTaskQuery(requestData))
  );

  return arrayToDictionary<CdeTask>(tasks, 'taskId');
};
