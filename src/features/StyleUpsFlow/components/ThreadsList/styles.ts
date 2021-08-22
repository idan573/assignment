import styled from 'styled-components';
import { noSessionsIllustration } from '@bit/scalez.savvy-ui.svg';
import { getImage } from '@bit/scalez.savvy-ui.layouts';

export const StyledNoSessionsIllustration = styled(getImage()).attrs({
  src: noSessionsIllustration(),
  alt: 'no-sessions-illustration'
})`
  --imageSize: 160px;

  border-radius: 0;
  box-shadow: none;
`;

export const StyledEmptyList = styled.section`
  width: 100%;
  height: auto;
  min-height: calc(var(--screenHeight) - 3 * var(--headerHeight));

  display: grid;
  place-content: center;
  place-items: center;
  grid-gap: 16px;

  p {
    color: var(--bluePrimary);
    text-align: center;
  }
`;
