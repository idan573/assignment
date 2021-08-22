import styled from 'styled-components';
import { getImage } from '@bit/scalez.savvy-ui.layouts';
import { noUser } from '@bit/scalez.savvy-ui.svg';

export const PrePaymentPageStyle = styled.div`
  display: grid;
  grid-gap: 16px;
  justify-items: center;

  video {
    width: 100%;
    max-height: 350px;
  }

  h1,
  p {
    padding: 0px 16px;
    text-align: center;
  }
`;

export const StyledStylistImage = styled(
  getImage({
    icon: noUser
  })
).attrs({
  alt: 'stylist-profile-image'
})`
  --imageSize: 64px;
  margin-top: -50px;
`;
