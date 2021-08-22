import styled from 'styled-components';

export const StyledCreateProfilePage = styled.section`
  padding: 16px;

  form {
    align-content: flex-start;

    h2 {
      margin-bottom: 24px;
    }

    .phone-input-container {
      height: 48px;

      padding: 0 16px;

      display: grid;
      grid-auto-flow: column;
      grid-gap: 8px;
      grid-template-columns: 10% 90%;
      overflow: hidden;

      border: 1px solid var(--blueLight);
      border-radius: 24px;

      input {
        height: 100%;
        border: none;
        outline: none;

        &&& {
          background-color: #fff;
        }
      }
    }
  }
`;
