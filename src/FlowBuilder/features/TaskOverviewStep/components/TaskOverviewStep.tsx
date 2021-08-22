import * as React from 'react';
import { Loader } from '@bit/scalez.savvy-ui.loader';
import { useLazyRequest } from '@bit/scalez.savvy-ui.hooks';

/* Api */
import {
  getContentTaskQuery,
  GQLGetContentTaskVars
} from 'App/api/task/getContentTask';

/* Types */
import { TaskDefinition } from 'App/types';
import { EVENTS } from 'services/analyticsService';
import { FlowRouteProps } from 'FlowBuilder/types';

/* Components */
import { TaskOverviewComponent } from 'features/TaskOverviewPage/components/TaskOverviewComponent';
import { FlowContext, FlowContextType } from 'FlowBuilder/FlowProvider';

interface Props extends FlowRouteProps {
  taskName: string;
}
const TaskOverviewStep: React.FC<Props> = React.memo(
  ({ onNext, taskName }: Props) => {
    const {
      state: {},
      actions: { trackEvent }
    } = React.useContext<FlowContextType>(FlowContext);

    const onClick = React.useCallback(() => {
      trackEvent({
        event: EVENTS.TASK_OVERVIEW_CLICKED,
        properties: {
          isFlow: true
        }
      });
      onNext();
    }, []);

    const [
      getTaskContent,
      { loading: loadingTaskDefinition, data: taskDefinition }
    ] = useLazyRequest<GQLGetContentTaskVars, TaskDefinition>(
      getContentTaskQuery
    );

    React.useEffect(() => {
      getTaskContent({
        taskName
      });
    }, []);

    return !loadingTaskDefinition ? (
      <Loader />
    ) : (
      <TaskOverviewComponent
        isBlocked={false}
        isNext={true}
        onClick={onClick}
        taskContext={{
          title: taskDefinition?.taskTitle,
          image: taskDefinition?.taskImage,
          isBlocked: false,
          description: taskDefinition?.taskDescription
        }}
      />
    );
  }
);

export default TaskOverviewStep;
