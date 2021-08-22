import * as React from 'react';
import { captureException } from '@sentry/browser';
import { RouteComponentProps } from 'react-router-dom';
import mergeDeepWith from 'ramda/src/mergeDeepWith';
import mergeDeepWithKey from 'ramda/src/mergeDeepWithKey';
import concat from 'ramda/src/concat';
import range from 'ramda/src/range';

import { Textarea } from '@bit/scalez.savvy-ui.textarea';
import { Button } from '@bit/scalez.savvy-ui.button';
import { Modal } from '@bit/scalez.savvy-ui.modal';
import { MessageBar } from '@bit/scalez.savvy-ui.message-bar';
import { MessageLoading } from '@bit/scalez.savvy-ui.message-loading';
import { HEADER_ITEM_TYPES } from '@bit/scalez.savvy-ui.header';
import {
  useLazyPresignedUrlFileUpload,
  useRequest,
  useLazyRequest,
  REQUEST_STATUSES
} from '@bit/scalez.savvy-ui.hooks';
import { allSettled } from '@bit/scalez.savvy-ui.utils';

/* Analytics */
import { EVENTS } from 'services/analyticsService';

/* Core */
import { setHeaderWithTitleConfig } from 'App/components/headerConfig';

/* Api */
import {
  GQLUpdateUserThreadVars,
  updateUserThreadMutation
} from 'App/api/thread/updateUserThread';
import {
  GQLImagePresignedUrlParamsVars,
  getImagePresignedUrlParamsMutation
} from 'App/api/media/getImagePresignedUrlParams';
import { publishMessageEventMutation } from 'App/api/thread/publishMessageEvent';
import { publishStylistFeedbackMutation } from 'App/api/stylist/publishStylistFeedback';
import {
  GetThreadContentVars,
  ThreadContentData,
  getThreadContentQuery
} from 'features/StyleUpsFlow/api/getThreadContent';
import {
  GQLRetrievePrivateThreadIdVars,
  retrievePrivateThreadIdQuery
} from 'App/api/thread/getPrivateThreadId';

/* Types */
import {
  CdeTask,
  TASK_TYPE,
  Stylist,
  PresigenUrlParameters,
  Thread,
  ThreadEvent,
  THREAD_EVENT_TYPES,
  THREAD_EVENT_SENDER_TYPES
} from 'App/types';

/* Components */
import { RootContext, RootContextType } from 'App/components';
import { ThreadEventItem } from './ThreadEventItem';

/* Styles */
import {
  GlobalStepStyles,
  StyledSavvyLogo,
  StyledFeedbackModalContent,
  StyledThreadEventsListPage
} from './styles';

type Props = RouteComponentProps<{ threadId: string }>;

