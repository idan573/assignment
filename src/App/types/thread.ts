export enum THREAD_EVENT_TYPES {
  TASK = 'task',
  TASK_RESPONSE = 'taskResponse',
  TASK_FEEDBACK = 'taskFeedback',
  MESSAGE = 'message',
  THREAD_REFERENCE = 'threadReference',
  INTERNAL_LINK = 'internalLink',
  TASK_SUGGESTION = 'taskSuggestion',
  STEP_SUGGESTION = 'stepSuggestion'
}

export enum THREAD_EVENT_SENDER_TYPES {
  USER = 'user',
  STYLIST = 'stylist',
  SAVVY = 'savvy'
}

export type Thread = Partial<{
  threadId: string;
  image: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  isConversationStopped: boolean;
  isPrivate: boolean;

  /* Not in "retrieveUserThreads" query */
  events: ThreadEvent[];

  /* Only in "retrieveUserThreads" query */
  userId: string;
  userType: string;
  isThreadSeen: boolean;
}>;

export type ThreadEvent = Partial<{
  threadId: string;
  timestamp: string;
  threadEventType: THREAD_EVENT_TYPES;
  senderId: string;
  senderType: THREAD_EVENT_SENDER_TYPES;
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
