import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Button } from '@bit/scalez.savvy-ui.button';
import { FloatWrapper } from '@bit/scalez.savvy-ui.float-wrapper';

/* Services */
import { EVENTS } from 'services/analyticsService';

/* Components */
import { RootContext, RootContextType } from 'App/components';

/* Styles */
import {
  StyledTaskAwaitPage,
  StyledSuggestionImage,
  StyledStylistImage,
  StyledCardImage,
  StyledButtonsBlock
} from './styles';

/* Assets */
import feedImg from '../assets/feed.png';
import chatImg from '../assets/chat.png';
import rulesImg from '../assets/rules.png';

type Props = RouteComponentProps<{
  taskName: string;
}>;

const TaskAwaitPage: React.FC<Props> = React.memo(
  ({ match, history, location }: Props) => {
    const {
      state: { userData, homePageStylist },
      actions: { trackPage, trackEvent }
    } = React.useContext<RootContextType>(RootContext);

    React.useEffect(() => {
      trackPage({
        name: 'TaskAwaitPage'
      });
    }, []);

    const suggestionPageData = React.useMemo(() => {
      const num = userData.tasksCount % 3;

      if (num === 0) {
        return {
          title: 'Now, Check Out: The Outfeed',
          description:
            'Savvy matched you with style coach-curated looks based on your style profile.',
          image: feedImg,
          onClick: () => {
            trackEvent({ event: EVENTS.SUGGESTION_FEED_CLICKED });

            history.push({
              pathname: '/outfit-feed',
              search: location.search
            });
          }
        };
      }

      if (num === 1) {
        return {
          title: 'Forgot to mention something?',
          description:
            'Request an outfit or fill your style coach in on any missing details you thought of. She is always happy to hear from you!',
          image: chatImg,

          onClick: () => {
            history.push({
              pathname: '/stylist-chat',
              search: location.search
            });
          }
        };
      }

      if (num === 2) {
        return {
          title: 'Try Our Tips For Advice! ',
          description:
            'Get specialized tips created for women just like you. Heart items you like and add them to your closet for a tailored experience.',
          image: rulesImg,
          onClick: () => {
            trackEvent({ event: EVENTS.SUGGESTION_TIPS_CLICKED });

            history.push({
              pathname: '/free-rules-experience',
              search: location.search
            });
          }
        };
      }
    }, []);

    return (
      <>
        <StyledTaskAwaitPage>
          <Button
            className="back-button"
            data-type="secondary"
            data-size="small"
            data-form="circle"
            data-action="back"
            data-action-position="center"
            onClick={() => history.push({ pathname: '/homepage' })}
          />

          <div className="image-block">
            <StyledStylistImage src={homePageStylist.profilePicture} />

            <div className="status-label">
              <span className="sbody-bold">
                {homePageStylist.firstName || 'Your stylist'}
              </span>
            </div>
            <p className="body">Working on your request</p>
          </div>

          <hr />

          <div className="suggestion-block">
            <h3>{suggestionPageData.title}</h3>
            <StyledSuggestionImage src={suggestionPageData.image} />
            <p>{suggestionPageData.description}</p>
          </div>
        </StyledTaskAwaitPage>
        <FloatWrapper>
          <StyledButtonsBlock>
            <Button
              data-type="secondary"
              onClick={() =>
                history.push({
                  pathname: '/homepage'
                })
              }
            >
              Not Now
            </Button>
            <Button data-type="primary" onClick={suggestionPageData.onClick}>
              Try It!
            </Button>
          </StyledButtonsBlock>
        </FloatWrapper>
      </>
    );
  }
);

export default TaskAwaitPage;
