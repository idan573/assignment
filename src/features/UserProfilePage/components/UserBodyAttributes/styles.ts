import styled from 'styled-components';
import { getImage } from '@bit/scalez.savvy-ui.layouts';

export const StyledBodyAttrIcon = styled(getImage()).attrs({
  alt: 'user-image'
})`
  --imageSize: 32px;

  border-radius: 0;
  box-shadow: none;
  transition: none;
`;

export const StyledUserBodyAttributes = styled.div`
  display: grid;
  grid-gap: 40px;

  div.attributes-grid {
    display: grid;
    grid-gap: 8px;
    grid-template-columns: repeat(6, 1fr);
    grid-template-rows: repeat(3, 150px);

    div.attribute-card {
      grid-row: var(--gridRow);
      grid-column: span 2;

      padding: 24px 16px;

      width: 100%;
      height: 100%;

      display: grid;
      grid-gap: 8px;

      background-color: #fff;
      border-radius: 16px;
      border: 1px solid var(--blueLight);

      &:nth-child(n + 4) {
        grid-column: span 3;
      }
    }
  }

  h2 {
    margin-top: 20px;
  }

  div.attribute-block {
    padding: 24px 0;

    display: grid;
    grid-gap: 8px;

    &:first-of-type {
      padding-top: 8px;
    }

    &:not(:last-of-type) {
      border-bottom: 1px solid var(--blueLight);
    }
  }
`;
