/* Services */
import { graphqlService } from 'services/graphqlService';

/* Types */
import { Stylist } from 'App/types';
import { GQLStylist } from './types';

/* Fragments */
import { stylistFragment } from './fragments';

/* Mappers */
import { stylistMapper } from './mappers';

export type GQLSearchStylistsVars = {
  userId: string;
  stylistsTiers?: string[];
  limit?: number;
  isAddFeedback?: boolean;
};

interface GQLSearchStylists {
  searchStylists: GQLStylist[];
}

const SearchStylists = `
  query searchStylists(
    $userId: String!
    $stylistsTiers: [String]
    $limit: Int
    $isAddFeedback: Boolean
  ) {
    searchStylists(
      userId: $userId 
      stylistsTiers: $stylistsTiers 
      limit: $limit 
      isAddFeedback: $isAddFeedback
    ) ${stylistFragment}
  }
`;

export const searchStylistsQuery = async (
  variables: GQLSearchStylistsVars
): Promise<Stylist[]> => {
  const {
    searchStylists: stylists = []
  } = await graphqlService.graphqlOperation<
    GQLSearchStylistsVars,
    GQLSearchStylists
  >(SearchStylists, variables);

  return (stylists || []).map(stylistMapper);
};
