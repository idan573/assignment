import { arrayToDictionary } from '@bit/scalez.savvy-ui.utils';

/* Services */
import { graphqlService } from 'services/graphqlService';

/* Types */
import { Stylist } from 'App/types';
import { GQLStylist } from './types';

/* Fragments */
import { stylistFragment } from './fragments';

/* Mappers */
import { stylistMapper } from './mappers';

export type GQLRetrieveStylistsVars = Partial<{
  stylistsIds: string[];
  isAddFeedback: boolean;
}>;

interface GQLRetrieveStylists {
  retrieveStylists: GQLStylist[];
}

const RetrieveStylists = `
  query retrieveStylists(
    $stylistsIds: [String]
    $isAddFeedback: Boolean
  ) {
    retrieveStylists(
      stylistsIds: $stylistsIds
      isAddFeedback: $isAddFeedback
    ) ${stylistFragment}
  }
`;

export const retrieveStylistsQuery = async (
  variables: GQLRetrieveStylistsVars
): Promise<Stylist[]> => {
  const {
    retrieveStylists: stylists = []
  } = await graphqlService.graphqlOperation<
    GQLRetrieveStylistsVars,
    GQLRetrieveStylists
  >(RetrieveStylists, variables);

  return (stylists || []).map(stylistMapper);
};

/* Stylists dictionary */

export type StylistsDictionary = { [key: string]: Stylist };

export const retrieveStylistsDictionary = async (
  variables: GQLRetrieveStylistsVars
): Promise<StylistsDictionary> => {
  const stylists = await retrieveStylistsQuery({
    isAddFeedback: false,
    ...variables
  });

  return arrayToDictionary<Stylist>(stylists, 'stylistId');
};
