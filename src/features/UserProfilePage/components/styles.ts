import styled from 'styled-components';
import { noUser } from '@bit/scalez.savvy-ui.svg';
import { getImage } from '@bit/scalez.savvy-ui.layouts';

export const StyledUserProfileImage = styled(
  getImage({
    icon: noUser
  })
).attrs({
  alt: 'user-profile-image'
})`
  --imageSize: 64px;
  transition: none;
`;

export const StyledUserProfilePage = styled.section`
  height: var(--activeScreenHeight);

  div.profile-picture-block {
    --gridGap: 24px;
    padding: 0 16px;

    display: grid;
    grid-gap: var(--gridGap);
    grid-auto-flow: column;
    place-items: center;
    place-content: center;

    input {
      font-size: 0;
      opacity: 0;
      display: none;
    }

    button {
      margin-right: calc(var(--gridGap) * -1);
      transform: translateX(25%);
      z-index: 1;
    }
  }
`;
