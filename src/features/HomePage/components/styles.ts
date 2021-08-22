import styled, { createGlobalStyle } from 'styled-components';
import { getImage } from '@bit/scalez.savvy-ui.layouts';
import { userPlus } from '@bit/scalez.savvy-ui.svg';

export const GlobalPageStyles = createGlobalStyle`
  header#app-header {
    background-color: var(--pinkLighter);
  }
`;

export const StyledHomepage = styled.div`
  height: calc(var(--activeScreenHeight) - var(--headerHeight));
  padding-bottom: var(--headerHeight);
`;

export const StyledAddStylistHeaderItem = styled.div`
  display: grid;
  grid-gap: 8px;
  grid-auto-flow: column;
  align-items: center;
`;

export const StyledVacationStylistHeaderItem = styled.div`
  display: grid;
  grid-gap: 0px 8px;
  grid-auto-rows: 1fr;
  align-items: center;

  button {
    grid-row: 1/3;
  }

  h4 {
    grid-row: 1;
  }
`;
