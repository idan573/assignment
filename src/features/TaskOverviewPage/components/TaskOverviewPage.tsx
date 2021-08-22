import * as React from 'react';
import { RouteComponentProps, useLocation } from 'react-router-dom';
import TopBarProgress from 'react-topbar-progress-indicator';

import { Modal } from '@bit/scalez.savvy-ui.modal';
import { Error } from '@bit/scalez.savvy-ui.error';
import { useLazyRequest, useRequest } from '@bit/scalez.savvy-ui.hooks';
import { setQueryString } from '@bit/scalez.savvy-ui.utils';

/* Analytics */
import { EVENTS } from 'services/analyticsService';

/* Api */
import { GQLGetStyledVars, getStyledMutation } from 'App/api/getStyled';
import {
  GQLGetContentTaskVars,
  getContentTaskQuery
} from 'App/api/task/getContentTask';
import {
  GQLPutInitiatePaymentVars,
  putInitiatePaymentMutation
} from 'App/api/putInitiatePayment';
import { GQLStartStepVars, startStepMutation } from 'App/api/journey/startStep';
import { getUserQuery, GQLGetUserVars } from 'App/api/user/getUser';
import { getStepQuery, GQLGetStepVars } from 'App/api/journey/getStep';
import {
  getPlanByExpertIdChargebeeQuery,
  GQLGetPlanByExpertIdChargebeeVars
} from 'App/api/chargebee/getPlanByExpertId';

/* Types */
import {
  ChargebeePaymentPlan,
  CLIENT_TYPE,
  Step,
  STYLIST_TIER,
  TaskDefinition,
  User
} from 'App/types';
import { FLOW_NAMES } from 'FlowBuilder/types';

/* Components */
import { RootContext, RootContextType } from 'App/components';
import { TaskOverviewComponent } from './TaskOverviewComponent';

type LocationState = {
  isStyleDisabled?: boolean;
  taskName?: string;
};

type Props = RouteComponentProps<
  {
    taskName: string;
  },
  any,
  LocationState
>;

export enum TASK_START_TYPE {
  RANDOMIZE = 'Randomize',
  SELECTION = 'Selection',
  EXACT = 'Exact'
}

