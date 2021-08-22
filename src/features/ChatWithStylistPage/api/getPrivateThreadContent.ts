/* Api */
import {
  GQLRetrievePrivateThreadVars,
  retrievePrivateThreadQuery
} from 'App/api/thread/retrievePrivateThread';
import {
  StylistsDictionary,
  retrieveStylistsDictionary
} from 'App/api/stylist/retrieveStylists';

/* Types */
import {
  Thread,
  THREAD_EVENT_TYPES,
  THREAD_EVENT_SENDER_TYPES
} from 'App/types';

export type GetPrivateThreadContentVars = GQLRetrievePrivateThreadVars;

export type PrivateThreadContent = Partial<{
  thread: Thread;
  stylists: StylistsDictionary;
}>;

export const getPrivateThreadContentQuery = async (
  variables: GetPrivateThreadContentVars
): Promise<PrivateThreadContent> => {
  const privateThread = await retrievePrivateThreadQuery(variables);

  const uniqueStylistIds = [
    ...privateThread.events.reduce((acc, event) => {
      if (event.senderType === THREAD_EVENT_SENDER_TYPES.STYLIST) {
        acc.add(event.senderId);
      }

      return acc;
    }, new Set<string>())
  ];

  const stylistsDictionary = await retrieveStylistsDictionary({
    stylistsIds: [...uniqueStylistIds]
  });

  return {
    thread: {
      ...privateThread,
      /* Do not display feedbacks */
      events: privateThread.events.filter(
        event => event.threadEventType !== THREAD_EVENT_TYPES.TASK_FEEDBACK
      )
    },
    stylists: stylistsDictionary
  };
};
