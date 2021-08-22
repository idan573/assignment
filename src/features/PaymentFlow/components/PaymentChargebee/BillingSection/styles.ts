import styled from 'styled-components';
import { Button } from '@bit/scalez.savvy-ui.button';
import { getImage } from '@bit/scalez.savvy-ui.layouts';
import { lock } from '@bit/scalez.savvy-ui.svg';

/* Assets */
import cardsImg from '../../../assets/cards.svg';

export const StyledButton = styled(Button)`
  &:hover {
    opacity: 1;
  }

  .loading-text {
    @keyframes slide-in {
      0% {
        opacity: 0;
        transform: translateY(-25%);
      }

      100% { 
        opacity: 1;
        transform: translateY(0%);
      }
    }

    @keyframes slide-out {
      0% { 
        opacity: 1;
        transform: translateY(0%);
      }

      100% { 
        opacity: 0;
        transform: translateY(25%);
      }
    }

    position: absolute;

    animation-duration: 0.5s;
    animation-timing-function: cubic-bezier(0.4, 0, 1, 1);

    &[data-slide-in="true"] {
      opacity: 1;
      animation-name: slide-in;
    }

    &[data-slide-in="false"] {
      opacity: 0;
      animation-name: slide-out;
    }
  }

  &&& {
    width: 98%;
    margin: 0 auto;

    &[data-is-loading="true"] {
      box-shadow: none;
      pointer-events: none;

      background-image: url("${encodeURI(`data:image/svg+xml,
        <svg xmlns="http://www.w3.org/2000/svg">
          <style>
            @keyframes dashoffset {
              to { 
                stroke-dashoffset: -1236; 
              }
            }
          </style>

          <rect 
            width="100%" 
            height="100%"
            rx="24" 
            ry="24" 
            stroke="rgb(251,236,235)" 
            stroke-width="6" 
            stroke-dasharray="618" 
            fill="none"
            stroke-linecap="round"
            style="animation: dashoffset 1.2s linear infinite;" 
          />
        </svg>
      `)}");
    }
  }
`;

export const StyledCardsImage = styled(getImage()).attrs({
  src: cardsImg,
  alt: 'cards-list-image'
})`
  width: 100%;
  height: auto;
  margin: 16px 0 0;
  border-radius: 0;
  box-shadow: none;
`;

export const StyledBillingSection = styled.section`
  display: grid;
  grid-gap: 24px;
  place-content: flex-start center;
  justify-content: stretch;

  .chargebee-fieldset {
    display: contents;

    .inputs-row {
      display: grid;
      grid-gap: 8px;
      grid-template-columns: 1fr 1fr;
      grid-auto-flow: column;
    }

    .chargebee-input {
      width: inherit;
      height: 48px;

      padding: 14px 12px;

      background-color: #fff;
      border-width: 1px;
      border-style: solid;
      border-color: var(--blueLight);
      border-radius: 24px;

      font-family: var(--fr);
      font-size: 1.4rem;
      line-height: 125%;
      text-overflow: ellipsis;
      color: var(--blueDarker);

      &.focus {
        border-width: 2px;
      }

      &.invalid {
        border-color: var(--red);
      }

      &[pattern]:invalid:not(:placeholder-shown) {
        border-width: 2px;
        border-color: var(--pinkDark);
      }
    }

    .form-field-error {
      white-space: nowrap;

      &:empty {
        display: none;
      }
    }
  }

  p.error {
    width: 100%;
    height: 50px;

    padding: 16px;

    display: grid;
    place-content: center;
    place-items: center;

    border-radius: 16px;
    background-color: var(--pinkDark);

    overflow: hidden;
    text-align: center;
    color: #fff;

    &:empty {
      display: none;
    }
  }

  p.secure-payment {
    margin: 8px 0;

    display: grid;
    grid-gap: 16px;
    grid-auto-flow: column;
    place-content: center;
    place-items: center;

    text-align: center;
    color: var(--bluePrimary);
    
    &::before {
      content: '';

      width: 12px;
      height: 12px;
      
      display: block;

      background-position: center;
      background-repeat: no-repeat;
      background-size: cover;
      background-image: url("${lock({ stroke: 'var(--bluePrimary)' })}");
    }
  }
`;
