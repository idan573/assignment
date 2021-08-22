import styled from 'styled-components';

export const StyledPhoneNumberFormComponent = styled.section`
  padding: 16px;
  min-height: calc(var(--activeScreenHeight) - var(--headerHeight));

  display: grid;
  place-content: center;
  place-items: center;

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
`;
