/* Services */
import { graphqlService } from 'services/graphqlService';

/* Api */
import { getClosetProductIdsQuery } from 'App/api/closet/getClosetProductIds';
import { retrieveStylistsDictionary } from 'App/api/stylist/retrieveStylists';

/* Types */
import { Outfit } from 'App/types';
import { GQLOutfit } from './types';

/* Fragments */
import { outfitFragment } from './fragments';

/* Mappers */
import { outfitMapper } from './mappers';

export type GQLSuggestOutfitsVars = Partial<{
  userId: string;
  stylesIds: string[];
  productsIds: string[];
  numberOfOutfits: number;
  lastDaysAmount: number;
  fromDate: string;
  toDate: string;
}>;

interface GQLSuggestOutfits {
  suggestOutfits: GQLOutfit[];
}

const SuggestOutfits = `
  query suggestOutfits(
    $userId: String
    $stylesIds: [String]
    $productsIds: [String]
    $numberOfOutfits: Int
    $lastDaysAmount: Int
    $fromDate: String
    $toDate: String
  ) {
    suggestOutfits(
      userId: $userId
      stylesIds: $stylesIds
      productsIds: $productsIds
      numberOfOutfits: $numberOfOutfits
      lastDaysAmount: $lastDaysAmount
      fromDate: $fromDate
      toDate: $toDate
    ) ${outfitFragment}
  }
`;

export const suggestOutfitsQuery = async (
  variables: GQLSuggestOutfitsVars
): Promise<Outfit[]> => {
  const {
    suggestOutfits: outfits = []
  } = await graphqlService.graphqlOperation<
    GQLSuggestOutfitsVars,
    GQLSuggestOutfits
  >(SuggestOutfits, variables);

  let closetIds = [];
  let stylistsDictionary = {};

  if (!!variables.userId) {
    closetIds = await getClosetProductIdsQuery({
      userId: variables.userId
    });

    const uniqueStylistIds = outfits.reduce((acc, outfit) => {
      acc.add(outfit?.stylist?.stylistId);
      return acc;
    }, new Set<string>());

    stylistsDictionary = await retrieveStylistsDictionary({
      stylistsIds: [...uniqueStylistIds]
    });
  }

  const mappedOutfits = outfits
    .filter(outfit => !!outfit.products.length)
    .sort(
      (o1, o2) =>
        new Date(o2.receivedTimeStamp).getTime() -
        new Date(o1.receivedTimeStamp).getTime()
    )
    .map(outfit => {
      const mappedOutfit = outfitMapper(outfit, closetIds);

      return {
        ...mappedOutfit,
        stylist:
          stylistsDictionary[outfit.stylist?.stylistId] || mappedOutfit.stylist
      };
    });

  return mappedOutfits;
};
