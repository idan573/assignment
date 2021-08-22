import styled from 'styled-components';
import { Overlay } from '@bit/scalez.savvy-ui.overlay';
import { getImage } from '@bit/scalez.savvy-ui.layouts';
import { play, check, noUser } from '@bit/scalez.savvy-ui.svg';

export const StyledMediaOverlay = styled(Overlay)`
  padding: 16px;

  display: grid;
  place-items: center;

  background-color: rgba(7, 4, 23, 0.75);

  button {
    top: 16px;
    right: 16px;
    z-index: 1;
    position: absolute;
  }

  video {
    width: 100%;
    height: auto;
    border-radius: 8px;
  }
`;

export const StyledStylistMatchingPage = styled.section`
  width: 100%;
  height: auto;
  min-height: var(--screenHeight);

  padding-bottom: 144px;

  display: grid;
  place-content: center;

  &[data-has-video='true'] {
    justify-content: center;
    align-content: flex-start;

    .padding-block {
      margin-top: -60px;
    }
  }

  &[data-has-video='false'] {
    .video-block {
      display: none;
    }
  }

  .padding-block {
    padding: 0 16px;

    display: grid;
    grid-gap: 16px;
    place-content: center;
    place-items: center;
  }

  .video-block {
    width: 100%;
    height: 50vh;

    display: grid;
    place-items: center;

    position: relative;
    overflow: hidden;

    video {
      width: 100%;
      height: inherit;
      outline: none;
      object-fit: cover;
      z-index: 1;
    }
  }

  h2,
  p {
    text-align: center;
  }

  .images-block {
    display: flex;
    justify-content: center;
    align-items: center;

    .image-wrapper {
      width: 120px;
      height: 120px;

      display: grid;
      place-items: center;
      place-content: center;

      z-index: 1;

      background-color: #fff;
      border-radius: 50%;
    }

    .check-icon {
      margin: 0 -25px;
      z-index: 2;
    }
  }
`;

export const StyledImage = styled(
  getImage({
    icon: noUser
  })
)`
  --imageSize: 80px;
`;

export const StyledPlayIcon = styled(getImage()).attrs({
  src: play({ stroke: 'white', fill: 'white' }),
  alt: 'play-icon'
})`
  --imageSize: 40px;

  box-shadow: none;
  background-color: transparent;
  box-shadow: none;

  top: 50%;
  left: 50%;
  z-index: 2;
  position: absolute;

  transform: scale(1) translate(-50%, -50%) !important;
`;

export const StyledCheckIcon = styled(getImage()).attrs({
  src: check({ scale: 0.5, stroke: 'white' }),
  alt: 'check-icon'
})`
  --imageSize: 40px;
  background-image: var(--gradientBlue);
`;

export const StyledButtonsBlock = styled.div`
  display: grid;
  grid-gap: 16px;
`;
