import styled from 'styled-components';
import { star, clock } from '@bit/scalez.savvy-ui.svg';
import { getImage } from '@bit/scalez.savvy-ui.layouts';
import { Modal } from '@bit/scalez.savvy-ui.modal';

export const StyledChallengeImage = styled(getImage()).attrs({
  alt: 'challenge-image'
})`
  width: 120px;
  height: 140px;
`;

export const StyledRecommendedIcon = styled(getImage()).attrs({
  src: star({ stroke: 'white', fill: 'white ', scale: 0.6 }),
  alt: 'recommended-icon'
})`
  --imageSize: 35px;
  transform: scale(1) translate(40%, -40%) !important;
  top: 0;
  right: 0;
  position: absolute;

  box-shadow: none;
  transition: none;
  background-image: var(--gradientBlue);
`;

export const StyledStyleChallenges = styled.div`
  padding: 24px 16px var(--headerHeight);

  display: grid;
  grid-gap: 16px;
  place-items: center;

  background-color: var(--blueLighter);

  p.await-description {
    color: var(--bluePrimary);
  }

  p.description {
    text-align: center;
    color: var(--blueDark);
  }

  div.challenges-list {
    &[data-is-blocked='true'],
    &[data-is-loading='true'] {
      opacity: 0.5;
      pointer-events: none;
    }

    width: calc(100% + 32px);
    margin-left: -16px;
    padding: 16px;

    overflow-x: auto;
    overflow-y: hidden;

    place-self: flex-start;
    display: grid;
    grid-auto-flow: column;
    grid-gap: 24px;

    &::after {
      content: '';
      width: 1px;
      height: 100%;
      margin-left: -16px;
      display: block;
    }

    div.challenge-item {
      display: grid;
      align-content: flex-start;
      grid-gap: 8px;

      position: relative;

      text-align: center;

      div.image-wrapper {
        &[data-is-recommended='true'] {
          border: 2px solid var(--blueDarker);
        }

        padding: 8px;

        border-radius: 16px;

        img {
          border-radius: inherit;
        }
      }

      p.recommended-label {
        margin-top: -8px;
        color: var(--green);
      }
    }
  }
`;

export const StyledClockIcon = styled(getImage()).attrs({
  src: clock({
    strokeWidth: 1
  }),
  alt: 'clock-icon'
})`
  --imageSize: 50px;

  transition: none;
  box-shadow: none;
  border-radius: 0;
  background-color: transparent;
`;

export const StyledModal = styled(Modal)`
  place-items: center;
  text-align: center;

  p {
    display: contents;
  }
`;
