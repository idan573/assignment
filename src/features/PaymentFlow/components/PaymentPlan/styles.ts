import styled from 'styled-components';
import { getImage } from '@bit/scalez.savvy-ui.layouts';
import { savvyLogo, check, noUser } from '@bit/scalez.savvy-ui.svg';

/* Assets */
import subscriptionImg from '../../assets/bg.jpg';
import modalGif from '../../assets/modal.gif';

export const StyledSubscriptionImage = styled(getImage()).attrs({
  src: subscriptionImg,
  alt: 'subscription-image'
})`
  width: 100%;
  height: auto;
  max-height: inherit;

  border-radius: 0;
`;

export const StyledSavvyLogo = styled(getImage()).attrs({
  src: savvyLogo({ scale: 0.65 }),
  alt: 'savvy_logo'
})`
  --imageSize: 56px;
  object-fit: contain;
  margin-top: -45px;
  z-index: 1;
`;

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

export const StyledPaymentPlanPage = styled.div`
  width: 100%;
  height: auto;

  padding: 0 16px 16px;
  margin: 0 auto;

  display: grid;
  place-items: center;
  grid-gap: 16px;
  
  .image-wrapper {
    width: calc(100% + 32px);
    display: grid;
    place-content: stretch;

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
      
    .back-button {
      top: 16px;
      left: 16px;
      z-index: 1;
      position: absolute;
    }
  }

  .sub-header{
    text-align: center;
  }

  fieldset {
    width: 100%;
    display: contents;

    border: none;
    margin: 0;
    padding: 0;
    position: relative;


    label {
      width: inherit;
      padding: 24px 16px;

      overflow: hidden;
      cursor: pointer;
      position: relative;

      display: grid;
      grid-gap: 0px 24px;
      grid-template-columns: 24px auto auto;
      grid-template-areas: 
          'check period price' 
          'check period-description price-description';
      justify-items: flex-start;
      align-items: center;
      justify-content: flex-start;
      align-content: center;
      place-content: stretch;

      border: 1px solid var(--blueLight);
      border-radius: 16px;
      background-color: #fff;


      h4 {
        grid-area: period;
      }

      h3 {
        grid-area: price;
        justify-self: flex-end;
      }

      p {
        grid-area: period-description;
      }

      span {
        grid-area: price-description;
        justify-self: flex-end;
        color: var(--blueDark);
      }

      &::before {
        grid-area: check;

        content: '';

        width: 24px;
        height: 24px;

        display: block;
        flex-shrink: 0;

        background-color: #fff;
        border-radius: 50%;
        border: 2px solid var(--blueLighter);

        background-size: 100%;
        background-position: center;
        background-repeat: no-repeat;
        background-image: none;

        transition: background-image 0.1s background-color 0.1s;
        will-change: background-image;
      }

      &[data-prefix] {
        grid-template-areas: 
          'prefix prefix prefix' 
          'check period price' 
          'check period-description price-description';
        
        &::after {
          grid-area: prefix;

          content: attr(data-prefix);
          width: calc(100% + 34px);
          padding: 12px;
          margin-left: -16px;
          margin-top: -24px;
          margin-bottom: 24px;

          background-color: var(--blueLighter);
          transition: background-color 0.1s;
          will-change: background-color;

          font-family: var(--fm);  
          font-weight: 500;
          font-size: 1.4rem;
          line-height: 125%;
          color: var(--blueDarker);
        }
      }
    }
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
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        background-image: url("${check({ scale: 0.7 })}");
      }
    }
  }
`;

export const StyledRadio = styled.input.attrs({
  type: 'radio'
})`
  height: 0;
  width: 0;
  
  position: absolute;
  cursor: pointer;

  opacity: 0;
  visibility: hidden;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;

  &:checked {
    & + label.checkbox-label {
      box-shadow: var(--cardShadowBlue);
      border: 2px solid var(--blueDark);

      span {
        color: var(--blueDarker);
      }

      &::after {
        background-image: var(--gradientBlue);
        background-color: none;
        color: #fff;
      }

      &::before {
        border: none;
        background-color: var(--blueDark);
        background-image: url('${check({ scale: 0.7, stroke: 'white' })}');
      }
    }
  }
`;
