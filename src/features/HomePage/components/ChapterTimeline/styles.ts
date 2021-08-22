import styled from 'styled-components';
import { Modal } from '@bit/scalez.savvy-ui.modal';
import { lock, clock } from '@bit/scalez.savvy-ui.svg';
import { getImage } from '@bit/scalez.savvy-ui.layouts';

export const StyledLockIcon = styled(getImage()).attrs({
  src: lock({
    strokeWidth: 1
  }),
  alt: 'lock-icon'
})`
  --imageSize: 50px;

  transition: none;
  box-shadow: none;
  border-radius: 0;
  background-color: transparent;
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
