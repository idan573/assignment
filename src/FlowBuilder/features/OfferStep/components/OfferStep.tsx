import * as React from 'react';

/* Components */
import { FlowRouteProps } from 'FlowBuilder/types';
import { FlowContext, FlowContextType } from 'FlowBuilder/FlowProvider';
import { FloatWrapper } from '@bit/scalez.savvy-ui.float-wrapper';
import { Button } from '@bit/scalez.savvy-ui.button';

/* Types */
import { EVENTS } from 'services/analyticsService';

/* Styles */
import {
  StyledOfferPage,
  StyledSubscriptionImage,
  StyleSavvyLogo
} from './styles';

/* assets */
import freeTaskGif from 'FlowBuilder/features/OfferStep/assets/free-task.gif';

const FeedbackStep: React.FC<FlowRouteProps> = React.memo(
  ({ onNext }: FlowRouteProps) => {
    const {
      actions: { trackEvent }
    } = React.useContext<FlowContextType>(FlowContext);

    const onNextClick = React.useCallback(() => {
      //TODO: Add relevant event

      /*trackEvent({
        event: EVENTS.EXPERIENCE_FEEDBACK_REPLIED,
        properties: {
          rate,
          rateType
        }
      });*/
      onNext();
    }, []);
    return (
      <>
        <StyledOfferPage>
          <div className="image-wrapper">
            <StyledSubscriptionImage />
          </div>
          <StyleSavvyLogo />
          <h1>Unlock your Personal Style</h1>
          <p>
            We want to offer you a free body analysis with one of our
            professional stylists. She will unlock the first step on your style
            journey.
          </p>
          <div className="offer-block">
            <p className="offer-top-frame">Special Offer</p>
            <div className="offer-title">
              <div className="dollar-ellipse">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="10"
                  height="16"
                  viewBox="0 0 10 16"
                  fill="none"
                >
                  <path
                    d="M5 1.4V14.6"
                    stroke="white"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M7.99999 3.8H3.49999C2.94304 3.8 2.4089 4.02125 2.01507 4.41508C1.62124 4.80891 1.39999 5.34305 1.39999 5.9C1.39999 6.45696 1.62124 6.9911 2.01507 7.38493C2.4089 7.77875 2.94304 8 3.49999 8H6.49999C7.05695 8 7.59109 8.22125 7.98492 8.61508C8.37874 9.00891 8.59999 9.54305 8.59999 10.1C8.59999 10.657 8.37874 11.1911 7.98492 11.5849C7.59109 11.9788 7.05695 12.2 6.49999 12.2H1.39999"
                    stroke="white"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
              <h4>FREE BODY ANALYSIS</h4>
            </div>

            <hr />
            <img src={freeTaskGif} />
          </div>
        </StyledOfferPage>
        <FloatWrapper position="bottom" transition="slide-bottom">
          <Button
            onClick={() => {
              onNextClick();
            }}
          >
            Claim Free Intro Session
          </Button>
        </FloatWrapper>
      </>
    );
  }
);

export default FeedbackStep;
