import * as React from 'react';

/* Components */
import { HowItWorksComponent } from 'features/HowItWorksPage/components/HowItWorksComponent';
import { FlowRouteProps } from 'FlowBuilder/types';

const HowItWorksStep: React.FC<FlowRouteProps> = React.memo(
  ({ onNext }: FlowRouteProps) => {
    return <HowItWorksComponent onClick={onNext} />;
  }
);

export default HowItWorksStep;
