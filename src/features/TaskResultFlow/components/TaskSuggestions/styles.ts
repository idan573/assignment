import { getImage } from '@bit/scalez.savvy-ui.layouts';
import { noUser } from '@bit/scalez.savvy-ui.svg';
import styled from 'styled-components';

export const StyledTaskSuggestions = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 40%;
  align-items: center;

  h3 {
    margin-top: 24px;
    word-break: break-word;
    text-align: center;
    margin-right: 16px;
    margin-left: 16px;
  }

  .task-item {
    margin: 24px 16px;
    height: 180px;
    width: 180px;
  }
`;
export const StyledStylistImage = styled(
  getImage({
    icon: noUser
  })
).attrs({
  alt: 'user-upload-image'
})`
  --imageSize: 64px;
  align-self: center;
  background-color: var(--blueLighter);
`;

export const StyledButtonsBlock = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: minmax(auto, 50%);
  grid-gap: 16px;
`;
