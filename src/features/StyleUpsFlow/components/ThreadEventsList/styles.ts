import styled, { createGlobalStyle } from 'styled-components';
import { getImage } from '@bit/scalez.savvy-ui.layouts';
import { arrow, savvyLogo, star } from '@bit/scalez.savvy-ui.svg';

export const GlobalStepStyles = createGlobalStyle`
  .step-transition-wrapper {
    height: var(--screenHeight) !important;
    min-height: var(--screenHeight) !important;
  }
`;

export const StyledSavvyLogo = styled(getImage()).attrs({
  src: savvyLogo({ scale: 0.65 }),
  alt: 'savvy-logo'
})`
  --imageSize: 120px;
  object-fit: contain;

  box-shadow: none;
  border: 1px solid var(--blueLight);
`;

export const StyledTaskResultImage = styled(getImage()).attrs({
  alt: 'task-image'
})`
  --imageSize: 8vw;
  max-height: calc(0.08 * var(--maxWidth));
  max-width: calc(0.08 * var(--maxWidth));

  object-fit: contain;

  border-radius: 4px;
  box-shadow: none;
  background-color: transparent;
`;

export const StyledFeedbackModalContent = styled.div`
  display: grid;
  grid-gap: 24px;
  place-items: center;

  textarea {
    max-height: 150px;
  }

  div.rating-wrapper {
    display: grid;  
    grid-gap: 8px;
    grid-auto-flow: column;
    align-items: center;
    justify-content: center;

    .rating-point {
      width: 32px;
      height: 32px;
      cursor: pointer;
      flex-shrink: 0;

      background-color: transparent;
      background-position: center;
      background-size: cover;
      background-repeat: no-repeat;
      background-image: url('${star()}');

      &[data-is-active="true"] {
        background-image: url('${star({ fill: 'var(--blueDarker)' })}');
      }
    }
  }
`;

export const StyledUnexpandedTaskResultEventItem = styled.div`
  padding: inherit;
  padding-top: 24px;
  padding-bottom: 24px;
  margin: -18px;

  display: grid;
  grid-gap: 16px;
  grid-auto-flow: column;
  place-items: center;
  place-content: space-between;

  background-color: var(--blueLighter);
  border-radius: inherit;

  div.images-wrapper {
    display: grid;
    grid-gap: 8px;
    grid-auto-flow: column;
  }

  span {
    width: max-content;

    display: grid;
    grid-gap: 8px;
    grid-auto-flow: column;

    &::after {
      content: '';

      width: 16px;
      height: 16px;
      
      display: block;

      background-position: center;
      background-repeat: no-repeat;
      background-size: cover;
      background-color: transparent;
      background-image: url("${arrow()}");
    }
  }
`;

export const StyledFeedbackEventItem = styled.div`
  display:flex;  
  align-items: center;
  justify-content: flex-start;
  grid-gap: 8px;

  .rating-point {
    width: 32px;
    height: 32px;
    cursor: pointer;
    flex-shrink: 0;

    background-color: transparent;
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    background-image: url('${star()}');

    &[data-is-active="true"] {
      background-image: url('${star({ fill: 'var(--blueDarker)' })}');
    }
  }
`;

export const StyledThreadEventsListPage = styled.section`
  min-height: var(--activeScreenHeight);

  display: grid;
  grid-gap: 24px;
  grid-auto-flow: row;
  grid-template-rows: max-content;
  justify-content: stretch;

  ul.messages-list {
    padding: 0 16px 16px;
    margin: 0;
    list-style: none;

    display: grid;
    grid-gap: 16px;
    grid-auto-flow: row;
    grid-template-rows: max-content;
    align-content: flex-start;

    & > *:not(img) {
      height: max-content;
    }
  }

  div.message-bar-content {
    margin-top: auto;

    display: grid;
    grid-gap: 16px;

    bottom: 0;
    z-index: 1;
    position: sticky;
  }

  hr {
    width: 100%;
    border: 0.5px solid #e9e7ef;
    height: 0;
  }

  .chat-link {
    margin-top: -24px;
    justify-self: center;
    height: 90px;
    display: grid;
    grid-template-areas: 'chat text';
    grid-template-columns: 50px auto;
    grid-gap: 16px;
    align-items: center;

    button {
      grid-area: chat;
    }

    h4 {
      grid-area: text;
    }
  }
`;
