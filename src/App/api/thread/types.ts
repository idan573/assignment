import {
  Thread,
  ThreadEvent,
  THREAD_EVENT_TYPES,
  THREAD_EVENT_SENDER_TYPES
} from 'App/types/thread';

export type GQLThreadEvent = Partial<{
  threadId: string;
  timestamp: string;
  threadEventType:
    | 'task'
    | 'taskResponse'
    | 'taskFeedback'
    | 'message'
    | 'threadReference'
    | 'internalLink'
    | 'taskSuggestion'
    | 'stepSuggestion';
  senderId: string;
  senderType: string;
  taskId: string;
  taskType: string;
  taskName: string;
  threadIdReference: string;
  referenceDescription: string;
  text: string;
  images: string[];
  video: string;
  title: string;
  image: string;
}>;

export type GQLThread = Partial<{
  threadId: string;
  image: string;
  title: string;
  isConversationStopped: boolean;
  events: GQLThreadEvent[];
  createdAt: string;
  updatedAt: string;
  isPrivate: boolean;
}>;

export type GQLUserThread = Pick<GQLThread, 'threadId'> &
  Partial<{
    userId: string;
    userType: string;
    isThreadSeen: boolean;
  }>;

export type GQLRetrieveUserThreadsResponse = Omit<GQLThread, 'events'> &
  Partial<{
    userId: string;
    userType: string;
    isThreadSeen: boolean;
  }>;
