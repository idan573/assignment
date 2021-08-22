/* Services */
import { graphqlService } from 'services/graphqlService';

/* Types */
import { User } from 'App/types';
import { GQLUser } from './types';

/* Fragments */
import { userFragment } from './fragments';

/* Mappers */
import { userMapper } from './mappers';

export type GQLGetUserVars = {
  userId: string;
  isAddUploadImages?: boolean;
};

interface GQLGetUserData {
  getUser: GQLUser;
}

const GetUser = `
  query getUser(
    $userId: String!
    $isAddUploadImages: Boolean
  ) {
    getUser(
      userId: $userId
      isAddUploadImages: $isAddUploadImages
    ) ${userFragment}
  }
`;

export const getUserQuery = async (
  variables: GQLGetUserVars
): Promise<User> => {
  const { getUser: user } = await graphqlService.graphqlOperation<
    GQLGetUserVars,
    GQLGetUserData
  >(GetUser, variables);

  if (!user) {
    return null;
    // throw 'There was an error retrieving user data';
  }

  return userMapper(user);
};