const TaskOverviewPage: React.FC<Props> = React.memo(
  ({ match: { params }, history, location }: Props) => {
    const { stepName } = React.useMemo(() => {
      const searchParams = new URLSearchParams(location.search);
      return {
        stepName: searchParams.get('stepName')
      };
    }, []);

    const { state: locationState } = useLocation<{
      isStyleDisabled: boolean;
    }>();

    const {
      state: {
        isMobileApp,
        userData,
        isUserHasAllPersonalInfo,
        isAutomated,
        isAbTesting,
        homePageStylist
      },
      actions: { trackPage, trackEvent, setActiveTaskData, setPartialUserData }
    } = React.useContext<RootContextType>(RootContext);

    const setLocationSearch = React.useCallback(() => {
      const searchParams = new URLSearchParams(location.search);
      const stepName = searchParams.get('stepName');
      const isSourcePrivateThread =
        searchParams.get('isSourcePrivateThread') === 'true';

      if (!!isSourcePrivateThread) {
        return setQueryString({
          isSourcePrivateThread
        });
      }

      if (!stepName || stepName === 'none') {
        return location.search;
      }

      return setQueryString({
        stepName
      });
    }, []);

    const [isErrorActive, toggleError] = React.useState<boolean>(false);

    const [isFreeTaskModalActive, toggleFreeTaskModal] = React.useState<
      boolean
    >(false);

    const [
      isStylistVactionModalActive,
      toggleStylistVacationModal
    ] = React.useState<boolean>(
      homePageStylist?.stylistTier === STYLIST_TIER.VACATION
    );

    const [isTaskCapacityModalActive, toggleTaskCapacityModal] = React.useState<
      boolean
    >(false);

    const [getStyled] = useLazyRequest<GQLGetStyledVars, string>(
      getStyledMutation,
      {
        onCompleted: taskId => {
          const variables = {
            stepName,
            userId: userData?.userId,
            isRedoStep: false,
            taskId
          };

          startStep(variables);

          history.push({
            pathname: '/homepage',
            search: location.search
          });
        }
      }
    );

    const [startStep] = useLazyRequest<GQLStartStepVars, void>(
      startStepMutation
    );

    const { loading: loadingGetStep, data: stepInfo } = useRequest<
      GQLGetStepVars,
      Step
    >(getStepQuery, {
      payload: {
        stepName
      },
      skip: !stepName
    });

    useRequest<GQLGetUserVars, User>(getUserQuery, {
      payload: {
        userId: userData?.userId,
        isAddUploadImages: true
      },
      onCompleted: user => {
        setPartialUserData(user);
      }
    });

    const { data: plan } = useRequest<
      GQLGetPlanByExpertIdChargebeeVars,
      ChargebeePaymentPlan
    >(getPlanByExpertIdChargebeeQuery, {
      payload: {
        userId: userData?.homePageStylist
      },
      skip: !userData?.homePageStylist
    });

    const [putInitiatePayment] = useLazyRequest<
      GQLPutInitiatePaymentVars,
      void
    >(putInitiatePaymentMutation);

    const { loading: loadingTaskDefinition, data: taskDefinition } = useRequest<
      GQLGetContentTaskVars,
      TaskDefinition
    >(getContentTaskQuery, {
      payload: {
        taskName: params.taskName
      }
    });

    /*
    const isHaveActiveTaskOrBlocked = React.useMemo(() => {
      if (locationState?.isStyleDisabled) {
        return false;
      }
      if (userData?.isHaveActiveTask) {
        return true;
      }
      if (taskDefinition?.isBlocked) {
        return true;
      }
      return false;
    }, [userData, taskDefinition]); */

    const isNeedPayment = React.useMemo(() => {
      if (userData.subscribedToService) {
        return false;
      }

      if (!!plan?.freeQuantity && !userData?.tasksCount) {
        return false;
      }

      if (!stepName) {
        return true;
      }

      if (!userData?.tasksCount && isMobileApp) {
        return false;
      }

      if (
        !userData?.tasksCount &&
        userData?.doneUIFlows?.includes(FLOW_NAMES.MESSENGER_FREE_TASK)
      ) {
        return false;
      }

      if (!userData.tasksCount) {
        return true;
      }

      return !stepInfo?.isFree;
    }, [userData, stepInfo, plan]);

    React.useEffect(() => {
      if (!!taskDefinition) {
        trackPage({
          name: 'TaskOverviewPage',
          properties: {
            taskName: params.taskName,
            taskId: taskDefinition.id,
            stylistId: taskDefinition?.stylist?.stylistId
          }
        });
      }
    }, [taskDefinition]);

    const freeFlowRedirect = React.useCallback(
      (selectedStylist: string) => {
        console.log('free flow');

        if (!selectedStylist) {
          /* Redirect to stylist matching */
          trackEvent({
            event: EVENTS.TASK_OVERVIEW_CLICKED,
            properties: {
              component: 'TaskOverviewPage',
              startType: TASK_START_TYPE.SELECTION,
              taskName: params.taskName,
              isChatUI: !!taskDefinition?.forms
            },
            callback: () =>
              history.push({
                pathname: `/stylist-matching/${params.taskName}`,
                search: location.search,
                state: {
                  taskName: params.taskName
                }
              })
          });
          return;
        }

        /* Task has form: Redirect to chat */
        if (taskDefinition?.forms) {
          history.push({
            pathname: `/task-chat/${params.taskName}`,
            search: setLocationSearch()
          });
          return;
        }

        /* Has no questions form (getStyled -> /homepage) */
        const variables: GQLGetStyledVars = {
          userId: userData?.userId,
          stylistId: selectedStylist,
          taskName: params.taskName,
          taskType: taskDefinition.taskType,
          tier: taskDefinition.tier,
          mustUseChosenStylist: userData?.clientType === 'follower'
        };

        trackEvent({
          event: EVENTS.TASK_OVERVIEW_CLICKED,
          properties: {
            isChatUI: false,
            component: 'TaskOverviewPage',
            taskName: params.taskName,
            startType: TASK_START_TYPE.EXACT
          }
        });

        /* Get Styled if user already subscribed and task has no form */
        trackEvent({
          event: EVENTS.TASK_STARTED,
          properties: {
            isChatUI: false,
            component: 'TaskOverviewPage',
            ...variables
          },
          callback: () => {
            getStyled(variables);
          }
        });
      },
      [taskDefinition, userData, isUserHasAllPersonalInfo]
    );

    const paymentRedirect = React.useCallback(
      (selectedStylist: string) => {
        console.log('payment flow');

        putInitiatePayment({
          userId: userData?.userId,
          initiatePayment: {
            stylistId: selectedStylist,
            taskName: params.taskName,
            taskType: taskDefinition.taskType,
            tier: taskDefinition.tier,
            mustUseChosenStylist: userData?.clientType === 'follower',
            stepName
          }
        });

        trackEvent({
          event: EVENTS.TASK_OVERVIEW_CLICKED,
          properties: {
            isChatUI: !!taskDefinition?.forms,
            component: 'TaskOverviewPage',
            taskName: params.taskName,
            startType: TASK_START_TYPE.EXACT
          },
          callback: () => {
            if (userData?.clientType === CLIENT_TYPE.FOLLOWER) {
              trackEvent({
                event: EVENTS.PAYMENT_STARTED,
                properties: {
                  component: 'TaskOverviewPage',
                  planId: plan?.id
                }
              });
              history.push({
                pathname: !!userData?.tasksCount
                  ? '/payment/chargebee'
                  : '/payment/pre-payment',
                search: location.search,
                state: {
                  taskName: params.taskName
                }
              });

              return;
            }

            history.push({
              pathname: '/payment/trial',
              search: location.search,
              state: {
                taskName: params.taskName
              }
            });
          }
        });
      },
      [userData, taskDefinition]
    );

    const handleNextClick = React.useCallback(() => {
      if (!userData?.userId) {
        toggleError(true);
        return;
      }

      /* Save task in root context */
      setActiveTaskData(taskDefinition);

      if (isAutomated) {
        history.push({
          pathname: '/onboarding',
          search: location.search
        });
        return;
      }

      if (!isNeedPayment) {
        if (
          !!userData?.tasksCount &&
          userData?.subscriptionTaskCap - userData?.subscriptionTaskUsed <= 0
        ) {
          toggleTaskCapacityModal(true);
          return;
        }

        freeFlowRedirect(userData?.homePageStylist);
        return;
      }

      if (
        userData?.tasksCount === 0 &&
        plan?.freeQuantity !== 0 &&
        !isFreeTaskModalActive
      ) {
        toggleFreeTaskModal(true);
        return;
      }

      paymentRedirect(userData?.homePageStylist);
    }, [taskDefinition, userData, plan, isFreeTaskModalActive]);

    const freeTaskModalActions = React.useMemo(
      () => [
        {
          ['data-type']: 'secondary' as const,
          children: 'Cancel',
          onClick: () => toggleFreeTaskModal(false)
        },
        {
          ['data-type']: 'primary' as const,
          children: 'Start',
          onClick: handleNextClick
        }
      ],
      []
    );

    const stylistVacationModalActions = React.useMemo(
      () => [
        {
          ['data-type']: 'secondary' as const,
          children: 'Switch Stylist',
          onClick: () =>
            history.push({
              pathname: '/stylist-list',
              search: location.search
            })
        },
        {
          ['data-type']: 'primary' as const,
          children: 'Wait',
          onClick: () => toggleStylistVacationModal(false)
        }
      ],
      []
    );

    const taskCapacityModalActions = React.useMemo(
      () => [
        {
          ['data-type']: 'primary' as const,
          children: 'Ok',
          onClick: () => toggleTaskCapacityModal(false)
        }
      ],
      []
    );

    return (
      <>
        <Error render={isErrorActive}>Error: no user connected</Error>

        {loadingTaskDefinition && <TopBarProgress />}

        <Modal
          name="free-task-modal"
          render={isFreeTaskModalActive}
          title="Try It Out! 🎉"
          message="I’ll be happy to offer you 1 free StyleUp! Ready to start?"
          actions={freeTaskModalActions}
          onClickOutside={() => toggleFreeTaskModal(false)}
        />

        <Modal
          name="stylist-vacation-modal"
          render={isStylistVactionModalActive}
          title="Looks like your stylist is on vacation!"
          message="Want to wait for her? She can help you when she returns."
          actions={stylistVacationModalActions}
          onClickOutside={() => toggleStylistVacationModal(false)}
        />

        <Modal
          name="task-capacity-modal"
          render={isTaskCapacityModalActive}
          title="Task Limit Exceeded"
          message="Hey, You have reached to your tasks monthly capacity. please come back in a bit or upgrade your plan"
          actions={taskCapacityModalActions}
          onClickOutside={() => toggleTaskCapacityModal(false)}
        />

        <TaskOverviewComponent
          isBlocked={false}
          isNext={
            !loadingTaskDefinition &&
            !!taskDefinition &&
            !locationState?.isStyleDisabled
          }
          onClick={handleNextClick}
          taskContext={{
            title: taskDefinition?.taskTitle,
            image: taskDefinition?.taskImage,
            description: taskDefinition?.taskDescription,
            isBlocked: taskDefinition?.isBlocked
          }}
        />
      </>
    );
  }
);

export default TaskOverviewPage;
