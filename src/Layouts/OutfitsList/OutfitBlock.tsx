import * as React from 'react';
import { useHistory, useLocation } from 'react-router';
import { ProductCard } from '@bit/scalez.savvy-ui.product-card';
import { Notification } from '@bit/scalez.savvy-ui.notification';
import { Button } from '@bit/scalez.savvy-ui.button';
import { Modal } from '@bit/scalez.savvy-ui.modal';
import { Outfit as OutfitUI } from '@bit/scalez.savvy-ui.outfit';
import {
  useClipboardNotification,
  useStateWithCallback
} from '@bit/scalez.savvy-ui.hooks';
import { camelizeSnake, setQueryString } from '@bit/scalez.savvy-ui.utils';

/* Core */
import { getPlatform, isMobileApp } from 'core/utils';

/* Services */
import { authService } from 'services/authService';
import { EVENTS } from 'services/analyticsService';

/* Api */
import { addProductToClosetMutation } from 'App/api/closet/addProductToCloset';
import { reportStyleRateMutation } from 'App/api/reportStyleRate';
import { removeProductFromClosetMutation } from 'App/api/closet/removeProductFromCloset';

/* Types */
import { Outfit, Product } from 'App/types';
import { RATE_OPTIONS } from 'Layouts/TinderExperience/types';

/* Components */
import { RootContext, RootContextType } from 'App/components/RootProvider';
import { OutfitListContext, OutfitListContextType } from './OutfitsList';

/* Styles */
import {
  StyledOutfitBlock,
  StyledMatchModalContent,
  StyledStylistImage,
  StyledCheckIcon,
  StyledUserImage
} from './styles';

interface Props {
  data: Outfit;
}

