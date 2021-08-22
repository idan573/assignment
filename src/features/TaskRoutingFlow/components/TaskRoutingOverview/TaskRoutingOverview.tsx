import React from 'react';
import { RootContextType, RootContext } from 'App/components';

/* Api */
import { RouteComponentProps } from 'react-router';
import { getUserQuery, GQLGetUserVars } from 'App/api/user/getUser';
import { useRequest } from '@bit/scalez.savvy-ui.hooks';

/* Components */
import { TaskOverviewComponent } from 'features/TaskOverviewPage/components/TaskOverviewComponent';
import { Loader } from '@bit/scalez.savvy-ui.loader';
import { User } from 'App/types';

type Props = RouteComponentProps<{ stepName: string }>;

const TaskRoutingOverview: React.FC<Props> = ({ history }: Props) => {
  const {
    state: {
      userData,
      journeyInfo: { activeStepInfo }
    },
    actions: { setPartialUserData }
  } = React.useContext<RootContextType>(RootContext);

  useRequest<GQLGetUserVars, User>(getUserQuery, {
    payload: {
      userId: userData?.userId,
      isAddUploadImages: true
    },
    onCompleted: user => {
      setPartialUserData(user);
    }
  });

  const onClick = React.useCallback(() => {
    if (!activeStepInfo.routes?.length) {
      history.push({ pathname: '/homepage' });
      return;
    }
    history.push({
      pathname: `/task-routing-step/categories/${activeStepInfo?.stepName}`,
      search: location.search
    });
  }, [activeStepInfo]);

  const isHaveActiveTaskOrBlocked = React.useMemo(() => {
    if (userData?.isHaveActiveJourneyTask) {
      return true;
    }

    return false;
  }, [userData]);

  const taskContext = React.useMemo(() => {
    return {
      title: activeStepInfo?.title ?? '',
      image: activeStepInfo?.image ?? '',
      description: activeStepInfo?.description ?? '',
      isBlocked: false
    };
  }, [activeStepInfo]);

  return (
    <>
      {!activeStepInfo ? (
        <Loader />
      ) : (
        <TaskOverviewComponent
          isBlocked={isHaveActiveTaskOrBlocked}
          isNext={!!activeStepInfo?.routes?.length}
          onClick={onClick}
          taskContext={taskContext}
        />
      )}
    </>
  );
};

export default TaskRoutingOverview;
