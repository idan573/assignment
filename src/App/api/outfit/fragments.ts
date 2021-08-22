import { stylistFragment } from 'App/api/stylist/fragments';
import { productFragment } from 'App/api/closet/fragments';

export const outfitFragment = `{
  userId
  styleId
  score
  position
  receivedTimeStamp
  rates {
    rate
    value
  }
 stylist ${stylistFragment}
 products ${productFragment}
}`;
