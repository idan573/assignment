/* Types */
import { Outfit } from 'App/types';
import { GQLOutfit } from './types';

/* Mappers */
import { stylistMapper } from 'App/api/stylist/mappers';

export const outfitMapper = (
  outfit: GQLOutfit,
  closetIds: string[] = []
): Outfit => ({
  userId: outfit.userId,
  styleId: outfit.styleId,
  score: Math.round(outfit.score),
  position: outfit.position,
  receivedTimeStamp: outfit.receivedTimeStamp,
  rates: outfit.rates,
  stylist: stylistMapper(outfit.stylist),
  products: outfit.products.map(product => ({
    ...product,
    inWishlist: closetIds.some(id => id === product.productId)
  }))
});