const ThreadEventsList: React.FC<Props> = React.memo(
  ({ history, location, match: { params } }: Props) => {
    const inputFileImageRef = React.useRef<HTMLInputElement>(null);
    const lastMessageRef = React.useRef<HTMLDivElement>(null);

    const {
      state: { userData },
      actions: { trackPage, trackEvent, setActiveStepData }
    } = React.useContext<RootContextType>(RootContext);

    const [threadStylist, setThreadStylist] = React.useState<Stylist>({});
    const [threadTask, setThreadTask] = React.useState<CdeTask>({});

    const [message, setMessage] = React.useState<string>('');

    const [feedbackRate, setFeedbackRate] = React.useState<number>(-1);
    const [feedbackMessage, setFeedbackMessage] = React.useState<string>();
    const [isFeedbackModalActive, toggleFeedbackModal] = React.useState<
      boolean
    >(false);
    const [isMessageBarActive, toggleMessageBar] = React.useState<boolean>(
      false
    );

    useRequest<GQLUpdateUserThreadVars, void>(updateUserThreadMutation, {
      payload: {
        threadId: params.threadId,
        userId: userData.userId,
        isThreadSeen: true
      }
    });

    const { data: threadId } = useRequest<
      GQLRetrievePrivateThreadIdVars,
      string
    >(retrievePrivateThreadIdQuery, {
      payload: {
        userId: userData.userId
      }
    });

    const [
      _,
      { data: threadContent = {}, loading: loadingThreadContent },
      dispatchThread
    ] = useLazyRequest<GetThreadContentVars, ThreadContentData>(
      getThreadContentQuery,
      {
        initialState: {
          loading: !!params.threadId
        },
        immediate: !!params.threadId,
        payload: {
          threadId: params.threadId
        },
        onCompleted(threadContent) {
          updateThreadTask(threadContent);
          updateThreadStylist(threadContent);

          setActiveStepData(prevState => ({
            ...prevState,
            headerConfig: setHeaderWithTitleConfig(threadContent.thread.title)
          }));

          lastMessageRef?.current?.scrollIntoView({
            block: 'start'
          });
        },
        onError(error) {
          console.error('Failed to upload thread content: ', error);
          captureException(error, {
            tags: {
              userId: userData.userId
            }
          });
        }
      }
    );

    const [
      imageFileUpload,
      imageFileOnChange,
      { data: imageFileData },
      handleImageDispatch
    ] = useLazyPresignedUrlFileUpload({
      onError(error) {
        console.error('Image FileReader error: ', error);
        captureException(error, {
          tags: {
            userId: userData.userId
          }
        });
      }
    });

    const [sendMessage, { loading: sendingMessage }] = useLazyRequest<
      Partial<{
        threadContent: ThreadContentData;
        stylist: Stylist;
        task: CdeTask;
        imageFile: File;
        message: string;
        threadId: string;
      }>,
      void
    >(
      async ({
        threadContent,
        message,
        imageFile,
        stylist,
        task,
        threadId
      }) => {
        const imageParams = await handleImageUpload(imageFile);

        dispatchThread({
          status: REQUEST_STATUSES.GOT,
          data: mergeDeepWith(concat, threadContent, {
            thread: {
              events: [
                {
                  taskId: task.taskId,
                  senderId: userData.userId,
                  senderType: THREAD_EVENT_SENDER_TYPES.USER,
                  threadEventType: THREAD_EVENT_TYPES.MESSAGE,
                  text: message,
                  images: !!imageParams.presignedUrl
                    ? [imageParams.presignedUrl]
                    : undefined
                }
              ]
            }
          })
        });

        lastMessageRef?.current?.scrollIntoView({
          block: 'start'
        });

        const publishTaskVariables = {
          stylistId: stylist.stylistId,
          sourceTaskId: task.taskId,
          tier: task.tier,
          userId: userData.userId,
          taskName: 'oneOnOneResponseTask',
          taskType: TASK_TYPE.ONE_ON_ONE_RESPONSE,
          mustUseChosenStylist: true,
          userResponse: message,
          userResponseImages: !!imageParams.presignedUrl
            ? [imageParams.presignedUrl]
            : undefined
        };

        const publicMessageEventVars = {
          threadId: params.threadId,
          userIdFrom: userData?.userId,
          userIdTo: userData?.homePageStylist,
          text: message,
          images: !!imageParams.presignedUrl
            ? [imageParams.presignedUrl]
            : undefined,
          senderType: THREAD_EVENT_SENDER_TYPES.USER
        };

        publishMessageEventMutation(publicMessageEventVars);

        const privateMessageEventVars = {
          ...publicMessageEventVars,
          threadId
        };

        publishMessageEventMutation(privateMessageEventVars);

        trackEvent({
          event: EVENTS.TALK_TO_STYLIST_CLICKED,
          properties: publishTaskVariables
        });
      }
    );

    React.useEffect(() => {
      trackPage({
        name: 'StyleUpThreadEventsListPage'
      });

      trackEvent({
        event: EVENTS.THREAD_OPENED,
        properties: {
          threadId: params.threadId
        }
      });
    }, []);

    const updateThreadTask = React.useCallback(
      (threadContent: ThreadContentData) => {
        const threadEventsReversed = [...threadContent.thread.events].reverse();
        const lastTaskResponseEvent = threadEventsReversed.find(
          event => event.threadEventType === THREAD_EVENT_TYPES.TASK_RESPONSE
        );

        setThreadTask(
          threadContent.tasks?.[lastTaskResponseEvent?.taskId] || {}
        );

        const lastThreadEvent = threadEventsReversed[0];
        if (
          lastThreadEvent?.threadEventType ===
            THREAD_EVENT_TYPES.TASK_RESPONSE &&
          lastThreadEvent.taskType !== TASK_TYPE.ONE_ON_ONE_RESPONSE
        ) {
          toggleMessageBar(
            true &&
              userData?.homePageStylist === lastTaskResponseEvent?.senderId
          );
        }
      },
      [isMessageBarActive]
    );

    React.useEffect(() => {
      if (!isMessageBarActive) {
        return;
      }

      trackEvent({
        event: EVENTS.TASK_RESULTS_OPENED,
        properties: {
          userId: userData.userId,
          stylistId: threadStylist.stylistId,
          timestamp: Date.now(),
          component: 'StyleUpThreadEventsListPage'
        }
      });
    }, [isMessageBarActive]);

    const updateThreadStylist = React.useCallback(
      (threadContent: ThreadContentData) => {
        const lastStylistEvent = [...threadContent.thread.events]
          .reverse()
          .find(
            event => event.senderType === THREAD_EVENT_SENDER_TYPES.STYLIST
          );

        setThreadStylist(
          threadContent.stylists?.[lastStylistEvent?.senderId] || {}
        );
      },
      []
    );

    const handleImageUpload = React.useCallback(
      async (imageFile: File): Promise<PresigenUrlParameters> => {
        try {
          if (!!imageFile) {
            const imageParams = await getImagePresignedUrlParamsMutation({
              userId: userData.userId
            });

            await imageFileUpload({
              file: imageFile,
              presignedUrl: imageParams.presignedUrl,
              endpoint: imageParams.endpoint,
              headers: imageParams.headers
            });

            trackEvent({
              event: EVENTS.IMAGE_UPLOAD_CLICKED,
              properties: {
                userId: userData.userId,
                stylistId: threadStylist.stylistId,
                timestamp: Date.now(),
                component: 'StyleUpThreadEventsListPage'
              }
            });

            return imageParams;
          }

          return {};
        } catch (error) {
          return {};
        }
      },
      [threadContent, threadStylist]
    );

    const handleSubmitFeedback = React.useCallback(() => {
      // let threadContentCopy = threadContent;

      if (!!feedbackMessage || feedbackRate !== -1) {
        // const newThreadContent = mergeDeepWithKey(
        //   (k, l, r) => (typeof l === 'object' ? concat(l, r) : r),
        //   threadContent,
        //   {
        //     thread: {
        //       events: [
        //         {
        //           taskId: threadTask.taskId,
        //           senderId: userData.userId,
        //           senderType: THREAD_EVENT_SENDER_TYPES.USER,
        //           threadEventType: THREAD_EVENT_TYPES.TASK_FEEDBACK
        //         }
        //       ]
        //     },
        //     feedbacks: {
        //       [threadTask.taskId]: {
        //         feedback: feedbackMessage || '',
        //         rate: feedbackRate
        //       }
        //     }
        //   }
        // );

        // threadContentCopy = newThreadContent;

        // dispatchThread({
        //   status: REQUEST_STATUSES.GOT,
        //   data: newThreadContent
        // });

        const publishStylistFeedbackVariables = {
          feedback: feedbackMessage,
          rate: feedbackRate,
          userId: userData.userId,
          userName: userData.firstName,
          userProfileImage: userData.profilePicture,

          stylistId: threadStylist.stylistId,
          threadId: params.threadId,

          taskId: threadTask.taskId,
          taskName: threadTask.taskName,
          taskType: TASK_TYPE.ONE_ON_ONE_RESPONSE,
          tier: threadTask.tier
        };

        publishStylistFeedbackMutation(publishStylistFeedbackVariables);

        trackEvent({
          event: EVENTS.TASK_RATED,
          properties: publishStylistFeedbackVariables
        });
      }

      sendMessage({
        threadContent,
        stylist: threadStylist,
        task: threadTask,
        message,
        imageFile: imageFileData.file,
        threadId
      });

      toggleFeedbackModal(false);

      /* Reset feedback content */

      !!feedbackMessage && setFeedbackMessage('');

      feedbackRate > -1 && setFeedbackRate(-1);

      /* Reset message content */

      !!message && setMessage('');

      !!imageFileData.file &&
        handleImageDispatch({
          status: REQUEST_STATUSES.NONE
        });

      history.push({
        pathname: '/homepage',
        state: location.search
      });
    }, [
      message,
      imageFileData,
      feedbackMessage,
      feedbackRate,
      threadContent,
      threadStylist,
      threadTask
    ]);

    const handleSubmitMessage = React.useCallback(() => {
      const events = threadContent.thread.events;

      const isLastEventTaskOneOnOne =
        threadContent.tasks[events[events.length - 1].taskId]?.taskType ===
        TASK_TYPE.ONE_ON_ONE_RESPONSE;

      const isLastEventTaskResponse =
        events[events.length - 1].threadEventType ===
        THREAD_EVENT_TYPES.TASK_RESPONSE;

      if (isLastEventTaskResponse && !isLastEventTaskOneOnOne) {
        toggleFeedbackModal(true);
        return;
      }

      sendMessage({
        threadContent,
        stylist: threadStylist,
        task: threadTask,
        message,
        imageFile: imageFileData.file,
        threadId
      });

      /* Reset message content */

      !!message && setMessage('');

      !!imageFileData.file &&
        handleImageDispatch({
          status: REQUEST_STATUSES.NONE
        });

      history.push({ pathname: '/homepage', state: location.search });
    }, [
      message,
      imageFileData,
      threadContent,
      threadStylist,
      threadTask,
      threadId
    ]);

    const inputFileProps = React.useMemo(() => {
      return [
        {
          ref: inputFileImageRef,
          type: 'file',
          accept: 'image/*',
          onChange: imageFileOnChange
        }
      ];
    }, []);

    const textareaProps = React.useMemo(() => {
      return {
        value: message,
        placeholder: 'Enter Text',
        onChange: e => {
          e.preventDefault();
          setMessage(e.currentTarget.value);
        },
        onHeightChange: height => {
          lastMessageRef?.current?.scrollIntoView();
        }
      };
    }, [message]);

    const buttonProps = React.useMemo(() => {
      return [
        {
          ['data-type']: !!imageFileData.file
            ? ('tertiary' as const)
            : ('secondary' as const),
          ['data-form']: 'circle' as const,
          ['data-size']: 'small' as const,
          ['data-action']: 'camera',
          ['data-action-position']: 'center' as const,
          onClick: () => inputFileImageRef.current.click()
        },
        {
          type: 'submit' as const,
          ['data-type']: 'primary' as const,
          ['data-form']: 'rounded' as const,
          ['data-size']: 'small' as const,
          ['data-action']: !message && !imageFileData.file ? 'next' : 'send',
          ['data-action-position']: 'center-right' as const,
          children: !message && !imageFileData.file ? 'Next' : 'Send',
          onClick: (e: React.FormEvent<HTMLButtonElement>) => {
            e.preventDefault();

            if (!imageFileData.file && !message) {
              history.push({
                pathname: '/homepage'
              });

              return;
            }

            handleSubmitMessage();
          }
        }
      ];
    }, [message, imageFileData.file]);

    return (
      <>
        <GlobalStepStyles />

        <Modal name="feedback-modal" render={isFeedbackModalActive}>
          <StyledFeedbackModalContent>
            <StyledSavvyLogo />

            <form>
              <h2>How was this StyleUp?</h2>

              <div className="rating-wrapper">
                {range(1, 6).map(i => (
                  <div
                    key={i}
                    className="rating-point"
                    data-is-active={i <= feedbackRate}
                    onClick={() => setFeedbackRate(i)}
                  />
                ))}
              </div>

              <Textarea
                inputMode="text"
                placeholder="Leave feedback..."
                value={feedbackMessage}
                maxLength={200}
                onChange={e => setFeedbackMessage(e.target.value)}
              />
              <Button
                type="submit"
                data-action="next"
                data-action-position="right"
                onClick={(e: React.FormEvent<HTMLButtonElement>) => {
                  e.preventDefault();

                  handleSubmitFeedback();
                }}
              >
                {!!feedbackMessage || feedbackRate !== -1
                  ? `Send & Continue`
                  : 'Continue'}
              </Button>
            </form>
          </StyledFeedbackModalContent>
        </Modal>

        <StyledThreadEventsListPage>
          <ul className="messages-list">
            {loadingThreadContent ? (
              <MessageLoading />
            ) : (
              threadContent.thread?.events?.map((event, key) => (
                <ThreadEventItem
                  key={key}
                  stylist={threadContent.stylists?.[event.senderId]}
                  task={threadContent.tasks?.[event.taskId]}
                  isConversationStopped={isMessageBarActive}
                  isExpanded={event.taskId === threadTask.taskId}
                  ref={
                    key === threadContent.thread?.events.length - 1
                      ? lastMessageRef
                      : undefined
                  }
                  {...event}
                />
              ))
            )}

            {sendingMessage && <MessageLoading />}
          </ul>

          {!!isMessageBarActive && (
            <div className="message-bar-content">
              <MessageBar
                inputFileProps={inputFileProps}
                textareaProps={textareaProps}
                buttonProps={buttonProps}
              />
            </div>
          )}

          {!isMessageBarActive && !!threadTask?.taskId && (
            <>
              <hr />
              <div className="chat-link">
                <Button
                  data-type="secondary"
                  data-form="circle"
                  data-size="big"
                  data-action="quoteBubble"
                  data-action-position="center"
                  onClick={() => {
                    history.push({
                      pathname: '/stylist-chat',
                      search: location.search,
                      state: {
                        taskId: threadTask?.taskId
                      }
                    });
                  }}
                />
                <h4>View chat for this session</h4>
              </div>
            </>
          )}
        </StyledThreadEventsListPage>
      </>
    );
  }
);

export default ThreadEventsList;
