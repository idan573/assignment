import { animated } from 'react-spring';
import styled from 'styled-components';

export const StyledSlidePageWrapper = styled(animated.div)`
  width: 100%;
  top: 0;
  left: 0;
  position: absolute;
  overflow-x: hidden;

  &[data-is-loading='true'] {
    opacity: 0.8;

    *,
    *::before,
    *::after {
      pointer-events: none;
    }
  }
`;
