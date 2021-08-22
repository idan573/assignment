import * as React from 'react';
import TopBarProgress from 'react-topbar-progress-indicator';
import { RouteComponentProps } from 'react-router-dom';
import { useRequest, useLazyRequest } from '@bit/scalez.savvy-ui.hooks';
import { Modal } from '@bit/scalez.savvy-ui.modal';
import { FloatWrapper } from '@bit/scalez.savvy-ui.float-wrapper';
import {
  HEADER_ITEM_TYPES,
  HEADER_ITEM_POSITION_TYPES
} from '@bit/scalez.savvy-ui.header';

/* Analytics */
import { EVENTS } from 'services/analyticsService';

/* Api */
import {
  GQLRetrieveUserThreadsVars,
  getUnseenThreadsNumberQuery
} from 'App/api/thread/retrieveUserThreads';
import {
  GQLGetClosetProductTypesVars,
  getClosetProductTypesQuery
} from 'App/api/closet/getClosetProductTypes';
import {
  GetClosetData,
  GQLGetClosetVars,
  defaultClosetData,
  getClosetQuery
} from 'App/api/closet/getCloset';
import {
  GQLRemoveProductFromClosetVars,
  removeProductFromClosetMutation
} from 'App/api/closet/removeProductFromCloset';

/* Types */
import { Product, ClosetProductTypes } from 'App/types';
import { APP_HEADER_ITEM_TYPES } from 'App/components/AppHeader/AppHeader';
import { RATE_OPTIONS } from 'Layouts/TinderExperience/types';

/* Components */
import { RootContext, RootContextType } from 'App/components';
import { InfiniteGridBlock } from './InfiniteGridBlock/InfiniteGridBlock';

/* Styles */
import { StyledCounter } from 'globalstyles/Main';
import { StyledButton } from './styles';

const arrayToMatrix = (array: any[], width: number): any[] =>
  array.reduce((arrayOfRows, item, index) => {
    if (index % width === 0) {
      arrayOfRows.push([item]);
    } else {
      arrayOfRows[arrayOfRows.length - 1].push(item);
    }

    return arrayOfRows;
  }, []);

const closetConfig = {
  productsPerQuery: 100,
  gridColumnCount: 2
};

