import styled from 'styled-components';
import { getImage } from '@bit/scalez.savvy-ui.layouts';
import { check, noUser } from '@bit/scalez.savvy-ui.svg';

/* Assets */
import subscriptionImg from '../../assets/subscriptionImg.png';
import modalGif from '../../assets/modal.gif';

export const StyledModalGif = styled(getImage()).attrs({
  src: modalGif,
  alt: 'gif-animation'
})`
  width: calc(100% + 32px);
  height: auto;
  max-height: inherit;

  box-shadow: none;
  border-radius: 24px 24px 0 0;
`;

export const StyledModalContent = styled.div`
  margin-top: -24px;
  display: grid;
  grid-gap: 16px;
  place-content: center;
  place-items: center;
  text-align: center;

  span {
    color: var(--bluePrimary);
  }

  button:first-of-type {
    margin-top: 16px;
  }

  button:last-of-type {
    margin-bottom: 8px;
  }
`;

export const StyledSubscriptionImage = styled(getImage()).attrs({
  src: subscriptionImg,
  alt: 'subscription-image'
})`
  width: 100%;
  height: auto;
  max-height: inherit;

  border-radius: 0;
`;

export const StyledStylistImage = styled(
  getImage({
    icon: noUser
  })
).attrs({
  alt: 'stylist-image'
})`
  --imageSize: 48px;
`;

export const StyledTrialPage = styled.div`
  width: 100%;
  height: auto;

  padding: 8px 16px 64px;
  margin: 0 auto;

  display: grid;
  place-items: center;
  grid-gap: 24px;

  .stylist-block {
    margin-top: 24px;
    padding: 0 16px 24px;

    display: grid;
    place-items: center;
    grid-gap: 8px;

    text-align: center;

    border: 1px solid var(--blueLight);
    border-radius: 16px;

    img {
      margin-top: -24px;
    }

    span {
      margin-top: 8px;
    }
  }

  .subscription-block {
    width: 100%;

    overflow: hidden;
    position: relative;

    box-shadow: var(--cardShadowBlueLong);
    border-radius: 16px;

    .image-wrapper {
      width: calc(100% + 32px);
      height: 96px;
    
      display: grid;
      place-content: center;

      margin-left: -16px;
      overflow: hidden;
      position: relative;


      &::before {
        content: '';

        display: block;

        width: 100%;
        height: 100%;

        bottom: 0;
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

    .content-wrapper {
      padding: 24px 16px ;

      display: grid;
      grid-gap: 16px;

      hr {
        width: calc(100% + 2 * 16px);
        height: 1px;

        margin: 8px 0 8px -16px;

        border: none;
        background-color: var(--blueLighter);
      }

      .price-block {
        display: grid;
        grid-template-areas: 'plan-desc plan-price';
        flex-direction: row;
        align-items: flex-end;

        .desc-block{
          grid-area: 'plan-desc';
          color: var(--bluePrimary);
        }

        .plan-block {
          h3 {
            margin: 0 4px;
            line-height: 1;
            grid-area: 'plan-price';
            text-align: end;
            color: var(--bluePrimary)
          }

          h3::before {
            content: '$';
            align-self: flex-start;
          }

          h3::after{
            content: ' / ' attr(data-period-unit);
            font-size: 14px;
          }
        }
      }
    }

    .info-block {
      height: 84px;
      
      padding: 19px;
      
      text-align: center;
      background-color: var(--blueLighter);
    }
    ul {
      list-style: none;
      overflow-y: hidden;

      padding: 0 0 8px 4px;
      margin: 0;

      display: grid;
      grid-gap: 16px;

      li {
        display: flex;
        align-items: center;

        &::before {
          content: '';

          margin-right: 16px;

          flex-shrink: 0;
          
          width: 24px;
          height: 24px;

          border-radius: 50%;
          background-color: #fff;
          box-shadow: var(--cardShadowBlue);
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          background-image: url("${check({ scale: 0.7 })}");
        }
      }
    }

  }
`;
