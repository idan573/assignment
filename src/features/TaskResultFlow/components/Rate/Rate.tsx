import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import range from 'ramda/src/range';
import { Button } from '@bit/scalez.savvy-ui.button';
import { Textarea } from '@bit/scalez.savvy-ui.textarea';
import { useLazyRequest } from '@bit/scalez.savvy-ui.hooks';

/* Analytics */
import { EVENTS } from 'services/analyticsService';

/* Api */
import {
  GQLPublishStylistFeedbackVars,
  publishStylistFeedbackMutation
} from 'App/api/stylist/publishStylistFeedback';

/* Components */
import { RootContext, RootContextType } from 'App/components';

/* Styles */
import {
  StyledRatePage,
  StyledRatingWrapper,
  StyledFloatWrapper,
  StyledSpinner,
  StyledSavvyLogo
} from './styles';

type Props = RouteComponentProps<{ taskId: string }>;

const Rate: React.FC<Props> = ({ match, history, location }: Props) => {
  const {
    state: { userData, activeTaskResultData },
    actions: { trackPage, trackEvent }
  } = React.useContext<RootContextType>(RootContext);

  const [rate, setRate] = React.useState<number>(-1);
  const [userText, setUserText] = React.useState<string>();
  const [isSendClicked, setIsSendClicked] = React.useState<boolean>(false);

  React.useEffect(() => {
    trackPage({
      name: 'StyleUpsRatePage',
      properties: {
        taskId: activeTaskResultData.taskId,
        taskName: activeTaskResultData.taskName
      }
    });
  }, []);

  const [publishReview] = useLazyRequest<GQLPublishStylistFeedbackVars, void>(
    publishStylistFeedbackMutation,
    {
      onCompleted: () => {
        trackEvent({
          event: EVENTS.TASK_RATED,
          properties: {
            taskId: activeTaskResultData.taskId,
            taskName: activeTaskResultData.taskName,
            taskType: 'ONE_ON_ONE_RESPONSE'
          },
          callback: () => {
            if (rate <= 3) {
              history.push({
                pathname: `/task-result/stylist-replacement/${match.params.taskId}`,
                search: location.search
              });
              return;
            }

            /* Waiting for BE logic */
            /*
            if (!!activeTaskResultData?.nextTask) {
              history.push({
                pathname: `/task-result/suggestions/${match.params.taskId}`,
                search: location.search
              });
              return;
            }*/

            history.push({
              pathname: '/homepage',
              search: location.search
            });
          }
        });
      }
    }
  );

  const onSendClicked = React.useCallback(() => {
    setIsSendClicked(true);

    const {
      taskId,
      taskName,
      tier,
      threadId,
      taskType,
      stylist,
      user
    } = activeTaskResultData;

    publishReview({
      feedback: userText,
      rate,
      userId: userData?.userId,
      taskId,
      stylistId: stylist?.stylistId,
      taskName,
      threadId,
      tier,
      userName: user?.firstName,
      userProfileImage: user?.profilePicture,
      taskType
    });
  }, [userText, rate]);

  return (
    <>
      <StyledRatePage>
        <StyledSavvyLogo />

        <h2>How was this StyleUp?</h2>

        <StyledRatingWrapper>
          {range(1, 6).map(i => (
            <div
              key={i}
              className="rating-point"
              data-is-active={i <= rate}
              onClick={() => setRate(i)}
            />
          ))}
        </StyledRatingWrapper>

        <form>
          <Textarea
            inputMode="text"
            placeholder="Enter review"
            className="input-user-review"
            value={userText}
            maxLength={200}
            onChange={e => setUserText(e.target.value)}
          />
        </form>
      </StyledRatePage>

      <StyledFloatWrapper
        order={1}
        delay={500}
        position="bottom"
        transition="slide-bottom"
      >
        {isSendClicked ? (
          <StyledSpinner />
        ) : (
          <Button
            data-action="next"
            data-action-position="right"
            onClick={onSendClicked}
            disabled={rate === -1}
          >
            Send
          </Button>
        )}
      </StyledFloatWrapper>
    </>
  );
};

export default Rate;
