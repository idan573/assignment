import styled from 'styled-components';

export const StyledProfileSection = styled.section`
  display: grid;
  grid-gap: 24px;
  place-content: flex-start center;
  justify-content: stretch;

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

    .PhoneInputCountryIcon {
      box-shadow: none;
      background-color: transparent;
    }
  }

  button {
    margin-top: 24px;
  }
`;