const ClosetPage: React.FC<RouteComponentProps> = ({
  history,
  location
}: RouteComponentProps) => {
  const {
    state: { userData },
    actions: { setActiveStepData, trackPage, trackEvent }
  } = React.useContext<RootContextType>(RootContext);

  const [allProducts, setAllProducts] = React.useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = React.useState<Product[]>([]);
  const [activeProductType, setActiveProductType] = React.useState<string>(
    'All'
  );
  const [productModalData, setProductModalData] = React.useState<{
    isActive: boolean;
    productLink: string;
    productName: string;
    productId: string;
    productParentId: string;
    productBrand: string;
    productType: string;
  }>({
    isActive: false,
    productLink: '',
    productBrand: '',
    productName: '',
    productId: '',
    productType: '',
    productParentId: ''
  });

  const { data: unseenThreadsNumber } = useRequest<
    GQLRetrieveUserThreadsVars,
    number
  >(getUnseenThreadsNumberQuery, {
    payload: {
      userId: userData.userId
    }
  });

  const [
    getCloset,
    { loading: closetLoading, data: closetData = defaultClosetData }
  ] = useLazyRequest<GQLGetClosetVars, GetClosetData>(getClosetQuery, {
    onCompleted: ({ products }: GetClosetData) => {
      setAllProducts(allProducts.concat(products));

      const newFilteredProducts =
        activeProductType === 'All'
          ? products
          : products.filter(
              (product: Product) => product.productType === activeProductType
            );

      setFilteredProducts(filteredProducts.concat(newFilteredProducts));
    },
    onError: e => {
      console.log(e);
    }
  });

  const {
    data: closetProductTypes = { productTypes: [], totalProductsCount: 0 }
  } = useRequest<GQLGetClosetProductTypesVars, ClosetProductTypes>(
    getClosetProductTypesQuery,
    {
      payload: {
        userId: userData?.userId ?? ''
      }
    }
  );

  React.useEffect(() => {
    trackPage({
      name: 'ClosetPage'
    });

    getCloset({
      userId: userData?.userId,
      count: closetConfig.productsPerQuery
    });
  }, []);

  React.useEffect(() => {
    setActiveStepData(prevState => ({
      ...prevState,
      headerConfig: [
        {
          type: HEADER_ITEM_TYPES.TITLE,
          props: {
            dataSelfPosition: HEADER_ITEM_POSITION_TYPES.LEFT,
            children: 'Closet'
          }
        },
        {
          type: APP_HEADER_ITEM_TYPES.NOTIFICATION,
          props: {
            notificationsCount: unseenThreadsNumber
          }
        },
        {
          type: HEADER_ITEM_TYPES.BUTTON,
          props: {
            dataSelfPosition: HEADER_ITEM_POSITION_TYPES.RIGHT,
            ['data-action']: 'menu'
          }
        }
      ]
    }));
  }, [unseenThreadsNumber]);

  /* Grid Methods */

  const handleProductTypeClick = React.useCallback(
    (type: string) => {
      setActiveProductType(type);

      if (type !== 'All') {
        setFilteredProducts(
          allProducts.filter((product: Product) => product.productType === type)
        );
      }
    },
    [allProducts]
  );

  const handleProductClick = React.useCallback((product: Product) => {
    setProductModalData({
      isActive: true,
      productId: product.productId,
      productName: product.productName,
      productType: product.productType,
      productBrand: product.brand,
      productParentId: product.parentId,
      productLink: product.productLink
    });
  }, []);

  const handleProductRemove = React.useCallback(
    (clickedProduct: Product) => {
      trackEvent({
        event: EVENTS.PRODUCT_RATED,
        properties: {
          source: 'ClosetPage',
          productId: clickedProduct.productId,
          productName: clickedProduct.productName,
          rateValue: -1,
          rate: RATE_OPTIONS.LIKE
        }
      });

      const removeSpecificProduct = (product: Product) =>
        product.productId !== clickedProduct.productId;

      setAllProducts(prevState => prevState.filter(removeSpecificProduct));

      if (activeProductType !== 'All') {
        setFilteredProducts(prevState =>
          prevState.filter(removeSpecificProduct)
        );
      }

      removeProductFromClosetMutation({
        userId: userData.userId,
        productId: clickedProduct.productId
      });
    },
    [activeProductType]
  );

  const handleLoadMore = React.useCallback(() => {
    getCloset({
      userId: userData?.userId,
      count: closetConfig.productsPerQuery,
      nextToken: closetData.nextToken
    });
  }, [closetData]);

  /* Modal Methods */

  const handleModalSubmit = React.useCallback(() => {
    trackEvent({
      event: EVENTS.PRODUCT_CLICKED,
      properties: {
        component: 'ClosetPage',
        productId: productModalData.productId,
        productName: productModalData.productName,
        productType: productModalData.productType,
        productBrand: productModalData.productBrand,
        productParentId: productModalData.productParentId,
        productLink: productModalData.productLink
      },
      callback: () => (window.location.href = productModalData.productLink)
    });
  }, [productModalData]);

  const handleModalCancel = React.useCallback(() => {
    setProductModalData({
      isActive: false,
      productLink: '',
      productBrand: '',
      productName: '',
      productId: '',
      productType: '',
      productParentId: ''
    });
  }, []);

  const modalActions = React.useMemo(
    () => [
      {
        ['data-type']: 'secondary' as const,
        children: 'Cancel',
        onClick: handleModalCancel
      },
      {
        ['data-type']: 'primary' as const,
        children: 'Continue',
        onClick: handleModalSubmit
      }
    ],
    [handleModalSubmit]
  );

  const listProps = React.useMemo(() => {
    const productsMatrix = arrayToMatrix(
      activeProductType === 'All' ? allProducts : filteredProducts,
      closetConfig.gridColumnCount
    );

    const list =
      productsMatrix.length || allProducts.length
        ? [
            ['product-types-cell', 'empty-cell'],
            ...productsMatrix,
            !!closetData.nextToken ? ['load-more-button-cell'] : ['empty-cell']
          ]
        : [
            /* do not show empty-closet-cell if data still loading */
            closetData.nextToken !== defaultClosetData.nextToken &&
            !closetLoading &&
            !closetData.products.length
              ? ['empty-closet-cell']
              : ['empty-cell']
          ];

    return {
      columnCount: closetConfig.gridColumnCount,
      list
    };
  }, [
    allProducts,
    filteredProducts,
    closetData,
    closetLoading,
    activeProductType
  ]);

  return (
    <>
      {closetLoading && <TopBarProgress />}

      {/*Product  Open  Modal */}
      <Modal
        name="product-open-modal"
        render={productModalData.isActive}
        title="You will be redirected to the store page"
        actions={modalActions}
        onClickOutside={handleModalCancel}
      />

      <InfiniteGridBlock
        {...listProps}
        productTypes={closetProductTypes.productTypes}
        activeProductType={activeProductType}
        onProductTypeClick={handleProductTypeClick}
        onProductClick={handleProductClick}
        onProductRemove={handleProductRemove}
        onLoadMoreClick={handleLoadMore}
      />

      {!closetLoading && (
        <FloatWrapper order={1} delay={500} position="bottom" transition="fade">
          <StyledButton
            data-type="secondary"
            data-form="circle"
            data-action-position="center"
            data-action="plus"
            onClick={() => {
              history.push({
                pathname: '/outfit-feed',
                search: location.search
              });
            }}
          />
        </FloatWrapper>
      )}
    </>
  );
};

export default ClosetPage;
