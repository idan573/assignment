import styled from 'styled-components';
import { getImage } from '@bit/scalez.savvy-ui.layouts';
import { savvyLogo } from '@bit/scalez.savvy-ui.svg';

/* Assets */
import bgImg from 'features/WelcomePage/assets/bg.jpg';

export const StyledSavvyLogo = styled(getImage()).attrs({
  src: savvyLogo(),
  alt: 'savvy-logo',
  className: 'savvy-logo'
})`
  width: 82px;
  height: 48px;

  box-shadow: none;
  border-radius: 0;
  object-fit: contain;
  background-color: transparent;
`;

export const StyledWelcomePage = styled.section`
  width: 100%;
  height: var(--screenHeight);

  padding: 32px 16px;
  /* 
    16px - gap between button and content
    16px - button padding bottom
    48px - button height
  */
  padding-bottom: calc(16px + 48px);

  position: relative;

  display: grid;
  grid-gap: 40px;
  place-content: center;
  place-items: center;
  align-content: flex-start;
  text-align: center;

  background-image: url("${bgImg}");
  background-size: 120%;
  background-repeat: no-repeat;
  background-position: center bottom;

  &::after {
    content: '';

    width: 100%;
    height: 120px;

    bottom: 0;
    left: 0;
    position: absolute;

    background: linear-gradient(
      to bottom,
      rgba(255, 255, 255, 0.001) 0%,
      rgba(255, 255, 255, 1) 40%,
      rgba(255, 255, 255, 1) 100%
    );
  }
`;
