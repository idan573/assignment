import * as React from 'react';
import { useHistory } from 'react-router-dom';
import range from 'ramda/src/range';
import {
  AnalysisGroupsResult,
  ANALYSIS_GROUP_ITEM_TYPE
} from '@bit/scalez.savvy-ui.analysis-groups-result';
import { Notification } from '@bit/scalez.savvy-ui.notification';
import { ProductCard } from '@bit/scalez.savvy-ui.product-card';
import {
  TaskMessage,
  MESSAGE_CONTENT_TYPES
} from '@bit/scalez.savvy-ui.task-message';
import { savvyLogo, clock } from '@bit/scalez.savvy-ui.svg';
import { getDate } from '@bit/scalez.savvy-ui.utils';
import { useStateWithCallback } from '@bit/scalez.savvy-ui.hooks';

/* Analytics */
import { EVENTS } from 'services/analyticsService';

/* Api */
import { addProductToClosetMutation } from 'App/api/closet/addProductToCloset';
import { removeProductFromClosetMutation } from 'App/api/closet/removeProductFromCloset';

/* Types */
import {
  PRODUCT_CATEGORIES,
  Product,
  CdeTask,
  Stylist,
  StylistFeedback,
  ThreadEvent,
  THREAD_EVENT_TYPES,
  THREAD_EVENT_SENDER_TYPES,
  TASK_TYPE,
  ANALYSIS_STATEMENT_TYPE
} from 'App/types';
import { RATE_OPTIONS } from 'Layouts/TinderExperience/types';

/* Components */
import { RootContext, RootContextType } from 'App/components';

/* Styles */
import {
  StyledTaskResultImage,
  StyledUnexpandedTaskResultEventItem,
  StyledFeedbackEventItem
} from './styles';

interface Props extends ThreadEvent {
  isExpanded?: boolean;
  isConversationStopped?: boolean;
  stylist?: Stylist;
  task?: CdeTask;
  feedback?: StylistFeedback;
}

