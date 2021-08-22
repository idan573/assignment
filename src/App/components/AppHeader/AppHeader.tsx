import * as React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Modal } from '@bit/scalez.savvy-ui.modal';
import { SideMenu, MENU_ITEM_TYPES } from '@bit/scalez.savvy-ui.side-menu';
import {
  HEADER_ITEM_TYPES,
  HEADER_ITEM_POSITION_TYPES,
  HEADER_ITEM_TEMPLATE_TYPES
} from '@bit/scalez.savvy-ui.header';
import { Button } from '@bit/scalez.savvy-ui.button';

/* Core */
import {
  openFAQ,
  openStylistPlatform,
  openAppStore,
  isMobileApp
} from 'core/utils';

/* Services */
import { authService } from 'services/authService';

/* Types */
import { STANDALONE_STATE_NAMES } from 'App/types';

/* Constants */
import { standaloneFlowPathnames } from 'App/components/routerConfig';

/* Components */
import { RootContext, RootContextType } from 'App/components';

/* Styles */
import {
  GlobalPageStyles,
  StyledHeader,
  StyledHeaderSavvyLogo,
  StyledHeaderStylistImage,
  StyledUserImage,
  StyledUserProfile
} from './styles';

export enum APP_HEADER_ITEM_TYPES {
  NOTIFICATION = 'APP_HEADER_ITEM_NOTIFICATION',
  CHAT = 'APP_HEADER_ITEM_CHAT',
  HOMEPAGE_STYLIST = 'APP_HEADER_ITEM_HOMEPAGE_STYLIST',
  HOMEPAGE_STYLIST_CHAT = 'APP_HEADER_ITEM_HOMEPAGE_STYLIST_CHAT'
}

