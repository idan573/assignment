import * as React from 'react';

/* Styles */
import { StyledImageBlock, StyledImage } from './styles';

interface Props extends React.ImgHTMLAttributes<HTMLImageElement> {
  className?: string;
}

const ImageWithLoader: React.FC<Props> = ({ src, className }: Props) => {
  const [isLoading, setLoadState] = React.useState<boolean>(true);

  React.useEffect(() => {
    setLoadState(true);
  }, [src]);

  return (
    <StyledImageBlock data-is-loading={isLoading} className={className}>
      <StyledImage src={src} onLoad={() => setLoadState(false)} />
    </StyledImageBlock>
  );
};

export { ImageWithLoader };
