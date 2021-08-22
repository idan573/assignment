import styled from 'styled-components';
import { noUser } from '@bit/scalez.savvy-ui.svg';
import { getImage } from '@bit/scalez.savvy-ui.layouts';

export const StyledStylistPage = styled.div`
  width: 100%;
  height: auto;
  min-height: var(--activeScreenHeight);

  display: grid;
  place-content: center;
  place-items: center;
  grid-gap: 16px;

  padding: 0 16px;

  hr {
    width: calc(100% + 32px);
    height: 1px;

    margin: 8px 0;
    margin-left: -16px;

    border: none;
    background-color: var(--blueLighter);
  }

  ol {
    list-style: none;
    counter-reset: custom-counter;

    padding: 0;
    margin: 8px 0 0 0;

    li {
      display: flex;
      align-items: center;
      counter-increment: custom-counter;

      &:not(:last-of-type) {
        margin-bottom: 16px;
      }

      &::before {
        content: counter(custom-counter);

        margin-right: 16px;

        width: 24px;
        height: 24px;

        display: flex;
        flex-shrink: 0;
        align-items: center;
        justify-content: center;

        font-family: var(--fsb);
        font-size: 1.1rem;
        line-height: 13px;
        text-transform: capitalize;
        color: var(--blueDarker);

        border-radius: 50%;
        background-color: #fff;
        box-shadow: var(--cardShadowBlue);
      }
    }
  }

  button {
    margin-top: 16px;
  }
`;

export const StyledStylistImage = styled(
  getImage({
    icon: noUser
  })
).attrs({
  alt: 'stylist profile picture'
})`
  --imageSize: 88px;
`;
