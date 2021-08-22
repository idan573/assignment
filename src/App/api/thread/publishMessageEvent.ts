/* Services */
import { graphqlService } from 'services/graphqlService';

/* Type */
import { THREAD_EVENT_SENDER_TYPES } from 'App/types/thread';

export type GQLPublishMessageEventVars = Partial<{
  threadId: string;
  userIdFrom: string;
  userIdTo: string;
  text: string;
  images: string[];
  video: string;
  senderType: THREAD_EVENT_SENDER_TYPES;
}>;

type GQLPublishMessageEvent = {
  publishMessageEvent: string;
};

const PublishMessageEvent = `
  mutation publishMessageEvent(
    $threadId: String!
    $userIdFrom: String
    $userIdTo: String
    $text: String
    $images: [String]
    $video: String
    $senderType: String
  ) {
    publishMessageEvent(
      threadId: $threadId
      userIdFrom: $userIdFrom
      userIdTo: $userIdTo
      text: $text
      images: $images
      video: $video
      senderType: $senderType
    )
  }
`;

export const publishMessageEventMutation = async (
  variables: GQLPublishMessageEventVars
): Promise<void> => {
  await graphqlService.graphqlOperation<
    GQLPublishMessageEventVars,
    GQLPublishMessageEvent
  >(PublishMessageEvent, variables);
};
