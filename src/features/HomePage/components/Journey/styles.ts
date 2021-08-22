import styled from 'styled-components';
import { check } from '@bit/scalez.savvy-ui.svg';
import { getImage } from '@bit/scalez.savvy-ui.layouts';

export const StyledCheckIcon = styled(getImage()).attrs({
  src: check({ stroke: 'white', scale: 0.75 }),
  alt: 'check-icon'
})`
  --imageSize: 27px;

  background-image: var(--gradientBlue);

  right: 16px;
  position: absolute;
`;

export const StyledJourney = styled.div`
  div.level-wrapper {
    &[data-is-blocked='true'] {
      opacity: 0.4;
    }

    &[data-is-done='true'] {
      cursor: pointer;
      border-bottom: 1px solid var(--blueLight);
    }

    padding: 24px 16px;

    display: grid;
    grid-gap: 16px;

    & > h2,
    & > p {
      text-align: center;

      &:empty {
        display: none;
      }
    }

    & > p {
      color: var(--blueDark);
    }

    & > ul {
      margin: 0 -16px;
    }
  }
`;
