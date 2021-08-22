import * as React from 'react';
import ReactSwipeableViews from 'react-swipeable-views';

import {
  StyledSwipeableViews,
  StyledDotsBlock,
  StyledSwipeableDot
} from './styles';

export interface Props {
  onChangeIndex?: () => void;
  children: React.ReactElement[];
}

const SwipableViews: React.FC<Props> = ({ onChangeIndex, children }: Props) => {
  const [viewIndex, setViewIndex] = React.useState<number>(0);

  const handleChangeIndex = (index: number) => {
    setViewIndex(index);
    !!onChangeIndex && onChangeIndex();
  };

  return (
    <StyledSwipeableViews>
      <ReactSwipeableViews
        index={viewIndex}
        enableMouseEvents={true}
        onChangeIndex={handleChangeIndex}
      >
        {children}
      </ReactSwipeableViews>

      {children.length > 1 && (
        <StyledDotsBlock>
          {children.map((_, index: number) => (
            <StyledSwipeableDot
              key={index}
              data-is-active={viewIndex === index}
              onClick={() => setViewIndex(index)}
            />
          ))}
        </StyledDotsBlock>
      )}
    </StyledSwipeableViews>
  );
};

export { SwipableViews };
