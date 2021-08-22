import * as React from 'react';
import styled from 'styled-components';
import { animated, interpolate } from 'react-spring';

interface AnimatableProps {
  x: any;
  y: any;
  scale: any;
  rotation: any;
}

export const StyledTinderExperience = styled.div`
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-columns: 100%;
  grid-template-rows: 75% 25%;

  user-select: none;
`;

export const StyledCardsWrapper = styled.div`
  position: relative;
`;

export const StyledCard = styled(
  ({ x, y, rotation, scale, isActive, ...rest }) => <animated.div {...rest} />
).attrs<AnimatableProps & { isActive: boolean }>(
  ({
    x,
    y,
    rotation,
    scale,
    isActive
  }: AnimatableProps & { isActive: boolean }) => ({
    style: {
      boxShadow: isActive
        ? interpolate(
            [x, y],
            (x, y) => `${x / 3}px ${y / 3 || 6}px 18px rgba(13, 0, 72, 0.12)`
          )
        : '0px 6px 18px rgba(13, 0, 72, 0.12)',

      /*
        Rotation transformation, e.g. rotateY(${r / 10}deg) 
        brakes UI in safari and IOS devices
      */

      transform: interpolate(
        [x, y, rotation, scale],
        (x, y, r, s) =>
          `translate3d(${x}px,${y}px,0) rotateZ(${r}deg) scale(${
            isActive ? s : '0.9'
          })`
      )
    }
  })
)`
  width: 100%;
  height: 100%;

  top: 0;
  left: 0;
  z-index: 1;
  position: absolute;

  display: flex;
  justify-content: center;
  align-items: center;

  background-color: var(--blueLighter);
  border-radius: 24px;

  overflow: hidden;
  will-change: transform, box-shadow;
`;
