import * as React from 'react';
import concat from 'ramda/src/concat';
import mergeDeepWithKey from 'ramda/src/mergeDeepWithKey';
import { Button } from '@bit/scalez.savvy-ui.button';
import { Outfit as OutfitUI } from '@bit/scalez.savvy-ui.outfit';
import { useLazyRequest } from '@bit/scalez.savvy-ui.hooks';
import { camelizeSnake } from '@bit/scalez.savvy-ui.utils';

/* Api */
import {
  GQLScrollOutfitsVars,
  ScrollOutfitsData,
  scrollOutfitsQuery
} from 'App/api/outfit/scrollOutfits';
import { reportStyleRateMutation } from 'App/api/reportStyleRate';

/* Types */
import { Outfit, Product } from 'App/types';
import { EVENTS } from 'services/analyticsService';
import { RATE_OPTIONS } from 'Layouts/TinderExperience/types';

import { RootContextType, RootContext } from 'App/components';

/* Styles */
import { StyledPlaceholderImage, StyledOutfitsList } from './styles';
import { Modal } from '@bit/scalez.savvy-ui.modal';

type Props = GQLScrollOutfitsVars &
  Partial<{
    isAllowRate: boolean;
  }>;

const StylistOutfitsList: React.FC<Props> = React.memo(
  ({ isAllowRate = true, ...variables }: Props) => {
    const {
      state: { userData, ratedOutfits, activeStepData },
      actions: { trackEvent, setRatedOutfit }
    } = React.useContext<RootContextType>(RootContext);

    const [
      getOutfits,
      { data: scrollOutfits = {}, loading: loadingOutfits }
    ] = useLazyRequest<GQLScrollOutfitsVars, ScrollOutfitsData>(
      scrollOutfitsQuery,
      {
        initialState: {
          loading: true,
          data: {
            outfits: []
          }
        },
        immediate: true,
        payload: {
          numberOfOutfits: 3,
          ...variables
        },
        mergeResponse(oldState, newState) {
          return mergeDeepWithKey(
            (k, l, r) => (k === 'outfits' ? concat(l, r) : r),
            oldState,
            newState
          );
        }
      }
    );

    const handleRateClick = React.useCallback(
      (outfit: Outfit) => {
        const isRated = ratedOutfits.has(outfit?.styleId);

        setRatedOutfit(outfit.styleId);

        const properties = {
          count: isRated ? -1 : 1,
          rate: isRated
            ? outfit.rates?.[0]?.rate ?? RATE_OPTIONS.LIKE
            : RATE_OPTIONS.LIKE,
          outfitId: outfit.styleId
        };

        trackEvent({
          event: EVENTS.OUTFIT_RATED,
          properties: {
            source: camelizeSnake(
              activeStepData.stateName.replace('STATE', 'PAGE')
            ),
            rateValue: properties.count,
            rate: properties.rate,
            outfitId: properties.outfitId,
            stylistId: outfit.stylist.stylistId,
            stylistName: outfit.stylist.firstName
          }
        });

        reportStyleRateMutation({
          userId: userData.userId,
          styleId: properties.outfitId,
          rate: properties.rate,
          isRemoveRate: isRated
        });
      },
      [ratedOutfits]
    );

    const handleProductModalCancel = React.useCallback(() => {
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

    const handleProductModalSubmit = React.useCallback(() => {
      trackEvent({
        event: EVENTS.PRODUCT_CLICKED,
        properties: {
          productId: productModalData.productId,
          productName: productModalData.productName,
          productType: productModalData.productType,
          productBrand: productModalData.productBrand,
          productParentId: productModalData.productParentId,
          productLink: productModalData.productLink
        },
        callback: () => {
          window.location.href = productModalData.productLink;
        }
      });
    }, [productModalData]);

    const productModalActions = React.useMemo(
      () => [
        {
          ['data-type']: 'secondary' as const,
          children: 'Back',
          onClick: handleProductModalCancel
        },
        {
          ['data-type']: 'primary' as const,
          children: 'Next',
          onClick: handleProductModalSubmit
        }
      ],
      [handleProductModalSubmit]
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

    const handleLoadMore = React.useCallback(() => {
      getOutfits({
        numberOfOutfits: 3,
        scrollId: scrollOutfits.scrollId,
        ...variables
      });
    }, [scrollOutfits]);

    const getOutfitRate = React.useCallback(
      (outfit: Outfit) => ({
        count: Number(outfit.rates?.[0]?.value) || 0,
        isRated: !!outfit?.rates?.length
      }),
      []
    );

    return (
      (!loadingOutfits || !!scrollOutfits?.outfits?.length) && (
        <>
          <Modal
            name="product-open-modal"
            render={productModalData.isActive}
            title="You will be redirected to the store page"
            actions={productModalActions}
            onClickOutside={handleProductModalCancel}
          />
          <StyledOutfitsList>
            <h2>Outfits I Styled</h2>

            {!!scrollOutfits?.outfits?.length ? (
              <>
                <ul>
                  {scrollOutfits.outfits.map((outfit, key) => {
                    const outfitRate = getOutfitRate(outfit);

                    return (
                      <OutfitUI
                        key={key}
                        rate={{
                          isRated: ratedOutfits.has(outfit?.styleId),
                          value: ratedOutfits.has(outfit?.styleId)
                            ? outfitRate.count + 1
                            : outfitRate.count
                        }}
                        products={outfit?.products?.map(product => ({
                          data: {
                            images: product.images
                          },
                          onProductClick: () => handleProductClick(product)
                        }))}
                        onRateClick={
                          isAllowRate
                            ? () => handleRateClick(outfit)
                            : undefined
                        }
                      />
                    );
                  })}
                </ul>

                <div className="load-more-button-wrapper">
                  <Button data-type="secondary" onClick={handleLoadMore}>
                    Load More
                  </Button>
                </div>
              </>
            ) : (
              <>
                <p className="empty-text body">
                  This content creator hasn't styled outfits yet.
                  <br />
                  Outfits will appear here after she styles.
                </p>

                <StyledPlaceholderImage />
              </>
            )}
          </StyledOutfitsList>
        </>
      )
    );
  }
);

export { StylistOutfitsList };
