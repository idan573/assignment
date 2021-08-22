import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import TopBarProgress from 'react-topbar-progress-indicator';
import { useRequest } from '@bit/scalez.savvy-ui.hooks';

/* Api */
import {
  GQLGetContentTaskVars,
  getContentTaskQuery
} from 'App/api/task/getContentTask';

/* Components */
import { RootContext, RootContextType } from 'App/components';
import { StylistListComponent } from './StylistListComponent';

/* Types */
import { Stylist, TaskDefinition } from 'App/types';

type Props = RouteComponentProps<{
  taskName?: string;
}>;

const StylistListPage: React.FC<Props> = React.memo(
  ({ match: { params }, history, location }: Props) => {
    const {
      actions: { trackPage }
    } = React.useContext<RootContextType>(RootContext);

    const { loading: loadingTaskDefinition } = useRequest<
      GQLGetContentTaskVars,
      TaskDefinition
    >(getContentTaskQuery, {
      skip: !params.taskName,
      payload: {
        taskName: params.taskName
      }
    });

    React.useEffect(() => {
      trackPage({
        name: 'StylistListPage'
      });
    }, []);

    const handleChooseStylist = React.useCallback((stylist: Stylist) => {
      history.push({
        pathname: `/stylist-overview/${stylist.stylistId}`,
        search: location.search
      });
    }, []);

    return (
      <>
        {loadingTaskDefinition ? (
          <TopBarProgress />
        ) : (
          <StylistListComponent onStylistClick={handleChooseStylist} />
        )}
      </>
    );
  }
);

export default StylistListPage;
