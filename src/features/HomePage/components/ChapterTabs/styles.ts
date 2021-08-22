import styled from 'styled-components';
import { Tabs } from '@bit/scalez.savvy-ui.tabs';

export const StyledTabs = styled(Tabs)`
  padding-top: 16px;
  margin: 0 -16px 24px;

  div.chapter-tabs-controls {
    width: 100%;

    padding: 16px;

    top: 0;
    z-index: 1;
    position: absolute;

    display: grid;
    grid-auto-flow: column;
    justify-content: space-between;
    grid-template-areas: 'prev next';

    button {
      height: 82px !important;
    }

    button.next {
      grid-area: next;
    }

    button.prev {
      grid-area: prev;
    }
  }

  div.chapter-wrapper {
    display: grid;
    grid-gap: 40px;
    place-items: center;

    p.chapter-description {
      text-align: center;
      color: var(--blueDark);

      &:empty {
        display: none;
      }
    }
  }
`;
