import styled from 'styled-components';
import { getImage } from '@bit/scalez.savvy-ui.layouts';
import { savvyLogo } from '@bit/scalez.savvy-ui.svg';

export const StyledSavvyLogo = styled(getImage()).attrs({
  src: savvyLogo({ scale: 0.65 }),
  alt: 'savvy_logo'
})`
  --imageSize: 80px;
  object-fit: contain;
`;

export const StyledFreeRulesExperience = styled.div`
  .desc {
    margin: 48px 16px 16px 16px;
    height: 171px;
    padding: 16px 16px 16px 16px;
    position: relative;
    border: 1px solid var(--blueLight);
    border-radius: 24px;
    .desc-content {
      position: relative;
      top: -55px;
      height: 171px;
      display: grid;
      grid-auto-flow: row;
      grid-gap: 16px;
      justify-items: center;
      text-align: center;
    }
  }

  h2 {
    padding-left: 16px;
    padding-top: 32px;
  }

  .rules-experience-grid {
    padding-top: 24px;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(130px, 180px));
    grid-gap: 4px;
    justify-items: center;
    align-items: center;
    justify-content: center;

    .experience-item {
      img {
        max-height: 170px;
        max-width: 170px;
        border-radius: 16px 16px 0px 0px;
      }

      .title-container {
        position: relative;
        display: flex;
        align-items: center;
        top: -30px;
        border-radius: 16px;
        box-shadow: var(--cardShadowBlue);
        z-index: 1;
        background: white;
        height: 60px;
        justify-content: center;
        p {
          padding: 8px 16px;
          text-align: center;
          top: -30px;
          max-width: 170px;
        }
      }
    }
  }
`;
