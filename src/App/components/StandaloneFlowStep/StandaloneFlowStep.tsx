import * as React from 'react';
import { useTransition } from 'react-spring';

/* Core */
import { isFacebookApp } from 'core/utils';

/* Services */
import { authService } from 'services/authService';

/* Types */
import { RootContext, RootContextType } from 'App/components/RootProvider';
import { StandaloneFlowRouteType } from 'App/components/routerConfig';

/* Styles */
import { StyledSlidePageWrapper } from './styles';

type StandaloneFlowStepProps = Omit<
  StandaloneFlowRouteType,
  'pathname' | 'component'
> & {
  children: JSX.Element;
};

const StandaloneFlowStep: React.FC<StandaloneFlowStepProps> = React.memo(
  ({
    children,
    renderNavbar,
    renderIntercom,
    headerConfig,
    stateName,
    defaultBack,
    restricted
  }: StandaloneFlowStepProps) => {
    const {
      state: { userData },
      actions: { setActiveStepData, setPartialUserData }
    } = React.useContext<RootContextType>(RootContext);

    const [isStepReady, toggleIsStepReady] = React.useState<boolean>(false);

    React.useEffect(() => {
      window?.Intercom?.('update', {
        hide_default_launcher: !renderIntercom
      });

      const isFB = isFacebookApp();

      if (!isFB) {
        handleLogin();
      } else {
        toggleIsStepReady(true);
      }

      const activeStepData = {
        stateName,
        headerConfig,
        renderNavbar,
        defaultBack
      };

      setActiveStepData(prevState => ({
        ...prevState,
        ...activeStepData
      }));
    }, []);

    const handleLogin = React.useCallback(async () => {
      if (restricted) {
        const isAuthenticated = await authService.isAuthenticated();

        if (!isAuthenticated) {
          await authService.login();
        }
      }

      toggleIsStepReady(true);
    }, []);

    const stepTransitions = useTransition(isStepReady, null, {
      from: { transform: 'translate3d(100%,0,0)' },
      enter: { transform: 'translate3d(0%,0,0)' },
      leave: { transform: 'translate3d(-50%,0,0)' }
    });

    return (
      <>
        {stepTransitions.map(
          ({ item, key, props: styleProps }) =>
            item && (
              <StyledSlidePageWrapper
                key={key}
                style={styleProps}
                className="step-transition-wrapper"
              >
                {children}
              </StyledSlidePageWrapper>
            )
        )}
      </>
    );
  }
);

export { StandaloneFlowStep };
