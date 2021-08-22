/* Services */
import { graphqlService } from 'services/graphqlService';

export interface GQLStartFormVars {
  userId: string;
  forms: string[][];
  taskName?: string;
  stepName?: string;
  isAnonymous?: boolean;
}

export interface GQLStartFormData {
  userId?: string;
  name?: string;
  formId: string;
  isHaveNextQuestion?: boolean;
}

interface GQLStartForm {
  startForm: GQLStartFormData;
}

const StartForm = `
  mutation startForm(
    $userId: String!
    $forms: [[String]]!
    $taskName: String
    $stepName: String
    $isAnonymous: Boolean
  ) {
    startForm(
      userId: $userId
      forms: $forms
      taskName: $taskName
      stepName: $stepName
      isAnonymous: $isAnonymous
    ) {
      userId
      name
      formId
      isHaveNextQuestion
    }
  }
`;

export const startFormMutation = async (
  variables: GQLStartFormVars
): Promise<GQLStartFormData> => {
  const { startForm: from } = await graphqlService.graphqlOperation<
    GQLStartFormVars,
    GQLStartForm
  >(StartForm, variables);

  return from;
};
