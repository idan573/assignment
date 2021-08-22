import * as React from 'react';
import { ListChildComponentProps } from 'react-window';

import {
  VirtualizedListContext,
  VirtualizedListContextType
} from './VirtualizedList';

interface Props extends ListChildComponentProps {
  children: JSX.Element;
}

const VirtualizedListRow: React.FC<Props> = React.memo(
  ({ index, style, children }: Props) => {
    const { setRowHeight } = React.useContext<VirtualizedListContextType>(
      VirtualizedListContext
    );
    const rowRootRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
      if (rowRootRef.current) {
        const { height } =
          rowRootRef.current?.firstElementChild?.getBoundingClientRect() ?? {};

        setRowHeight?.(index, height);
      }
    }, [index, setRowHeight]);

    return (
      <div style={style} ref={rowRootRef}>
        {children}
      </div>
    );
  }
);

export { VirtualizedListRow };
