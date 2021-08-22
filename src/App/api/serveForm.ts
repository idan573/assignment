/* Services */
import { graphqlService } from 'services/graphqlService';

/* Types */
import { PresigenUrlParameters } from 'App/types';

/* Fragments */
import { presigenUrlParametersFragment } from 'App/api/media/fragments';

export interface GQLServeFormVars {
  formId: string;
  userResponse?: {
    answerName: string;
    userAnswer?: string;
  };
}

export interface GQLServeFormAnswer {
  answerName: string;
  answerType?: 'multiChoiceAnswer' | 'openTextAnswer' | 'imageAnswer';
  answerText?: string;
  attributeValue?: string;
  nextQuestion?: string;
  metadata?: PresigenUrlParameters;
}

export interface GQLServeFormQuestion {
  questionName: string;
  questionText?: string[];
  questionDisplayText?: string[];
  questionType?:
    | 'emptyQuestion'
    | 'regularQuestion'
    | 'imageQuestion'
    | 'linkQuestion';
  answers?: GQLServeFormAnswer[];
  skipIfAttributeExist?: boolean;
  nextQuestion?: string;
  attributeName?: string;
}

export enum FORM_ACTIONS {
  DOWNLOAD = 'downloadPage',
  SUGGEST = 'suggestPage'
}

export interface GQLServeFormData {
  formId: string;
  isHaveNextQuestion: boolean;
  question?: GQLServeFormQuestion;
  actions?: FORM_ACTIONS[];
}

interface GQLServeForm {
  serveForm: {
    formId: string;
    isHaveNextQuestion: boolean;
    question?: GQLServeFormQuestion;
  };
}

const chatAnswerFragment = `{
  answerName
  answerType
  answerText
  attributeValue
  nextQuestion
  metadata ${presigenUrlParametersFragment}
}`;

const chatQuestionFragment = `{
  questionName
  questionText
  questionDisplayText
  questionType
  answers ${chatAnswerFragment}
  skipIfAttributeExist
  nextQuestion
  attributeName
}`;

const serveFormResponseFragment = `{
  formId
  isHaveNextQuestion
  question ${chatQuestionFragment}
  actions
}`;

const ServeForm = `
  mutation serveForm(
    $formId: String!
    $userResponse: FormUserResponse
  ) {
    serveForm(
      formId: $formId
      userResponse: $userResponse
    ) ${serveFormResponseFragment}
  }
`;

export const serveFormMutation = async (
  variables: GQLServeFormVars
): Promise<GQLServeFormData> => {
  const { serveForm } = await graphqlService.graphqlOperation<
    GQLServeFormVars,
    GQLServeForm
  >(ServeForm, variables);

  return serveForm;
};
