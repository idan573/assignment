import {
  Product,
  PRODUCT_CATEGORIES,
  ClosetProductTypes
} from 'App/types/closet';
import { GQLProduct, GQLInputProduct } from './types';

import { stylistMapper } from 'App/api/stylist/mappers';

export const closetProductTypesMapper = (types: string[]): ClosetProductTypes =>
  types.reduce(
    (acc, item) => {
      const [name, count] = item.slice(1, -1).split('=');

      acc.productTypes.push(name);
      acc.totalProductsCount = acc.totalProductsCount + +count;

      return acc;
    },
    { productTypes: [], totalProductsCount: 0 }
  );

export const productMapper = ({
  productCategory,
  stylist,
  ...gqlProduct
}: GQLProduct = {}): Product => ({
  ...gqlProduct,
  stylist: stylist ? stylistMapper(stylist) : undefined,
  productCategory: productCategory as PRODUCT_CATEGORIES
});

export const inputProductMapper = ({
  productId,
  productType,
  portal,
  parentId,
  productLink,
  color,
  descriptionLong,
  descriptionShort,
  images,
  brand,
  retail,
  productName,
  currency,
  price,
  priceSale,
  priceShipping,
  size,
  cleanedSize,
  ...rest
}: Product = {}): GQLInputProduct => ({
  productId,
  productType,
  portal,
  parentId,
  productLink,
  color,
  descriptionLong,
  descriptionShort,
  images,
  brand,
  retail,
  productName,
  currency,
  price,
  priceSale,
  priceShipping,
  size,
  cleanedSize
});
