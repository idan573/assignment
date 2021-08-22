import styled from 'styled-components';
import { Overlay } from '@bit/scalez.savvy-ui.overlay';

export const StyledVideoPreviewOverlay = styled(Overlay)`
  padding: 0 8px 16px;

  display: grid;
  grid-template-rows:
    var(--headerHeight) calc(100% - var(--headerHeight) - 40px)
    40px;

  div.video-wrapper {
    height: 100%;
    padding: 8px 0 16px;

    video {
      width: 100%;
      height: 100%;

      border-radius: 16px;
      background-color: #000;

      &:not([src]) {
        display: none;
      }
    }
  }

  div.buttons-wrapper {
    display: grid;
    grid-gap: 8px;
    grid-auto-flow: column;
    grid-auto-columns: 1fr;
  }
`;
