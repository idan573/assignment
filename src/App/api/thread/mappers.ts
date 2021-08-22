/* Types */
import {
  GQLThread,
  GQLUserThread,
  GQLRetrieveUserThreadsResponse,
  GQLThreadEvent
} from './types';

import {
  Thread,
  ThreadEvent,
  THREAD_EVENT_TYPES,
  THREAD_EVENT_SENDER_TYPES
} from 'App/types/thread';

export const threadEventMapper = ({
  threadEventType,
  senderType,
  ...rest
}: GQLThreadEvent = {}): ThreadEvent => ({
  threadEventType: threadEventType as THREAD_EVENT_TYPES,
  senderType: senderType as THREAD_EVENT_SENDER_TYPES,
  ...rest
});

export const threadMapper = ({
  events = [],
  isThreadSeen,
  ...rest
}: /* TODO: fix TS (any) or unify threads interfaces */
| GQLThread
  | GQLUserThread
  | GQLRetrieveUserThreadsResponse
  | any = {}): Thread => ({
  events: (events || []).map(threadEventMapper),
  isThreadSeen: [undefined, null].includes(isThreadSeen) || isThreadSeen,
  ...rest
});
