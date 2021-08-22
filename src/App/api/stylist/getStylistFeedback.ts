/* Services */
import { graphqlService } from 'services/graphqlService';

/* Types */
import { StylistFeedback } from 'App/types';
import { GQLStylistFeedback } from './types';

/* Fragments */
import { stylistFeedbackFragment } from './fragments';

/* Mappers */
import { stylistFeedbackMapper } from './mappers';

export type GQLGetStylistFeedbackVars = {
  taskId: string;
  stylistId: string;
};

interface GQLGetStylistFeedback {
  getStylistFeedback: GQLStylistFeedback[];
}

const GetStylistFeedback = `
  query getStylistFeedback(
    $stylistId: String!
    $taskId: String!
  ) {
    getStylistFeedback(
      taskId: $taskId
      stylistId: $stylistId
    ) ${stylistFeedbackFragment}
  }
`;

export const getStylistFeedbackQuery = async (
  variables: GQLGetStylistFeedbackVars
): Promise<StylistFeedback> => {
  const {
    getStylistFeedback: [feedback] = []
  } = await graphqlService.graphqlOperation<
    GQLGetStylistFeedbackVars,
    GQLGetStylistFeedback
  >(GetStylistFeedback, variables);

  return stylistFeedbackMapper(feedback);
};
