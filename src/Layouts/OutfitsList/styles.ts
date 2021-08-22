import styled from 'styled-components';
import { getImage } from '@bit/scalez.savvy-ui.layouts';
import { noUser, check } from '@bit/scalez.savvy-ui.svg';

import { VirtualizedList } from 'Layouts/VirtualizedList/VirtualizedList';

export const StyledStylistImage = styled(
  getImage({
    icon: noUser
  })
).attrs({
  alt: 'stylist-profile-image'
})`
  --imageSize: 32px;
  box-shadow: none;
  border: 1px solid var(--blueLight);
`;

export const StyledUserImage = styled(
  getImage({
    icon: noUser
  })
).attrs({
  alt: 'user-profile-image'
})`
  --imageSize: 32px;
  box-shadow: none;
  border: 1px solid var(--blueLight);
`;

export const StyledCheckIcon = styled(getImage()).attrs({
  src: check({ scale: 0.6 }),
  alt: 'check-icon'
})`
  --imageSize: 32px;
  box-shadow: none;
  background-image: var(--gradientPink);
`;

export const StyledMatchModalContent = styled.div`
  padding-top: 24px;

  position: relative;

  display: grid;
  grid-gap: 16px;
  place-content: center;
  place-items: center;
  text-align: center;

  &::before {
    content: '';
    display: block;

    width: calc(100% + 32px);
    height: 90px;

    top: -24px;
    left: -16px;
    position: absolute;

    background-color: var(--pinkLighter);
    border-radius: 24px 24px 0px 0px;
  }

  div.images-block {
    display: grid;
    place-items: center;
    place-content: center;
    grid-auto-flow: column;

    .check-icon,
    .user-image {
      --imageSize: 80px;
    }

    .check-icon {
      z-index: 1;
    }

    .user-image {
      margin-left: -20px;
    }
  }

  span {
    margin-top: -8px;
  }

  hr {
    width: 100%;
    height: 1px;

    margin: 8px 0;

    border: none;
    background-color: var(--blueLight);
  }

  button {
    margin-top: 24px;
  }
`;

export const StyledOutfitsVirtualizedList = styled(VirtualizedList)`
  background-color: var(--blueLighter);
`;

export const StyledOutfitBlock = styled.div`
  position: relative;

  button.share-button {
    min-width: 100px;

    top: 16px;
    right: 16px;
    position: absolute;
  }

  &:first-of-type {
    border-top: 1px solid var(--blueLighter);
  }

  /* Prevent images from flickering */
  img {
    transition: none;
  }

  .stylist-block {
    padding: 16px;
    cursor: pointer;

    display: grid;
    grid-gap: 4px 16px;
    grid-template-areas:
      'image title'
      'image name ';
    justify-content: flex-start;
    align-items: center;
    align-content: center;

    background-color: #fff;

    img {
      grid-area: image;
    }

    span.title {
      grid-area: title;
      color: var(--bluePrimary);
    }

    span.name {
      grid-area: name;
    }
  }

  .outfit-footer {
    &:empty {
      display: none;
    }

    padding: 20px 16px;

    display: grid;
    grid-auto-flow: column;
    grid-gap: 24px;
    justify-content: space-between;

    background-color: #fff;

    button.like-outfit {
      padding: 0;
    }
  }

  .score-block {
    cursor: pointer;

    display: grid;
    grid-gap: 4px 16px;
    grid-template-areas:
      'image value'
      'image name ';
    justify-content: flex-end;
    align-items: center;

    img {
      grid-area: image;

      &.check-icon {
        z-index: 1;
      }

      &.user-image {
        margin-left: 20px;
      }
    }

    h3.value {
      grid-area: value;
    }

    span.name {
      grid-area: name;
    }
  }
`;
