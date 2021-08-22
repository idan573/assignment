import * as React from 'react';
import { Loader } from '@bit/scalez.savvy-ui.loader';

/* Types */
import { Product } from 'App/types';
import {
  CardProps,
  ControlsProps,
  RatedItemData,
  RATE_OPTIONS
} from 'Layouts/TinderExperience/types';

/* Components */
import { TinderExperience } from 'Layouts/TinderExperience/TinderExperience';
import { ProductCard } from './ProductCard/ProductCard';
import { Controls } from './Controls/Controls';

/* Styles */
import { StyledProductExperience } from './styles';

export interface Props {
  products: Product[];
  toggleAnimation: (toggle: boolean) => void;
  handleItemRate: (rate: RatedItemData) => void;
  status: REQUEST_STATUSES;
}

export const ProductsExperienceComponent: React.FC<Props> = ({
  products,
  handleItemRate,
  toggleAnimation,
  status
}: Props) => {
  const onItemRate = React.useCallback(({ rate, index }: RatedItemData) => {
    if (rate === RATE_OPTIONS.LIKE) {
      toggleAnimation(true);
    }

    handleItemRate({ rate, index });
  }, []);

  return (
    <>
      {products?.length ? (
        <StyledProductExperience>
          <TinderExperience<Product>
            items={products}
            renderComponent={(props: CardProps<Product>) => (
              <ProductCard {...props} />
            )}
            renderControls={(props: ControlsProps) => (
              <Controls
                disabled={status === REQUEST_STATUSES.REQUEST}
                {...props}
              />
            )}
            onItemRate={onItemRate}
            disabled={status === REQUEST_STATUSES.REQUEST}
          />
        </StyledProductExperience>
      ) : (
        <Loader />
      )}
    </>
  );
};
