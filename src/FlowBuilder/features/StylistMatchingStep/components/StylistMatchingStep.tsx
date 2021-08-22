import * as React from 'react';

/* Types */
import { EVENTS } from 'services/analyticsService';
import { FlowRouteProps } from 'FlowBuilder/types';

/* Components */
import { StylistMatchingComponent } from 'features/StylistMatchingPage/components/StylistMatchingComponent';
import { FlowContext, FlowContextType } from 'FlowBuilder/FlowProvider';

const StylistMatchingStep: React.FC<FlowRouteProps> = React.memo(
  ({ onNext, currentFlowState }: FlowRouteProps) => {
    const {
      actions: { trackEvent }
    } = React.useContext<FlowContextType>(FlowContext);

    const oneChoose = React.useCallback(() => {
      trackEvent({
        event: EVENTS.STYLIST_SELECTED,
        properties: {
          isFlow: true
        }
      });

      onNext();
    }, []);

    return (
      <StylistMatchingComponent
        onChooseStylist={oneChoose}
        onChooseOtherStylist={onNext}
      />
    );
  }
);

export default StylistMatchingStep;
