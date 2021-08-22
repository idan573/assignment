/* Services */
import { graphqlService } from 'services/graphqlService';

/* Types */
import { Stylist } from 'App/types';
import { GQLStylist } from './types';

/* Fragments */
import { stylistFragment } from './fragments';

/* Mappers */
import { stylistMapper } from './mappers';

interface GQLRetrieveSavvyStylist {
  retrieveSavvyStylist: GQLStylist;
}

const RetrieveSavvyStylist = `
  query retrieveSavvyStylist {
    retrieveSavvyStylist ${stylistFragment}
  }
`;

export const getSavvyStylistQuery = async (): Promise<Stylist> => {
  const {
    retrieveSavvyStylist: savvyStylist = {}
  } = await graphqlService.graphqlOperation<{}, GQLRetrieveSavvyStylist>(
    RetrieveSavvyStylist,
    {}
  );

  return stylistMapper(savvyStylist);
};
