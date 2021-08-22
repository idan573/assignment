import * as React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Navbar } from '@bit/scalez.savvy-ui.navbar';
import { useRequest } from '@bit/scalez.savvy-ui.hooks';

/* Api */
import {
  getUnseenThreadsNumberQuery,
  GQLRetrieveUserThreadsVars
} from 'App/api/thread/retrieveUserThreads';

/* Components */
import { RootContext, RootContextType } from 'App/components';

/* Styles */
import { GlobalPageStyles } from './styles';

const AppNavbar: React.FC = React.memo(() => {
  const location = useLocation();
  const history = useHistory();

  const {
    state: { activeStepData, userData, isCreatorFlow }
  } = React.useContext<RootContextType>(RootContext);

  const { data: unseenThreadsNumber } = useRequest<
    GQLRetrieveUserThreadsVars,
    number
  >(getUnseenThreadsNumberQuery, {
    skip: !userData?.userId || !isCreatorFlow,
    payload: {
      userId: userData.userId,
      isPrivate: true
    }
  });

  const setNavbarButtonProps = React.useCallback(
    (pathname: string) => {
      const isActive = location.pathname.includes(pathname);

      return {
        ['data-is-active']: isActive,
        ...(!isActive && {
          onClick: () =>
            history.push({
              pathname: pathname,
              search: location.search
            })
        })
      };
    },
    [location.pathname]
  );

  const navbarButtons = React.useMemo(
    () => [
      {
        children: 'Home',
        ['data-form']: 'rectangle' as const,
        ['data-action']: 'home',
        ...setNavbarButtonProps('/homepage')
      },
      isCreatorFlow
        ? {
            children: 'Chat',
            ['data-form']: 'rectangle' as const,
            ['data-action']: 'quoteBubble',
            label: !!unseenThreadsNumber ? ' ' : '',
            ...setNavbarButtonProps('/stylist-chat')
          }
        : {
            children: 'Tips',
            ['data-form']: 'rectangle' as const,
            ['data-action']: 'cards',
            ...setNavbarButtonProps('/free-rules-experience')
          },
      {
        children: 'Outfeed',
        ['data-form']: 'rectangle' as const,
        ['data-action']: 'search',
        ...setNavbarButtonProps('/outfit-feed')
      },
      {
        children: 'My Closet',
        ['data-form']: 'rectangle' as const,
        ['data-action']: 'heart',
        ...setNavbarButtonProps('/closet')
      }
    ],
    [location.pathname, unseenThreadsNumber]
  );

  return (
    <>
      {activeStepData?.renderNavbar && (
        <>
          <GlobalPageStyles />
          <Navbar buttons={navbarButtons} />
        </>
      )}
    </>
  );
});

export { AppNavbar };
