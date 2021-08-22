import styled from 'styled-components';
import { getImage } from '@bit/scalez.savvy-ui.layouts';
import { noUser } from '@bit/scalez.savvy-ui.svg';

export const StyledCarouselImage = styled(getImage()).attrs({
  alt: 'carousel-image'
})`
  --imageSize: 100%;
  max-height: 250px;
  border-radius: 16px;
`;

export const StyledReviewImage = styled(
  getImage({
    icon: noUser
  })
).attrs({
  alt: 'user-review-image'
})`
  --imageSize: 32px;
`;

export const StyledHowItWorksPage = styled.section`
  .banner-block {
    padding: 0 16px;

    display: grid;
    grid-gap: 16px;
    align-items: flex-start;
    justify-items: center;

    img {
      margin-bottom: 8px;
    }

    h2,
    p {
      text-align: center;
    }
  }

  .section {
    h2.section-title,
    p.section-descritpion {
      text-align: center;
    }
  }

  .reviews-section {
    margin-top: 40px;
    padding: 48px 16px 80px;

    display: grid;
    grid-gap: 16px;

    background-color: var(--pinkLighter);

    .review-block {
      &:first-of-type {
        margin-top: 24px;
      }

      padding: 24px 14px;

      display: grid;
      grid-template-columns: 32px auto;
      grid-template-areas:
        'image name'
        'line line'
        'text text';
      align-items: center;
      justify-items: flex-start;
      grid-gap: 16px;

      img {
        grid-area: image;
      }

      span.user-name {
        grid-area: name;
      }

      hr {
        grid-area: line;

        width: 100%;
        height: 1px;

        margin: 0;

        border: none;
        background-color: var(--blueLighter);
      }

      p.review-text {
        grid-area: text;
      }

      background-color: #fff;
      border-radius: 16px;
      box-shadow: var(--cardShadowBlue);
    }
  }
`;
