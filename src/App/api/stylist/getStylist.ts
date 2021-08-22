/* Services */
import { graphqlService } from 'services/graphqlService';

/* Types */
import { Stylist } from 'App/types';
import { GQLStylist } from './types';

/* Fragments */
import { stylistFragment } from './fragments';

/* Mappers */
import { stylistMapper } from './mappers';

export type GQLGetStylistVars = {
  stylistId: string;
};

interface GQLGetStylist {
  getStylist: GQLStylist[];
}

const GetStylist = `
  query getStylist($stylistId: String!) {
    getStylist(stylistId: $stylistId) ${stylistFragment}
  }
`;

export const getStylistQuery = async (
  variables: GQLGetStylistVars
): Promise<Stylist> => {
  const {
    getStylist: [stylist = {}] = []
  } = await graphqlService.graphqlOperation<GQLGetStylistVars, GQLGetStylist>(
    GetStylist,
    variables
  );

  return stylistMapper(stylist);
};
