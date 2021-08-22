export enum RATE_OPTIONS {
  LIKE = 'LIKE',
  DISLIKE = 'DISLIKE',
  INIT = 'INIT'
}

export interface RatedItemData {
  index: number;
  rate: RATE_OPTIONS;
}

export interface CardProps<T> {
  data: T;
  rate: RATE_OPTIONS;
  isDragging: boolean;
}

export interface ControlsProps {
  onClick: (rate: RATE_OPTIONS) => void;
}
