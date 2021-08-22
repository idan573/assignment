/* Service */
import { graphqlService } from 'services/graphqlService';

export type GQLReportProductDecisionVars = {
  experienceId: string;
  isLike: boolean;
  isRandom: boolean;
  position: number;
  productId: string;
  score: number;
  sessionId: string;
  styleId: string;
  userId: string;
};

const ReportProductDecision = `
  mutation reportProductDecisions(
    $experienceId: String!
    $isLike: Boolean!
    $isRandom: Boolean!
    $position: Int!
    $productId: String!
    $score: Float!
    $sessionId: String!
    $styleId: String!
    $userId: String!
  ) {
    reportProductDecisions(
      userId: $userId
      experienceId: $experienceId
      isLike: $isLike
      isRandom: $isRandom
      position: $position
      productId: $productId
      score: $score
      sessionId: $sessionId
      styleId: $styleId
    )
  }
`;

export const reportProductDecisionMutation = async (
  variables: GQLReportProductDecisionVars
): Promise<void> => {
  await graphqlService.graphqlOperation<GQLReportProductDecisionVars, void>(
    ReportProductDecision,
    variables
  );
};
