import styled from 'styled-components';

import { WelcomeComponent } from 'features/WelcomePage/components/WelcomeComponent';

export const StyledWelcomeStep = styled(WelcomeComponent)`
  height: var(--activeScreenHeight);

  img.savvy-logo {
    display: none;
  }
`;
