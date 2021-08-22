import * as React from 'react';
import { captureException } from '@sentry/browser';
import { RouteComponentProps } from 'react-router-dom';
import concat from 'ramda/src/concat';
import mergeDeepWithKey from 'ramda/src/mergeDeepWithKey';
import { Button } from '@bit/scalez.savvy-ui.button';
import { HEADER_ITEM_TYPES } from '@bit/scalez.savvy-ui.header';
import { Modal } from '@bit/scalez.savvy-ui.modal';
import { MessageBar } from '@bit/scalez.savvy-ui.message-bar';
import { MessageLoading } from '@bit/scalez.savvy-ui.message-loading';
import {
  getDate,
  getSearchParams,
  setQueryString
} from '@bit/scalez.savvy-ui.utils';

import {
  useLazyPresignedUrlFileUpload,
  useStateWithCallback,
  useRequest,
  useLazyRequest,
  REQUEST_STATUSES
} from '@bit/scalez.savvy-ui.hooks';

/* Api */
import {
  GQLUpdateUserThreadVars,
  updateUserThreadMutation
} from 'App/api/thread/updateUserThread';
import {
  GQLRetrievePrivateThreadVars,
  retrievePrivateThreadQuery
} from 'App/api/thread/retrievePrivateThread';
import {
  GQLImagePresignedUrlParamsVars,
  getImagePresignedUrlParamsMutation
} from 'App/api/media/getImagePresignedUrlParams';
import {
  GQLVideoPresignedUrlParamsVars,
  getVideoPresignedUrlParamsMutation
} from 'App/api/media/getVideoPresignedUrlParams';
import {
  GQLPublishMessageEventVars,
  publishMessageEventMutation
} from 'App/api/thread/publishMessageEvent';
import { GQLGetUserVars, getUserQuery } from 'App/api/user/getUser';
import {
  GetPrivateThreadContentVars,
  PrivateThreadContent,
  getPrivateThreadContentQuery
} from 'features/ChatWithStylistPage/api/getPrivateThreadContent';

/* Types */
import {
  PresigenUrlParameters,
  Thread,
  THREAD_EVENT_TYPES,
  THREAD_EVENT_SENDER_TYPES,
  User,
  STYLIST_TIER,
  CLIENT_TYPE
} from 'App/types';
import { APP_HEADER_ITEM_TYPES } from 'App/components/AppHeader/AppHeader';
import { EVENTS } from 'services/analyticsService';

/* Component */
import { RootContext, RootContextType } from 'App/components';
import { ChatWithStylistMessage } from './ChatWithStylistMessage';
import { VideoPreviewOverlay } from './VideoPreviewOverlay/VideoPreviewOverlay';

/* Styles */
import {
  GlobalStepStyles,
  StyledChatWithStylistPage,
  StyledStylistImage,
  StyledSubscriptionImage,
  StyledModalContent,
  StyledClockIcon,
  StyledModal
} from './styles';

type Props = RouteComponentProps;

