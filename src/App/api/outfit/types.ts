/* Types */
import { GQLStylist } from 'App/api/stylist/types';
import { Product } from 'App/types';

export interface GQLOutfit {
  userId: string;
  styleId: string;
  score: number;
  position: number;
  receivedTimeStamp: string;
  rates: {
    rate: string;
    value: string;
  }[];
  stylist: GQLStylist;
  products: Product[];
}
