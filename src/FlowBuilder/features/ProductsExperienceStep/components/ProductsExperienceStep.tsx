import React from 'react';
import { Loader } from '@bit/scalez.savvy-ui.loader';

/* Analytics */
import { EVENTS } from 'services/analyticsService';

/* Components */
import { REFlowState } from 'FlowBuilder/flows/reFlow';
import { FlowContext, FlowContextType } from 'FlowBuilder/FlowProvider';
import { ProductsExperienceComponent } from 'features/ProductsExperiencePage/components/ProducsExperienceComponent';

/* Types */
import { RatedItemData, RATE_OPTIONS } from 'Layouts/TinderExperience/types';
import { FlowRouteProps } from 'FlowBuilder/types';

/* API */
import {
  GQLReportProductDecisionVars,
  reportProductDecisionMutation
} from 'App/api/rulesExperience/reportProductDecisions';
import { addProductToClosetMutation } from 'App/api/closet/addProductToCloset';

const ProductsStep: React.FC<FlowRouteProps> = ({
  currentFlowState,
  userData,
  onNext,
  onBack
}: FlowRouteProps) => {
  const {
    actions: { trackEvent }
  } = React.useContext<FlowContextType>(FlowContext);

  const [animation, toggleAnimation] = React.useState<boolean>(false);

  const reFlowState = currentFlowState as REFlowState;
  const {
    actions: { setFlowState }
  } = React.useContext<FlowContextType>(FlowContext);

  const finishStep = React.useCallback(() => {
    const { rules, ruleIndex } = reFlowState;
    if (ruleIndex + 1 < rules?.length) {
      setFlowState({
        ruleIndex: ruleIndex + 1,
        products: [],
        productIndex: undefined
      });
      onBack();
      return;
    }

    onNext();
  }, []);

  const handleItemRate = ({ index, rate }: RatedItemData) => {
    if (!reFlowState?.products) {
      return;
    }

    const products = [...reFlowState?.products];
    if (!products[index - 1]?.productId) {
      finishStep();
      return;
    }

    if (!products[index]) {
      return;
    }

    /* Update Rate Selection*/
    const isLike = rate === RATE_OPTIONS.LIKE;
    setFlowState({ productIndex: index, products });
    const selectedProduct = products[index];

    /* Report Rule Decision */
    const reportProduct: GQLReportProductDecisionVars = {
      experienceId: reFlowState.experienceId,
      isLike: isLike,
      isRandom: selectedProduct.isRandom,
      position: parseInt(selectedProduct.position),
      productId: selectedProduct.productId,
      score: selectedProduct.score,
      sessionId: reFlowState.sessionId,
      styleId: selectedProduct.styleId,
      userId: userData?.userId
    };

    reportProductDecisionMutation(reportProduct).then(() => {
      console.log('report product decision', {
        isLike: isLike
      });
    });

    trackEvent({
      event: EVENTS.PRODUCT_RATED,
      properties: {
        source: 'ProductsExperienceStep',
        productId: selectedProduct.productId,
        productName: selectedProduct.productName,
        rateValue: isLike ? -1 : 1,
        rate: isLike ? RATE_OPTIONS.LIKE : RATE_OPTIONS.DISLIKE
      }
    });

    if (reportProduct?.isLike) {
      addProductToClosetMutation({
        userId: userData?.userId,
        products: [selectedProduct]
      }).then(res => {
        console.log('added product to whishlist', res);
      });
    }
  };

  return (
    <>
      {reFlowState?.products?.length ? (
        <ProductsExperienceComponent
          products={reFlowState.products}
          handleItemRate={handleItemRate}
          toggleAnimation={toggleAnimation}
          status={undefined}
        />
      ) : (
        <Loader />
      )}
    </>
  );
};

export default ProductsStep;
