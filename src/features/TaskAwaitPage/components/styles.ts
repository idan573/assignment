import styled from 'styled-components';
import { getImage } from '@bit/scalez.savvy-ui.layouts';
import { clock, noUser } from '@bit/scalez.savvy-ui.svg';

export const StyledStylistImage = styled(
  getImage({
    icon: noUser
  })
).attrs({
  alt: 'stylist-profile-image'
})`
  --imageSize: 64px;
  margin-top: -48px;
  border: 1px solid var(--blueLight);
  box-shadow: none;
`;

export const StyledSuggestionImage = styled(getImage()).attrs({
  alt: 'suggestion-image'
})`
  width: 100%;
  height: auto;
  max-height: 300px;

  object-fit: contain;
  border-radius: 0;
  box-shadow: none;
`;

export const StyledCardImage = styled(getImage()).attrs({
  alt: 'button-image'
})`
  --imageSize: 112px;

  background-color: transparent;
  border-radius: 8px;
  box-shadow: none;
  filter: drop-shadow(var(--cardShadowBlue));
`;

export const StyledTaskAwaitPage = styled.div`
  width: 100%;
  height: auto;

  padding: 72px 16px 16px;
  margin-bottom: 100px;

  position: relative;

  display: grid;
  grid-gap: 8px;
  align-content: flex-start;

  text-align: center;

  &::before {
    content: '';

    width: 100%;
    height: 64px;

    top: 0;
    left: 0;
    position: absolute;

    display: block;

    background-color: var(--pinkLighter);
  }

  .back-button {
    top: 12px;
    left: 16px;
    position: absolute;
  }

  hr {
    width: 100%;
    height: 1px;

    margin: 8px 0;

    border: none;
    background-color: var(--blueLight);
  }

  .suggestion-block {
    display: grid;
    grid-gap: 16px;

    p {
      margin-top: -8px;
    }
  }

  .image-block {
    display: grid;
    place-items: center;
    grid-gap: 12px;

    .status-label {
      width: 130px;
      padding: 4px;

      display: grid;
      grid-gap: 4px;
      grid-auto-flow: column;
      place-items: center;
      place-content: center;

      background-color: #fff;

      &::before {
        content: '';

        width: 20px;
        height: 20px;

        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        background-image: url("${clock()}");
      }
    } 
  }
`;

export const StyledButtonsBlock = styled.div`
  display: grid;
  grid-gap: 16px;
  grid-auto-flow: column;
`;
