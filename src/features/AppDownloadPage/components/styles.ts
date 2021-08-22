import styled from 'styled-components';
import { getImage } from '@bit/scalez.savvy-ui.layouts';

import bg from '../assets/bg.png';

export const StyledBgImage = styled(getImage()).attrs({
  src: bg,
  alt: 'app-preview-image'
})`
  width: 100%;
  height: auto;

  border-radius: 0;
  box-shadow: none;

  transition: none;
`;

export const StyledAppDownloadPage = styled.section`
  padding: 16px;

  display: grid;
  grid-gap: 16px;
  place-items: center;
  place-content: center;

  h2,
  p {
    text-align: center;
  }

  h2 {
    margin-top: -16px;
  }
`;
