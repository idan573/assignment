import styled from 'styled-components';
import { getImage } from '@bit/scalez.savvy-ui.layouts';

import placeholderImg from 'features/StylistOverviewPage/assets/placeholderImg.jpg';

export const StyledPlaceholderImage = styled(getImage()).attrs({
  alt: 'placeholder-image',
  src: placeholderImg
})`
  width 100%;
  height: auto;
  
  border-radius: 0;
  box-shadow: none;
  transition: none;

  filter: blur(10px);
`;

export const StyledOutfitsList = styled.section`
  display: grid;
  grid-gap: 16px;

  h2 {
    justify-self: center;
  }

  p.empty-text {
    padding: 0 16px;
    text-align: center;
    color: var(--bluePrimary);
  }

  ul {
    margin: 0;
    padding: 0;
    list-style: none;

    display: grid;
    grid-gap: 24px;

    background-color: var(--blueLighter);
  }

  div.load-more-button-wrapper {
    padding: 0 16px;
  }

  & > *:last-child {
    margin-bottom: 80px;
  }
`;
