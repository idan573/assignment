import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { useLazyRequest, useRequest } from '@bit/scalez.savvy-ui.hooks';

/* Core */
import { isMobileApp } from 'core/utils';

/* Analytics */
import { EVENTS } from 'services/analyticsService';

/* Api */
import {
  GQLGetContentTaskVars,
  getContentTaskQuery
} from 'App/api/task/getContentTask';
import {
  GQLPublishTaskVars,
  publishTaskMutation
} from 'App/api/task/publishTask';
import { GQLStartStepVars, startStepMutation } from 'App/api/journey/startStep';

/* Types */
import { TaskDefinition } from 'App/types';
import { FORM_ACTIONS } from 'App/api/serveForm';

/* Components */
import { RootContext, RootContextType } from 'App/components';
import { ChatPage } from './ChatPage';

export type Props = RouteComponentProps<{
  taskName: string;
}>;

const ChatPageTask: React.FC<Props> = React.memo(
  ({ match: { params }, history, location }: Props) => {
    const {
      stepName,
      isSourcePrivateThread,
      isJourneyChat
    } = React.useMemo(() => {
      const searchParams = new URLSearchParams(location.search);
      return {
        stepName: searchParams.get('stepName'),
        isSourcePrivateThread:
          searchParams.get('isSourcePrivateThread') === 'true',
        isJourneyChat: !!searchParams.get('stepName')
      };
    }, []);

    const {
      state: { userData, isAutomated, isAbTesting },
      actions: { trackPage, trackEvent, setUserBlockTask }
    } = React.useContext<RootContextType>(RootContext);

    const [isNextButtonActive, toggleNextButton] = React.useState<boolean>(
      false
    );

    const { loading: loadingTaskDefinition, data: taskDefinition } = useRequest<
      GQLGetContentTaskVars,
      TaskDefinition
    >(getContentTaskQuery, {
      payload: {
        taskName: params.taskName
      }
    });

    const [publishTask, { loading: publishTaskLoading }] = useLazyRequest<
      GQLPublishTaskVars,
      any
    >(publishTaskMutation, {
      onCompleted: (task: any) => {
        setUserBlockTask();

        toggleNextButton(true);

        /* 
          Start step only for Journey tasks
          Do not start step for StyleAdvice tasks
        */
        if (isJourneyChat) {
          handleStartStep({
            taskId: task?.split(new RegExp(/([a-zA-Z0-9-]+)/))[3] ?? ' '
          });
        }
      }
    });

    const [startStep, { loading: startStepLoading }] = useLazyRequest<
      GQLStartStepVars,
      void
    >(startStepMutation);

    React.useEffect(() => {
      trackPage({
        name: 'ChatPageTask'
      });
    }, []);

    const handleStartStep = React.useCallback(
      (vars: Partial<GQLStartStepVars>) => {
        const variables: GQLStartStepVars = {
          userId: userData.userId,
          stepName,
          isRedoStep: false,
          ...(vars as GQLStartStepVars)
        };

        startStep(variables);

        trackEvent({
          event: EVENTS.JOURNEY_START_STEP,
          properties: variables
        });

        trackEvent({
          event: `${EVENTS.JOURNEY_START_STEP}_${stepName}`,
          properties: variables
        });
      },
      []
    );

    const handlePublishTask = React.useCallback(() => {
      const variables = {
        userId: userData?.userId,
        stylistId: userData?.homePageStylist,
        taskName: taskDefinition?.taskName,
        taskType: taskDefinition?.taskType,
        tier: isAutomated ? 'AUTOMATED' : taskDefinition?.tier,
        mustUseChosenStylist: userData?.clientType === 'follower',
        stepName,
        isSourcePrivateThread
      };

      trackEvent({
        event: EVENTS.TASK_STARTED,
        properties: {
          component: 'ChatPageTask',
          ...variables
        },
        callback: () => {
          publishTask(variables);
        }
      });
    }, [taskDefinition]);

    const handleOnNext = React.useCallback((formActions: FORM_ACTIONS[]) => {
      /* AB Test */
      if (isAbTesting && isAutomated && !userData?.phoneNumber) {
        switch (formActions?.[0]) {
          case FORM_ACTIONS.DOWNLOAD:
            history.push({
              pathname: '/phone-form',
              state: {
                action: isMobileApp()
                  ? FORM_ACTIONS.DOWNLOAD
                  : FORM_ACTIONS.SUGGEST
              }
            });
            return;
          case FORM_ACTIONS.SUGGEST:
            history.push({
              pathname: '/phone-form',
              state: { action: FORM_ACTIONS.SUGGEST }
            });
            return;
          default:
            history.push({
              pathname: '/homepage'
            });
            return;
        }
      }

      switch (formActions?.[0]) {
        case FORM_ACTIONS.DOWNLOAD:
          history.push({
            pathname: isMobileApp() ? '/task-await' : '/download',
            search: location.search
          });
          break;
        case FORM_ACTIONS.SUGGEST:
          history.push({
            pathname: '/task-await',
            search: location.search
          });
          break;
        default:
          history.push({
            pathname: '/homepage'
          });
      }
    }, []);

    return (
      <ChatPage
        startFormVariables={{
          userId: userData.userId,
          forms: taskDefinition?.forms,
          taskName: params?.taskName,
          stepName
        }}
        loading={
          loadingTaskDefinition || publishTaskLoading || startStepLoading
        }
        showNextButton={isNextButtonActive}
        onFormEnd={handlePublishTask}
        onFormSkip={() => {
          handlePublishTask();

          history.push({
            pathname: '/homepage'
          });
        }}
        onNext={handleOnNext}
      />
    );
  }
);

export default ChatPageTask;