const ChatWithStylistPage: React.FC<Props> = ({ history, location }: Props) => {
  const inputFileImageRef = React.useRef<HTMLInputElement>(null);
  const inputFileVideoRef = React.useRef<HTMLInputElement>(null);
  const lastMessageRef = React.useRef<HTMLDivElement>(null);
  const taskId = (location.state as any)?.taskId;

  const {
    state: { userData, homePageStylist },
    actions: { setActiveStepData, trackPage, trackEvent, setPartialUserData }
  } = React.useContext<RootContextType>(RootContext);

  const [message, setMessage] = React.useState<string>('');
  const [isSubscriptionModalActive, toggleSubscriptionModal] = React.useState<
    boolean
  >(false);
  const [isVideoOverlayActive, toggleVideoOverlay] = React.useState<boolean>(
    false
  );
  const [isHaveActiveTask, toggleIsHaveActiveTask] = React.useState<boolean>(
    false
  );

  const [
    _,
    { data: threadContent = {}, loading: loadingThread },
    dispatchThread
  ] = useLazyRequest<GetPrivateThreadContentVars, PrivateThreadContent>(
    getPrivateThreadContentQuery,
    {
      initialState: {
        loading: !!userData.subscribedToService && !!userData?.homePageStylist
      },
      payload: {
        userId: userData.userId,
        stylistId: userData.homePageStylist,
        isAddEvents: true
      },
      immediate: !!userData.subscribedToService && !!userData?.homePageStylist,
      onCompleted(threadContent) {
        updateUserThreadMutation({
          threadId: threadContent.thread.threadId,
          userId: userData.userId,
          isThreadSeen: true
        });

        lastMessageRef?.current?.scrollIntoView({
          block: 'start'
        });
      }
    }
  );

  useRequest<GQLGetUserVars, User>(getUserQuery, {
    skip: userData.subscribedToService,
    payload: {
      userId: userData.userId,
      isAddUploadImages: true
    },
    onCompleted: user => {
      setPartialUserData(user);
    }
  });

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

  const [
    videoFileUpload,
    videoFileOnChange,
    { data: videoFileData },
    handleVideoDispatch
  ] = useLazyPresignedUrlFileUpload({
    onError(error) {
      console.error('Video FileReader error: ', error);
      captureException(error, {
        tags: {
          userId: userData.userId
        }
      });
    }
  });

  const handleVideoUpload = React.useCallback(async (videoFile: File): Promise<
    PresigenUrlParameters
  > => {
    try {
      if (!!videoFile) {
        const videoParams = await getVideoPresignedUrlParamsMutation({
          userId: userData.userId,
          extension: videoFile.name.split('.').pop()
        });

        await videoFileUpload({
          file: videoFile,
          presignedUrl: videoParams.presignedUrl,
          endpoint: videoParams.endpoint,
          headers: videoParams.headers
        });

        trackEvent({
          event: EVENTS.VIDEO_UPLOAD_CLICKED,
          properties: {
            userId: userData.userId,
            stylistId: userData.homePageStylist,
            timestamp: Date.now(),
            component: 'ChatWithStylistPage'
          }
        });

        return videoParams;
      }

      return {};
    } catch (error) {
      return {};
    }
  }, []);

  const handleImageUpload = React.useCallback(async (imageFile: File): Promise<
    PresigenUrlParameters
  > => {
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
            stylistId: userData.homePageStylist,
            timestamp: Date.now(),
            component: 'ChatWithStylistPage'
          }
        });

        return imageParams;
      }

      return {};
    } catch (error) {
      return {};
    }
  }, []);

  const [sendMessage, { loading: sendingMessage }] = useLazyRequest<
    Partial<{
      threadContent: PrivateThreadContent;
      imageFile: File;
      videoFile: File;
      message: string;
    }>,
    void
  >(async ({ message, imageFile, videoFile, threadContent }) => {
    const parallelFileUpload = async (
      arr: (() => Promise<PresigenUrlParameters>)[]
    ): Promise<PresigenUrlParameters[]> => {
      const res = await Promise.allSettled(arr.map(func => func()));
      return res.map(({ value }: any) => value);
    };

    const [imageParams, videoParams] = await parallelFileUpload([
      async () => await handleImageUpload(imageFile),
      async () => await handleVideoUpload(videoFile)
    ]);

    const messageContent = {
      senderType: THREAD_EVENT_SENDER_TYPES.USER,
      text: message,
      images: !!imageParams.presignedUrl
        ? [imageParams.presignedUrl]
        : undefined,
      video: videoParams.presignedUrl
    };

    dispatchThread({
      status: REQUEST_STATUSES.GOT,
      data: mergeDeepWithKey(
        (k, l, r) => (k === 'events' ? concat(l, r) : r),
        threadContent,
        {
          thread: {
            events: [
              {
                threadEventType: THREAD_EVENT_TYPES.MESSAGE,
                ...messageContent
              }
            ]
          }
        }
      )
    });

    lastMessageRef?.current?.scrollIntoView({
      block: 'start'
    });

    publishMessageEventMutation({
      threadId: threadContent.thread.threadId,
      userIdFrom: userData.userId,
      userIdTo: userData.homePageStylist,
      ...messageContent
    });
  });

  React.useEffect(() => {
    trackPage({
      name: 'ChatWithStylistPage'
    });

    trackEvent({
      event: EVENTS.CHAT_WITH_STYLIST_OPENED,
      properties: {
        userId: userData.userId,
        stylistId: userData.homePageStylist,
        timestamp: Date.now()
      }
    });
  }, []);

  React.useEffect(() => {
    setActiveStepData(prevState => ({
      ...prevState,
      headerConfig: [
        {
          type: HEADER_ITEM_TYPES.BUTTON,
          props: {
            ['data-action']: 'back'
          }
        },
        {
          type: APP_HEADER_ITEM_TYPES.HOMEPAGE_STYLIST
        }
      ]
    }));
  }, []);

  const activeThreadEventIndex = React.useMemo(() => {
    let retIndex = threadContent?.thread?.events?.length - 1 ?? 0;
    threadContent?.thread?.events?.forEach((e, index) => {
      if (
        e?.taskId === taskId &&
        e.threadEventType === THREAD_EVENT_TYPES.THREAD_REFERENCE
      ) {
        retIndex = index - 1;
      }
    });
    return retIndex > 0 ? retIndex : 0;
  }, [threadContent, taskId]);

  const handleSubmitMessage = React.useCallback(() => {
    sendMessage({
      message,
      imageFile: imageFileData.file,
      videoFile: videoFileData.file,
      threadContent
    });

    /* Reset message content */

    !!message && setMessage('');

    !!imageFileData.file &&
      handleImageDispatch({
        status: REQUEST_STATUSES.NONE
      });

    !!videoFileData.file &&
      handleVideoDispatch({
        status: REQUEST_STATUSES.NONE
      });
  }, [message, imageFileData, videoFileData, threadContent]);

  const inputFileProps = React.useMemo(() => {
    return [
      {
        ref: inputFileImageRef,
        type: 'file',
        accept: 'image/*',
        onChange: imageFileOnChange
      },
      {
        ref: inputFileVideoRef,
        type: 'file',
        accept: 'video/*,video/mp4,video/x-m4v',
        onChange: (e: React.FormEvent<HTMLInputElement>) => {
          toggleVideoOverlay(true);
          videoFileOnChange(e);
        }
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
        ['data-type']: !!videoFileData.file
          ? ('tertiary' as const)
          : ('secondary' as const),
        ['data-form']: 'circle' as const,
        ['data-size']: 'small' as const,
        ['data-action']: 'record',
        ['data-action-position']: 'center' as const,
        onClick: () => inputFileVideoRef.current.click()
      },

      {
        type: 'submit' as const,
        disabled:
          (!message && !videoFileData.file && !imageFileData.file) ||
          !userData?.homePageStylist,
        ['data-type']: 'primary' as const,
        ['data-form']: 'rounded' as const,
        ['data-size']: 'small' as const,
        ['data-action']: 'send' as const,
        ['data-action-position']: 'center-right' as const,
        children: 'Send',
        onClick: (e: React.FormEvent<HTMLButtonElement>) => {
          e.preventDefault();

          if (userData.subscribedToService) {
            handleSubmitMessage();
          } else {
            toggleSubscriptionModal(true);
          }
        }
      }
    ];
  }, [message, imageFileData.file, videoFileData.file]);

  const handleThreadReferenceRedirect = React.useCallback(
    (threadIdReference: string) => {
      history.push({
        pathname: `/styleups/thread/${threadIdReference}`,
        search: location.search
      });
    },
    []
  );

  const [
    isStylistVactionModalActive,
    toggleStylistVacationModal
  ] = React.useState<boolean>(
    homePageStylist.stylistTier === STYLIST_TIER.VACATION
  );

  const stylistVacationModalActions = React.useMemo(
    () => [
      {
        ['data-type']: 'secondary' as const,
        children: 'Switch Stylist',
        onClick: () =>
          history.push({
            pathname: '/stylist-list',
            search: location.search
          })
      },
      {
        ['data-type']: 'primary' as const,
        children: 'Wait',
        onClick: () => toggleStylistVacationModal(false)
      }
    ],
    []
  );

  return (
    <>
      <GlobalStepStyles />

      <Modal
        name="stylist-vacation-modal"
        render={isStylistVactionModalActive && !isSubscriptionModalActive}
        title="Looks like your stylist is on vacation!"
        message="Want to wait for her? She can help you when she returns."
        actions={stylistVacationModalActions}
        onClickOutside={() => toggleStylistVacationModal(false)}
      />

      <Modal
        render={isSubscriptionModalActive}
        name="subscribtion-modal"
        onClickOutside={() => toggleSubscriptionModal(false)}
      >
        <StyledModalContent>
          <StyledSubscriptionImage />

          <h3>Subscribe and Experience 1-on-1 Chat at any Moment</h3>
          <p className="body">
            Access a real, live personal stylist as often as you’d like. She’s
            always on-hand to give you style advice and address your needs.
          </p>

          <Button
            data-type="secondary"
            onClick={() => toggleSubscriptionModal(false)}
          >
            Not Now
          </Button>

          <Button
            onClick={() => {
              if (userData?.clientType === CLIENT_TYPE.FOLLOWER) {
                return !!userData?.tasksCount
                  ? history.push({
                      pathname: '/payment/chargebee',
                      search: location.search
                    })
                  : history.push({
                      pathname: '/payment/pre-payment',
                      search: location.search
                    });
              }

              history.push({
                pathname: '/payment/trial',
                search: location.search
              });
            }}
          >
            Subscribe
          </Button>
        </StyledModalContent>
      </Modal>

      <StyledModal
        name="await-step-modal"
        render={isHaveActiveTask}
        message={
          <>
            <StyledClockIcon />
            Your stylist is currently still working on a task. Check back in a
            bit!
          </>
        }
        onClickOutside={() => toggleIsHaveActiveTask(false)}
      />

      <VideoPreviewOverlay
        render={isVideoOverlayActive}
        file={videoFileData.file}
        acceptVideo={() => {
          toggleVideoOverlay(false);
        }}
        deleteVideo={() => {
          handleVideoDispatch({
            status: REQUEST_STATUSES.NONE
          });
          toggleVideoOverlay(false);
        }}
      />

      <StyledChatWithStylistPage>
        <ul
          className="messages-list"
          data-is-empty={
            !threadContent?.thread?.events?.length && !loadingThread
          }
        >
          {loadingThread ? (
            <MessageLoading />
          ) : !!threadContent?.thread?.events?.length ? (
            threadContent.thread?.events.map((event, key) => (
              <ChatWithStylistMessage
                key={key}
                ref={
                  key === activeThreadEventIndex ? lastMessageRef : undefined
                }
                stylist={threadContent.stylists?.[event.senderId]}
                onReferenceEventClick={handleThreadReferenceRedirect}
                {...event}
              />
            ))
          ) : (
            <>
              <StyledStylistImage src={homePageStylist.profilePicture} />
              <h4>
                This is where your conversation with{' '}
                {homePageStylist.firstName || 'your stylist'} starts
              </h4>
            </>
          )}

          {sendingMessage && <MessageLoading />}
        </ul>

        <div className="message-bar-content">
          <MessageBar
            inputFileProps={inputFileProps}
            textareaProps={textareaProps}
            buttonProps={buttonProps}
          />
        </div>
      </StyledChatWithStylistPage>
    </>
  );
};

export default ChatWithStylistPage;
