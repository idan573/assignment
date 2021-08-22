import styled from 'styled-components';
import { getImage } from '@bit/scalez.savvy-ui.layouts';
import { noUser } from '@bit/scalez.savvy-ui.svg';

export const StyledStylistImage = styled(getImage({ icon: noUser })).attrs({
  alt: 'stylist-profile-image'
})`
  --imageSize: 73px;
`;

export const StyledTaskImage = styled(getImage()).attrs({
  alt: 'task-image'
})`
  --imageSize: 100%;
  border-radius: 0;
`;

export const StyledRecommendedTaskImage = styled(getImage()).attrs({
  alt: 'task-image'
})`
  --imageSize: 100%;
  border-radius: 16px;
`;

export const StyledRecommendedTaskBlock = styled.div`
  padding: 16px;

  display: grid;
  grid-template-areas:
    'title title close-btn'
    'img desc desc'
    'img start-btn start-btn';
  grid-template-columns: 0.3fr 0.6fr 0.1fr;
  grid-gap: 8px;
  grid-template-rows: 32px 70px 40px;
  overflow: hidden;

  background-color: #fff;
  box-shadow: var(--cardShadowBlue);

  img {
    grid-area: img;
  }

  button:frist-of-type {
    grid-area: close-btn;
  }

  button:last-of-type {
    grid-area: start-btn;
  }

  h4,
  p {
    display: -webkit-box;
    overflow: hidden;
    -webkit-box-orient: vertical;
  }

  h4 {
    grid-area: title;
    -webkit-line-clamp: 2;
  }

  p {
    grid-area: desc;
    -webkit-line-clamp: 4;
    color: var(--blueDark);
  }
`;

export const StyledCreatorStyleAdvices = styled.div`
  div.stylist-block {
    padding: 16px;

    display: grid;
    grid-gap: 8px;

    background-color: var(--pinkLighter);

    div.top-content-wrapper {
      display: grid;
      grid-gap: 16px;
      grid-auto-flow: column;
      place-content: space-between;

      button {
        place-self: center;
      }

      div.styleups-block {
        padding: 4px 12px;

        display: grid;
        place-content: center;
        place-items: center;

        cursor: pointer;
        border-radius: 16px;
        background-color: #fff;
        box-shadow: var(--cardShadowBlue);

        p {
          text-align: center;
          color: var(--blueDark);
        }
      }
    }

    & > p {
      margin-top: -8px;
      color: var(--blueDark);
    }

    div.buttons-block {
      display: grid;
      grid-gap: 12px;
      grid-auto-flow: column;
      grid-auto-columns: max-content;
      place-content: space-between;
      place-items: center;

      button {
        min-width: 130px;
      }
    }
  }

  div.tasks-block {
    padding: 16px;

    div.tasks-list {
      display: grid;
      grid-gap: 12px;
      grid-template-columns: repeat(auto-fill, minmax(135px, 1fr));
      grid-auto-rows: 225px;

      div.task-card {
        width: 100%;
        height: 100%;

        position: relative;
        overflow: hidden;
        cursor: pointer;

        border-radius: 16px;

        div.title-block {
          width: 100%;
          height: 60px;

          padding: 8px;

          display: grid;
          place-items: center;
          place-content: center;

          bottom: 0;
          position: absolute;

          background-color: rgba(255, 255, 255, 0.7);

          p {
            /* Show only 2 lines of text */
            display: -webkit-box;
            overflow: hidden;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;

            text-align: center;
          }
        }
      }
    }
  }
`;
