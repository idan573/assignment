/* Core */
import { getPartialFragment } from 'core/utils';

/* Services */
import { graphqlService } from 'services/graphqlService';

/* Types */
import { Stylist } from 'App/types';
import { GQLStylist } from './types';

/* Fragments */
import { stylistFragment } from './fragments';

/* Mappers */
import { stylistMapper } from './mappers';

export type GQLGetStylistByUsernameVars = {
  userName: string;
};

interface GQLGetStylistByUsername {
  getStylistByUsername: GQLStylist;
}

const GetStylistByUsername = `
  query getStylistByUsername($userName: String!) {
    getStylistByUsername(userName: $userName) ${getPartialFragment(
      stylistFragment,
      ['stylistId']
    )}
  }
`;

export const getStylistByUsernameQuery = async (
  variables: GQLGetStylistByUsernameVars
): Promise<Stylist> => {
  const {
    getStylistByUsername: stylist = { stylistId: '' }
  } = await graphqlService.graphqlOperation<
    GQLGetStylistByUsernameVars,
    GQLGetStylistByUsername
  >(GetStylistByUsername, variables);

  return stylistMapper(stylist);
};
