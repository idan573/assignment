/* Services */
import { graphqlService } from 'services/graphqlService';

export enum METRIC_NAMES {
  TRIAL_STARTED = 'ScalezTrialStarted_ForntEnd'
}

export interface GQLReportMetricVars {
  metricName: METRIC_NAMES;
  valueType?: string;
  value?: number;
  unit?: string;
}

const ReportMetric = `
  mutation reportMetric(
    $metricName: String!
    $valueType: String
    $value: Float
    $unit: String
  ) {
    reportMetric(
      metricName: $metricName
      valueType: $valueType
      value: $value
      unit: $unit
    )
  }
`;

export const reportMetricMutation = async (
  variables: GQLReportMetricVars
): Promise<void> => {
  await graphqlService.graphqlOperation<GQLReportMetricVars, void>(
    ReportMetric,
    variables
  );
};
