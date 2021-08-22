import * as React from 'react';
import { useDebouncedCallback } from 'use-debounce';

/* Types */
import { Outfit } from 'App/types';

/* Components */
import { RootContext, RootContextType } from 'App/components/RootProvider';
import { OutfitBlock } from './OutfitBlock';

/* Styles */
import { StyledOutfitsVirtualizedList } from './styles';

export type OutfitListContextType = Partial<{
  setOutfitProductLike: (arg: {
    rate: boolean;
    outfitId: string;
    productId: string;
  }) => void;
}>;

export const OutfitListContext = React.createContext<OutfitListContextType>({});

interface Props {
  outfits: Outfit[];
  scores?: number[];
  listConfig?: Partial<{
    screenContentHeight: number;
  }>;
  children?: JSX.Element | JSX.Element[];
}
const OutfitsList: React.FC<Props> = ({
  scores,
  outfits,
  listConfig,
  children
}: Props) => {
  const {
    actions: { trackEvent }
  } = React.useContext<RootContextType>(RootContext);

  const outfitsDataMap = React.useRef<
    Partial<{
      [outfitId: string]: {
        productLikes: {
          [productId: string]: boolean;
        };
      };
    }>
  >({});

  const { childrenArray, childrenCount } = React.useMemo(() => {
    const childrenArray = React.Children.toArray(children) || [];

    return {
      childrenArray,
      childrenCount: childrenArray.filter(item => !!item).length ?? 0
    };
  }, [children]);

  const [listDimensions, setDimensions] = React.useState({
    height: window.innerHeight - listConfig?.screenContentHeight ?? 0
  });

  const { callback: debouncedCallback } = useDebouncedCallback((vh: number) => {
    setDimensions({
      height: vh - listConfig?.screenContentHeight ?? 0
    });
  }, 500);

  React.useEffect(() => {
    const resizeHandler = _ => {
      debouncedCallback(window.innerHeight);
    };

    window.addEventListener('resize', resizeHandler);

    return () => {
      window.removeEventListener('resize', resizeHandler);
    };
  }, []);

  const setOutfitProductLike = React.useCallback(
    (arg: { rate: boolean; outfitId: string; productId: string }) => {
      if (outfitsDataMap.current[arg.outfitId]?.productLikes) {
        outfitsDataMap.current[arg.outfitId].productLikes[arg.productId] =
          arg.rate;
      } else {
        outfitsDataMap.current[arg.outfitId] = {
          productLikes: {
            [arg.productId]: arg.rate
          }
        };
      }
    },
    []
  );

  return (
    <OutfitListContext.Provider value={{ setOutfitProductLike }}>
      <StyledOutfitsVirtualizedList
        width="100%"
        height={listDimensions.height}
        gap={[
          ...Array(childrenCount).fill(0),
          ...Array(outfits.length).fill(24)
        ]}
        itemCount={outfits.length + childrenCount}
      >
        {({ index }) => {
          const outfitIndex = index - childrenCount;
          const outfitProductLikes =
            outfitsDataMap.current?.[outfits[outfitIndex]?.styleId]
              ?.productLikes;

          return (
            (childrenArray?.[index] as JSX.Element) || (
              <OutfitBlock
                data={{
                  ...outfits[outfitIndex],
                  products: !!outfitProductLikes
                    ? outfits[outfitIndex]?.products.map(product => ({
                        ...product,
                        inWishlist:
                          outfitProductLikes?.[product.productId] ??
                          product.inWishlist
                      }))
                    : outfits[outfitIndex]?.products,
                  stylist: outfits[outfitIndex]?.stylist,
                  score: !!scores
                    ? scores[outfitIndex]
                    : outfits[outfitIndex]?.userId
                    ? outfits[outfitIndex]?.score
                    : undefined
                }}
              />
            )
          );
        }}
      </StyledOutfitsVirtualizedList>
    </OutfitListContext.Provider>
  );
};

export { OutfitsList };
