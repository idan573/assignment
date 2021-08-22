import * as React from 'react';
import { useHistory } from 'react-router';
import { useRequest } from '@bit/scalez.savvy-ui.hooks';
import { setPlaceholder } from '@bit/scalez.savvy-ui.utils';
import { savvyLogo } from '@bit/scalez.savvy-ui.svg';

/* Tyoes */
import { TaskDefinition } from 'App/types';
import { EVENTS } from 'services/analyticsService';

/* Components */
import { RootContext, RootContextType } from 'App/components';

/* Styles */
import {
  StyledStyleChallenges,
  StyledChallengeImage,
  StyledRecommendedIcon,
  StyledModal,
  StyledClockIcon
} from './styles';

type Props = {
  isBlocked: boolean;
  isLoadingStyleChallenges: boolean;
  styleChallenges: TaskDefinition[];
};

const tasksPlaceholder = Array(3)
  .fill({
    taskContext: {
      image: savvyLogo({ stroke: 'var(--bluePrimary)', scale: 0.2 })
    },
    isRecommended: false
  })
  .map((item, i) => ({
    ...item,
    taskContext: {
      ...item.taskContext,
      title: setPlaceholder(9617, 4, 10)
    }
  })) as TaskDefinition[];

const StyleChallenges: React.FC<Props> = ({
  isBlocked,
  isLoadingStyleChallenges,
  styleChallenges = []
}: Props) => {
  const history = useHistory();

  const {
    state: { userData },
    actions: { trackEvent }
  } = React.useContext<RootContextType>(RootContext);

  const [isBlockedTaskActive, toggleBlockedTaskActive] = React.useState<
    boolean
  >(false);

  const handleTaskClick = React.useCallback((task: TaskDefinition) => {
    if (!!userData?.isHaveActiveTask) {
      toggleBlockedTaskActive(true);
      return;
    }

    trackEvent({
      event: EVENTS.STYLE_ADVICE_CLICKED,
      properties: {
        taskName: task.taskName
      }
    });

    history.push({
      pathname: `/task-overview/${task.taskName}`
    });
  }, []);

  return (
    <>
      <StyledModal
        name="blocked-task-modal"
        render={isBlockedTaskActive}
        message={
          <>
            <StyledClockIcon />
            Your stylist is currently still working on a task. Check back in a
            bit!
          </>
        }
        onClickOutside={() => toggleBlockedTaskActive(false)}
      />
      <StyledStyleChallenges>
        <p className="await-description sbody-bold">While You Wait</p>
        <h3>My Style Challenges</h3>
        <p className="description sbody">
          Practice makes perfect: Style Challenges are a way of taking what
          you’ve learned to the next level. Give these quick, fun challenges a
          try!
        </p>

        <div
          className="challenges-list"
          data-is-loading={isLoadingStyleChallenges}
          data-is-blocked={isBlocked}
        >
          {(isLoadingStyleChallenges ? tasksPlaceholder : styleChallenges)?.map(
            (task, key) => (
              <div
                key={key}
                className="challenge-item"
                onClick={() => handleTaskClick(task)}
              >
                <div
                  className="image-wrapper"
                  data-is-recommended={task.isRecommended}
                >
                  <StyledChallengeImage src={task.taskImage} />
                </div>

                <p className="body-bold">{task.taskTitle}</p>

                {task.isRecommended && (
                  <>
                    <StyledRecommendedIcon />
                    <p className="recommended-label body-bold">Recommended</p>
                  </>
                )}
              </div>
            )
          )}
        </div>
      </StyledStyleChallenges>
    </>
  );
};
export { StyleChallenges };
