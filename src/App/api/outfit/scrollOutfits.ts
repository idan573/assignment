/* Services */
import { graphqlService } from 'services/graphqlService';

/* Api */
import { getClosetProductIdsQuery } from 'App/api/closet/getClosetProductIds';
import {
  retrieveStylistsQuery,
  retrieveStylistsDictionary
} from 'App/api/stylist/retrieveStylists';

/* Types */
import { Product, Outfit } from 'App/types';
import { GQLOutfit } from './types';

/* Fragments */
import { outfitFragment } from './fragments';

/* Mappers */
import { outfitMapper } from './mappers';

export type GQLScrollOutfitsVars = Partial<{
  userId: string;
  stylistId: string;
  numberOfOutfits: number;
  lastDaysAmount: number;
  fromDate: string;
  toDate: string;
  scrollId: string;
  isFilterUserId: boolean;
  isUserOutfits: boolean;
}>;

export type ScrollOutfitsData = Partial<{
  outfits: Outfit[];
  scrollId: string;
}>;

interface GQLScrollOutfits {
  scrollOutfits: {
    results: GQLOutfit[];
    scrollId: string;
  };
}

const ScrollOutfits = `
  query scrollOutfits(
    $userId: String
    $stylistId: String
    $numberOfOutfits: Int
    $lastDaysAmount: Int
    $fromDate: String
    $toDate: String
    $scrollId: String
    $isFilterUserId: Boolean
    $isUserOutfits: Boolean
  ) {
    scrollOutfits(
      userId: $userId
      stylistId: $stylistId
      numberOfOutfits: $numberOfOutfits
      lastDaysAmount: $lastDaysAmount
      fromDate: $fromDate
      toDate: $toDate
      scrollId: $scrollId
      isFilterUserId: $isFilterUserId
      isUserOutfits: $isUserOutfits
    ) {
      results ${outfitFragment}
      scrollId  
    }
  }
`;

export const scrollOutfitsQuery = async (
  variables: GQLScrollOutfitsVars
): Promise<ScrollOutfitsData> => {
  const { scrollOutfits } = await graphqlService.graphqlOperation<
    GQLScrollOutfitsVars,
    GQLScrollOutfits
  >(ScrollOutfits, variables);

  let closetIds = [];
  let stylistsDictionary = {};

  if (!!variables.userId) {
    closetIds = await getClosetProductIdsQuery({
      userId: variables.userId
    });

    const uniqueStylistIds = scrollOutfits.results.reduce((acc, outfit) => {
      acc.add(outfit?.stylist?.stylistId);
      return acc;
    }, new Set<string>());

    stylistsDictionary = await retrieveStylistsDictionary({
      stylistsIds: [...uniqueStylistIds]
    });
  }

  const mappedOutfits = scrollOutfits.results
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

  return {
    outfits: mappedOutfits,
    scrollId: scrollOutfits.scrollId
  };
};
