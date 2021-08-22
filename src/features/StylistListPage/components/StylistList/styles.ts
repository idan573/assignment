import styled from 'styled-components';
import { star, noUser } from '@bit/scalez.savvy-ui.svg';
import { getImage } from '@bit/scalez.savvy-ui.layouts';

export const StyledStylistImage = styled(
  getImage({
    icon: noUser
  })
).attrs({
  alt: 'stylist-profile-image'
})`
  --imageSize: 100%;
`;

export const StyledStylistGrid = styled.div`
  width: 100%;

  display: grid;
  grid-gap: 32px 16px;
  grid-template-columns: repeat(2, minmax(100px, 50%));
  justify-items: center;
  align-items: center;

  h4 {
    margin-top: 16px;
  }

  .stylist-block {
    width: 100%;
    max-width: 200px;
    height: 100%;

    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    justify-items: center;

    .square-image-wrapper {
      width: 100%;
      position: relative;

      .square-content {
        width: 100%;
        height: 100%;
        position: absolute;
      }
      
      &::after {
        content: "";
        display: block;
        padding-bottom: 100%;
      }
    }
    
    .reviews-block {
      width: 100%;
      
      padding: 1.2rem;
      margin-top: -25px;
      z-index: 1;

      display: flex;
      justify-content: space-between;

      background-color: #fff;
      border: 1px solid var(--blueLight);
      border-radius: 24px;
      
      .rating-block {
        display: grid;
        grid-template-columns: repeat(5, 16px);
        grid-gap: 0.3rem;
        grid-auto-flow: column;
        align-items: center;
        justify-items: center;

        .reviews-count {
          margin-left: auto;
        }

        .rating-star {
          width: 100%;
          height: 100%;
      
          flex-shrink: 0;

          background-color: transparent;
          background-position: center;
          background-size: cover;
          background-repeat: no-repeat;
          background-image: url('${star()}');

          &[data-is-active="true"] {
            background-image: url('${star({ fill: 'var(--blueDarker)' })}');
          }
        }
      }
    }
  }
`;
