import * as React from 'react';
import { Button } from '@bit/scalez.savvy-ui.button';
import { FloatWrapper } from '@bit/scalez.savvy-ui.float-wrapper';

/* Styles */
import { StyledWelcomePage, StyledSavvyLogo } from './styles';

interface Props {
  onClick: () => void;
  className?: string;
}

const WelcomeComponent: React.FC<Props> = React.memo(
  ({ onClick, className }) => {
    return (
      <>
        <StyledWelcomePage className={className}>
          <StyledSavvyLogo />
          <h1>Welcome to Savvy!</h1>
        </StyledWelcomePage>

        <FloatWrapper position="bottom" transition="slide-bottom">
          <Button
            data-type="primary"
            data-action="next"
            data-action-position="right"
            onClick={onClick}
          >
            Continue
          </Button>
        </FloatWrapper>
      </>
    );
  }
);

export { WelcomeComponent };
