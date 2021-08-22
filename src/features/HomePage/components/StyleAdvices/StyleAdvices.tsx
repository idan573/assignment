import * as React from 'react';
import { useHistory } from 'react-router';
import {
  TaskMessage,
  MESSAGE_CONTENT_TYPES
} from '@bit/scalez.savvy-ui.task-message';
import { savvyLogo } from '@bit/scalez.savvy-ui.svg';

/* Analytics */
import { EVENTS } from 'services/analyticsService';

/* Types */
import { TaskDefinition } from 'App/types';

/* Components */
import { RootContext, RootContextType } from 'App/components';

/* Styles */
import {
  StyledClockIcon,
  StyledStyleAdvices,
  StyledTaskImage,
  StyledModal
} from './styles';

interface Props {
  styleAdviceTasks: TaskDefinition[];
}

const StyleAdvices: React.FC<Props> = React.memo(
  ({ styleAdviceTasks = [] }: Props) => {
    const history = useHistory();

    const {
      state: { userData, homePageStylist },
      actions: { trackEvent }
    } = React.useContext<RootContextType>(RootContext);

    const [isHaveActiveTask, toggleIsHaveActiveTask] = React.useState<boolean>(
      false
    );

    const handleCategoryClick = React.useCallback((taskName: string) => {
      if (userData?.isHaveActiveTask) {
        toggleIsHaveActiveTask(true);
        return;
      }
      trackEvent({
        event: EVENTS.STYLE_ADVICE_CLICKED,
        properties: {
          taskName
        }
      });

      history.push({
        pathname: `/task-overview/${taskName}`
      });
    }, []);

    return (
      <>
        <StyledModal
          name="active-task-modal"
          render={isHaveActiveTask}
          message={
            <>
              <StyledClockIcon />
              Your stylist is currently still working on a task. Check back in a
              bit!
            </>
          }
          onClickOutside={() => toggleIsHaveActiveTask(false)}
        />

        <StyledStyleAdvices>
          <TaskMessage
            info={
              homePageStylist
                ? {
                    senderName: homePageStylist.firstName,
                    senderImage: homePageStylist.profilePicture
                  }
                : {
                    senderImage: savvyLogo({ scale: 0.45 }),
                    senderName: 'Savvy'
                  }
            }
            content={[
              {
                type: MESSAGE_CONTENT_TYPES.TEXT,
                data: `Hey ${userData?.firstName ||
                  'beautiful'}, need quick, one-off style advice from your style coach (me!)? Select a style session below!`
              }
            ]}
          />

          <div className="tasks-grid">
            {styleAdviceTasks.map((task, key, array) => {
              return (
                <React.Fragment key={key}>
                  <div
                    className="task-block"
                    onClick={() => handleCategoryClick(task.taskName)}
                  >
                    <StyledTaskImage src={task.taskImage} />

                    <p className="task-name body-bold">{task.taskTitle}</p>
                  </div>

                  {/* render if last task has odd index, just for the symmetry */}
                  {key === array.length - 1 && array.length % 2 === 1 && (
                    <div className="task-block plug">
                      <p className="task-name body-bold">Coming Soon</p>
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </StyledStyleAdvices>
      </>
    );
  }
);

export { StyleAdvices };
