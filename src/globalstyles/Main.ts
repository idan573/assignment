import styled, { keyframes, createGlobalStyle } from 'styled-components';
import { savvyLogo, defaultProductType } from '@bit/scalez.savvy-ui.svg';
import { getImage } from '@bit/scalez.savvy-ui.layouts';

export const CssApp = createGlobalStyle`
  #root {
    overflow: auto;
  }

  .intercom-container,
  .intercom-lightweight-app {
    display: none;
    
    &&& {
      z-index: 9;
    }
    
    .intercom-lightweight-app-launcher,
    .intercom-launcher-frame {
      bottom: calc(var(--headerHeight) + 20px);
    }

    .intercom-launcher-badge-frame {
      bottom: calc(var(--headerHeight) + 60px);
    }
  }
`;

export const StyledSavvyLogo = styled(getImage()).attrs({
  src: savvyLogo(),
  alt: 'savvy-logo'
})`
  width: 53px;
  height: 32px;

  &&& {
    box-shadow: none;
    border-radius: 0;

    object-fit: contain;
    transition: none;
  }
`;

export const StyledCounter = styled.div`
  width: max-content;
  height: 40px;

  padding: 12px;

  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 1.4rem;
  font-family: var(--fm);
  line-height: 17px;
  color: var(--bluePrimary);

  border-radius: 24px;
  background-color: var(--blueLighter);

  &[data-animate='true'] {
    animation: ${keyframes`
      0% {
        transform: scale(1);
      }
      
      50% {
        transform: scale(1.3);
      }

      100% {
        transform: scale(1);
      }
    `} 0.7s cubic-bezier(0, 0, 0.01, 1.01);
  }

  &::before {
    content: '';

    display: block;

    width: 16px;
    height: 16px;

    margin-right: 5px;

    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    
    background-image: url('${defaultProductType({
      fill: 'var(--bluePrimary)'
    })}');
  }
`;
