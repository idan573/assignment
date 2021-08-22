/* Services */
import { graphqlService } from 'services/graphqlService';

export interface GQLReportStyleRateVars {
  userId: string;
  styleId: string;
  rate?: string;
  isRemoveRate?: boolean;
}

interface GQLReportStyleRate {
  reportStyleRate: void;
}

const ReportStyleRate = `
  mutation reportStyleRate(
    $userId: String!
    $styleId: String!
    $rate: String
    $isRemoveRate: Boolean
  ) {
    reportStyleRate(
      userId: $userId
      styleId: $styleId
      rate: $rate
      isRemoveRate: $isRemoveRate
    )
  }
`;

export const reportStyleRateMutation = async (
  variables: GQLReportStyleRateVars
): Promise<void> => {
  await graphqlService.graphqlOperation<
    GQLReportStyleRateVars,
    GQLReportStyleRate
  >(ReportStyleRate, variables);
};
