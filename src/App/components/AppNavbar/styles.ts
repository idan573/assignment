import { createGlobalStyle } from 'styled-components';

export const GlobalPageStyles = createGlobalStyle`
  #root > [class*="StyledSlidePageWrapper"] {
    padding-bottom: calc(var(--headerHeight));
  }

  & .indicator-label {
    width: 15px;
    height: 15px;
    margin-top: 5px;
  }
`;
