import styled from 'styled-components';
import { getImage } from '@bit/scalez.savvy-ui.layouts';

/* Assets */
import bgImg from './assets/bg.jpg';

export const StyledBgImage = styled(getImage()).attrs({
  src: bgImg,
  alt: 'bg-image'
})`
  --imageSize: 200px;
  margin-bottom: 16px;
  border-radius: 16px;
`;

export const StyledPaymentSuccessPage = styled.section`
  &::before {
    content: '';

    width: 100%;
    height: 140px;

    top: 0;
    left: 0;
    position: absolute;

    background-color: var(--pinkLighter);
  }

  width: 100%;
  height: auto;
  min-height: var(--screenHeight);

  padding: 40px 16px 16px;
  position: relative;

  display: grid;
  grid-gap: 24px;
  place-items: center;
  place-content: flex-start;

  & > h2 {
    text-align: center;
  }

  & > p {
    text-align: center;
    margin-top: -16px;
    margin-bottom: 32px;
  }

  & > button:first-of-type {
    margin-top: 16px;
  }
`;
