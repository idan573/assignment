import styled from 'styled-components';
import { getImage } from '@bit/scalez.savvy-ui.layouts';
import { clock } from '@bit/scalez.savvy-ui.svg';

export const StyledClockIcon = styled(getImage()).attrs({
  src: clock({
    strokeWidth: 2.7
  }),
  alt: 'clock-icon'
})`
  --imageSize: 18px;
  box-shadow: none;

  margin-right: 6px;
  margin-bottom: -3px;
`;

export const StyledTaskOverview = styled.div`
  padding: 0 16px;
  /* 
    16px - button padding top
    16px - button padding bottom
    48px - button height
  */
  padding-bottom: calc(16px + 16px + 48px);
`;
