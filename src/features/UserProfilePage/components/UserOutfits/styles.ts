import styled from 'styled-components';
import { getImage } from '@bit/scalez.savvy-ui.layouts';

import placeholderImg from 'features/StylistOverviewPage/assets/placeholderImg.jpg';

export const StyledPlaceholderImage = styled(getImage()).attrs({
  alt: 'placeholder-image',
  src: placeholderImg
})`
  width 100%;
  height: 500px;
  
  filter: blur(10px);

  object-fit: contain;
  object-position: top;
  
  border-radius: 0;
  box-shadow: none;
  transition: none;

`;

export const StyledEmptyOutfitsList = styled.section`
  display: grid;
  grid-gap: 24px;

  background-color: #fff;

  h3 {
    justify-self: center;
  }

  p {
    padding: 0 16px;
    text-align: center;
    color: var(--bluePrimary);
  }
`;

export const StyledOutfitsListHeader = styled.div`
  padding: 16px;
  display: grid;
  grid-gap: 16px;
  grid-auto-flow: column;
  place-content: space-between;
  place-items: center;
  background-color: #fff;
`;
