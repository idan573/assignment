import styled from 'styled-components';
import { spinner, noProductsIllustration } from '@bit/scalez.savvy-ui.svg';
import { getImage } from '@bit/scalez.savvy-ui.layouts';

export const StyledNoProductsIllustration = styled(getImage()).attrs({
  src: noProductsIllustration(),
  alt: 'no-products-illustration'
})`
  --imageSize: 160px;

  border-radius: 0;
  box-shadow: none;
`;

export const StyledInfiniteGridBlock = styled.div`
  overscroll-behavior: contain;

  .grid {
    padding-bottom: 16px;
    overflow-x: hidden !important;
  }

  .product-types-wrapper {
    padding: 8px 16px;

    overflow-x: auto;
    overflow-y: hidden;

    display: grid;
    grid-auto-flow: column;
    grid-gap: 8px;
    align-items: center;
    justify-content: flex-start;

    &::after {
      content: '';
      display: block;
      width: 8px;
      height: 100%;
    }
  }

  .empty-closet-wrapper {
    width: 100%;
    height: var(--screenHeight);

    padding: 24px;

    display: grid;
    place-items: center;
    place-content: center;
    grid-gap: 16px;

    text-align: center;
  }
`;

export const StyledSpinnerBlock = styled.div`
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  background-image: url("${spinner({ scale: 0.5 })}");
`;
