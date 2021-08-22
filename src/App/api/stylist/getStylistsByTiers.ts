/* Services */
import { graphqlService } from 'services/graphqlService';

/* Types */
import { Stylist } from 'App/types';
import { GQLStylist } from './types';

/* Fragments */
import { stylistFragment } from './fragments';

/* Mappers */
import { stylistMapper } from './mappers';

export type GQLGetStylistsByTiersVars = {
  tier: string;
  stylistsTiers?: string[];
  limit?: number;
  stylistsIds?: string[];
};

interface GQLGetStylistsByTiers {
  getStylistsByTiers: GQLStylist[];
}

const GetStylistsByTiers = `
  query getStylistsByTiers(
    $tier: String!
    $stylistsTiers: [String]
    $limit: Int
    $stylistsIds: [String]
  ) {
    getStylistsByTiers(
      tier: $tier 
      stylistsTiers: $stylistsTiers 
      limit: $limit 
      stylistsIds: $stylistsIds
    ) ${stylistFragment}
  }
`;

export const getStylistsByTiersQuery = async (
  variables: GQLGetStylistsByTiersVars
): Promise<Stylist[]> => {
  const {
    getStylistsByTiers: stylists = []
  } = await graphqlService.graphqlOperation<
    GQLGetStylistsByTiersVars,
    GQLGetStylistsByTiers
  >(GetStylistsByTiers, variables);

  return (stylists || []).map(stylistMapper);
};
