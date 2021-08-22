import styled from 'styled-components';

/* Styles */
import { dislikeBtn, likeBtn } from 'globalstyles/variables';

export const StyledControlsBlock = styled.div`
  width: 80%;

  display: flex;
  justify-self: center;
  align-items: center;
  justify-content: space-evenly;
`;

const StyledControlButton = styled.button.attrs({
  type: 'button'
})`
  width: 96px;
  height: 96px;

  position: relative;
  overflow: hidden;

  display: flex;
  align-items: center;
  justify-content: center;

  background-color: #fff;
  background-position: center;
  background-size: 45px;
  background-repeat: no-repeat;

  border-radius: 50%;
  border: 4px solid transparent;

  &[disabled] {
    opacity: 0.4;
  }
`;

export const StyledDislikeButton = styled(StyledControlButton)`
  border-color: var(--blueLight);
  box-shadow: var(--cardShadowBlueLong);
  background-image: url('${dislikeBtn()}');
`;

export const StyledLikeButton = styled(StyledControlButton)`
  border-color: var(--pinkLight);
  box-shadow: var(--cardShadowPinkLong);
  background-image: url('${likeBtn()}');
`;
