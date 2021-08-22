import * as React from 'react';
import range from 'ramda/src/range';
import { Button } from '@bit/scalez.savvy-ui.button';

/* Types */
import { Outfit, Stylist } from 'App/types';
import { RootContextType, RootContext } from 'App/components';
import { EVENTS } from 'services/analyticsService';

/* Styles */
import {
  StyledStylistOverviewComponent,
  StyledMediaOverlay,
  StyledStylistProfileImage,
  StyledStylistImage,
  StyledOutfitImage,
  StyledSadIcon,
  StyledPlayIcon
} from './styles';

interface Props {
  stylistData?: Stylist;
}

const StylistOverviewComponent: React.FC<Props> = React.memo(
  ({ stylistData }: Props) => {
    const {
      actions: { trackEvent }
    } = React.useContext<RootContextType>(RootContext);

    const [isVideoError, setVideoError] = React.useState<boolean>(false);

    const [overlayState, setOverlayState] = React.useState<
      Partial<{ isActive: boolean; type: 'image' | 'video'; src: string }>
    >({ isActive: false });

    return (
      <>
        {!!stylistData && (
          <>
            <StyledMediaOverlay render={overlayState.isActive}>
              <Button
                data-type="secondary"
                data-size="extra-small"
                data-form="circle"
                data-action="cross"
                data-action-position="center"
                onClick={() =>
                  setOverlayState(prevState => ({
                    ...prevState,
                    isActive: false
                  }))
                }
              />
              {overlayState.type === 'video' ? (
                <video controls={true} autoPlay>
                  <source src={overlayState.src} type="video/mp4" />
                </video>
              ) : (
                <StyledStylistImage src={overlayState.src} />
              )}
            </StyledMediaOverlay>

            <StyledStylistOverviewComponent>
              {(!!stylistData?.stylistAttributes?.photos?.length ||
                stylistData?.stylistAttributes?.bioVideo) && (
                <div
                  className={`stylist-media-block ${
                    stylistData?.stylistAttributes?.photos?.length > 1 ||
                    (!!stylistData?.stylistAttributes?.bioVideo &&
                      stylistData?.stylistAttributes?.photos?.length === 1)
                      ? 'has-large-family'
                      : 'has-only-child'
                  }`}
                >
                  {!!stylistData?.stylistAttributes?.bioVideo && (
                    <div className="video-block">
                      {isVideoError ? (
                        <div className="video-error-block">
                          <StyledSadIcon />
                          <p className="body">Bio Video is unavailable</p>
                        </div>
                      ) : (
                        <>
                          <StyledPlayIcon
                            onClick={() => {
                              setOverlayState({
                                isActive: true,
                                type: 'video',
                                src: stylistData.stylistAttributes.bioVideo
                              });
                              trackEvent({
                                event: EVENTS.STYLIST_VIDEO_CLICKED,
                                properties: {
                                  stylistId: stylistData?.stylistId
                                }
                              });
                            }}
                          />
                          <video
                            src={stylistData.stylistAttributes.bioVideo}
                            onError={() => {
                              setVideoError(true);
                            }}
                          />
                        </>
                      )}
                    </div>
                  )}

                  {stylistData?.stylistAttributes?.photos?.map((src, key) => (
                    <StyledStylistImage
                      key={key}
                      src={src}
                      onClick={() =>
                        setOverlayState({
                          isActive: true,
                          type: 'image',
                          src
                        })
                      }
                    />
                  ))}
                </div>
              )}

              <div className="stylist-block">
                <div className="circle-wrapper">
                  <StyledStylistProfileImage
                    className="square-content"
                    src={stylistData.profilePicture}
                  />

                  <div className="reviews-block">
                    <div className="rating-block">
                      {range(0, 5).map(i => (
                        <div
                          key={i}
                          className="rating-star"
                          data-is-active={i < (stylistData.avgRate || 0)}
                        />
                      ))}
                    </div>

                    <span className="sbody-bold reviews-count">
                      ({stylistData.reviewsCount || 0})
                    </span>
                  </div>
                </div>

                <h3 className="stylist-name">{stylistData?.firstName}</h3>

                <span className="stylist-city">{stylistData?.city}</span>

                <p className="stylist-bio body">
                  {stylistData?.stylistAttributes?.bio}
                </p>
              </div>

              {!!stylistData?.stylistAttributes?.myOutfitPhotos?.length && (
                <>
                  <h3 className="outfit-title">Outfits I Styled</h3>

                  <div className="outfit-images-block">
                    {stylistData.stylistAttributes.myOutfitPhotos.map(
                      (src, key) => (
                        <StyledOutfitImage key={key} src={src} />
                      )
                    )}
                  </div>
                </>
              )}
            </StyledStylistOverviewComponent>
          </>
        )}
      </>
    );
  }
);

export { StylistOverviewComponent };
