import styled from 'styled-components';
import { getImage } from '@bit/scalez.savvy-ui.layouts';

export const StyledHappyUserImage = styled(getImage()).attrs({
  alt: 'happy-user-image'
})`
  --imageSize: 48px;
  box-shadow: none;
  border: 1px solid var(--blueLight);
`;

export const StyledOutfitFeedPage = styled.section`
  .list-header {
    padding: 40px 16px;

    display: grid;
    grid-gap: 24px;
    background-color: #fff;
  }

  .images-block {
    display: grid;
    grid-auto-flow: column;
    place-content: center;
    place-items: center;

    img {
      margin-left: calc(-1 * (48px * 0.2));
    }
  }

  p.message {
    text-align: center;
  }

  .subscribe-block {
    padding: 32px;

    display: grid;
    grid-gap: 24px;
    place-items: center;
    place-content: center;

    text-align: center;
    background-color: var(--pinkLighter);
  }
`;
