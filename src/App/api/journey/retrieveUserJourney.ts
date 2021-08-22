/* Services */
import { graphqlService } from 'services/graphqlService';

/* Types */
import { Level } from 'App/types';
import { GQLLevel } from './types';

/* Fragments */
import { levelFragment } from './fragments';

/* Mappers */
import { levelMapper, sortByOrder } from './mappers';

export type GQLRetrieveJourneyVars = {
  userId: string;
};

interface GQLRetrieveJourney {
  retrieveJourney: GQLLevel[];
}

const RetrieveJourney = `
  query retrieveJourney($userId: String!) {
    retrieveJourney(userId: $userId) ${levelFragment}
  }    
`;

export const retrieveJourneyQuery = async (
  variables: GQLRetrieveJourneyVars
): Promise<Level[]> => {
  const {
    retrieveJourney: levels = []
  } = await graphqlService.graphqlOperation<
    GQLRetrieveJourneyVars,
    GQLRetrieveJourney
  >(RetrieveJourney, variables);

  return levels?.map(levelMapper)?.sort(sortByOrder) ?? [];
};
