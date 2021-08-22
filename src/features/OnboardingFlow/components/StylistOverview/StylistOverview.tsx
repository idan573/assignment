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
import { Stylist } from 'App/types';

/* Components */
import { RootContext, RootContextType } from 'App/components';
import { StylistOverviewComponent } from 'features/StylistOverviewPage/components/StylistOverviewComponent';

type Props = RouteComponentProps<{ stylistId: string }>;

const StylistOverview: React.FC<Props> = React.memo(
  ({ match: { params } }: Props) => {
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
    }, [stylistData]);

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

        <FloatWrapper
          render={!loadingStylist}
          position="bottom"
          transition="slide-bottom"
        >
          <Button onClick={() => toggleModal(true)}>
            {`Choose ${stylistData.firstName}`}
          </Button>
        </FloatWrapper>
      </>
    );
  }
);

export default StylistOverview;
