import styled from 'styled-components';
import { getImage } from '@bit/scalez.savvy-ui.layouts';

export const StyledEntryImage = styled(getImage()).attrs({
  alt: 'user-attribute-illustration'
})`
  width: auto;
  height: 100%;

  object-fit: scale-down;

  border-radius: 0;
  box-shadow: none;
  background-color: transparent;
`;

export const StyledUserAnalysisEntries = styled.div`
  --entryHeight: 200px;
  
  display: grid;
  grid-gap: 16px 8px;
  grid-template-columns: repeat(2, 1fr);
  grid-auto-rows: auto var(--entryHeight);

  &[data-is-loading='true'] {
    h3,
    span {
      color: var(--blueLight);
    }
  }

  div.section-title-block {
    grid-column: 1/3;

    display: grid;
    grid-auto-flow: column;
    justify-content: space-between;
    align-items: center;

    &:not(:first-of-type) {
      margin-top: 40px;
    }
  }

  div.analysis-entry-card {
    padding: 20px;

    width: 100%;
    height: 100%;
    min-height: var(--entryHeight);
    overflow: hidden;

    display: grid;
    grid-gap: 16px;
    place-content: center;
    place-items: center;
    grid-template-rows: 80% 20%;

    background-color: #fff;
    border-radius: 16px;
    box-shadow: var(--cardShadowBlue);

    span {
      width: 100%;
      overflow: hidden;
      text-align: center;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
`;
