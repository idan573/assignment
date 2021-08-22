/* Services */
import { graphqlService } from 'services/graphqlService';

/* Types */
import { Rule } from 'App/types';
import { GQLRule } from './types';

/* Fragments */
import { ruleFragment } from './fragments';

/* Mappers */
import { ruleMapper } from './mappers';

export type GQLSuggestRulesVars = {
  userId: string;
  rulesIds?: string[];
  productsTypes?: string[];
  extraAttributes?: Partial<{
    key: string;
    value: string;
  }>[];
  numberOfRules?: number;
};

interface GQLSuggestRules {
  suggestRules: GQLRule[];
}

export const SuggestRules = `
    query suggestRules(
      $userId: String!
      $rulesIds: [String]
      $productsTypes: [String]
      $extraAttributes: [ExtraAttribute]
      $numberOfRules: Int
    ) {
      suggestRules(
        userId: $userId 
        rulesIds: $rulesIds
        productsTypes: $productsTypes
        extraAttributes: $extraAttributes
        numberOfRules: $numberOfRules
      ) 
      ${ruleFragment}
    }
`;

export const suggestRulesQuery = async (
  variables: GQLSuggestRulesVars
): Promise<Rule[]> => {
  const { suggestRules: rules = [] } = await graphqlService.graphqlOperation<
    GQLSuggestRulesVars,
    GQLSuggestRules
  >(SuggestRules, variables);

  return rules?.map(ruleMapper) ?? [];
};
