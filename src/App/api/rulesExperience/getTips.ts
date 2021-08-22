/* Services */
import { graphqlService } from 'services/graphqlService';

/* Types */
import { RuleTip } from 'App/types';
import { GQLRuleTip } from './types';

/* Fragments */
import { ruleTipFragment } from './fragments';

/* Mappers */
import { ruleTipMapper } from './mappers';

const GetTips = `
  query getTips {
    getTips ${ruleTipFragment}
  }
`;

class GQLGetTips {
  getTips: GQLRuleTip[];
}

export const getTipsQuery = async (): Promise<RuleTip[]> => {
  const { getTips: tips = [] } = await graphqlService.graphqlOperation<
    {},
    GQLGetTips
  >(GetTips, {});

  return (
    tips?.map(ruleTipMapper)?.sort((s1, s2) => s1.priority - s2.priority) ?? []
  );
};
