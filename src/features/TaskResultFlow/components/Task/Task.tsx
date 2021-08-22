import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import TopBarProgress from 'react-topbar-progress-indicator';
import { Notification } from '@bit/scalez.savvy-ui.notification';
import { ProductCard } from '@bit/scalez.savvy-ui.product-card';
import {
  AnalysisGroupsResult,
  ANALYSIS_GROUP_ITEM_TYPE
} from '@bit/scalez.savvy-ui.analysis-groups-result';
import { useStateWithCallback } from '@bit/scalez.savvy-ui.hooks';

/* Core */
import { isMobileApp } from 'core/utils';

/* Api */
import { addProductToClosetMutation } from 'App/api/closet/addProductToCloset';
import { removeProductFromClosetMutation } from 'App/api/closet/removeProductFromCloset';

/* Types */
import { EVENTS } from 'services/analyticsService';
import {
  Product,
  PRODUCT_CATEGORIES,
  ANALYSIS_STATEMENT_TYPE
} from 'App/types';
import { RATE_OPTIONS } from 'Layouts/TinderExperience/types';

/* Components */
import { RootContext, RootContextType } from 'App/components';

/* Styles */
import { StyledTaskPage } from './styles';

type Props = RouteComponentProps<{ taskId: string }>;

let notificationTimeout;
const Task: React.FC<Props> = React.memo(
  ({ match: { params }, location }: Props) => {
    const { source } = React.useMemo(() => {
      const searchParams = new URLSearchParams(location.search);
      const urlSource = searchParams.get('source');
      return {
        source: urlSource ? urlSource : isMobileApp() ? 'app' : ''
      };
    }, []);

    const {
      state: { userData, activeTaskResultData },
      actions: { trackPage, trackEvent }
    } = React.useContext<RootContextType>(RootContext);

    const [notificationMessage, showMessage] = useStateWithCallback<{
      isActive: boolean;
      rate: RATE_OPTIONS;
    }>({ isActive: false, rate: null }, state => {
      clearTimeout(notificationTimeout);

      if (state.isActive) {
        notificationTimeout = setTimeout(() => {
          showMessage({ ...state, isActive: false });
        }, 2500);
      }
    });

    React.useEffect(() => {
      const properties = {
        taskId: params.taskId,
        TaskResultsOpenedTaskId: params.taskId,
        TaskResultsOpenedTaskName: activeTaskResultData?.taskName,
        taskName: activeTaskResultData?.taskName,
        source,
        TaskResultsOpenedStylistId: activeTaskResultData?.stylist?.stylistId,
        stylistId: activeTaskResultData?.stylist?.stylistId,
        stepName: activeTaskResultData?.stepName ?? '',
        threadId: activeTaskResultData?.threadId,
        tier: activeTaskResultData?.tier
      };

      trackPage({
        name: 'TaskResultPage',
        properties
      });

      trackEvent({
        event: EVENTS.TASK_RESULTS_OPENED,
        properties
      });
    }, []);

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

        showMessage({
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

    /* Format products data for TaskResult grid */
    const productResult = React.useMemo(() => {
      const categorizedProducts =
        activeTaskResultData?.taskResults?.categorisedProducts ?? {};

      const categories = Object.keys(categorizedProducts);

      if (!categorizedProducts || !categories.length) {
        return [];
      }

      /* Render one category grid */
      if (categories.length === 1) {
        return [categorizedProducts[categories[0]] || []];
      } else {
        /* Render multiple categories grid */
        return [
          categorizedProducts[PRODUCT_CATEGORIES.BASIC] || [],
          categorizedProducts[PRODUCT_CATEGORIES.INTEREST] || [],
          categorizedProducts[PRODUCT_CATEGORIES.COMPLETER] || [],
          categorizedProducts[PRODUCT_CATEGORIES.ACCESSORIES] || []
        ];
      }
    }, [activeTaskResultData]);

    const productCardProps = React.useMemo(() => {
      return productResult?.map(category =>
        category?.map?.(product => ({
          data: {
            price: product.price,
            priceSale: product.priceSale,
            name: product.productName,
            images: product.images
          },
          isRated: product.inWishlist,
          onProductClick: () => {
            window.location.href = product.productLink;
          },
          onRateClick: (isRated: boolean) =>
            handleProductRateClick({ ...product, inWishlist: isRated })
        }))
      );
    }, [activeTaskResultData]);

    const analysisGroupsResult = React.useMemo(() => {
      return {
        groups: activeTaskResultData.taskResults?.analysisGroups?.reduce(
          (acc, group) => {
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
          },
          []
        )
      };
    }, [activeTaskResultData]);

    return (
      <>
        {!activeTaskResultData && <TopBarProgress />}

        <Notification render={notificationMessage.isActive}>
          {notificationMessage.rate === RATE_OPTIONS.LIKE &&
            'Item added to your closet'}

          {notificationMessage.rate === RATE_OPTIONS.DISLIKE &&
            'Item removed from your closet'}
        </Notification>

        <StyledTaskPage>
          <AnalysisGroupsResult
            stylist={{
              firstName: activeTaskResultData?.stylist?.firstName,
              profilePicture: activeTaskResultData?.stylist?.profilePicture
            }}
            {...analysisGroupsResult}
          />

          <div
            className="product-grid"
            data-is-equal={productResult.length === 1}
          >
            {productCardProps.flat().map((props, key) => (
              <ProductCard key={key} {...props} />
            ))}
          </div>
        </StyledTaskPage>
      </>
    );
  }
);

export default Task;
