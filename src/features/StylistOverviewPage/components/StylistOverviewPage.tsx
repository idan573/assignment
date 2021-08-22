import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Modal } from '@bit/scalez.savvy-ui.modal';
import { Loader } from '@bit/scalez.savvy-ui.loader';
import { Button, ButtonProps } from '@bit/scalez.savvy-ui.button';
import { FloatWrapper } from '@bit/scalez.savvy-ui.float-wrapper';
import { useLazyRequest, useRequest } from '@bit/scalez.savvy-ui.hooks';

/* Services */
import { EVENTS } from 'services/analyticsService';

/* Api */
import { GQLGetStylistVars, getStylistQuery } from 'App/api/stylist/getStylist';
import {
  GQLSetUserStylistVars,
  setUserStylistMutation
} from 'App/api/user/setUserStylist';
import {
  GQLSwitchUserStylistVars,
  switchUserStylistMutation
} from 'App/api/stylist/switchUserStylist';

/* Types */
import { STYLIST_TIER, Stylist } from 'App/types';

/* Components */
import { RootContext, RootContextType } from 'App/components';
import { StylistOverviewComponent } from './StylistOverviewComponent';
import { StylistOutfitsList } from './StylistOutfitsList/StylistOutfitsList';

type Props = RouteComponentProps<{ stylistId: string }>;

const StylistOverviewPage: React.FC<Props> = React.memo(
  ({ match: { params }, history, location }: Props) => {
    const {
      state: { userData, isUserHasAllPersonalInfo, activeTaskData },
      actions: { trackPage, trackEvent, setUserHomepageStylist }
    } = React.useContext<RootContextType>(RootContext);

    const [isModalActive, toggleModal] = React.useState<boolean>(false);

    const {
      data: stylistData = {} as Stylist,
      loading: loadingStylist
    } = useRequest<GQLGetStylistVars, Stylist>(getStylistQuery, {
      payload: {
        stylistId: params.stylistId
      }
    });

    const [setUserStylist] = useLazyRequest<GQLSetUserStylistVars, void>(
      setUserStylistMutation
    );

    const [
      switchUserStylist,
      { loading: loadingSwitchStylist }
    ] = useLazyRequest<GQLSwitchUserStylistVars, void>(
      switchUserStylistMutation
    );

    React.useEffect(() => {
      trackPage({
        name: 'StylistOverviewPage',
        properties: {
          stylistId: params.stylistId
        }
      });
    }, []);

    const handleRedirect = React.useCallback(() => {
      if (!activeTaskData?.taskName) {
        history.push({
          pathname: '/homepage',
          search: location.search
        });
        return;
      }

      history.push({
        pathname: isUserHasAllPersonalInfo
          ? `/task-chat/${activeTaskData?.taskName}`
          : '/create-profile',
        search: location.search
      });
    }, [isUserHasAllPersonalInfo]);

    let timeout;
    const handleChooseStylist = React.useCallback(async () => {
      const userStylistVars = {
        userId: userData.userId,
        stylistId: stylistData.stylistId
      };

      if (!!userData?.homePageStylist) {
        switchUserStylist(userStylistVars);
      } else {
        setUserStylist(userStylistVars);
      }

      /* TODO: clarify what why and how */
      timeout = setTimeout(() => {
        setUserHomepageStylist(stylistData.stylistId);

        trackEvent({
          event: EVENTS.STYLIST_SELECTED,
          properties: {
            selectionType: 'selected',
            stylistId: stylistData.stylistId,
            stylistFirstName: stylistData.firstName,
            stylistLastName: stylistData.lastName
          }
        });

        handleRedirect();
      }, 2000);
    }, [stylistData]);

    React.useEffect(() => {
      return () => clearTimeout(timeout);
    }, []);

    const modalButtons: ButtonProps[] = React.useMemo(
      () => [
        {
          children: 'Cancel',
          ['data-type']: 'secondary' as const,
          onClick: () => toggleModal(false)
        },
        {
          children: 'Switch',
          onClick: handleChooseStylist
        }
      ],
      [handleChooseStylist]
    );

    const isActiveStylist = React.useMemo(
      () =>
        [STYLIST_TIER.WHITE_LABEL, STYLIST_TIER.EXPERT].includes(
          stylistData.stylistTier
        ),
      [stylistData]
    );

    return (
      <>
        <Loader render={loadingStylist || loadingSwitchStylist} />

        <Modal
          render={isModalActive}
          name="switch-stylist-modal"
          title="Are you sure you want to switch your stylist?"
          actions={modalButtons}
          onClickOutside={() => toggleModal(false)}
        />

        {!loadingStylist && (
          <StylistOverviewComponent stylistData={stylistData} />
        )}

        <StylistOutfitsList stylistId={params.stylistId} />

        <FloatWrapper
          render={!loadingStylist}
          position="bottom"
          transition="slide-bottom"
        >
          {isActiveStylist ? (
            <Button onClick={() => toggleModal(true)}>
              {`Choose ${stylistData.firstName}`}
            </Button>
          ) : (
            <Button onClick={() => history.goBack()}>{`Continue`}</Button>
          )}
        </FloatWrapper>
      </>
    );
  }
);

export default StylistOverviewPage;
