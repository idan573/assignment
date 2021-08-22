import styled from 'styled-components';
import { animated } from 'react-spring';
import { savvyLogo, noImage } from '@bit/scalez.savvy-ui.svg';
import { getImage } from '@bit/scalez.savvy-ui.layouts';

export const StyledConversation = styled(animated.div)`
  &:last-of-type {
    padding-bottom: 24px;
  }

  display: grid;
  grid-auto-flow: row;
  grid-gap: 16px;

  .multi-choice-answers-block {
    width: calc(100% + 32px);

    padding: 8px 16px;
    margin-left: -16px;
    overflow-x: auto;

    display: grid;
    grid-auto-flow: column;
    grid-gap: 8px;
    justify-items: flex-start;
    justify-content: flex-start;

    button.multi-choice-button {
      white-space: nowrap;
      overflow: visible;
    }

    &::after {
      content: '';
      display: block;

      width: 1px;
      height: 100%;
    }
  }

  .message {
    width: 100%;

    display: grid;
    grid-auto-flow: column;
    grid-gap: 16px;
    justify-items: flex-start;
    align-items: flex-start;
    justify-content: flex-start;
    grid-template-areas: 'avatar message';
    grid-template-columns: minmax(auto, 48px) minmax(auto, calc(100% - 48px));

    [class*='message-text'] {
      width: 100%;
      padding: 16px;
      grid-area: message;

      overflow: hidden;
      text-overflow: ellipsis;

      &.savvy-message-text {
        border: 1px solid var(--blueLight);
        border-radius: 4px 16px 16px 16px;
      }

      &.user-message-text {
        background-color: var(--blueLighter);
        border-radius: 16px 4px 16px 16px;
      }
    }
  }
`;

export const StyledSavvyLogo = styled(getImage({})).attrs({
  src: savvyLogo({ scale: 0.65 }),
  alt: 'savvy_logo'
})`
  --imageSize: 48px;
  object-fit: contain;
`;

export const StyledImage = styled(
  getImage({
    icon: noImage
  })
).attrs({
  alt: 'user-upload-image'
})`
  --imageSize: auto;
  min-width: 100%;
  max-width: 100%;
  max-height: 250px;

  grid-area: message;
  justify-self: flex-end;

  border-radius: 8px;
  background-color: var(--blueLighter);

  object-fit: contain;
`;
