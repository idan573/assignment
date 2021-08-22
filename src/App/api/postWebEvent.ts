/* Services */
import { graphqlService } from 'services/graphqlService';

export interface PostWebEventProperties {
  fbc?: String;
  fbp?: String;
  userAgent?: String;
  url?: String;
  userIp?: String;
}

export interface GQLPostWebEventVars {
  userId: string;
  event: string;
  properties?: PostWebEventProperties;
}

const PostWebEvent = `
  mutation postWebEvent(
    $userId: String!
    $event: String!
    $properties: PostWebEventProperties
  ) {
    postWebEvent(userId: $userId, event: $event, properties: $properties)
  }
`;

export const postWebEventMutation = async (
  variables: GQLPostWebEventVars
): Promise<void> => {
  await graphqlService.graphqlOperation<GQLPostWebEventVars, void>(
    PostWebEvent,
    variables
  );
};
