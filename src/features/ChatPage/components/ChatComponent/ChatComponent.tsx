import * as React from 'react';
import { useTransition } from 'react-spring';
import { MessageLoading } from '@bit/scalez.savvy-ui.message-loading';
import {
  useRequest,
  useLazyRequest,
  REQUEST_STATUSES
} from '@bit/scalez.savvy-ui.hooks';

/* Api */
import {
  GQLStartFormVars,
  GQLStartFormData,
  startFormMutation
} from 'App/api/startForm';
import {
  GQLServeFormVars,
  GQLServeFormAnswer,
  GQLServeFormQuestion,
  GQLServeFormData,
  serveFormMutation
} from 'App/api/serveForm';

/* Components */
import { RootContext, RootContextType } from 'App/components';
import { Conversation } from '../Conversation/Conversation';

/* Styles */
import { StyledQuestionnaireChatPage, StyledConversationsList } from './styles';

export interface ConversationState
  extends GQLServeFormQuestion,
    Pick<GQLServeFormAnswer, 'answerType' | 'answerText'> {
  localImageAnswer?: string;
}

export interface UserAnswer
  extends Pick<GQLServeFormAnswer, 'answerName' | 'answerType' | 'answerText'> {
  localImageAnswer?: string;
}

interface Props {
  startFormVariables: GQLStartFormVars;
  loading?: boolean;
  onFormStart?: (data: GQLStartFormData) => void;
  onFormEnd?: (data: GQLServeFormData) => void;
}

const ChatComponent: React.FC<Props> = React.memo(
  ({ startFormVariables, loading, onFormStart, onFormEnd }: Props) => {
    const lastMessageRef = React.useRef<HTMLDivElement>(null);
    const messageLoadingRef = React.useRef<HTMLDivElement>(null);

    const {
      state: { userData }
    } = React.useContext<RootContextType>(RootContext);

    const [isFormFinished, setIsFormFinished] = React.useState<boolean>(false);
    const [messages, setMessages] = React.useState<ConversationState[]>([]);

    /* Start form */

    const { loading: startFormLoading } = useRequest<
      GQLStartFormVars,
      GQLStartFormData
    >(startFormMutation, {
      skip: !startFormVariables.forms,
      payload: startFormVariables,
      onCompleted: formData => {
        onFormStart?.(formData);

        serveForm({
          formId: formData?.formId
        });
      }
    });

    /* Serve form */

    const needToLoadNextQuestionCheck = React.useCallback(
      (questionType: string) =>
        !!['emptyQuestion', 'linkQuestion', 'imageQuestion'].includes(
          questionType
        ),
      []
    );

    const serveFormOnCompleted = React.useCallback(
      (data: GQLServeFormData) => {
        if (isFormFinished) {
          return;
        }

        const isNeedToLoadNextQuestion = needToLoadNextQuestionCheck(
          data?.question?.questionType
        );

        /* Handle done chat */
        if (!data?.isHaveNextQuestion) {
          handleFinishForm(data);
          return;
        }

        /* Save new message */
        setMessages((prevState: ConversationState[]) => [
          ...prevState,
          {
            questionName: data?.question?.questionName,
            questionType: data?.question?.questionType,
            questionText: data?.question?.questionText ?? [],
            questionDisplayText: data?.question?.questionDisplayText ?? [],
            answers: data?.question?.answers ?? [],
            answerText: '',
            answerType: '' as GQLServeFormAnswer['answerType']
          }
        ]);

        /* Load next question */
        if (isNeedToLoadNextQuestion) {
          serveFormWithDelay(data?.formId, 2000);
        }
      },
      [onFormEnd, isFormFinished]
    );

    const handleFinishForm = React.useCallback(
      (lastServeFormData: GQLServeFormData) => {
        setIsFormFinished(true);

        onFormEnd?.(lastServeFormData);

        lastMessageRef?.current?.scrollIntoView({
          behavior: 'smooth'
        });
      },
      [onFormEnd]
    );

    const serveFormWithDelay = React.useCallback(
      async (formId: string, delay: number) => {
        dispatchServeFormEvent({
          status: REQUEST_STATUSES.REQUEST
        });

        let timeout;
        const [serveFormData, _] =
          (await Promise.all([
            (async () => await serveFormMutation({ formId }))(),
            new Promise(resolve => (timeout = setTimeout(resolve, delay)))
          ])
            .catch(error => {
              console.error(error);

              dispatchServeFormEvent({
                status: REQUEST_STATUSES.ERROR,
                error: error.message
              });
            })
            .finally(() => clearTimeout(timeout))) || [];

        dispatchServeFormEvent({
          status: REQUEST_STATUSES.GOT,
          data: serveFormData
        });

        serveFormOnCompleted(serveFormData);
      },
      [onFormEnd, isFormFinished]
    );

    const [
      serveForm,
      { loading: serveFormLoading, data: serveFormData },
      dispatchServeFormEvent
    ] = useLazyRequest<GQLServeFormVars, GQLServeFormData>(serveFormMutation, {
      onCompleted: serveFormOnCompleted
    });

    /* Other */

    React.useEffect(() => {
      lastMessageRef?.current?.scrollIntoView({
        behavior: 'smooth'
      });
    }, [messages]);

    React.useEffect(() => {
      if (loading || serveFormLoading) {
        messageLoadingRef.current?.scrollIntoView({
          behavior: 'smooth'
        });
      }
    }, [loading, serveFormLoading]);

    const onQuestionAnswered = React.useCallback(
      (
        {
          answerName,
          answerType,
          answerText,
          localImageAnswer
        }: UserAnswer = {} as UserAnswer
      ) => {
        setMessages((prevMessages: ConversationState[]) => {
          const lastQuestion = prevMessages.pop();

          return !!lastQuestion
            ? [
                ...prevMessages,
                {
                  questionName: lastQuestion.questionName,
                  questionText: lastQuestion.questionText,
                  answerType,
                  answerText,
                  ...(!!localImageAnswer ? { localImageAnswer } : {})
                }
              ]
            : prevMessages;
        });

        serveForm({
          formId: serveFormData.formId,
          userResponse: {
            answerName,
            userAnswer: answerText
          }
        });
      },
      [serveFormData]
    );

    //@ts-ignore
    const transitions = useTransition(messages, (_, i) => i, {
      from: { opacity: 0, transform: 'translateY(-25%)' },
      enter: { opacity: 1, transform: 'translateY(0%)' },
      leave: { opacity: 0 }
    });

    return (
      <StyledQuestionnaireChatPage>
        <StyledConversationsList data-is-done={isFormFinished}>
          {transitions.map(({ key, item, props }, index) => (
            <Conversation
              key={key}
              style={props}
              ref={index === messages.length - 1 ? lastMessageRef : undefined}
              {...item}
              isDone={isFormFinished}
              onAnswer={onQuestionAnswered}
              onSubmit={onQuestionAnswered}
            />
          ))}

          {(loading || startFormLoading || serveFormLoading) && (
            <MessageLoading
              //@ts-ignore
              ref={messageLoadingRef}
              className="message-loader"
            />
          )}
        </StyledConversationsList>
      </StyledQuestionnaireChatPage>
    );
  }
);

export { ChatComponent };
