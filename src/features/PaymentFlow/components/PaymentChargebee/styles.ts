import styled, { createGlobalStyle } from 'styled-components';
import { check } from '@bit/scalez.savvy-ui.svg';

export const GlobalPageStyles = createGlobalStyle`
  header#app-header {
    position: relative;
    background-color: transparent;
  }

  #root > [class*="StyledSlidePageWrapper"] {
    padding-top: 0;
  }
`;

export const StyledPaymentPage = styled.div`
  hr {
    height: 2px;

    margin: 0;

    transition: opacity 0.3s;
    border: none;
    background-color: var(--blueLighter);
  }

  section.order-summary-section {
    padding: calc(var(--headerHeight) + 16px) 16px 40px;
    background-color: var(--pinkLighter);
  }

  div.padding-block {
    padding: 0 16px;
    margin-top: -24px;

    .terms-block {
      padding: 8px 0;

      display: grid;
      grid-gap: 32px;
      place-content: space-evenly;
      grid-auto-flow: column;

      a {
        height: 48px;
        display: grid;
        place-content: center;
        place-items: center;
        text-decoration: none;

        span {
          text-align: center;
          color: var(--bluePrimary);
        }
      }
    }

    section {
      &[data-is-expanded='false'] {
        max-height: 100px;

        form > h3 {
          cursor: pointer;
        }
      }

      &[data-is-blocked="true"] {
        h3 {
          color: var(--blueLight);

          span {
            color: var(--blueLight);
            
            &::before {
              display: none;
            }
          }
        }
      }


      max-height: 700px;
      padding: 0 0 40px;

      overflow: hidden;
      transition: max-height 0.3s;

      h3 {
        height: 100px;
        margin-bottom: -24px;

        display: flex;
        align-items: center;
        justify-content: space-between;

        span {
          display: grid;
          grid-gap: 8px;
          grid-auto-flow: column;
          place-items: center;

          color: var(--bluePrimary);

          &[data-is-done="true"]::before {
            content: '';

            width: 20px;
            height: 20px;
            
            display: block;

            border-radius: 50%;
            background-position: center;
            background-repeat: no-repeat;
            background-size: cover;
            background-color: var(--blueDark);
            background-image: url("${check({
              stroke: 'white',
              strokeWidth: 3,
              scale: 0.6
            })}");
          }
        }
      }
    }
  }
`;
