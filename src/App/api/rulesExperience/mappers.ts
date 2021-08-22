import { Rule, RuleTip } from 'App/types';
import { GQLRule, GQLRuleTip } from './types';

export const ruleMapper = ({
  isRandomProbability,
  ...gqlRule
}: GQLRule = {}): Rule => ({
  ...gqlRule,
  isRandom: isRandomProbability,
  isLiked: false
});

export const ruleTipMapper = ({ ...gqlRuleTip }: GQLRuleTip): RuleTip => ({
  ...gqlRuleTip
});
