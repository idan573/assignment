import styled from 'styled-components';
import { getImage } from '@bit/scalez.savvy-ui.layouts';
import { noUser, noProduct } from '@bit/scalez.savvy-ui.svg';

/* Types */
import { RATE_OPTIONS } from 'Layouts/TinderExperience/types';

/* Styles */
import { likeBtn, dislikeBtn } from 'globalstyles/variables';

export const StyledProductCard = styled.div`
  width: 100%;
  height: 100%;

  position: relative;

  display: grid;
  grid-template-columns: 100%;
  grid-template-rows: 56px calc(100% - 112px) 56px;

  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
`;

export const StyledProductImage = styled(
  getImage({
    icon: noProduct,
    iconStyles: {
      scale: 0.3,
      opacity: 0.5
    }
  })
).attrs({
  alt: 'product-image'
})`
  --imageSize: 100%;

  object-fit: contain;

  border-radius: 0;
  box-shadow: none;
  background-color: var(--blueLighter);

  &[data-is-loaded='false'] {
    background-color: #fff;
  }
`;

export const StyledProductInfoBlock = styled.div`
  width: 100%;
  height: 56px;

  padding: 16px;

  display: flex;
  align-items: flex-end;
  justify-content: space-between;

  position: relative;

  background-color: #fff;

  &::before,
  &::after {
    display: block;

    width: 100%;
    height: 24px;

    left: 0;
    position: absolute;
  }

  &[data-position='top'] {
    align-items: center;

    &::after {
      content: '';

      bottom: 0;
      transform: translateY(100%);
      background: linear-gradient(
        0deg,
        rgba(255, 255, 255, 0.01) 0%,
        #ffffff 100%
      );
    }
  }

  &[data-position='bottom'] {
    &::before {
      content: '';

      top: 0;
      transform: translateY(-100%);
      background: linear-gradient(
        180deg,
        rgba(255, 255, 255, 0.01) 0%,
        #ffffff 100%
      );
    }
  }
`;

export const StyledStylistImage = styled(
  getImage({
    icon: noUser
  })
).attrs({
  alt: 'stylist-profile-image'
})`
  --imageSize: 24px;
  font-size: 0;
  box-shadow: none;
`;

export const StyledStylistText = styled.span`
  font-family: var(--fr);
  font-size: 1.4rem;
  color: var(--blueDarker);

  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

  & > b {
    font-family: var(--fm);
  }
`;

export const StyledStylistName = styled(StyledStylistText)`
  width: 45%;

  margin: 0 auto 0 8px;
`;

export const StyledStylistCity = styled(StyledStylistText)`
  width: 40%;

  text-align: end;
`;

export const StyledProductPrice = styled.span`
  font-family: var(--fm);
  font-size: 2.1rem;
  color: var(--blueDarker);
`;

export const StyledProductBrand = styled.span`
  font-family: var(--fm);
  font-size: 1.4rem;
  color: var(--blueDarker);
`;

interface HistProps extends React.DOMAttributes<HTMLDivElement> {
  rate: RATE_OPTIONS;
}

export const StyledHint = styled.div.attrs<HistProps>(({ rate }) => ({
  style: {
    opacity: rate !== RATE_OPTIONS.INIT ? 1 : 0
  }
}))`
  width: 100%;
  height: 100%;

  position: absolute;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  font-family: var(--fm);
  font-size: 2.8rem;
  color: #fff;

  background-color: transparent;

  &::before {
    content: '';
    display: block;

    width: 100px;
    height: 100px;

    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
  }

  ${({ rate }: HistProps) => {
    switch (rate) {
      case RATE_OPTIONS.LIKE:
        return `
          background-color: rgba(235, 173, 164, 0.75);

          &::before {
            background-image: url('${likeBtn('white')}');
          }
        `;
      case RATE_OPTIONS.DISLIKE:
        return `
          background-color: rgba(13, 0, 72, 0.75);

          &::before {
            background-image: url('${dislikeBtn('white')}');
          }
        `;
      default:
        return '';
    }
  }};

  transition: opacity 0.2s;
  will-change: opacity;
`;
