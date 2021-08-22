import { allSettled } from '@bit/scalez.savvy-ui.utils';

/* Api */
import { getThreadInfoQuery } from 'App/api/thread/getThreadInfo';
import { getThreadEventsQuery } from 'App/api/thread/getThreadEvents';
import {
  CdeTasksDictionary,
  getCdeTasksDictionary
} from 'App/api/task/getCdeTask';
import {
  StylistsDictionary,
  retrieveStylistsDictionary
} from 'App/api/stylist/retrieveStylists';

/* Types */
import {
  CdeTask,
  Thread,
  THREAD_EVENT_TYPES,
  THREAD_EVENT_SENDER_TYPES
} from 'App/types';

export type GetThreadContentVars = {
  threadId: string;
};

export type ThreadContentData = Partial<{
  thread: Thread;
  stylists: StylistsDictionary;
  tasks: CdeTasksDictionary;
}>;

export const getThreadContentQuery = async (
  variables: GetThreadContentVars
): Promise<ThreadContentData> => {
  const [threadInfo, threadEvents] = await allSettled([
    async () => await getThreadInfoQuery(variables),
    async () => await getThreadEventsQuery(variables)
  ]);

  const uniqueTaskIds = [
    ...threadEvents.reduce((acc, event) => {
      if (!!event.taskId) {
        acc.add(event.taskId);
      }

      return acc;
    }, new Set<string>())
  ];

  const uniqueStylistIds = [
    ...threadEvents.reduce((acc, event) => {
      if (event.senderType === THREAD_EVENT_SENDER_TYPES.STYLIST) {
        acc.add(event.senderId);
      }

      return acc;
    }, new Set<string>())
  ];

  const [stylistsDictionary, tasksDictionary] = await allSettled([
    async () =>
      await retrieveStylistsDictionary({
        stylistsIds: uniqueStylistIds
      }),
    async () =>
      await getCdeTasksDictionary(
        uniqueTaskIds.map(taskId => ({
          taskId
        }))
      )
  ]);

  return {
    thread: {
      ...threadInfo,
      /* Do not display feedbacks */
      events: threadEvents.filter(
        event => event.threadEventType !== THREAD_EVENT_TYPES.TASK_FEEDBACK
      )
    },
    stylists: stylistsDictionary,
    tasks: tasksDictionary
  };
};
