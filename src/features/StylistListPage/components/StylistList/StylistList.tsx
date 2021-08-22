import * as React from 'react';
import range from 'ramda/src/range';

/* Types */
import { Stylist } from 'App/types';

/* Styles */
import { StyledStylistGrid, StyledStylistImage } from './styles';

interface Props {
  items: Stylist[];
  onClick: (stylist: Stylist) => void;
}

const StylistList: React.FC<Props> = React.memo(({ items, onClick }: Props) => {
  return (
    <StyledStylistGrid>
      {items.map((stylist, key) => (
        <div
          key={key}
          className="stylist-block"
          onClick={() => onClick(stylist)}
        >
          <div className="square-image-wrapper">
            <StyledStylistImage
              className="square-content"
              src={stylist.profilePicture}
            />
          </div>

          <div className="reviews-block">
            <div className="rating-block">
              {range(0, 5).map(i => (
                <div
                  key={i}
                  className="rating-star"
                  data-is-active={i < (stylist.avgRate || 0)}
                />
              ))}
            </div>

            <span className="sbody-bold reviews-count">
              ({stylist.reviewsCount || 0})
            </span>
          </div>

          <h4>{stylist.firstName}</h4>
        </div>
      ))}
    </StyledStylistGrid>
  );
});

export { StylistList };
