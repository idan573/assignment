import * as React from 'react';
import { Button } from '@bit/scalez.savvy-ui.button';
import {
  HEADER_ITEM_TYPES,
  HEADER_ITEM_POSITION_TYPES
} from '@bit/scalez.savvy-ui.header';

/* Types */
import { FlowRouteProps } from 'FlowBuilder/types';

/* Context */
import { FlowContext, FlowContextType } from 'FlowBuilder/FlowProvider';

/* Styles */
import { StyledWelcomeStep } from './styles';

const WelcomeStep: React.FC<FlowRouteProps> = React.memo(
  ({ onNext }: FlowRouteProps) => {
    const {
      actions: { setActiveStepData }
    } = React.useContext<FlowContextType>(FlowContext);

    const onStylistLoginClick = React.useCallback(() => {
      window.open('https://app.savvy.style/', '_self');
    }, []);

    React.useEffect(() => {
      setActiveStepData(prevState => ({
        ...prevState,
        headerConfig: [
          {
            type: HEADER_ITEM_TYPES.LOGO,
            props: {
              dataSelfPosition: HEADER_ITEM_POSITION_TYPES.LEFT
            }
          },
          {
            type: HEADER_ITEM_TYPES.BUTTON,
            dataSelfPosition: HEADER_ITEM_POSITION_TYPES.RIGHT,
            props: {
              ['data-type']: 'secondary',
              ['data-size']: 'extra-small',
              onClick: onStylistLoginClick,
              children: 'Stylist Login'
            }
          }
        ]
      }));
    }, []);

    return <StyledWelcomeStep onClick={() => onNext()} />;
  }
);

export default WelcomeStep;
