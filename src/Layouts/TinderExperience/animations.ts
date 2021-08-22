import { GestureData } from './machine';

export const setDraggingAnimationConfig = ({ mx, my }: GestureData) => ({
  x: mx,
  y: my,
  rotation: mx / 100,
  scale: 1.03,
  config: {
    friction: 50,
    tension: 800
  }
});

export const setIdleAnimationConfig = ({ mx }: GestureData) => ({
  x: 0,
  y: 0,
  rotation: mx / 100,
  scale: 1,
  config: {
    friction: 50,
    tension: 500
  }
});

export const setTriggeredSwipeAnimationConfig = ({
  xDirection,
  yDirection,
  mx,
  velocity
}: GestureData) => ({
  x: (200 + window.innerWidth) * xDirection,
  y: (200 + window.innerHeight) * yDirection,

  /* How much the card tilts, flicking it harder makes it rotate faster */
  rotation: mx / 100 + xDirection * 10 * velocity,
  scale: 1,
  config: {
    friction: 50,
    tension: 150
  }
});

export const setTriggeredClickAnimationConfig = ({
  xDirection,
  velocity
}: GestureData) => ({
  x: (200 + window.innerWidth) * xDirection,
  y: -(200 + window.innerHeight),

  /* How much the card tilts, flicking it harder makes it rotate faster */
  rotation: (window.innerWidth * xDirection) / 100 + xDirection * 10 * velocity,
  scale: 1.05,
  config: {
    friction: 100,
    precision: 10,
    tension: 150
  }
});
