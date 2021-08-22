import { createGlobalStyle } from 'styled-components';

import MontserratLight from 'assets/fonts/Montserrat-Light.woff2';
import MontserratRegular from 'assets/fonts/Montserrat-Regular.woff2';
import MontserratMedium from 'assets/fonts/Montserrat-Medium.woff2';
import MontserratSemiBold from 'assets/fonts/Montserrat-SemiBold.woff2';
import MontserratBold from 'assets/fonts/Montserrat-Bold.woff2';

import MontserratVF from 'assets/fonts/Montserrat-VF.woff2';

export const Fonts = createGlobalStyle`
  @font-face {
    font-family: 'Montserrat-VF';
    src: local('Montserrat'),
      url('${MontserratVF}') format('woff2-variations');
    font-weight: normal;
    font-style: normal;
    font-display: fallback;
  }

  @font-face {
    font-family: 'Montserrat-VF-Light';
    src: local('Montserrat'),
      url('${MontserratVF}') format('woff2-variations'),
      url('${MontserratLight}') format('woff2');
    
    /* font-variation-settings: 'wght' 250; */
    font-weight: 250;
    font-style: normal;
    font-display: fallback;
  }


  @font-face {
    font-family: 'Montserrat-VF-Regular';
    src: local('Montserrat'),
      url('${MontserratVF}') format('woff2-variations'),
      url('${MontserratRegular}') format('woff2');
    
    /* font-variation-settings: 'wght' 380; */
    font-weight: 380;
    font-style: normal;
    font-display: fallback;
  }

  @font-face {
    font-family: 'Montserrat-VF-Medium';
    src: local('Montserrat'),
      url('${MontserratVF}') format('woff2-variations'),
      url('${MontserratMedium}') format('woff2');
    
    /* font-variation-settings: 'wght' 500; */
    font-weight: 500;
    font-style: normal;
    font-display: fallback;
  }

  @font-face {
    font-family: 'Montserrat-VF-SemiBold';
    src: local('Montserrat'),
      url('${MontserratVF}') format('woff2-variations'),
      url('${MontserratSemiBold}') format('woff2');
    
    /* font-variation-settings: 'wght' 650; */
    font-weight: 650;
    font-style: normal;
    font-display: fallback;
  }

  @font-face {
    font-family: 'Montserrat-VF-Bold';
    src: local('Montserrat'),
      url('${MontserratVF}') format('woff2-variations'),
      url('${MontserratBold}') format('woff2');
    
    /* font-variation-settings: 'wght' 720; */
    font-weight: 720;
    font-style: normal;
    font-display: fallback;
  }
`;
