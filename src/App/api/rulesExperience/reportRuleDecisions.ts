/* Service */
import { graphqlService } from 'services/graphqlService';

export type GQLReportRuleDecisionVars = {
  experienceId: string;
  isAgree: boolean;
  isRandomProbability: boolean;
  modelName: string;
  order: number;
  position: number;
  probability: number;
  ruleId: string;
  sessionId: string;
  userId: string;
};

const ReportRuleDecisions = `
  mutation reportRuleDecisions(
    $userId: String!
    $ruleId: String!
    $position: Int!
    $order: Int!
    $modelName: String!
    $probability: Float!
    $isRandomProbability: Boolean!
    $isAgree: Boolean!
    $sessionId: String!
    $experienceId: String!
  ) {
    reportRuleDecisions(
      userId: $userId
      experienceId: $experienceId
      isAgree: $isAgree
      isRandomProbability: $isRandomProbability
      position: $position
      ruleId: $ruleId
      order: $order
      sessionId: $sessionId
      modelName: $modelName
      probability: $probability
    )
  }
`;

export const reportRuleDecisionMutation = async (
  variables: GQLReportRuleDecisionVars
): Promise<void> => {
  await graphqlService.graphqlOperation<GQLReportRuleDecisionVars, void>(
    ReportRuleDecisions,
    variables
  );
};
