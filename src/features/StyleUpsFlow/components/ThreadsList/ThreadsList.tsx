import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import TopBarProgress from 'react-topbar-progress-indicator';
import { useRequest } from '@bit/scalez.savvy-ui.hooks';
import { ThreadPreview } from '@bit/scalez.savvy-ui.thread-preview';

/* Api */
import {
  GQLRetrieveUserThreadsVars,
  retrieveUserThreadsQuery
} from 'App/api/thread/retrieveUserThreads';

/* Components */
import { RootContext, RootContextType } from 'App/components';

/* Types */
import { Thread } from 'App/types';

/* Styles */
import { StyledNoSessionsIllustration, StyledEmptyList } from './styles';

const ThreadsList: React.FC<RouteComponentProps> = React.memo(
  ({ history }: RouteComponentProps) => {
    const {
      state: { userData },
      actions: { trackPage }
    } = React.useContext<RootContextType>(RootContext);

    const { loading: loadingThreads, data: sortedThreads } = useRequest<
      GQLRetrieveUserThreadsVars,
      Thread[]
    >(retrieveUserThreadsQuery, {
      payload: {
        userId: userData.userId,
        isPrivate: false
      }
    });

    React.useEffect(() => {
      trackPage({
        name: 'StyleUpThreadsListPage'
      });
    }, []);

    return (
      <>
        {loadingThreads && <TopBarProgress />}

        {sortedThreads?.length ? (
          sortedThreads.map((thread, key) => (
            <ThreadPreview
              key={key}
              isSeen={thread.isThreadSeen}
              data={{
                image: thread.image,
                title: thread.title,
                timestamp: thread.updatedAt
              }}
              onClick={() =>
                history.push({
                  pathname: `/styleups/thread/${thread.threadId}`,
                  search: location.search
                })
              }
            />
          ))
        ) : !loadingThreads ? (
          <StyledEmptyList>
            <StyledNoSessionsIllustration />
            <h3>No Style Sessions</h3>
            <p className="body">
              New Style Sessions will be displayed here. It’s time to start your
              journey!
            </p>
          </StyledEmptyList>
        ) : (
          undefined
        )}
      </>
    );
  }
);

export default ThreadsList;
