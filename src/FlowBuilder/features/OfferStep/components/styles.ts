import styled from 'styled-components';

/* Assets */
import subscriptionImg from 'features/PaymentFlow/assets/bg.jpg';
import { getImage } from '@bit/scalez.savvy-ui.layouts';
import { savvyLogo } from '@bit/scalez.savvy-ui.svg';

export const StyledOfferPage = styled.div`
  display: grid;
  grid-auto-flow: row;
  grid-gap: 16px;
  justify-items: center;

  .image-wrapper {
    width: 100%;
    height: 100%;
    display: grid;
    place-content: stretch;

    overflow: hidden;
    position: relative;

    &::before {
      content: '';

      display: block;

      width: 100%;
      height: 50%;

      bottom: 10px;
      left: 0;
      z-index: 1;
      position: absolute;

      background-image: linear-gradient(
        180deg,
        rgba(252, 230, 227, 0) 0%,
        #fce6e3 150%
      );
    }
  }

  h1 {
    text-align: center;
  }

  p {
    text-align: center;
    padding: 0px 16px 0px;
  }

  .offer-block {
    background-color: #fff;
    height: 563px;
    width: 340px;
    margin-bottom: 60px;
    box-shadow: var(--cardShadowBlue);

    align-content: center;
    place-content: stretch;

    border: 1px solid var(--blueLight);
    border-radius: 16px;
    content: attr(data-prefix);

    span {
      color: var(--blueDarker);
    }

    .offer-title {
      display: grid;
      grid-template-areas: 'dollar desc';
      grid-gap: 8px;
      grid-template-columns: 30px calc(100% - 30px);

      align-items: center;
      justify-items: flex-start;
      .dollar-ellipse {
        grid-area: dollar;
        background: linear-gradient(135deg, #5c5388 0%, #241959 100%);
        height: 24px;
        width: 24px;
        border-radius: 50%;
        display: grid;
        grid-column: auto;
        justify-self: flex-end;
        margin-top: 5px;
        svg {
          align-self: center;
          justify-self: center;
        }
      }

      h4 {
        grid-area: desc;
        margin-top: 30px;
        margin-bottom: 20px;
      }
    }

    p {
      text-align: left;
      padding: 12px 16px 12px;
      color: white;
      background: linear-gradient(135deg, #5c5388 0%, #241959 100%);
      border-radius: 16px 16px 0px 0px;
      margin: 0px;
      height: 34px;
    }

    img {
      max-width: 338px;
    }
  }
`;

export const StyledSubscriptionImage = styled(getImage()).attrs({
  src: subscriptionImg,
  alt: 'subscription-image'
})`
  width: 100%;
  height: auto;
  max-height: inherit;

  object-position: 0 -10px;
  border-radius: 0;
`;

export const StyleSavvyLogo = styled(getImage()).attrs({
  src: savvyLogo({ scale: 0.7 }),
  alt: 'savvy_logo'
})`
  --imageSize: 56px;
  object-fit: contain;
  position: relative;
  margin-top: -55px;
  z-index: 4;
`;
