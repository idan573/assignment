import * as React from 'react';
import { VariableSizeList, ListProps } from 'react-window';

/* Components */
import { VirtualizedListRow } from './VirtualizedListRow';

export type VirtualizedListContextType = Partial<{
  setRowHeight: (index: number, size: number) => void;
}>;

export const VirtualizedListContext = React.createContext<
  VirtualizedListContextType
>({});

interface Props extends ListProps {
  gap?: number | number[];
  className?: string;
  children: (args: any) => JSX.Element;
}

// 0 1 0--13 0--13 0--8 0--7
const VirtualizedList: React.FC<Props> = React.memo(
  ({
    width = '100%',
    height = 0,
    gap = 0,
    itemCount = 0,
    overscanCount = 5,
    className,
    children
  }: Props) => {
    const listRef = React.useRef<VariableSizeList | null>(null);
    const rowSizeMap = React.useRef<{ [key: string]: number }>({});

    const [listContentHeight, setListContentHeight] = React.useState<number>(0);

    React.useEffect(() => {
      const contentHeight = Object.values(rowSizeMap.current).reduce(
        (a, b, i) => a + b + getRowGap(i),
        0
      );

      setListContentHeight(
        Number(contentHeight < height ? contentHeight : height)
      );
    }, [height]);

    const setRowHeight = React.useCallback((index: number, size: number) => {
      /* Performance: Only update the rowSizeMap and reset cache if an actual value changed */
      if (rowSizeMap.current[index] !== size) {
        rowSizeMap.current = {
          ...rowSizeMap.current,
          [index]: size
        };

        if (listRef.current) {
          /* Clear cached data and rerender */
          listRef.current.resetAfterIndex(0);
        }
      }
    }, []);

    const getRowSize = React.useCallback(
      index => rowSizeMap.current[index] || 100,
      []
    );

    /*
      Calculate row gap for each item (gap is a number or an array)
    */
    const getRowGap = React.useCallback(
      (index: number): number => {
        const isNum = (num: any): boolean => !isNaN(Number(num));

        const numOrDefault = (num: any, defaultNum: number = 0): number =>
          isNum(num) ? Number(num) : defaultNum;

        const getSum = (arr: any[]): number =>
          arr.reduce((a, b) => numOrDefault(a) + numOrDefault(b), 0);

        const getGapValue = (gap: number[]): number =>
          getSum(gap?.slice?.(0, index) ?? []);

        return isNum(gap) ? Number(gap) * index : getGapValue(gap as number[]);
      },
      [gap]
    );

    /*
      Increases accuracy by calculating an average row height
      Fixes the scrollbar behaviour described here: https://github.com/bvaughn/react-window/issues/408
    */
    const calcEstimatedRowSize = React.useCallback(() => {
      const keys = Object.keys(rowSizeMap.current);
      const estimatedHeight = keys.reduce(
        (p, i) => p + rowSizeMap.current[i],
        0
      );
      return estimatedHeight / keys.length;
    }, []);

    return (
      <VirtualizedListContext.Provider value={{ setRowHeight }}>
        <VariableSizeList
          ref={listRef}
          className={className}
          width={width}
          height={listContentHeight}
          itemCount={itemCount}
          itemSize={getRowSize}
          overscanCount={overscanCount}
          estimatedItemSize={calcEstimatedRowSize()}
        >
          {props => (
            <VirtualizedListRow
              {...props}
              style={{
                ...props.style,
                top: (props.style.top as number) + getRowGap(props.index)
              }}
            >
              {children(props)}
            </VirtualizedListRow>
          )}
        </VariableSizeList>
      </VirtualizedListContext.Provider>
    );
  }
);

export { VirtualizedList };
