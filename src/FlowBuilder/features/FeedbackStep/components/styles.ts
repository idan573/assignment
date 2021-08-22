import styled from 'styled-components';

export const StyledFeedbackStep = styled.div`
  width: 100%;
  height: auto;
  min-height: var(--screenHeight);

  padding: 20px;
  margin: 0 auto;

  display: grid;
  grid-template-columns: 100%;
  grid-template-rows: 50% 50%;

  div.title-block {
    padding-bottom: 40px;

    z-index: 1;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;

    h3,
    p {
      text-align: center;
    }
  }
`;
