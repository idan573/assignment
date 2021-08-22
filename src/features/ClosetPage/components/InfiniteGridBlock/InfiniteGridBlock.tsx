import * as React from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { VariableSizeGrid } from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';
import { Button } from '@bit/scalez.savvy-ui.button';
import { ProductTypeButton } from '@bit/scalez.savvy-ui.product-type-button';
import { ProductCard } from '@bit/scalez.savvy-ui.product-card';

/* Types */
import { Product } from 'App/types';

/* Styles */
import {
  StyledInfiniteGridBlock,
  StyledNoProductsIllustration,
  StyledSpinnerBlock
} from './styles';

interface Props {
  columnCount: number;
  list: (Product[] | string[])[];
  productTypes: string[];
  activeProductType: string;
  onProductTypeClick: (type: string) => void;
  onProductRemove: (product: Product) => void;
  onProductClick: (product: Product) => void;
  onLoadMoreClick: () => void;
}

const gridConfig = {
  maxWidth: +getComputedStyle(document.documentElement)
    .getPropertyValue('--maxWidth')
    .replace('px', ''),
  rowHeight: 220,
  productTypesRowHeight: 80,
  buttonRowHeight: 48,
  /* Header + Navbar heights */
  screenContentHeight:
    +getComputedStyle(document.documentElement)
      .getPropertyValue('--headerHeight')
      .replace('px', '') * 2,
  paddingLeftRight: 0,
  rowGap: 0,
  columnGap: 0
};

let cellStatusMap = {};

const isCellLoaded = index => cellStatusMap[index] === REQUEST_STATUSES.GOT;
const loadMoreCells = (startIndex, stopIndex) => {
  for (let index = startIndex; index <= stopIndex; index++) {
    cellStatusMap[index] = REQUEST_STATUSES.REQUEST;
  }

  return new Promise(resolve =>
    setTimeout(() => {
      for (let index = startIndex; index <= stopIndex; index++) {
        cellStatusMap[index] = REQUEST_STATUSES.GOT;
      }
      resolve();
    }, /* Simulate server response delay */ 300 + Math.round(Math.random() * 500))
  );
};

const GridCell: React.FC = ({ rowIndex, columnIndex, style, data }: any) => {
  const {
    columnCount,
    list,
    productTypes,
    activeProductType,
    gridDimensions,
    onProductTypeClick,
    onProductClick,
    onProductRemove,
    onLoadMoreClick
  } = data;

  const cellData = list?.[rowIndex]?.[columnIndex] ?? undefined;

  /* Render full width cell for product types list */
  if (cellData === 'product-types-cell') {
    return (
      <div
        className="product-types-wrapper"
        style={{
          ...style,
          width: gridDimensions.width
        }}
      >
        {['All', ...productTypes].map((type: string, key) => (
          <ProductTypeButton
            key={key}
            name={type}
            size="small"
            isActive={type === activeProductType}
            onClick={() => onProductTypeClick(type)}
          />
        ))}
      </div>
    );
  }

  /* Skip second cell beacuse first cell takes up the entire width */
  if (cellData === 'empty-cell') {
    return null;
  }

  if (cellData === 'empty-closet-cell') {
    return (
      <div
        className="empty-closet-wrapper"
        style={{
          ...style,
          width: gridDimensions.width,
          top: '50%',
          transform: 'translateY(-50%)'
        }}
      >
        <StyledNoProductsIllustration />
        <h2>Your closet is empty</h2>
        <p className="body">
          Add to your closet by ❤️ing items in the Outfeed.
          <br />
          <br />
          Your fashion creator will also see your closet and get to know you
          better!
        </p>
      </div>
    );
  }

  if (cellData === 'load-more-button-cell') {
    return (
      <Button
        style={{
          ...style,
          width: gridDimensions.width - 2 * gridConfig.paddingLeftRight,
          height: gridConfig.buttonRowHeight,
          left: style.left + gridConfig.paddingLeftRight
        }}
        data-type="secondary"
        onClick={() => onLoadMoreClick()}
      >
        Load More...
      </Button>
    );
  }

  if (!!cellData) {
    const cellIndex = rowIndex * columnCount + columnIndex;

    return cellStatusMap[cellIndex] === REQUEST_STATUSES.GOT ? (
      <ProductCard
        /* adding gutter between items */
        style={{
          ...style,
          width:
            style.width - gridConfig.paddingLeftRight - gridConfig.columnGap,
          height: style.height - gridConfig.rowGap,
          top: style.top + gridConfig.columnGap,
          left:
            columnIndex === 0
              ? style.left + gridConfig.paddingLeftRight
              : style.left + gridConfig.columnGap
        }}
        data={{
          price: cellData.price,
          priceSale: cellData.priceSale,
          name: cellData.productName,
          images: cellData.images
        }}
        onRemoveClick={() => {
          onProductRemove(cellData);
        }}
        onProductClick={() => onProductClick(cellData)}
      />
    ) : (
      <StyledSpinnerBlock style={style} />
    );
  }

  return null;
};

