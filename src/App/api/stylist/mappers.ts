import {
  STYLIST_TIER,
  Stylist,
  StylistAttributes,
  StylistFeedback
} from 'App/types';
import { GQLStylist, GQLStylistAttributes, GQLStylistFeedback } from './types';

export const stylistAttributesMapper = ({
  ...gqlStylistAttributes
}: GQLStylistAttributes = {}): StylistAttributes => ({
  ...gqlStylistAttributes
});

export const stylistFeedbackMapper = ({
  ...gqlStylistFeedback
}: GQLStylistFeedback = {}): StylistFeedback => ({
  ...gqlStylistFeedback
});

export const stylistMapper = ({
  id,
  stylistTier,
  stylistAttributes,
  ...gqlStylist
}: GQLStylist = {}): Stylist => {
  return {
    ...gqlStylist,
    stylistTier: stylistTier as STYLIST_TIER,
    stylistAttributes: stylistAttributesMapper(stylistAttributes)
  };
};
