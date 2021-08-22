import * as React from 'react';

/* Types */
import { FlowRouteProps } from 'FlowBuilder/types';
import { EVENTS } from 'services/analyticsService';

/* Components */
import { FlowContext, FlowContextType } from 'FlowBuilder/FlowProvider';
import { ReactionsBlock } from 'Layouts/ReactionsBlock/ReactionsBlock';

/* Styles */
import { StyledFeedbackStep } from './styles';

const FeedbackStep: React.FC<FlowRouteProps> = React.memo(
  ({ onNext }: FlowRouteProps) => {
    const {
      actions: { trackEvent }
    } = React.useContext<FlowContextType>(FlowContext);

    const onNextClick = React.useCallback((rate, rateType) => {
      trackEvent({
        event: EVENTS.EXPERIENCE_FEEDBACK_REPLIED,
        properties: {
          rate,
          rateType
        }
      });
      onNext();
    }, []);
    return (
      <StyledFeedbackStep>
        <div className="title-block">
          <h3>StyleUp completed!</h3>
          <p className="body">
            How would you rate your overall satisfaction with Savvy?
          </p>
        </div>

        <ReactionsBlock handleNextClick={onNextClick} />
      </StyledFeedbackStep>
    );
  }
);

export default FeedbackStep;
