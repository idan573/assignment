import * as React from 'react';

/* Types */
import { Stylist } from 'App/types';

/* Components */
import { StylistListComponent } from 'features/StylistListPage/components/StylistListComponent';
import { FlowRouteProps } from 'FlowBuilder/types';
import { FlowContextType, FlowContext } from 'FlowBuilder/FlowProvider';

const ChooseStylistStep: React.FC<FlowRouteProps> = React.memo(
  ({ onNext }: FlowRouteProps) => {
    const {
      actions: { setFlowState }
    } = React.useContext<FlowContextType>(FlowContext);

    const handleChooseStylist = React.useCallback((stylist: Stylist) => {
      setFlowState({ stylistId: stylist.stylistId });
      onNext();
    }, []);

    return <StylistListComponent onStylistClick={handleChooseStylist} />;
  }
);

export default ChooseStylistStep;
