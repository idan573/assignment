import * as React from 'react';
import TopBarProgress from 'react-topbar-progress-indicator';
import { Button } from '@bit/scalez.savvy-ui.button';
import { FloatWrapper } from '@bit/scalez.savvy-ui.float-wrapper';
import { useLazyRequest, useRequest } from '@bit/scalez.savvy-ui.hooks';

/* Analytics */
import { EVENTS } from 'services/analyticsService';

/* Api */
import {
  GQLSetUserStylistVars,
  setUserStylistMutation
} from 'App/api/user/setUserStylist';
import {
  GQLSearchStylistsVars,
  searchStylistsQuery
} from 'App/api/stylist/searchStylists';
import {
  GQLSwitchUserStylistVars,
  switchUserStylistMutation
} from 'App/api/stylist/switchUserStylist';

/* Types */
import { STYLIST_TIER, Stylist } from 'App/types';

/* Components */
import { RootContext, RootContextType } from 'App/components';

/* Styles */
import {
  StyledStylistMatchingPage,
  StyledMediaOverlay,
  StyledImage,
  StyledCheckIcon,
  StyledButtonsBlock,
  StyledPlayIcon
} from './styles';

export interface Props {
  variables?: Partial<GQLSearchStylistsVars>;
  onChooseStylist?: (stylist: Stylist) => void;
  onChooseOtherStylist?: () => void;
  onStylistGot?: (stylist: Stylist) => void;
}

const StylistMatchingComponent: React.FC<Props> = React.memo(
  ({
    variables = {},
    onChooseStylist,
    onChooseOtherStylist,
    onStylistGot
  }: Props) => {
    const innerVideoRef = React.useRef<HTMLVideoElement>();
    const overlayVideoRef = React.useRef<HTMLVideoElement>();

    const {
      state: { userData },
      actions: { trackEvent, setUserHomepageStylist }
    } = React.useContext<RootContextType>(RootContext);

    const [videoPlaybackTime, setVideoPlaybackTime] = React.useState<number>(0);
    const [isVideoError, setVideoError] = React.useState<boolean>(false);
    const [isVideoOverlayActive, toggleVideoOverlay] = React.useState<boolean>(
      false
    );

    const {
      data: [stylistData = {} as Stylist] = [],
      loading: loadingStylistData
    } = useRequest<GQLSearchStylistsVars, Stylist[]>(searchStylistsQuery, {
      payload: {
        userId: userData.userId,
        limit: 1,
        isAddFeedback: false,
        ...variables,
        stylistsTiers: [STYLIST_TIER.WHITE_LABEL]
      },
      onCompleted([stylistData]) {
        onStylistGot?.(stylistData);
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

    const handleOpenOverlay = React.useCallback(() => {
      trackEvent({
        event: EVENTS.STYLIST_MATCHING_VIDEO_CLICKED,
        properties: {
          selectionType: 'match',
          stylistId: stylistData?.stylistId,
          stylistFirstName: stylistData?.firstName,
          stylistLastName: stylistData?.lastName
        }
      });

      setVideoPlaybackTime(Math.floor(innerVideoRef.current.currentTime));
      innerVideoRef.current.pause();
      toggleVideoOverlay(true);
    }, [stylistData]);

    const handleCloseOverlay = React.useCallback(() => {
      overlayVideoRef.current.pause();
      setVideoPlaybackTime(Math.floor(overlayVideoRef.current.currentTime));
      innerVideoRef.current.play();
      toggleVideoOverlay(false);
    }, []);

    let timeout;
    const handleChooseCurrentStylist = React.useCallback(async () => {
      const userStylistVars = {
        userId: userData.userId,
        stylistId: stylistData.stylistId
      };

      if (!!userData?.homePageStylist) {
        switchUserStylist(userStylistVars);
      } else {
        setUserStylist(userStylistVars);
      }

      /* TODO: clarify what why and how ????*/
      timeout = setTimeout(() => {
        setUserHomepageStylist(stylistData.stylistId);

        trackEvent({
          event: EVENTS.STYLIST_SELECTED,
          properties: {
            selectionType: 'match',
            stylistId: stylistData?.stylistId,
            stylistFirstName: stylistData?.firstName,
            stylistLastName: stylistData?.lastName
          }
        });

        onChooseStylist?.(stylistData);
      }, 2000);
    }, [stylistData, onChooseStylist, userData]);

    React.useEffect(() => {
      return () => clearTimeout(timeout);
    }, []);

    return (
      <>
        <StyledMediaOverlay render={isVideoOverlayActive}>
          <Button
            data-type="secondary"
            data-size="extra-small"
            data-form="circle"
            data-action="cross"
            data-action-position="center"
            onClick={handleCloseOverlay}
          />
          <video ref={overlayVideoRef} controls={true} autoPlay={true}>
            <source
              src={stylistData.stylistAttributes?.bioVideo}
              type="video/mp4"
            />
          </video>
        </StyledMediaOverlay>

        {loadingStylistData || loadingSwitchStylist ? (
          <TopBarProgress />
        ) : !!stylistData ? (
          <>
            <StyledStylistMatchingPage
              data-has-video={
                !!stylistData.stylistAttributes?.bioVideo && !isVideoError
              }
            >
              <div className="video-block">
                <video
                  ref={innerVideoRef}
                  loop={true}
                  autoPlay={true}
                  playsInline
                  muted={true}
                  onClick={handleOpenOverlay}
                  onError={() => setVideoError(true)}
                >
                  <source
                    src={`${stylistData.stylistAttributes?.bioVideo}#t=${videoPlaybackTime}`}
                    type="video/mp4"
                  />
                </video>

                <StyledPlayIcon onClick={handleOpenOverlay} />
              </div>

              <div className="padding-block">
                <div className="images-block">
                  <div className="image-wrapper">
                    <StyledImage
                      src={stylistData.profilePicture}
                      alt="stylist-profile-image"
                    />
                  </div>
                  <StyledCheckIcon className="check-icon" />
                  <div className="image-wrapper">
                    <StyledImage
                      src={userData.profilePicture}
                      alt="user-profile-image"
                    />
                  </div>
                </div>

                <h2>Savvy matched you with {stylistData.firstName}!</h2>

                <p className="body">
                  {stylistData.firstName} received great ratings from women like
                  you!
                </p>
              </div>
            </StyledStylistMatchingPage>

            <FloatWrapper>
              <StyledButtonsBlock>
                <Button
                  data-type="secondary"
                  onClick={() => onChooseOtherStylist?.()}
                >
                  See More Stylists
                </Button>
                <Button
                  data-type="primary"
                  onClick={handleChooseCurrentStylist}
                >
                  {`Continue with ${stylistData.firstName}`}
                </Button>
              </StyledButtonsBlock>
            </FloatWrapper>
          </>
        ) : (
          undefined
        )}
      </>
    );
  }
);

export { StylistMatchingComponent };
