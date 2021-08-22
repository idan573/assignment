import * as React from 'react';

/* Types */
import { ControlsProps, RATE_OPTIONS } from 'Layouts/TinderExperience/types';

/* Styles */
import {
  StyledControlsBlock,
  StyledLikeButton,
  StyledDislikeButton
} from './styles';

interface Props extends ControlsProps {
  disabled: boolean;
}

const Controls: React.FC<Props> = ({ disabled, onClick }: Props) => {
  const onControlClick = React.useCallback(
    (rate: RATE_OPTIONS) => onClick(rate),
    [onClick]
  );

  return (
    <StyledControlsBlock>
      <StyledDislikeButton
        disabled={disabled}
        onClick={() => onControlClick(RATE_OPTIONS.DISLIKE)}
      />

      <StyledLikeButton
        disabled={disabled}
        onClick={() => onControlClick(RATE_OPTIONS.LIKE)}
      />
    </StyledControlsBlock>
  );
};

export { Controls };
