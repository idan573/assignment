import styled from 'styled-components';
import { getImage } from '@bit/scalez.savvy-ui.layouts';
import { noUser } from '@bit/scalez.savvy-ui.svg';

export const StyledStylistReplacementPage = styled.section`
  width: 100%;
  height: auto;
  min-height: calc(var(--activeScreenHeight) - var(--headerHeight) - 16px);

  padding: 0 16px;

  display: grid;
  grid-gap: 16px;
  place-content: center;
  place-items: center;

  h3 {
    text-align: center;
  }
`;

export const StyledStylistImage = styled(
  getImage({
    icon: noUser
  })
).attrs({
  alt: 'clock'
})`
  --imageSize: 120px;
`;

export const StyledButtonsBlock = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 16px;
`;
