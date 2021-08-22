import styled from 'styled-components';
import { animated } from 'react-spring';

export const StyledLikeAnimation = styled(animated.div)<any>`
  width: 48px;
  height: 48px;

  display: grid;
  place-items: center;

  z-index: 2;
  bottom: 0;
  position: absolute;

  font-size: 1.6rem;
  font-family: var(--fm);
  line-height: 20px;
  color: var(--blueDarker);

  border-radius: 50%;
  box-shadow: var(--cardShadowBlue);
  background-color: #fff;
`;

export const StyledProductExperience = styled.section`
  width: 100%;
  height: var(--activeScreenHeight);
  padding: 36px 16px 0;
`;
