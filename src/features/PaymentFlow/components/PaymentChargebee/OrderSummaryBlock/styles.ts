import styled from 'styled-components';
import { getImage } from '@bit/scalez.savvy-ui.layouts';
import { arrow } from '@bit/scalez.savvy-ui.svg';

/* Assets */
import subscriptionImg from 'features/PaymentFlow/assets/bg.jpg';

export const StyledSubscriptionImage = styled(getImage()).attrs({
  src: subscriptionImg,
  alt: 'subscription-image'
})`
  width: 100%;
  height: 100%;
  max-height: inherit;
  border-radius: 0;
`;

export const StyledOrderSummaryBlock = styled.div`
  width: 100%;

  cursor: pointer;
  overflow: hidden;

  border-radius: 16px;
  box-shadow: var(--cardShadowPink);

  .image-wrapper {
    width: 100%;
    height: 100px;
    display: grid;
    place-content: stretch;

    overflow: hidden;
    position: relative;

    &::before {
      content: '';

      display: block;

      width: 100%;
      height: 50%;

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

  &[data-is-expanded="false"] {
    .order-info-block {
      max-height: 60px;

      hr {
        opacity: 0;
      }
    }
  }

  .order-info-block {
    max-height: 320px;
    padding: 20px 16px;

    display: grid;
    grid-gap: 16px 20px;
    justify-content: space-between;
    align-content: flex-start;

    transition: max-height .3s;
    background-color: #fff;


    /* Stretch this content in two columns */
    & > *:is(hr, div.coupon-input, div.coupon-block,  button) {
      grid-column: 1/3;
    }

    div.coupon-input {
      input {
        cursor: pointer;
      }
    }

    button {
      margin-top: 10px;
    }

    div.coupon-block {
      display: grid;
      grid-gap: 8px 16px;
      grid-template-columns: 0.6fr 0.4fr;
      grid-auto-flow: column;
      place-items: center flex-start;

      p, h1 {
        max-width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      p:first-of-type {
        grid-column: 1/3;
      }

      h1 {
        grid-row: 2;
      }
    }

    span.price-bottom {
      text-align: end;

      &[data-is-free="true"] {
        text-decoration: line-through;
      }
    }
    
    span.price-top {
      display: grid;
      place-items: flex-end;
      place-content: flex-end;
      align-items: center;
      grid-auto-flow: column;
      grid-gap: 8px;

      &::after {
        content: '';

        width: 16px;
        height: 16px;
        
        display: block;

        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;

        background-image: url("${props =>
          arrow({
            strokeWidth: 3,
            rotate: props['data-is-expanded'] ? -90 : 90
          })}");
      }
    }
  }
`;
