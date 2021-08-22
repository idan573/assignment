/* Services */
import { graphqlService } from 'services/graphqlService';

/* Types */
import { TaskDefinition } from 'App/types';
import { GQLTaskDefinition } from 'App/api/task/types';

/* Fragments */
import { taskDefinitionFragment } from 'App/api/task/fragments';

import { taskDefinitionMapper } from 'App/api/task/mappers';

export type GQLGetHomepageVars = Partial<{
  stylistId: string;
  category: string;
}>;

export interface HomepageCategory {
  categoryName: string;
  tasks: TaskDefinition[];
}

type GQLHomepageCategory = {
  categoryName: string;
  tasks: GQLTaskDefinition[];
};

interface GQLGetHomepage {
  getHomePage: GQLHomepageCategory[];
}

const GetHomepage = `
  query getHomePage($stylistId: String, $category: String) {
    getHomePage(stylistId: $stylistId, category: $category) {
      categoryName
      tasks ${taskDefinitionFragment}
    }
  }
`;

export const getHomePageQuery = async (
  variables: GQLGetHomepageVars
): Promise<HomepageCategory[]> => {
  const {
    getHomePage: homepageCategories = []
  } = await graphqlService.graphqlOperation<GQLGetHomepageVars, GQLGetHomepage>(
    GetHomepage,
    variables
  );

  return homepageCategories.map(homepageCategoryMapper);
};

const homepageCategoryMapper = ({
  tasks,
  ...category
}: GQLHomepageCategory): HomepageCategory => ({
  ...category,
  tasks: tasks
    .map(homepageCategoryTaskMapper)
    ?.sort((t1, t2) => t1?.positionInCategory - t2?.positionInCategory)
});

const homepageCategoryTaskMapper = (
  { ...task }: GQLTaskDefinition,
  index
): TaskDefinition => {
  const mappedTaskDefinition = taskDefinitionMapper(task);

  return {
    ...mappedTaskDefinition,
    /* Temporary mark first task as recommended */
    isRecommended: index === 0
  };
};
