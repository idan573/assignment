import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Button } from '@bit/scalez.savvy-ui.button';
import { FloatWrapper } from '@bit/scalez.savvy-ui.float-wrapper';
import { Loader } from '@bit/scalez.savvy-ui.loader';
import { TaskListItem } from '@bit/scalez.savvy-ui.task-list-item';
import { useRequest } from '@bit/scalez.savvy-ui.hooks';
import { setQueryString } from '@bit/scalez.savvy-ui.utils';

/* Api */
import { GQLGetStylistVars, getStylistQuery } from 'App/api/stylist/getStylist';
import {
  GQLGetContentTaskVars,
  getContentTaskQuery
} from 'App/api/task/getContentTask';

/* Types */
import { Stylist, TaskDefinition } from 'App/types';

/* Components */
import { RootContext, RootContextType } from 'App/components';

/* Styles */
import {
  StyledButtonsBlock,
  StyledStylistImage,
  StyledTaskSuggestions
} from './styles';

type Props = RouteComponentProps<{ taskId: string }>;

const TaskSuggestions: React.FC<Props> = ({ history, location }: Props) => {
  const {
    state: { userData, activeTaskResultData },
    actions: { trackPage, setActiveTaskResultData }
  } = React.useContext<RootContextType>(RootContext);

  //TODO: add tracking events

  const { loading: loadingTaskDefinition, data: taskDefinition } = useRequest<
    GQLGetContentTaskVars,
    TaskDefinition
  >(getContentTaskQuery, {
    payload: {
      taskName: activeTaskResultData?.nextTask?.taskName
    },
    skip: !activeTaskResultData?.nextTask?.taskName
  });

  const { loading: loadingStylist, data: stylistData } = useRequest<
    GQLGetStylistVars,
    Stylist
  >(getStylistQuery, {
    payload: {
      stylistId: activeTaskResultData?.stylist?.stylistId
    },
    skip: !activeTaskResultData?.stylist?.stylistId
  });

  React.useEffect(() => {
    if (!!taskDefinition && taskDefinition?.taskName) {
      trackPage({
        name: 'TaskSuggestionsPage',
        properties: {
          taskName: taskDefinition?.taskName,
          taskId: taskDefinition?.id,
          stylistId: taskDefinition?.stylist?.stylistId
        }
      });
    }
  }, [taskDefinition]);

  const onSkipBtnClicked = React.useCallback(() => {
    history.push({
      pathname: '/homepage',
      search: location.search
    });
  }, []);

  const onNextButtonClicked = React.useCallback(() => {
    const search = setQueryString({
      userId: userData?.userId,
      stylistId: activeTaskResultData?.stylist?.stylistId ?? ''
    });

    history.push({
      pathname: `/task-overview/${activeTaskResultData?.nextTask?.taskName ??
        ''}`,
      search
    });
  }, []);

  return (
    <>
      {loadingStylist || loadingTaskDefinition ? (
        <Loader />
      ) : (
        <>
          <StyledTaskSuggestions onClick={onNextButtonClicked}>
            <StyledStylistImage src={stylistData?.profilePicture ?? ''} />
            <h3>{activeTaskResultData?.nextTask?.taskDescription}</h3>
            <TaskListItem
              className="task-item"
              data={{
                taskContext: {
                  image: taskDefinition?.taskImage,
                  title: taskDefinition?.taskTitle
                }
              }}
            />
          </StyledTaskSuggestions>

          <FloatWrapper>
            <StyledButtonsBlock>
              <Button data-type="secondary" onClick={onSkipBtnClicked}>
                Not Now
              </Button>
              <Button onClick={onNextButtonClicked}>Let's Do It!</Button>
            </StyledButtonsBlock>
          </FloatWrapper>
        </>
      )}
    </>
  );
};

export default TaskSuggestions;
