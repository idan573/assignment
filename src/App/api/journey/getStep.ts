/* Services */
import { graphqlService } from 'services/graphqlService';

/* Types */
import { Step } from 'App/types';
import { GQLStep } from './types';

/* Fragments */
import { stepFragment } from './fragments';

/* Mappers */
import { stepMapper } from './mappers';

export type GQLGetStepVars = {
  stepName: string;
};

interface GQLGetStep {
  getStep: GQLStep[];
}

const GetStep = `
  query getStep($stepName: String!) {
    getStep(stepName: $stepName) ${stepFragment}
  }
`;

export const getStepQuery = async (
  variables: GQLGetStepVars
): Promise<Step> => {
  const { getStep: [step] = [] } = await graphqlService.graphqlOperation<
    GQLGetStepVars,
    GQLGetStep
  >(GetStep, variables);

  if (!step) {
    return undefined;
  }

  return stepMapper(step);
};
