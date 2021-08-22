import * as React from 'react';
import * as Sentry from '@sentry/browser';
import { Button } from '@bit/scalez.savvy-ui.button';
import { FloatWrapper } from '@bit/scalez.savvy-ui.float-wrapper';
import { MessageBar } from '@bit/scalez.savvy-ui.message-bar';
import { Loader } from '@bit/scalez.savvy-ui.loader';

/* Core  */
import { openAppStore } from 'core/utils';

/* Analytics */
import { analyticsService, EVENTS } from 'services/analyticsService';

/* Types */
import { ConversationState, UserAnswer } from '../ChatComponent/ChatComponent';

/* Components */
import { RootContext, RootContextType } from 'App/components';

/* Styles */
import { StyledConversation, StyledImage, StyledSavvyLogo } from './styles';

interface Props extends ConversationState {
  isDone: boolean;
  style?: React.CSSProperties;
  onAnswer: (answer: UserAnswer) => void;
  onSubmit: (instantAnswer?: UserAnswer) => void;
}

/* Image upload reducer types and data */
interface UploadRequestDataType {
  status: REQUEST_STATUSES;
  error: string;
}

const uploadInitialState: UploadRequestDataType = {
  status: REQUEST_STATUSES.NONE,
  error: ''
};

function uploadReducer(
  state: UploadRequestDataType,
  action: Partial<UploadRequestDataType>
) {
  switch (action.status) {
    case REQUEST_STATUSES.REQUEST:
      return {
        ...state,
        status: REQUEST_STATUSES.REQUEST
      };
    case REQUEST_STATUSES.GOT:
      return {
        ...state,
        status: REQUEST_STATUSES.GOT
      };
    case REQUEST_STATUSES.ERROR:
      return {
        ...state,
        status: REQUEST_STATUSES.ERROR,
        error: action.error
      };
    case REQUEST_STATUSES.NONE:
      return uploadInitialState;
    default:
      return state;
  }
}

