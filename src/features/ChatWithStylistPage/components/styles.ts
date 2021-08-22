import styled, { createGlobalStyle } from 'styled-components';
import { TaskMessage } from '@bit/scalez.savvy-ui.task-message';
import { getImage } from '@bit/scalez.savvy-ui.layouts';
import { clock, noUser } from '@bit/scalez.savvy-ui.svg';
import { Modal } from '@bit/scalez.savvy-ui.modal';

/* Assets */
import subscriptionImg from 'features/PaymentFlow/assets/bg.jpg';

export const StyledThreadReferenceImage = styled(getImage()).attrs({
  alt: 'thread-reference-image'
})`
  --imageSize: 30px;
  box-shadow: none;
`;

export const StyledStylistImage = styled(
  getImage({
    icon: noUser
  })
).attrs({
  alt: 'stylist-image'
})`
  --imageSize: 120px;
  box-shadow: none;
`;

export const StyledSubscriptionImage = styled(getImage()).attrs({
  src: subscriptionImg,
  alt: 'subscription-image'
})`
  width: calc(100% + 32px);
  height: auto;
  max-height: inherit;

  transition: none;
  border-radius: 24px 24px 0 0;
`;

export const StyledModalContent = styled.div`
  margin-top: -24px;
  display: grid;
  grid-gap: 16px;
  place-content: center;
  place-items: center;
  text-align: center;

  button:first-of-type {
    margin-top: 8px;
  }
`;

export const GlobalStepStyles = createGlobalStyle`
  #app-header {
    top: 0;
    z-index: 1;
    position: sticky;
  }

  .step-transition-wrapper {
    height: var(--screenHeight) !important;
    min-height: var(--screenHeight) !important;
  }
`;

export const StyledChatWithStylistMessage = styled(TaskMessage)`
  &[data-is-old-stylist='true'] {
    --bgColor: var(--blueLighter);
  }
`;

export const StyledChatWithStylistPage = styled.section`
  min-height: var(--activeScreenHeight);

  display: grid;
  grid-gap: 24px;
  grid-auto-flow: row;
  justify-content: stretch;

  ul.messages-list {
    padding: 0 16px;
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

    &[data-is-empty='true'] {
      padding: 56px 16px;

      grid-gap: 24px;
      place-items: center;
      place-content: center;

      h4 {
        text-align: center;
        color: var(--bluePrimary);
      }
    }
  }

  div.message-bar-content {
    margin-top: auto;

    display: grid;
    grid-gap: 16px;

    bottom: 0;
    z-index: 1;
    position: sticky;

    .buttons-wrapper {
      width: 100%;
      padding: 0 8px;

      display: grid;
      grid-gap: 8px;
      grid-template-columns: repeat(2, max-content);
    }
  }
`;

export const StyledThreadReferenceEventItem = styled.div`
  display: grid;
  grid-gap: 14px;

  text-align: start;
  cursor: pointer;

  hr {
    width: 100%;
    height: 1px;

    margin: 0;

    border: none;
    background-color: var(--blueLight);
  }

  .task-block {
    display: grid;
    grid-auto-flow: column;
    align-items: center;
    grid-auto-columns: auto;
    grid-gap: 8px;
    width: 100%;
    grid-template-columns: max-content max-content auto;
    justify-items: flex-end;
    p {
      max-width: 100px;
      overflow: hidden;
      position: relative;
      text-decoration: none;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
`;

export const StyledClockIcon = styled(getImage()).attrs({
  src: clock({
    strokeWidth: 1
  }),
  alt: 'clock-icon'
})`
  --imageSize: 50px;

  transition: none;
  box-shadow: none;
  border-radius: 0;
  background-color: transparent;
`;

export const StyledModal = styled(Modal)`
  place-items: center;
  text-align: center;

  p {
    display: contents;
  }
`;