let notificationTimeout;
const OutfitBlock: React.FC<Props> = React.memo(({ data = {} }: Props) => {
  const history = useHistory();
  const location = useLocation();

  const { setOutfitProductLike } = React.useContext<OutfitListContextType>(
    OutfitListContext
  );

  const {
    state: { userData, activeStepData, ratedOutfits },
    actions: { trackEvent, setRatedOutfit }
  } = React.useContext<RootContextType>(RootContext);

  const outfitRate = React.useMemo(
    () => ({
      count: Number(data.rates?.[0]?.value) || 0,
      isRated: !!data?.rates?.length
    }),
    [data]
  );

  const [isScoreModalActive, toggleScoreModal] = React.useState<boolean>(false);

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

  const shareLink = React.useRef<string>(
    `${window.location.origin}/outfit-share?${setQueryString({
      stylesIds: data?.styleId,
      scores: data?.score,
      sender: userData?.userId,
      utm_source: 'share',
      utm_medium: getPlatform(),
      utm_campaign: window.location.href.includes('feed')
        ? 'outfitFeed'
        : 'outfitMatching'
    })}`
  );

  const [clipboardNotificationActive, copy] = useClipboardNotification(
    shareLink.current
  );

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

  /* ---------- Modal Methods ---------- */

  const handleMatchModalCancel = React.useCallback(() => {
    toggleScoreModal(false);
  }, []);

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

  /* ---------- Product Methods ---------- */

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

  const handleProductRateClick = React.useCallback(
    async ({
      inWishlist,
      position,
      productCategory,
      title,
      ...product
    }: Product) => {
      if (!userData?.userId) {
        authService.login();
        return;
      }

      trackEvent({
        event: EVENTS.PRODUCT_RATED,
        properties: {
          source: camelizeSnake(
            activeStepData.stateName.replace('STATE', 'PAGE')
          ),
          productId: product.productId,
          productName: product.productName,
          rateValue: inWishlist ? -1 : 1,
          rate: RATE_OPTIONS.LIKE
        }
      });

      setOutfitProductLike({
        rate: !inWishlist,
        outfitId: data.styleId,
        productId: product.productId
      });

      showMessage({
        isActive: true,
        rate: inWishlist ? RATE_OPTIONS.DISLIKE : RATE_OPTIONS.LIKE
      });

      if (inWishlist) {
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
    [data]
  );

  /* ---------- Score Methods ---------- */

  const handleScoreClick = React.useCallback((outfit: Outfit) => {
    toggleScoreModal(true);

    trackEvent({
      event: EVENTS.PERCENTAGE_MATCH_CLICKED,
      properties: {
        percentage: outfit.score,
        outfitId: outfit.styleId,
        stylistId: outfit.stylist.stylistId,
        stylistName: outfit.stylist.firstName
      }
    });
  }, []);

  /* ---------- Stylist Methods ---------- */

  const handleStylistClick = React.useCallback((outfit: Outfit) => {
    trackEvent({
      event: EVENTS.STYLIST_PROFILE_CLICKED,
      properties: {
        source: camelizeSnake(
          activeStepData.stateName.replace('STATE', 'PAGE')
        ),
        outfitId: outfit.styleId,
        stylistId: outfit.stylist.stylistId,
        stylistName: outfit.stylist.firstName
      }
    });

    history.push({
      pathname: `/stylist-overview/${data.stylist.stylistId}`,
      search: location.search
    });
  }, []);

  /* ---------- Share Methods ---------- */

  const handleGoNativeShare = React.useCallback(() => {
    window.location.href = `gonative://share/sharePage?url=${shareLink.current}`;
  }, []);

  const handleMobileDeviceShare = React.useCallback(async () => {
    try {
      console.log(shareLink.current);

      await navigator.share({
        title: 'Savvy',
        text: `Check out this outfit I found on Savvy.Style`,
        url: shareLink.current
      });
    } catch (err) {
      console.log(err);
    }
  }, []);

  const handleOutfitShareClick = React.useCallback((outfit: Outfit) => {
    trackEvent({
      event: EVENTS.OUTFIT_SHARE_CLICKED,
      properties: {
        userId: userData?.userId,
        styleId: outfit?.styleId,
        stylistId: outfit?.stylist?.stylistId,
        score: outfit?.score,
        stylistFirstName: outfit?.stylist?.firstName,
        stylistLastName: outfit?.stylist?.lastName
      }
    });

    if (isMobileApp()) {
      handleGoNativeShare();
      return;
    }

    if (!!navigator.share) {
      handleMobileDeviceShare();
      return;
    }

    copy();
  }, []);

  /* ---------- Outfit Methods ---------- */

  const handleRateClick = React.useCallback(
    async (outfit: Outfit) => {
      if (!userData.userId) {
        authService.login();
        return;
      }

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

  const outfitProps = React.useMemo(
    () => ({
      stylist: {
        firstName: data?.stylist?.firstName,
        profilePicture: data?.stylist?.profilePicture
      },
      user: {
        firstName: userData.firstName,
        profilePicture: userData.profilePicture
      },
      score: {
        value: data.score
      },
      rate: {
        isRated: ratedOutfits.has(data?.styleId),
        value: ratedOutfits.has(data?.styleId)
          ? outfitRate.count + 1
          : outfitRate.count
      },
      share: {
        ['data-action']: !!navigator.share || isMobileApp() ? 'share' : 'link',
        onClick: () => handleOutfitShareClick(data),
        children: !!navigator.share ? 'Share' : 'Copy'
      },
      products: data?.products?.map((product, key) => ({
        data: {
          price: product.price,
          priceSale: product.priceSale,
          images: product.images
        },
        isRated: !!product.inWishlist,
        onProductClick: () => handleProductClick(product),
        onRateClick: isRated =>
          handleProductRateClick({
            ...product,
            inWishlist: isRated
          })
      })),
      onStylistClick: () => handleStylistClick(data),
      onScoreClick: () => handleScoreClick(data),
      onRateClick: () => handleRateClick(data)
    }),
    [data, outfitRate]
  );

  return (
    <>
      <Notification render={clipboardNotificationActive}>
        Outfit link copied to your clipboard
      </Notification>

      <Notification render={notificationMessage.isActive}>
        {notificationMessage.rate === RATE_OPTIONS.LIKE &&
          'Item added to your closet'}

        {notificationMessage.rate === RATE_OPTIONS.DISLIKE &&
          'Item removed from your closet'}
      </Notification>

      <Modal
        name="product-open-modal"
        render={productModalData.isActive}
        title="You will be redirected to the store page"
        actions={productModalActions}
        onClickOutside={handleProductModalCancel}
      />

      <Modal
        name="score-modal"
        render={isScoreModalActive}
        onClickOutside={handleMatchModalCancel}
      >
        <StyledMatchModalContent>
          <div className="images-block">
            <StyledCheckIcon className="check-icon" />
            <StyledUserImage
              className="user-image"
              src={userData.profilePicture}
            />
          </div>
          <h1>{data.score}%</h1>
          <span className="body">Style Match</span>
          <hr />
          <p className="body">
            Based on your style profile, Savvy found similarities between you
            and this stylist-curated look.
          </p>
          <Button onClick={handleMatchModalCancel}>Okay</Button>
        </StyledMatchModalContent>
      </Modal>

      <OutfitUI {...outfitProps} />
    </>
  );
});

export { OutfitBlock };