const AppHeader: React.FC = React.memo(() => {
  const history = useHistory();
  const location = useLocation();

  const {
    state: { userData, homePageStylist, activeStepData }
  } = React.useContext<RootContextType>(RootContext);

  const [isMenuActive, toggleMenu] = React.useState<boolean>(false);
  const [isSignOutModalActive, toggleSignOutModal] = React.useState<boolean>(
    false
  );
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean>(false);

  React.useEffect(() => {
    checkIsAuthenticated();
  }, []);

  const checkIsAuthenticated = React.useCallback(async () => {
    const isAuthenticated = await authService.isAuthenticated();
    setIsAuthenticated(isAuthenticated);
  }, []);

  const goBack = React.useCallback(() => {
    history.goBack();
  }, [activeStepData]);

  /* Collection of all possible Header actions */
  const headerActions = React.useMemo(
    () => ({
      menu: () => toggleMenu(true),
      back: goBack
    }),
    []
  );

  const headerContent = React.useMemo(
    () =>
      activeStepData?.headerConfig
        ?.map(item => {
          switch (item.type) {
            case HEADER_ITEM_TYPES.BUTTON:
              return {
                type: item.type,
                props: {
                  onClick: headerActions[item.props['data-action']],
                  dataGridTemplate: HEADER_ITEM_TEMPLATE_TYPES.MAX_CONTENT,
                  ...item.props
                }
              };

            case APP_HEADER_ITEM_TYPES.NOTIFICATION:
              return {
                type: HEADER_ITEM_TYPES.BUTTON,
                props: {
                  ['data-action']: 'bell',
                  label: item.props.notificationsCount,
                  dataSelfPosition: HEADER_ITEM_POSITION_TYPES.CENTER,
                  dataGridTemplate: HEADER_ITEM_TEMPLATE_TYPES.MAX_CONTENT,
                  onClick: () =>
                    history.push({
                      pathname: '/styleups/list',
                      search: location.search
                    }),
                  ...item.props
                }
              };

            case APP_HEADER_ITEM_TYPES.HOMEPAGE_STYLIST_CHAT:
              return {
                type: HEADER_ITEM_TYPES.BUTTON,
                props: {
                  ['data-action']: 'quoteBubble',
                  label: item.props.showNotificationDot,
                  dataSelfPosition: HEADER_ITEM_POSITION_TYPES.CENTER,
                  dataGridTemplate: HEADER_ITEM_TEMPLATE_TYPES.MAX_CONTENT,
                  className: 'private-chat-button',
                  onClick: () => {
                    history.push({
                      pathname: '/stylist-chat',
                      search: location.search
                    });
                  },
                  ...item.props
                }
              };

            case APP_HEADER_ITEM_TYPES.HOMEPAGE_STYLIST:
              return {
                type: HEADER_ITEM_TYPES.CUSTOM,
                props: {
                  dataSelfPosition: HEADER_ITEM_POSITION_TYPES.LEFT,
                  dataGridTemplate: '120px'
                },
                render: () => (
                  <div
                    className="stylist-content-wrapper"
                    onClick={() =>
                      history.push({
                        pathname: `/homepage-stylist-overview`,
                        search: location.search
                      })
                    }
                  >
                    <StyledHeaderStylistImage
                      src={homePageStylist.profilePicture}
                    />
                    <h4>{homePageStylist.firstName}</h4>
                  </div>
                )
              };

            case APP_HEADER_ITEM_TYPES.CHAT:
              return {
                type: HEADER_ITEM_TYPES.CUSTOM,
                props: {
                  dataSelfPosition: HEADER_ITEM_POSITION_TYPES.LEFT
                },
                render: () => (
                  <div className="chat-header-content-wrapper">
                    <StyledHeaderSavvyLogo />

                    <h2>Savvy</h2>
                  </div>
                )
              };

            default:
              return item as any;
          }
        })
        ?.flat(),
    [activeStepData, homePageStylist]
  );

  const sideMenuContent = React.useMemo(
    () => [
      isAuthenticated && [
        {
          type: MENU_ITEM_TYPES.CUSTOM,
          render: () => (
            <StyledUserProfile
              onClick={() => history.push({ pathname: '/user-profile' })}
            >
              <StyledUserImage src={userData.profilePicture} />
              <p className="body-bold">My Profile</p>
              <Button
                className="next"
                data-type="simple-icon"
                data-form="rectangle"
                data-action="next"
                data-action-position="center"
                data-size="extra-small"
                onClick={() => history.push({ pathname: '/user-profile' })}
              />
            </StyledUserProfile>
          )
        },
        !!userData.homePageStylist && {
          type: MENU_ITEM_TYPES.BUTTON,
          props: {
            ['data-action']: 'noUser',
            children: 'My Stylist',
            onClick: () =>
              history.push({
                pathname: '/homepage-stylist-overview',
                search: location.search
              })
          }
        },
        {
          type: MENU_ITEM_TYPES.BUTTON,
          props: {
            ['data-action']: 'star',
            children: 'Style Sessions',
            onClick: () =>
              history.push({
                pathname: '/styleups/list',
                search: location.search
              })
          }
        }
      ],
      [
        {
          type: MENU_ITEM_TYPES.BUTTON,
          props: {
            ['data-action']: 'quoteBubble',
            children: 'Contact Support',
            onClick: () => {
              toggleMenu(false);
              window?.Intercom?.('show');
            }
          }
        },
        {
          type: MENU_ITEM_TYPES.BUTTON,
          props: {
            ['data-action']: 'help',
            children: 'Help Center',
            onClick: () => openFAQ()
          }
        },
        {
          type: MENU_ITEM_TYPES.BUTTON,
          props: {
            ['data-action']: 'squares',
            children: 'Stylist Login',
            onClick: () => openStylistPlatform(userData.userId)
          }
        },
        !isMobileApp() && {
          type: MENU_ITEM_TYPES.BUTTON,
          props: {
            ['data-action']: 'play',
            children: 'Open In App',
            onClick: () => openAppStore()
          }
        },
        isAuthenticated
          ? {
              type: MENU_ITEM_TYPES.BUTTON,
              props: {
                ['data-action']: 'logout',
                children: 'Sign Out',
                onClick: () => toggleSignOutModal(true)
              }
            }
          : {
              type: MENU_ITEM_TYPES.BUTTON,
              props: {
                ['data-action']: 'returnArrow',
                children: 'Log In',
                onClick: async () => await authService.login()
              }
            }
      ]
    ],
    [isAuthenticated, activeStepData, userData]
  );

  /* Signout modal props */
  const handleSignoutModalSubmit = React.useCallback(async () => {
    await authService.logout();
    toggleSignOutModal(false);
  }, []);

  const handleSignoutModalCancel = React.useCallback(
    () => toggleSignOutModal(false),
    []
  );

  const signoutModalActions = React.useMemo(
    () => [
      {
        ['data-type']: 'secondary' as const,
        children: 'Not Yet',
        onClick: handleSignoutModalCancel
      },
      {
        ['data-type']: 'primary' as const,
        children: 'Sign Out',
        onClick: handleSignoutModalSubmit
      }
    ],
    []
  );

  return (
    !!headerContent && (
      <>
        <GlobalPageStyles />

        <StyledHeader
          id="app-header"
          data-position="sticky"
          content={headerContent}
        />

        <SideMenu
          render={isMenuActive}
          content={sideMenuContent}
          onClickOutside={() => toggleMenu(false)}
        />

        <Modal
          name="signout-modal"
          render={isSignOutModalActive}
          title="Sign Out?"
          actions={signoutModalActions}
          onClickOutside={handleSignoutModalCancel}
        />
      </>
    )
  );
});

export { AppHeader };