const InfiniteGridBlock: React.FC<Props> = ({
  columnCount,
  list,
  productTypes,
  activeProductType,
  onProductTypeClick,
  onProductClick,
  onProductRemove,
  onLoadMoreClick
}: Props) => {
  const infiniteLoaderRef = React.useRef(null);

  const [gridDimensions, setDimensions] = React.useState({
    width:
      window.innerWidth > gridConfig.maxWidth
        ? gridConfig.maxWidth
        : window.innerWidth,
    columnWidth:
      (window.innerWidth > gridConfig.maxWidth
        ? gridConfig.maxWidth
        : window.innerWidth) / columnCount,
    height: window.innerHeight - gridConfig.screenContentHeight
  });

  const { callback: debouncedCallback } = useDebouncedCallback(
    (vw: number, vh: number) => {
      const width = vw > gridConfig.maxWidth ? gridConfig.maxWidth : vw;
      setDimensions({
        width,
        columnWidth: width / columnCount,
        height: vh - gridConfig.screenContentHeight
      });
    },
    500
  );

  React.useEffect(() => {
    const resizeHandler = _ => {
      debouncedCallback(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', resizeHandler);

    return () => {
      window.removeEventListener('resize', resizeHandler);
    };
  }, []);

  React.useEffect(() => {
    infiniteLoaderRef.current._listRef.resetAfterRowIndex(0, true);
  }, [list]);

  const setRowHeight = React.useCallback(
    (rowIndex: number) => {
      const row = list[rowIndex];

      if (`${row[0]}` === 'product-types-cell') {
        return gridConfig.productTypesRowHeight;
      }

      if (`${row[0]}` === 'load-more-button-cell') {
        return gridConfig.buttonRowHeight;
      }

      return gridConfig.rowHeight;
    },
    [list]
  );

  const cellProps = React.useMemo(
    () => ({
      columnCount,
      list,
      productTypes,
      activeProductType,
      gridDimensions,
      onProductTypeClick,
      onProductClick,
      onProductRemove,
      onLoadMoreClick
    }),
    [
      list,
      productTypes,
      activeProductType,
      gridDimensions,
      onProductClick,
      onProductRemove
    ]
  );

  return (
    <StyledInfiniteGridBlock>
      <InfiniteLoader
        ref={infiniteLoaderRef}
        isItemLoaded={isCellLoaded}
        itemCount={list.flat(2).length - 1}
        loadMoreItems={loadMoreCells}
        threshold={200}
      >
        {({ onItemsRendered, ref }) => (
          <VariableSizeGrid
            itemKey={({ data, rowIndex, columnIndex }) => {
              const cellIndex = rowIndex * columnCount + columnIndex;
              const cellData: any = data?.list?.[rowIndex]?.[columnIndex];

              const key = `${rowIndex}:${columnIndex}:${cellData?.productId ??
                cellIndex}`;

              return key;
            }}
            className="grid"
            ref={ref}
            itemData={cellProps}
            width={gridDimensions.width}
            height={gridDimensions.height}
            columnCount={columnCount}
            columnWidth={_ => gridDimensions.columnWidth}
            rowCount={list.length - 1}
            rowHeight={setRowHeight}
            onItemsRendered={gridProps => {
              onItemsRendered({
                overscanStartIndex:
                  gridProps.overscanRowStartIndex * columnCount,
                overscanStopIndex: gridProps.overscanRowStopIndex * columnCount,
                visibleStartIndex: gridProps.visibleRowStartIndex * columnCount,
                visibleStopIndex: gridProps.visibleRowStopIndex * columnCount
              });
            }}
          >
            {GridCell}
          </VariableSizeGrid>
        )}
      </InfiniteLoader>
    </StyledInfiniteGridBlock>
  );
};

export { InfiniteGridBlock };
