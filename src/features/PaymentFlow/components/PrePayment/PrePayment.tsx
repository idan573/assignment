import React from 'react';
import { RouteComponentProps } from 'react-router';
import { Button } from '@bit/scalez.savvy-ui.button';
import { FloatWrapper } from '@bit/scalez.savvy-ui.float-wrapper';

/* Components */
import { RootContextType, RootContext } from 'App/components';

/* Styles */
import { PrePaymentPageStyle, StyledStylistImage } from './styles';

const PrePayment: React.FC<RouteComponentProps> = ({
  history,
  location
}: RouteComponentProps) => {
  const {
    state: { homePageStylist }
  } = React.useContext<RootContextType>(RootContext);

  const onClickNext = React.useCallback(() => {
    history.push({
      pathname: '/payment/chargebee',
      search: location.search
    });
  }, []);

  return (
    <>
      <PrePaymentPageStyle>
        <div className="video-wrapper">
          <video controls src={homePageStylist.stylistAttributes?.bioVideo}>
            <source type="video/mp4" />
            Sorry, your browser doesn't support HTML5 video.
          </video>
        </div>

        <StyledStylistImage src={homePageStylist.profilePicture} />

        <h1>Only A Few Spots Left</h1>

        <p className="body">
          Membership spots are limited - join my club before it’s too late!
        </p>
      </PrePaymentPageStyle>

      <FloatWrapper position="bottom" transition="slide-bottom">
        <Button
          data-type="primary"
          data-action="next"
          data-action-position="right"
          onClick={onClickNext}
        >
          {`Join ${homePageStylist.firstName}`}
        </Button>
      </FloatWrapper>
    </>
  );
};

export default PrePayment;
