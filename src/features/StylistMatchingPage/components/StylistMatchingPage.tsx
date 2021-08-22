import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { useRequest } from '@bit/scalez.savvy-ui.hooks';

/* Api */
import {
  GQLGetContentTaskVars,
  getContentTaskQuery
} from 'App/api/task/getContentTask';

/* Types */
import { TaskDefinition } from 'App/types';

/* Components */
import { RootContext, RootContextType } from 'App/components';
import { StylistMatchingComponent } from './StylistMatchingComponent';

type Props = RouteComponentProps<{
  taskName: string;
}>;

const StylistMatchingPage: React.FC<Props> = React.memo(
  ({ match: { params }, history, location }: Props) => {
    const {
      state: { isUserHasAllPersonalInfo, activeTaskData },
      actions: { trackPage }
    } = React.useContext<RootContextType>(RootContext);

    const { data: taskDefinition = activeTaskData || {} } = useRequest<
      GQLGetContentTaskVars,
      TaskDefinition
    >(getContentTaskQuery, {
      skip: params.taskName === activeTaskData?.taskName,
      payload: {
        taskName: params.taskName
      }
    });

    React.useEffect(() => {
      trackPage({
        name: 'StylistMatchingPage'
      });
    }, []);

    const handleChooseStylist = React.useCallback(() => {
      history.push({
        pathname: isUserHasAllPersonalInfo
          ? `/task-chat/${taskDefinition?.taskName}`
          : '/create-profile',
        search: location.search
      });
    }, [taskDefinition, isUserHasAllPersonalInfo]);

    const handleChooseOtherStylist = React.useCallback(() => {
      history.push({
        pathname: `/stylist-list/${taskDefinition?.taskName}`,
        search: location.search
      });
    }, [taskDefinition]);

    return (
      <StylistMatchingComponent
        variables={{
          stylistsTiers: taskDefinition?.stylistsTiers
        }}
        onChooseStylist={handleChooseStylist}
        onChooseOtherStylist={handleChooseOtherStylist}
      />
    );
  }
);

export default StylistMatchingPage;
