import styled from 'styled-components';
import { getImage } from '@bit/scalez.savvy-ui.layouts';
import { clock } from '@bit/scalez.savvy-ui.svg';
import { Modal } from '@bit/scalez.savvy-ui.modal';

export const StyledTaskImage = styled(getImage()).attrs({
  alt: 'style-advice-task-image'
})`
  --imageSize: var(--taskImageSize);
  box-shadow: none;
  transition: none;
`;

export const StyledStyleAdvices = styled.section`
  padding: 16px 16px calc(var(--headerHeight) + 16px);

  display: grid;
  grid-gap: 24px;

  .tasks-grid {
    margin-top: 24px;
    display: grid;
    grid-gap: 48px;
    grid-template-columns: repeat(auto-fill, minmax(100px, 130px));

    justify-items: center;
    align-items: flex-start;
    justify-content: space-evenly;

    .task-block {
      --taskImageSize: 120px;

      display: grid;
      grid-gap: 16px;
      place-items: center;
      cursor: pointer;

      p {
        text-align: center;
      }

      &.plug {
        cursor: auto;

        &::before {
          content: '';
          width: var(--taskImageSize);
          height: var(--taskImageSize);
          border-radius: 50%;
          border: 2px solid var(--blueLight);
          background-image: var(--gradientBlueLight);
        }

        p {
          color: var(--bluePrimary);
        }
      }
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
