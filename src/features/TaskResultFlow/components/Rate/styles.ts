import styled from 'styled-components';
import { FloatWrapper } from '@bit/scalez.savvy-ui.float-wrapper';
import { getImage } from '@bit/scalez.savvy-ui.layouts';
import { savvyLogo, spinner, star } from '@bit/scalez.savvy-ui.svg';

export const StyledRatePage = styled.section`
  height: calc(var(--activeScreenHeight) - var(--headerHeight));

  padding: 16px 16px 64px;

  display: grid;
  grid-gap: 24px;
  place-items: center;
  place-content: center;
  justify-content: stretch;
`;

export const StyledSavvyLogo = styled(getImage()).attrs({
  src: savvyLogo({ scale: 0.65 }),
  alt: 'savvy_logo'
})`
  --imageSize: 120px;
  object-fit: contain;
`;

export const StyledRatingWrapper = styled.div`
  display:flex;  
  align-items: center;
  justify-content: center;
  grid-gap: 8px;

  .rating-point {
    width: 32px;
    height: 32px;
    cursor: pointer;
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
`;

export const StyledSpinner = styled(getImage()).attrs({
  src: spinner(),
  alt: 'loading-spinner'
})`
  --imageSize: 32px;
`;

export const StyledFloatWrapper = styled(FloatWrapper)`
  display: flex;
  align-items: center;
`;
