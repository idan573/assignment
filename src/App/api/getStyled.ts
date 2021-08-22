/* Services */
import { graphqlService } from 'services/graphqlService';

export interface GQLGetStyledVars {
  userId: string;
  stylistId: string;
  taskName: string;
  taskType: string;
  tier: string;
  mustUseChosenStylist?: boolean;
}

const GetStyled = `
  mutation getStyled(
    $userId: String!
    $stylistId: String!
    $taskName: String!
    $taskType: String!
    $tier: String!
    $mustUseChosenStylist: Boolean
  ) {
    getStyled(
      userId: $userId
      stylistId: $stylistId
      taskName: $taskName
      taskType: $taskType
      tier: $tier
      mustUseChosenStylist: $mustUseChosenStylist
    )
  }
`;

export const getStyledMutation = async (
  variables: GQLGetStyledVars
): Promise<string> => {
  const taskId = await graphqlService.graphqlOperation<
    GQLGetStyledVars,
    string
  >(GetStyled, variables);

  return taskId;
};
