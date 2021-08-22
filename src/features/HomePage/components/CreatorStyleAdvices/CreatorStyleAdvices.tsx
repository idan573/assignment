import * as React from 'react';
import { useHistory } from 'react-router';
import { Button } from '@bit/scalez.savvy-ui.button';
import { FloatWrapper } from '@bit/scalez.savvy-ui.float-wrapper';
import { Modal } from '@bit/scalez.savvy-ui.modal';
import { ClickOutsideHandler } from '@bit/scalez.savvy-ui.click-outside-handler';

/* Analytics */
import { EVENTS } from 'services/analyticsService';

/* Types */
import { TaskDefinition } from 'App/types';

/* Components */
import { RootContext, RootContextType } from 'App/components';

/* Styles */
import { StyledModal, StyledClockIcon } from '../StyleAdvices/styles';
import {
  StyledStylistImage,
  StyledTaskImage,
  StyledRecommendedTaskImage,
  StyledRecommendedTaskBlock,
  StyledCreatorStyleAdvices
} from './styles';
import { authService } from 'services/authService';

type Props = {
  styleAdviceTasks: TaskDefinition[];
};

const CreatorStyleAdvices: React.FC<Props> = React.memo(
  ({ styleAdviceTasks = [] }: Props) => {
    const history = useHistory();

    const {
      state: { userData, homePageStylist },
      actions: { trackEvent }
    } = React.useContext<RootContextType>(RootContext);

    const [isStyleupsInfoModalActive, toggleStyleupsInfoModal] = React.useState<
      boolean
    >(false);

    const [isHaveActiveTaskModal, toggleIsHaveActiveTaskModal] = React.useState<
      boolean
    >(false);

    const [floatWrapperTask, setFloatWrapperTask] = React.useState<
      TaskDefinition
    >(null);

    React.useEffect(() => {
      if (styleAdviceTasks.length) {
        if (userData.tasksCount === 0) {
          const recommendedTask = styleAdviceTasks.find(
            task => task.isRecommended
          );

          setFloatWrapperTask(recommendedTask);
        }
      }
    }, [styleAdviceTasks]);

    const handleTaskClick = React.useCallback((task: TaskDefinition) => {
      if (userData?.isHaveActiveTask) {
        toggleIsHaveActiveTaskModal(true);
        return;
      }

      trackEvent({
        event: EVENTS.STYLE_ADVICE_CLICKED,
        properties: {
          taskName: task.taskName
        }
      });

      setFloatWrapperTask(task);
    }, []);

    const tasksCount = React.useMemo(() => {
      return userData?.subscriptionTaskCap - userData?.subscriptionTaskUsed >= 0
        ? userData?.subscriptionTaskCap - userData?.subscriptionTaskUsed
        : 0;
    }, [userData]);

    const styleupsInfoModalActions = React.useMemo(
      () => [
        {
          ['data-type']: 'secondary' as const,
          children: 'Back',
          onClick: () => toggleStyleupsInfoModal(false)
        }
      ],
      []
    );

    return (
      <>
        <StyledModal
          name="active-task-modal"
          render={isHaveActiveTaskModal}
          message={
            <>
              <StyledClockIcon />
              You have a StyleUp in progress. Check back in a bit!
            </>
          }
          onClickOutside={() => toggleIsHaveActiveTaskModal(false)}
        />

        <Modal
          name="styleups-modal"
          render={isStyleupsInfoModalActive}
          title="What are StyleUps?"
          message={
            <>
              StyleUps are used to request advice from your fashion creator.
              <br />
              <br />
              This counter shows how many StyleUps you have left this month.
            </>
          }
          actions={styleupsInfoModalActions}
          onClickOutside={() => toggleStyleupsInfoModal(false)}
        />

        <StyledCreatorStyleAdvices>
          <div className="stylist-block">
            <div className="top-content-wrapper">
              <StyledStylistImage src={homePageStylist.profilePicture} />

              {userData.subscribedToService && (
                <Button
                  data-type="secondary"
                  data-action-position="center-right"
                  onClick={() =>
                    history.push({
                      pathname: '/stylist-chat'
                    })
                  }
                >
                  Message Me
                </Button>
              )}

              <div
                className="styleups-block"
                onClick={() => toggleStyleupsInfoModal(true)}
              >
                <h2>{tasksCount}</h2>
                <p className="xsbody">Styleups</p>
              </div>
            </div>

            <h2>
              {homePageStylist.firstName} {homePageStylist.lastName}
            </h2>

            <p className="sbody">
              Hey {userData.firstName}, what look are you feeling today? Start a
              StyleUp below!
            </p>

            {!userData.subscribedToService && (
              <div className="buttons-block">
                <Button
                  data-type="secondary"
                  data-action="quoteBubble"
                  data-action-position="center-right"
                  onClick={() =>
                    history.push({
                      pathname: '/stylist-chat'
                    })
                  }
                >
                  Message Me
                </Button>

                <Button
                  data-type="secondary"
                  data-action-position="center"
                  onClick={() => {
                    if (!userData?.homePageStylist) {
                      authService.login();
                      //TODO: if user logged in match stylist
                      return;
                    }
                    history.push({
                      pathname: '/payment/pre-payment'
                    });
                  }}
                >
                  Join
                </Button>
              </div>
            )}
          </div>

          <div className="tasks-block">
            <div className="tasks-list">
              {styleAdviceTasks.map((task, key) => (
                <div
                  key={key}
                  className="task-card"
                  onClick={() => handleTaskClick(task)}
                >
                  <StyledTaskImage src={task.homepageImage} />

                  <div className="title-block">
                    <p className="body-bold">{task.taskTitle}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </StyledCreatorStyleAdvices>

        <FloatWrapper
          render={!!floatWrapperTask}
          order={1}
          type="inner"
          position="bottom"
          transition="slide-bottom"
          delay={500}
          onRest={(_, state) => state === 'leave' && setFloatWrapperTask(null)}
        >
          {hide => (
            <ClickOutsideHandler onClick={() => hide()}>
              <StyledRecommendedTaskBlock>
                <StyledRecommendedTaskImage
                  src={floatWrapperTask?.floatWrapperImage}
                />

                <Button
                  data-type="secondary"
                  data-size="extra-small"
                  data-form="circle"
                  data-action="cross"
                  data-action-position="center"
                  onClick={() => hide()}
                />

                <h4>{floatWrapperTask?.taskTitle}</h4>

                <p className="sbody">{floatWrapperTask?.shortDescription}</p>

                <Button
                  data-size="small"
                  data-action-position="center"
                  onClick={() => {
                    if (userData?.isHaveActiveTask) {
                      toggleIsHaveActiveTaskModal(true);
                      return;
                    }

                    history.push({
                      pathname: `/task-overview/${floatWrapperTask.taskName}`
                    });
                  }}
                >
                  Start
                </Button>
              </StyledRecommendedTaskBlock>
            </ClickOutsideHandler>
          )}
        </FloatWrapper>
      </>
    );
  }
);

export { CreatorStyleAdvices };
