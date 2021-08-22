import styled, { createGlobalStyle } from 'styled-components';
import { Header } from '@bit/scalez.savvy-ui.header';
import { getImage } from '@bit/scalez.savvy-ui.layouts';
import { savvyLogo, noUser } from '@bit/scalez.savvy-ui.svg';

export const GlobalPageStyles = createGlobalStyle`
  #root > [class*="StyledSlidePageWrapper"] {
    padding-top: var(--headerHeight);
  }
`;

export const StyledHeaderSavvyLogo = styled(getImage()).attrs({
  src: savvyLogo({ scale: 0.7 }),
  alt: 'savvy_logo'
})`
  --imageSize: 32px;
  object-fit: contain;
`;

export const StyledHeaderStylistImage = styled(
  getImage({
    icon: noUser
  })
).attrs({
  alt: 'stylist-profile-image'
})`
  --imageSize: 40px;
`;

export const StyledHeader = styled(Header)`
  &[data-position='sticky'] {
    top: 0;
    z-index: 1;
    position: sticky;
  }

  button.private-chat-button > .indicator-label {
    width: 12px;
    height: 12px;
    top: 10px !important;
  }

  .chat-header-content-wrapper {
    display: grid;
    grid-auto-flow: column;
    place-items: center;
    grid-gap: 16px;
  }

  .homepage-content-wrapper {
    display: grid;
    grid-auto-flow: column;
    justify-content: space-between;
    align-items: center;
  }

  .stylist-content-wrapper {
    display: grid;
    grid-gap: 6px;
    grid-auto-flow: column;
    place-items: center;

    cursor: pointer;

    h4 {
      max-width: 100%;
      justify-self: self-start;
    }
  }
`;

export const StyledUserImage = styled(
  getImage({
    icon: noUser
  })
).attrs({
  alt: 'profile-image'
})`
  --imageSize: 48px;
`;

export const StyledUserProfile = styled.div`
  margin-bottom: 16px;
  display: grid;
  grid-auto-flow: column;
  grid-gap: 8px;
  justify-content: flex-start;
  align-items: center;
  cursor: pointer;
`;
