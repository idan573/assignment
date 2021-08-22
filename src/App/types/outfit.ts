import { Stylist, Product } from 'App/types';

export type Outfit = Partial<{
  userId: string;
  styleId: string;
  receivedTimeStamp: string;
  stylist: Stylist;
  score: number;
  products: Product[];
  rates: {
    rate: string;
    value: string;
  }[];
  position: number;
}>;
