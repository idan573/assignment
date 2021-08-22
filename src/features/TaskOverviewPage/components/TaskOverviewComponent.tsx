import * as React from 'react';
import { Button } from '@bit/scalez.savvy-ui.button';
import { FloatWrapper } from '@bit/scalez.savvy-ui.float-wrapper';
import { Notification } from '@bit/scalez.savvy-ui.notification';
import { TaskOverview as TaskOverviewUI } from '@bit/scalez.savvy-ui.task-overview';
import { useNotification } from '@bit/scalez.savvy-ui.hooks';

/* Styles */
import { StyledTaskOverview, StyledClockIcon } from './styles';

interface Props {
  taskContext: {
    title: string;
    image: string;
    description: string;
    isBlocked: boolean;
  };
  isBlocked: boolean;
  isNext: boolean;
  onClick: () => void;
}

export const TaskOverviewComponent: React.FC<Props> = React.memo(
  ({ isBlocked, isNext, taskContext, onClick }: Props) => {
    const [isNotificationShown, toggleNotification] = useNotification({
      delay: 4000
    });

    React.useEffect(() => {
      //TODO: Remove if we are going to use blocking from the homepage
      if (isBlocked) {
        toggleNotification(true);
      }
    }, []);

    return (
      <>
        <Notification render={isNotificationShown}>
          <>
            <StyledClockIcon />
            {!taskContext?.isBlocked
              ? 'Your stylist is working on your current style request. Please wait for her response'
              : 'You must complete Part 1 of your style journey before moving on!'}
          </>
        </Notification>

        {!!taskContext && (
          <StyledTaskOverview>
            <TaskOverviewUI data={{ taskContext }} />
          </StyledTaskOverview>
        )}

        <FloatWrapper
          order={1}
          delay={500}
          position="bottom"
          transition="slide-bottom"
          render={isNext}
        >
          <Button
            data-action="next"
            data-action-position="right"
            onClick={onClick}
            disabled={isBlocked}
          >
            Start
          </Button>
        </FloatWrapper>
      </>
    );
  }
);
