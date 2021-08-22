import styled from 'styled-components';

export const StyledChapterList = styled.div`
  --listItemSize: calc((var(--maxWidth) - 2 * var(--listPaddingLeftRight)) / 3);
  --listPaddingLeftRight: 40px;
  --listGap: 16px;

  @media (max-width: 500px) {
    --listItemSize: calc((100vw - 2 * var(--listPaddingLeftRight)) / 3);
  }

  margin: 16px -16px 0;
  height: 200px;
  position: relative;

  div.chapter-list-controls {
    display: grid;
    grid-auto-flow: column;
    justify-content: space-between;
    align-content: center;
    height: calc(var(--listItemSize) - var(--listGap) * 2);

    button {
      width: 44px !important;
      height: inherit !important;
    }
  }

  .chapter-swipeable-views {
    height: inherit;

    div.three-chapters-block {
      padding: 0 var(--listPaddingLeftRight);

      display: grid;
      grid-gap: var(--listGap);
      grid-auto-flow: column;
      grid-auto-columns: var(--listItemSize);
      align-items: flex-start;
      justify-content: center;

      .chapter-preview {
        --progressPadding: 2px;

        place-content: center;
        --chapterImageSize: calc(var(--listItemSize) - var(--listGap) * 2);

        .progress-block {
          display: none;
        }
      }
    }
  }
`;
