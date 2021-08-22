import styled from 'styled-components';

export const StyledChooseCategoriesComponent = styled.section`
  width: 100%;
  height: var(--activeScreenHeight);

  padding: 0 16px 20px 16px;

  display: grid;
  grid-template-columns: 100%;
  grid-template-rows: calc(100% - 60px) 60px;

  div.content-wrapper {
    display: grid;
    grid-template-columns: 100%;
    grid-template-rows: 20% 80%;
  }

  div.text-block {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
    grid-gap: 8px;

    * {
      text-align: center;
    }
  }

  div.categories-block {
    width: calc(100% + 12px);
    margin-left: -6px;
    padding: 32px 0 24px 0;

    position: relative;
    overflow-y: auto;

    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-evenly;
    align-content: center;
    align-content: flex-start;

    button {
      margin-bottom: 8px;
    }
  }

  & > button.next-button {
    align-self: end;
  }
`;
