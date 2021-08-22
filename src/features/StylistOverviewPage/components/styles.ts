import styled from 'styled-components';
import { Overlay } from '@bit/scalez.savvy-ui.overlay';
import { getImage } from '@bit/scalez.savvy-ui.layouts';
import { play, sad, star, noUser } from '@bit/scalez.savvy-ui.svg';

export const StyledMediaOverlay = styled(Overlay)`
  padding: 16px;

  display: grid;
  place-items: center;

  background-color: rgba(7, 4, 23, 0.75);

  button {
    top: 16px;
    right: 16px;
    z-index: 1;
    position: absolute;
  }

  img,
  video {
    width: 100%;
    height: auto;
    border-radius: 8px;
  }
`;

export const StyledStylistProfileImage = styled(
  getImage({
    icon: noUser
  })
).attrs({
  alt: 'stylist-profile-image'
})`
  --imageSize: 120px;
`;

export const StyledStylistImage = styled(getImage()).attrs({
  alt: 'stylist-image'
})`
  width: auto;
  height: 200px;
  border-radius: 8px;
  object-fit: contain;
`;

export const StyledOutfitImage = styled(getImage()).attrs({
  alt: 'outfit-image'
})`
  width: 100%;
  height: auto;
  border-radius: 8px;
  object-fit: contain;
`;

export const StyledSadIcon = styled(getImage()).attrs({
  src: sad({ stroke: 'var(--bluePrimary)' }),
  alt: 'sad-icon'
})`
  --imageSize: 64px;
  box-shadow: none;
  background-color: var(--blueLighter);
`;

export const StyledPlayIcon = styled(getImage()).attrs({
  src: play({ stroke: '#fff', scale: 0.5 }),
  alt: 'play-icon'
})`
  --imageSize: 64px;

  cursor: pointer;
  box-shadow: none;
  background-color: rgba(7, 4, 23, 0.75);

  z-index: 1;
  position: absolute;
`;

export const StyledStylistOverviewComponent = styled.section`
  width: 100%;
  height: auto;

  padding: 0 16px 64px;

  .stylist-media-block {
    width: calc(100% + 32px);
    margin-bottom: -40px;
    padding: 0 16px 16px;
    margin-left: -16px;

    overflow-x: auto;
    overflow-y: hidden;

    display: grid;
    grid-auto-flow: column;
    align-items: center;
    justify-self: flex-start;
    grid-gap: 16px;

    .video-block {
      width: 200px;
      height: 200px;

      display: grid;
      place-items: center;

      position: relative;
      overflow: hidden;

      border-radius: 8px;

      video {
        width: 100%;
        height: 100%;
        outline: none;
        object-fit: cover;
      }

      .video-error-block {
        width: 100%;
        height: 100%;

        display: grid;
        grid-auto-flow: row;
        align-content: center;
        justify-items: center;
        grid-gap: 16px;

        background-color: var(--blueLighter);

        p {
          text-align: center;
          color: var(--bluePrimary);
        }
      }
    }

    &.has-only-child {
      justify-content: center;
    }

    &.has-large-family {
      justify-content: flex-start;

      &::after {
        content: '';
        width: 1px;
        height: 100%;
      }
    }
  }

  .outfit-title {
    margin-top: 40px;
    text-align: center;
  }

  .outfit-images-block {
    margin-top: 16px;

    display: grid;
    grid-auto-flow: row;
    align-items: center;
    justify-items: center;
    grid-gap: 16px;
  }

  .stylist-block {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    justify-items: center;
    
    .circle-wrapper {
      width: 168px;
      height: 168px;

      display: grid;
      place-items: center;
      position: relative;

      border-radius: 50%;
      background-color: #fff;
    }

    h4.stylist-name {
      margin-top: 4px;
    }

    span.stylist-city {
      &:empty {
        display: none;
      }

      margin-top: 16px;
      padding: 8px 16px;

      font-family: var(--fm);
      font-size: 1.4rem;
      line-height: 17px;
      color: var(--bluePrimary);

      border-radius: 16px;
      background-color: var(--blueLighter);
    }

    p.stylist-bio {
      &:empty {
        display: none;
      }

      margin-top: 24px;
    }

    .reviews-block {
      width: 100%;

      bottom: 12px;
      position: absolute;
      
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
