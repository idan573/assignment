/* Services */
import { graphqlService } from 'services/graphqlService';

/* Types */
import { CLIENT_TYPE } from 'App/types';
import { GQLUser } from './types';

/* Fragments */
import { userFragment } from './fragments';

export type GQLUpdateUserVars = {
  userId: string;
  attributes?: GQLUserAttributes;
};

type GQLUserAttributes = Partial<{
  homePageStylist: string;
  clientType: CLIENT_TYPE;
  email: string;
  profilePic: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  state: string;
  country: string;
  doneUIFlows: string[];
  currentPlatform: string;
  oneSignalId: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
}>;

interface GQLUpdateUser {
  updateUser: GQLUser;
}

const UpdateUser = `
  mutation updateUser(
    $userId: String!
    $attributes: InputUser
  ) {
    updateUser(
      userId: $userId
      attributes: $attributes
    ) ${userFragment}
  }
`;

export const updateUserMutation = async (
  variables: GQLUpdateUserVars
): Promise<void> => {
  await graphqlService.graphqlOperation<GQLUpdateUserVars, GQLUpdateUser>(
    UpdateUser,
    variables
  );
};
