export const threadEventFragment = `{
  threadId
  timestamp
  threadEventType
  senderId
  senderType
  taskId
  taskType
  taskName
  threadIdReference
  referenceDescription
  text
  images
  video
  image
  title
}`;

const partialThreadFragment = `
  threadId
  image
  title
  isConversationStopped
  createdAt
  updatedAt
  isPrivate
`;

export const threadFragment = `{
  events ${threadEventFragment}
  ${partialThreadFragment}
}`;

export const userThreadFragment = `{
  threadId
  userId
  userType
  isThreadSeen
}`;

export const retrieveUserThreadsResponseFragment = `{
  userId
  userType
  isThreadSeen
  ${partialThreadFragment}
}`;
