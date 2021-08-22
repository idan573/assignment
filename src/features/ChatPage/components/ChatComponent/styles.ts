import styled from 'styled-components';

export const StyledQuestionnaireChatPage = styled.div`
  height: var(--activeScreenHeight);
  min-height: var(--activeScreenHeight);
  display: grid;
  grid-gap: 24px;
  grid-auto-flow: row;
  justify-content: stretch;
  align-content: space-between;

  .message-bar-portal {
    margin-top: auto;

    bottom: 0;
    z-index: 1;
    position: sticky;

    button.add-photo {
      margin-left: 0;
    }
  }
`;

export const StyledConversationsList = styled.div`
  padding: 0 16px;

  display: grid;
  grid-gap: 24px;
  grid-auto-flow: row;
  justify-content: stretch;

  & > * {
    height: max-content;
  }

  &[data-is-done='true'] {
    padding-bottom: 50px;
  }

  .message-loader {
    padding-bottom: 24px;
  }
`;
