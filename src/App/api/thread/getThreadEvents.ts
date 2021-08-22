/* Services */
import { graphqlService } from 'services/graphqlService';

/* Types */
import { ThreadEvent } from 'App/types';
import { GQLThreadEvent } from './types';

/* Fragments */
import { threadEventFragment } from './fragments';

/* Mappers */
import { threadEventMapper } from './mappers';

export type GQLGetThreadsEventsVars = {
  threadId: string;
};

interface GQLGetThreadsEvents {
  getThreadEvents: GQLThreadEvent[];
}

const GetThreadEvents = `
  query getThreadEvents($threadId: String!) {
    getThreadEvents(threadId: $threadId) ${threadEventFragment}
  }
`;

export const getThreadEventsQuery = async (
  variables: GQLGetThreadsEventsVars
): Promise<ThreadEvent[]> => {
  const {
    getThreadEvents: events = []
  } = await graphqlService.graphqlOperation<
    GQLGetThreadsEventsVars,
    GQLGetThreadsEvents
  >(GetThreadEvents, variables);

  return (
    events
      ?.map(threadEventMapper)
      ?.sort((a, b) => +new Date(a.timestamp) - +new Date(b.timestamp)) ?? []
  );
};
