import * as React from 'react';
import { formatPrice } from '@bit/scalez.savvy-ui.utils';
import { usePrevious } from '@bit/scalez.savvy-ui.hooks';

/* Types */
import { Product } from 'App/types';
import { CardProps, RATE_OPTIONS } from 'Layouts/TinderExperience/types';

/* Styles */
import {
  StyledProductCard,
  StyledProductInfoBlock,
  StyledStylistImage,
  StyledStylistName,
  StyledStylistCity,
  StyledProductImage,
  StyledProductPrice,
  StyledProductBrand,
  StyledHint
} from './styles';

type Props = CardProps<Product>;

const ProductCard: React.FC<Props> = ({ data, rate, isDragging }: Props) => {
  const prevRate: RATE_OPTIONS = usePrevious(rate);

  const { hintRate, hintText } = React.useMemo(() => {
    const hintText = {
      [RATE_OPTIONS.LIKE]: 'LOVE IT',
      [RATE_OPTIONS.DISLIKE]: 'NOT MY STYLE'
    };

    return isDragging && rate === RATE_OPTIONS.INIT
      ? {
          hintRate: prevRate,
          hintText: hintText[prevRate]
        }
      : {
          hintRate: rate,
          hintText: hintText[rate]
        };
  }, [rate, isDragging]);

  const { price, city } = React.useMemo(
    () => ({
      price: formatPrice(`${data.price}`),
      city: !!data.stylist?.city && (
        <>
          from <b>{data.stylist?.city.split('-', 1)}</b>
        </>
      )
    }),
    [data]
  );

  return (
    <StyledProductCard>
      <StyledProductInfoBlock data-position="top">
        <StyledStylistImage src={data.stylist?.profilePicture} />

        <StyledStylistName>
          styled by <b>{data.stylist?.firstName}</b>
        </StyledStylistName>

        <StyledStylistCity>{city}</StyledStylistCity>
      </StyledProductInfoBlock>

      <StyledProductImage src={data?.images?.[0]} />

      <StyledProductInfoBlock data-position="bottom">
        <StyledProductPrice>{price}</StyledProductPrice>
        <StyledProductBrand>{data.brand}</StyledProductBrand>
      </StyledProductInfoBlock>

      <StyledHint rate={hintRate}>{hintText}</StyledHint>
    </StyledProductCard>
  );
};

export { ProductCard };
