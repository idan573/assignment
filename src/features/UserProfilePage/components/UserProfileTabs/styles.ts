import styled from 'styled-components';
import { SwipeableViews } from '@bit/scalez.savvy-ui.swipeable-views';
import { getImage } from '@bit/scalez.savvy-ui.layouts';

export const StyledUserImage = styled(getImage()).attrs<
  React.ImgHTMLAttributes<HTMLImageElement>
>({
  alt: 'user-image',
  onError: (e: React.BaseSyntheticEvent<HTMLImageElement>) => {
    e.target.style = ` 
      display: none;
    `;
    e.target.onError = null;
  }
})`
  width: 100%;
  height: auto;
  border-radius: 20px;
  transition-duration: 0.2s;
`;

export const StyledViewsControls = styled.div`
  &:empty {
    display: none;
  }

  --tabButtonHeight: var(--headerHeight);
  top: -1px;
  z-index: 1;
  position: sticky;
  overflow-x: auto;

  display: grid;
  grid-gap: 0;
  grid-auto-flow: column;
  justify-content: stretch;
  grid-auto-columns: 1fr;

  button {
    height: var(--tabButtonHeight);
    padding: 24px 0;

    position: relative;
    outline: none;
    cursor: pointer;

    border: none;
    background-color: #fff;

    &::after {
      content: '';

      width: 100%;
      display: block;

      bottom: 0;
      left: 0;
      position: absolute;
    }

    &[data-is-active='true'] {
      &::after {
        height: 4px;
        background-image: var(--gradientBlue);
      }
    }

    &[data-is-active='false'] {
      span {
        color: var(--bluePrimary);
      }

      &::after {
        height: 2px;
        background-image: none;
        background-color: var(--blueLight);
      }
    }
  }
`;

export const StyledSwipeableViews = styled(SwipeableViews)`
  top: calc(3 * var(--headerHeight));

  & > *:not(.outfits-tab) {
    padding: 24px 16px;
  }

  div.photos-tab {
    display: grid;
    grid-gap: 12px;
  }
`;
