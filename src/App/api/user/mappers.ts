/* Types */
import {
  CLIENT_TYPE,
  User,
  UserAttribute,
  UserAttributesByCategory
} from 'App/types';
import { GQLUser, GQLAttributesByCategory, GQLMappedAttribute } from './types';

export const userMapper = ({
  FirstName,
  firstName,
  LastName,
  lastName,
  ProfilePicture,
  profilePic,
  clientType,
  uploadImages,
  isHaveActiveJourneyTask,
  homePageStylist,
  subscriptionTaskCap,
  ...gqlUser
}: GQLUser = {}): User => {
  return {
    firstName: firstName || FirstName,
    lastName: lastName || LastName,
    profilePicture: profilePic || ProfilePicture,
    clientType: clientType as CLIENT_TYPE,
    uploadImages: uploadImages || [],
    isHaveActiveJourneyTask:
      isHaveActiveJourneyTask === 'false' ? false : !!isHaveActiveJourneyTask,
    homePageStylist:
      homePageStylist?.toLowerCase() !== 'none' ? homePageStylist : null,
    subscriptionTaskCap: !!subscriptionTaskCap
      ? subscriptionTaskCap
      : clientType === CLIENT_TYPE.SAVVY
      ? 6 /* TODO: Remove next month when old users will apply new tasks  */
      : subscriptionTaskCap,
    ...gqlUser
  };
};

export const userAttributeMapper = ({
  ...gqlAttribute
}: GQLMappedAttribute): UserAttribute => ({
  ...gqlAttribute
});

export const attributesByCategoryMapper = ({
  body = [],
  demography = [],
  profile = [],
  style = []
}: GQLAttributesByCategory = {}): UserAttributesByCategory => {
  return {
    body: body.map(userAttributeMapper),
    demography: demography.map(userAttributeMapper),
    profile: profile.map(userAttributeMapper),
    style: style.map(userAttributeMapper)
  };
};
