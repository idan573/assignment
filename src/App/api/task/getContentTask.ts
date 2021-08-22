/* Services */
import { graphqlService } from 'services/graphqlService';

/* Types */
import { TaskDefinition } from 'App/types';
import { GQLTaskDefinition } from './types';

/* Fragments */
import { taskDefinitionFragment } from './fragments';

/* Mappers */
import { taskDefinitionMapper } from './mappers';

export type GQLGetContentTaskVars = {
  taskName: string;
};

interface GQLGetContentTask {
  getContentTask: GQLTaskDefinition;
}

const GetTaskContent = `
  query getContentTask($taskName: String!) {
    getContentTask(taskName: $taskName) ${taskDefinitionFragment}
  }
`;

export const getContentTaskQuery = async (
  variables: GQLGetContentTaskVars
): Promise<TaskDefinition> => {
  const {
    getContentTask: taskDefinition
  } = await graphqlService.graphqlOperation<
    GQLGetContentTaskVars,
    GQLGetContentTask
  >(GetTaskContent, variables);

  return taskDefinitionMapper(taskDefinition || {});
};