const Conversation = React.memo(
  React.forwardRef<HTMLDivElement, Props>(
    (
      {
        questionName,
        questionText,
        questionDisplayText,
        questionType,
        answers = [],

        answerText,
        answerType,
        localImageAnswer,

        style,
        isDone,
        onAnswer,
        onSubmit
      }: Props,
      ref: React.Ref<HTMLDivElement>
    ) => {
      const {
        state: { userData },
        actions: { trackEvent }
      } = React.useContext<RootContextType>(RootContext);

      const inputFileRef = React.useRef<HTMLInputElement>(null);

      const [textareaValue, setTextareaValue] = React.useState<string>('');
      const [imageBlob, setImageBlob] = React.useState<Blob>(null);

      const [imageUploadState, imageUploadDispatch] = React.useReducer(
        uploadReducer,
        uploadInitialState
      );

      const [isLoadingImage, toggleLoadingImage] = React.useState<boolean>();

      const mappedAnswers = React.useMemo(() => {
        return answers.reduce((acc, item) => {
          acc[item.answerType] = item;
          return acc;
        }, {});
      }, [answers]);

      const handleTextareaChange = React.useCallback(
        (e: React.FormEvent<HTMLTextAreaElement>) => {
          const openTextAnswer = mappedAnswers['openTextAnswer'];
          const { value } = e.currentTarget;

          setTextareaValue(value);
        },
        [mappedAnswers]
      );

      const handleImageUpload = React.useCallback(
        async (imageBlob: Blob, instantAnswer: UserAnswer) => {
          console.log('handleImageUpload=', imageBlob);
          trackEvent({
            event: EVENTS.IMAGE_SELECTED,
            properties: {
              component: 'QuestionnaireChatPage',
              size: imageBlob?.size
            }
          });

          imageUploadDispatch({
            status: REQUEST_STATUSES.REQUEST
          });

          onSubmit(instantAnswer);

          const imageAnswer = mappedAnswers['imageAnswer'];
          console.log('imageAnswer=', imageAnswer);
          const formDataFields = imageAnswer.metadata.uploadParameters.fields.reduce(
            (acc, field) => {
              acc[field.name] = field.value;
              return acc;
            },
            {}
          );

          try {
            const formData = new FormData();

            const formDataValues = {
              ...formDataFields,
              File: imageBlob
            };

            for (const name in formDataValues) {
              formData.append(name, formDataValues[name]);
            }

            console.log('formData=', formData);
            analyticsService.track({
              event: EVENTS.IMAGE_UPLOADING,
              properties: {
                component: 'QuestionnaireChatPage',
                size: imageBlob.size
              }
            });

            const { ok, status, statusText } = await fetch(
              imageAnswer.metadata.uploadParameters.url,
              {
                method: 'POST',
                body: formData
              }
            );
            console.log('uploadParameters=', status);
            if (ok) {
              imageUploadDispatch({
                status: REQUEST_STATUSES.GOT
              });

              trackEvent({
                event: EVENTS.IMAGE_UPLOADED,
                properties: {
                  component: 'QuestionnaireChatPage',
                  size: imageBlob.size
                }
              });
            } else {
              throw {
                message: `Error: ${statusText}: ${status}`
              };
            }
          } catch (error) {
            console.log('handleImageUploadError=', error);
            imageUploadDispatch({
              status: REQUEST_STATUSES.ERROR,
              error: error.message
            });

            Sentry.captureException(error);
          }
        },
        [imageBlob, mappedAnswers, onSubmit]
      );

      const textareaProps = React.useMemo(() => {
        if (!!mappedAnswers['openTextAnswer']) {
          return {
            value: textareaValue,
            placeholder: 'Enter Text',
            onChange: handleTextareaChange,
            onHeightChange: height => {
              //@ts-ignore
              ref?.current?.scrollIntoView();
            }
          };
        }
      }, [textareaValue]);

      const inputFileProps = React.useMemo(() => {
        if (!!mappedAnswers['imageAnswer']) {
          return [
            {
              ref: inputFileRef,
              type: 'file',
              accept: 'image/*',
              onChange: async (e: React.FormEvent<HTMLInputElement>) => {
                e.persist();

                toggleLoadingImage(true);

                console.log('onChange = ', e);
                analyticsService.track({
                  event: EVENTS.IMAGE_SELECTED,
                  properties: {
                    component: 'QuestionnaireChatPage'
                  }
                });

                const imageFile = e.currentTarget.files[0];

                if (imageFile) {
                  console.log('imageFile = ', imageFile);

                  const reader = new FileReader();
                  const imageAnswer = mappedAnswers['imageAnswer'];

                  reader.onload = function(e) {
                    console.log('onLoad = ', e);

                    handleImageUpload(imageFile, {
                      answerType: 'imageAnswer' as const,
                      answerName: imageAnswer.answerName,
                      answerText: imageAnswer.metadata.fileUrl,
                      /* Read local file and set it instead of actual image url */
                      localImageAnswer: e.target.result as string
                    });
                  };

                  reader.onloadend = function() {
                    toggleLoadingImage(false);
                  };

                  reader.onerror = function(e) {
                    console.log('onerror = ', e);
                    Sentry.captureException(e, {
                      tags: {
                        userId: userData?.userId
                      }
                    });
                  };

                  console.log('reader = ', imageFile);
                  reader.readAsDataURL(imageFile);
                }
              }
            }
          ];
        }
      }, [mappedAnswers, userData]);

      const addPhotoButtonProps = React.useMemo(() => {
        return {
          className: 'add-photo',
          ['data-form']: 'rounded' as const,
          ['data-size']: 'small' as const,
          ['data-action-position']: 'center-left' as const,
          children: 'Add Photo',
          ['data-type']: 'secondary' as const,
          ['data-action']: 'noImage' as const,
          onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
            trackEvent({
              event: EVENTS.IMAGE_UPLOAD_CLICKED,
              properties: {
                component: 'QuestionnaireChatPage'
              }
            });

            e.preventDefault();
            inputFileRef.current.click();
          }
        };
      }, []);

      const sendButtonProps = React.useMemo(() => {
        return {
          type: 'submit' as const,
          disabled: !!mappedAnswers['openTextAnswer'] && !textareaValue,
          ['data-type']: 'primary' as const,
          ['data-form']: 'circle' as const,
          ['data-size']: 'small' as const,
          ['data-action']: 'send' as const,
          ['data-action-position']: 'center' as const,
          onClick: (e: React.FormEvent<HTMLButtonElement>) => {
            e.preventDefault();
            const openTextAnswer = mappedAnswers['openTextAnswer'];
            onSubmit({
              answerType: 'openTextAnswer' as const,
              answerName: openTextAnswer.answerName,
              answerText: textareaValue
            });
          }
        };
      }, [onSubmit, textareaValue]);

      return (
        <>
          <StyledConversation ref={ref} style={style}>
            {questionText.map((question, key) => {
              if (questionType === 'linkQuestion') {
                if (questionName === 'GoogleDownloadLink') {
                  return (
                    <Button data-size="small" onClick={openAppStore}>
                      {questionDisplayText[key]}
                    </Button>
                  );
                } else {
                  /* Temporary ignore external link option */
                  return;
                }
              }

              return (
                <div className="message" key={key}>
                  {!key && <StyledSavvyLogo />}

                  {questionType === 'imageQuestion' ? (
                    <StyledImage src={question} />
                  ) : (
                    <p className="savvy-message-text sbody">{question}</p>
                  )}
                </div>
              );
            })}

            {!!answerText && (
              <div className="message">
                {answerType === 'imageAnswer' ? (
                  isLoadingImage ? (
                    <Loader />
                  ) : (
                    <StyledImage src={localImageAnswer} />
                  )
                ) : (
                  <p className="user-message-text sbody">{answerText}</p>
                )}
              </div>
            )}

            {!!mappedAnswers['multiChoiceAnswer'] && (
              <div className="multi-choice-answers-block">
                {answers.map((item, key) => {
                  if (item.answerType === 'multiChoiceAnswer') {
                    return (
                      <Button
                        key={key}
                        className="multi-choice-button"
                        data-type="secondary"
                        data-size="small"
                        data-form="rounded"
                        data-action-position="center"
                        onClick={() => onAnswer(item)}
                      >
                        {item.answerText}
                      </Button>
                    );
                  }
                })}
              </div>
            )}
          </StyledConversation>

          <FloatWrapper
            className="message-bar-portal"
            portalSelector='[class*="StyledQuestionnaireChatPage"]'
            render={
              /* 
                render MessageBar: 
                - if chat is not finished 
                - only for current question (last in the dialog) 
                - if current question is expecting a text or image answer
              */
              !isDone &&
              !!ref &&
              (!!mappedAnswers['openTextAnswer'] ||
                !!mappedAnswers['imageAnswer'])
            }
            transition="fade"
            position="bottom"
            type="inner"
            onRest={() => {
              //@ts-ignore
              ref?.current?.scrollIntoView({
                behavior: 'smooth'
              });
            }}
          >
            <MessageBar
              textareaProps={textareaProps}
              inputFileProps={inputFileProps}
              buttonProps={
                !!mappedAnswers['imageAnswer']
                  ? [addPhotoButtonProps]
                  : [sendButtonProps]
              }
            />
          </FloatWrapper>
        </>
      );
    }
  )
);

export { Conversation };
