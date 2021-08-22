import styled from 'styled-components';
import { star } from '@bit/scalez.savvy-ui.svg';
import { getImage } from '@bit/scalez.savvy-ui.layouts';

export const StyledRecommendedIcon = styled(getImage()).attrs({
  src: star({ stroke: 'white', fill: 'white ', scale: 0.6 }),
  alt: 'recommended-icon'
})`
  --imageSize: calc(var(--chapterImageSize) / 2.5);

  top: 0;
  position: absolute;

  --translateDiff: calc((var(--progressSize) - var(--chapterImageSize)) / 2);
  transform: translate(
    calc(var(--translateDiff) + var(--imageSize) / 2),
    calc(var(--translateDiff) * -1)
  ) !important;

  box-shadow: none;
  transition: none;
  background-image: var(--gradientBlue);
`;

export const StyledChapterImage = styled(getImage()).attrs({
  alt: 'journey-image',
  className: 'chapter-image'
})`
  --imageSize: var(--chapterImageSize);
  box-shadow: none;
  transition: none;
`;

export const StyledChapterPreview = styled.div`
  [data-is-blocked='true'] {
    opacity: 0.5;
  }

  --chapterImageSize: 82px;
  --progressPadding: 8px;
  --progressSize: calc(var(--chapterImageSize) + var(--progressPadding) * 4);

  display: grid;
  grid-gap: 24px;
  grid-template-areas: 'img' 'name';
  place-items: center;

  position: relative;
  cursor: pointer;

  div.progress-block {
    width: var(--progressSize);
    height: var(--progressSize);

    top: calc(var(--progressPadding) * -2);
    position: absolute;

    border-radius: 50%;
    background: conic-gradient(
      var(--blueDark) var(--progress),
      var(--blueLight) var(--progress),
      var(--blueLight) calc(var(--progress) + calc(100% - var(--progress)))
    );

    &::after {
      content: '';

      width: calc(var(--progressSize) - var(--progressPadding) * 2);
      height: calc(var(--progressSize) - var(--progressPadding) * 2);

      top: var(--progressPadding);
      left: 50%;
      transform: translateX(-50%);
      position: absolute;

      border-radius: 50%;
      background-color: #fff;
    }
  }

  img.chapter-image {
    grid-area: img;
  }

  p {
    text-align: center;
  }

  p.chapter-name {
    grid-area: name;
  }

  p.recommended-label {
    margin-top: -24px;
    color: var(--green);
  }
`;
