/* Services */
import { graphqlService } from 'services/graphqlService';

export type GQLDiscardFormVars = {
  formId: string;
};

const DiscardForm = `
  mutation discardForm($formId: String!) {
    discardForm(formId: $formId) {
      formId
    }
  }
`;

export const discardFormMutation = async (
  variables: GQLDiscardFormVars
): Promise<void> => {
  await graphqlService.graphqlOperation<GQLDiscardFormVars, void>(
    DiscardForm,
    variables
  );
};
