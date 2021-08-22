import styled from 'styled-components';
import { spinner, noProduct } from '@bit/scalez.savvy-ui.svg';

export const StyledImageBlock = styled.div<any>`
  display: flex;
  justify-content: center;

  &[data-is-loading='true'] {
    background-repeat: no-repeat;
    background-position: center;
    background-color: rgba(255, 255, 255, 0.4);
    background-image: url("${spinner({ scale: 0.2 })}");
  }
`;

export const StyledImage = styled.img.attrs<
  React.DOMAttributes<HTMLImageElement>
>(props => {
  const defaultSrc = noProduct();

  return {
    src: props.src,
    alt: props.alt || 'product picture',
    onError: (e: React.BaseSyntheticEvent<HTMLImageElement>) => {
      e.target.src = defaultSrc;
      e.target.onError = null;
    }
  };
})`
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: 100%;

  z-index: -1;

  object-fit: contain;
  object-position: center;

  border-radius: 8px;
`;
