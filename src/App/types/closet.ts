import { Stylist } from 'App/types';

export enum PRODUCT_CATEGORIES {
  BASIC = 'Basic',
  INTEREST = 'Interest',
  COMPLETER = 'Completer',
  ACCESSORIES = 'Accessories'
}

export type Product = Partial<{
  portal: string;
  parentId: string;
  productId: string;
  productLink: string;
  productType: string;
  inWishlist: boolean;
  color: string;
  descriptionLong: string;
  descriptionShort: string;
  images: string[];
  brand: string;
  retail: string;
  productName: string;
  currency: string;
  price: number;
  priceSale: number;
  priceShipping: number;
  size: string;
  cleanedSize: string;
  position: string;
  productCategory: PRODUCT_CATEGORIES;
  title: string;
  styleId: string;
  stylist: Stylist;
  score: number;
  isRandom: boolean;
  sessionId: string;
  experienceId: string;
  tags: string[];
  sources: string[];
  isUserItem: boolean;
}>;

export type ClosetProductTypes = Partial<{
  productTypes: string[];
  totalProductsCount: number;
}>;
