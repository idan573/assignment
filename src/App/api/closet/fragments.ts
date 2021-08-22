import { stylistFragment } from 'App/api/stylist/fragments';

export const productFragment = `{
  portal
  parentId
  productId
  productLink
  productType
  inWishlist
  color
  descriptionLong
  descriptionShort
  images
  brand
  retail
  productName
  currency
  price
  priceSale
  priceShipping
  size
  cleanedSize
  position
  productCategory
  title
  styleId
  stylist ${stylistFragment}
  score
  isRandom
  sessionId
  experienceId
  tags
  sources
  isUserItem
}`;
