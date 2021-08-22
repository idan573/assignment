import * as React from 'react';

/* Components */
import { CreateProfileComponent } from 'features/CreateProfilePage/components/CreateProfileComponent';
import { FlowRouteProps } from 'FlowBuilder/types';
import { FlowContext, FlowContextType } from 'FlowBuilder/FlowProvider';
import { EVENTS } from 'services/analyticsService';

const CreateProfileStep: React.FC<FlowRouteProps> = React.memo(
  ({ onNext }: FlowRouteProps) => {
    const {
      state: {},
      actions: { trackEvent }
    } = React.useContext<FlowContextType>(FlowContext); 
    
    const onSubmit = React.useCallback(()=>{
      trackEvent({
        event: EVENTS.PROFILE_CREATED ,
        properties: {
          isFlow: true
        }
      })
      onNext();
    },[]);
    return <CreateProfileComponent onSubmit={onSubmit} />;
  }
);

export default CreateProfileStep;
