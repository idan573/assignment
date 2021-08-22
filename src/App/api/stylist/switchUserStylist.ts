/* Services */
import { graphqlService } from 'services/graphqlService';

export type GQLSwitchUserStylistVars = {
  stylistId: string;
  userId: string;
};

const SwitchUserStylist = `
  mutation switchUserStylist(
    $stylistId: String!
    $userId: String!
  ) {
    switchUserStylist(
      stylistId: $stylistId
      userId: $userId
    )
  }
`;

export const switchUserStylistMutation = async (
  variables: GQLSwitchUserStylistVars
): Promise<void> => {
  await graphqlService.graphqlOperation<GQLSwitchUserStylistVars, void>(
    SwitchUserStylist,
    variables
  );
};