let notificationTimeout;
const ThreadEventItem = React.memo(
  React.forwardRef<HTMLDivElement, Props>(
    (
      {
        images,
        text,
        taskId,
        timestamp,
        threadEventType,
        taskType,
        senderType,
        senderId,
        isExpanded,
        isConversationStopped,
        stylist: stylistData = {},
        task = {},
        feedback = {}
      }: Props,
      ref: React.Ref<HTMLDivElement>
    ) => {
      const history = useHistory();

      const {
        state: { userData },
        actions: { trackEvent }
      } = React.useContext<RootContextType>(RootContext);

      const [
        productRateNotification,
        toggleProductRateNotification
      ] = useStateWithCallback<{
        isActive: boolean;
        rate: RATE_OPTIONS;
      }>({ isActive: false, rate: null }, state => {
        clearTimeout(notificationTimeout);

        if (state.isActive) {
          notificationTimeout = setTimeout(() => {
            toggleProductRateNotification({ ...state, isActive: false });
          }, 2500);
        }
      });

      const handleProductRateClick = React.useCallback(
        async (product: Product) => {
          trackEvent({
            event: EVENTS.PRODUCT_RATED,
            properties: {
              source: 'TaskResultPage',
              productId: product.productId,
              productName: product.productName,
              rateValue: product.inWishlist ? -1 : 1,
              rate: RATE_OPTIONS.LIKE
            }
          });

          toggleProductRateNotification({
            isActive: true,
            rate: product.inWishlist ? RATE_OPTIONS.DISLIKE : RATE_OPTIONS.LIKE
          });

          if (product.inWishlist) {
            await removeProductFromClosetMutation({
              userId: userData.userId,
              productId: product.productId
            });
          } else {
            await addProductToClosetMutation({
              userId: userData.userId,
              products: [product]
            });
          }
        },
        []
      );

      const productsResult = React.useMemo(() => {
        const productsCategorized = task.taskResults?.categorisedProducts ?? {};
        const categories = Object.keys(productsCategorized);

        if (!productsCategorized || !categories.length) {
          return [];
        }

        /* Render equal grid (refine) */
        if (categories.length === 1) {
          return [productsCategorized[categories[0]] || []];
        } else {
          /* Render unequal grid (outfit) */
          return [
            productsCategorized[PRODUCT_CATEGORIES.BASIC] || [],
            productsCategorized[PRODUCT_CATEGORIES.INTEREST] || [],
            productsCategorized[PRODUCT_CATEGORIES.COMPLETER] || [],
            productsCategorized[PRODUCT_CATEGORIES.ACCESSORIES] || []
          ];
        }
      }, [task]);

      const analysisGroupsResult = React.useMemo(() => {
        return {
          groups: task.taskResults?.analysisGroups?.reduce((acc, group) => {
            acc.push({
              groupTitle: group.groupDisplayName,
              content: [
                ...(!!group.entries.length
                  ? [
                      {
                        type: ANALYSIS_GROUP_ITEM_TYPE.ENTRIES,
                        entriesItem: group.entries.map(
                          ({ displayName, image, isChosen }) => ({
                            image,
                            name: displayName,
                            isActive: isChosen
                          })
                        )
                      }
                    ]
                  : []),

                ...group.statements.map(
                  ({
                    type,
                    statements,
                    statementText,
                    statementTemplate,
                    displayName,
                    image
                  }) =>
                    ({
                      [ANALYSIS_STATEMENT_TYPE.TEXT]: {
                        type: ANALYSIS_GROUP_ITEM_TYPE.TEXT,
                        textItem: {
                          question: statementText,
                          answer: statementTemplate
                        }
                      },
                      [ANALYSIS_STATEMENT_TYPE.IMAGE]: {
                        type: ANALYSIS_GROUP_ITEM_TYPE.IMAGES,
                        imagesItem: {
                          title: statements?.[0]?.ruleGroup,
                          images: statements?.map(({ image, displayName }) => ({
                            src: image,
                            name: displayName
                          }))
                        }
                      }
                    }[type])
                )
              ]
            });

            return acc;
          }, [])
        };
      }, [task]);

      const timestampString = React.useMemo(() => {
        const { day, month, year } = getDate(timestamp);

        return `${day} ${month.toUpperCase()} ${year}`;
      }, [timestamp]);

      const taskMessageInfo = React.useMemo(() => {
        switch (senderType) {
          case THREAD_EVENT_SENDER_TYPES.USER:
            return {
              senderImage: userData.profilePicture,
              senderName: userData.firstName,
              timestamp: timestampString
            };
          case THREAD_EVENT_SENDER_TYPES.STYLIST:
            return {
              senderImage: stylistData.profilePicture,
              senderName: stylistData.firstName || 'My stylist',
              timestamp: timestampString
            };
          case THREAD_EVENT_SENDER_TYPES.SAVVY:
            return {
              senderImage: savvyLogo({ scale: 0.45 }),
              senderName: 'Savvy',
              timestamp: timestampString
            };

          default:
            return {};
        }
      }, [task, stylistData, userData]);

      const taskMessageContent = React.useMemo(() => {
        switch (threadEventType) {
          case THREAD_EVENT_TYPES.MESSAGE:
            return [
              !!text && {
                type: MESSAGE_CONTENT_TYPES.TEXT,
                data: text
              },
              !!images?.length && {
                type: MESSAGE_CONTENT_TYPES.PHOTO,
                data: images
              }
            ];
          case THREAD_EVENT_TYPES.TASK:
            return [
              {
                type: MESSAGE_CONTENT_TYPES.TEXT,
                data: task.userResponse
              }
            ];

          case THREAD_EVENT_TYPES.TASK_RESPONSE:
            return [
              !!(task.taskType === TASK_TYPE.IMAGE_FEEDBACK) &&
                task.userResponseImages?.length && {
                  type: MESSAGE_CONTENT_TYPES.PHOTO,
                  data: task.userResponseImages?.[0]
                },
              !!task.taskResults?.stylistResponse?.text && {
                type: MESSAGE_CONTENT_TYPES.TEXT,
                data: task.taskResults?.stylistResponse?.text
              },
              !!task.taskResults?.stylistResponse?.video && {
                type: MESSAGE_CONTENT_TYPES.VIDEO,
                data: task.taskResults?.stylistResponse?.video
              }
            ];
          case THREAD_EVENT_TYPES.TASK_FEEDBACK:
            const { rate, feedback: message } = feedback;

            return [
              {
                type: MESSAGE_CONTENT_TYPES.TEXT,
                data: message
              },
              {
                type: MESSAGE_CONTENT_TYPES.CUSTOM,
                children: (
                  <StyledFeedbackEventItem>
                    {range(1, 6).map(i => (
                      <div
                        key={i}
                        className="rating-point"
                        data-is-active={i <= rate}
                      />
                    ))}
                  </StyledFeedbackEventItem>
                )
              }
            ];
          default:
            return [];
        }
      }, [threadEventType, task, feedback]);

      const unexpandedResultMessageProps = React.useMemo(
        () => ({
          info: {
            senderImage: stylistData.profilePicture
          },
          content: [
            {
              type: MESSAGE_CONTENT_TYPES.CUSTOM,
              children: (
                <StyledUnexpandedTaskResultEventItem
                  onClick={() => {
                    history.push({
                      pathname: `/task-result/task/${task.taskId}`,
                      search: location.search
                    });
                  }}
                >
                  <span className="sbody-bold">Open Result</span>
                  <div className="images-wrapper">
                    {(task.taskType === TASK_TYPE.USER_ANALYSIS
                      ? task.taskResults?.analysisGroups
                          .flatMap(group => group.statements)
                          .filter(
                            statement =>
                              statement.type === ANALYSIS_STATEMENT_TYPE.IMAGE
                          )
                          .flatMap(
                            imageStatements => imageStatements.statements
                          )
                          .map(imageStatements => imageStatements.image)
                      : productsResult
                          .flat()
                          .map((product, key) => product.images[0])
                    )
                      .slice(0, 3)
                      .map((src, key) => (
                        <StyledTaskResultImage key={key} src={src} />
                      ))}
                  </div>
                </StyledUnexpandedTaskResultEventItem>
              )
            }
          ]
        }),
        [task, stylistData]
      );

      const callToActionMessageProps = React.useMemo(
        () => ({
          info: {
            senderImage: stylistData.profilePicture,
            senderName: stylistData.firstName,
            timestamp: timestampString
          },
          content: [
            {
              type: MESSAGE_CONTENT_TYPES.TEXT,
              data: 'How do you feel about this?'
            }
          ]
        }),
        [stylistData]
      );

      const waitingMessageProps = React.useMemo(
        () => ({
          info: {
            senderImage: savvyLogo({ scale: 0.45 })
          },
          content: [
            {
              type: MESSAGE_CONTENT_TYPES.ICON,
              data: clock()
            },
            {
              type: MESSAGE_CONTENT_TYPES.TEXT,
              data:
                "Your style coach is still hard at work on your request. Don't worry, you will be notified when it's ready!"
            }
          ]
        }),
        []
      );

      /* Show callToAction message if user needs to respond to the stylist */
      const isUserResponseAwait =
        !!ref &&
        threadEventType === THREAD_EVENT_TYPES.TASK_RESPONSE &&
        task.taskType !== TASK_TYPE.ONE_ON_ONE_RESPONSE;

      /* Show await message only if "task" event is the last in list */
      const isTaskAwait =
        !!ref &&
        threadEventType === THREAD_EVENT_TYPES.TASK &&
        task.taskType !== TASK_TYPE.ONE_ON_ONE_RESPONSE;

      let isTaskContainsResults;
      try {
        /* Show results link message only if "taskResponse" event has any results */
        isTaskContainsResults =
          task.taskType !== TASK_TYPE.ONE_ON_ONE_RESPONSE &&
          (!!task?.taskResults?.analysisEntries?.length ||
            (task?.taskResults?.categorisedProducts &&
              !!Object.keys(task?.taskResults?.categorisedProducts)?.length) ||
            !!task?.taskResults?.statements);
      } catch (e) {
        console.log(e);
      }

      return (
        <>
          <Notification render={productRateNotification.isActive}>
            {productRateNotification.rate === RATE_OPTIONS.LIKE &&
              'Item added to your closet'}

            {productRateNotification.rate === RATE_OPTIONS.DISLIKE &&
              'Item removed from your closet'}
          </Notification>

          {threadEventType === THREAD_EVENT_TYPES.TASK &&
            task.taskType === TASK_TYPE.ONE_ON_ONE_RESPONSE && (
              <TaskMessage
                ref={ref}
                info={taskMessageInfo}
                content={taskMessageContent}
              />
            )}

          {threadEventType === THREAD_EVENT_TYPES.MESSAGE && (
            <TaskMessage
              ref={ref}
              info={taskMessageInfo}
              content={taskMessageContent}
            />
          )}

          {threadEventType === THREAD_EVENT_TYPES.TASK_FEEDBACK && (
            <TaskMessage
              ref={ref}
              info={taskMessageInfo}
              content={taskMessageContent}
            />
          )}

          {threadEventType === THREAD_EVENT_TYPES.TASK_RESPONSE && (
            <>
              <TaskMessage
                ref={ref}
                info={taskMessageInfo}
                content={taskMessageContent}
              />

              {isExpanded ? (
                <>
                  {task.taskType === TASK_TYPE.USER_ANALYSIS && (
                    <AnalysisGroupsResult
                      stylist={{
                        firstName: stylistData.firstName,
                        profilePicture: stylistData.profilePicture
                      }}
                      {...analysisGroupsResult}
                    />
                  )}

                  <div className="product-grid">
                    {productsResult.flat().map((product, key) => (
                      <ProductCard
                        key={key}
                        data={{
                          price: product.price,
                          priceSale: product.priceSale,
                          images: product.images
                        }}
                        isRated={product.inWishlist}
                        onProductClick={() => {
                          window.location.href = product.productLink;
                        }}
                        onRateClick={(isRated: boolean) =>
                          handleProductRateClick({
                            ...product,
                            inWishlist: isRated
                          })
                        }
                      />
                    ))}
                  </div>

                  {isUserResponseAwait && (
                    <TaskMessage {...callToActionMessageProps} />
                  )}
                </>
              ) : (
                isTaskContainsResults && (
                  <TaskMessage ref={ref} {...unexpandedResultMessageProps} />
                )
              )}
            </>
          )}

          {isTaskAwait && <TaskMessage ref={ref} {...waitingMessageProps} />}
        </>
      );
    }
  )
);

export { ThreadEventItem };
