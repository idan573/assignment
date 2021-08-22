/* Services */
import { graphqlService } from 'services/graphqlService';

export type GQLSetUserStylistVars = {
  stylistId: string;
  userId: string;
};

const SetUserStylist = `
  mutation setUserStylist(
    $stylistId: String!
    $userId: String!
  ) {
    setUserStylist(
      stylistId: $stylistId
      userId: $userId
    )
  }
`;

export const setUserStylistMutation = async (
  variables: GQLSetUserStylistVars
): Promise<void> => {
  await graphqlService.graphqlOperation<GQLSetUserStylistVars, void>(
    SetUserStylist,
    variables
  );
};
