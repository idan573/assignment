/* Service */
import { graphqlService } from 'services/graphqlService';

export type GQLStartRuleExperienceVars = {
  userId: string;
};

const StartRuleExperience = `
  mutation startRuleExperience(
    $userId: String!
  ) {
    startRuleExperience(
      userId: $userId
    )
  }
`;

export const startRuleExperienceMutation = async (
  variables: GQLStartRuleExperienceVars
): Promise<void> => {
  await graphqlService.graphqlOperation<GQLStartRuleExperienceVars, void>(
    StartRuleExperience,
    variables
  );
};
