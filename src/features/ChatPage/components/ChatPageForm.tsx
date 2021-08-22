import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import TopBarProgress from 'react-topbar-progress-indicator';
import { Modal } from '@bit/scalez.savvy-ui.modal';
import { Button, ButtonProps } from '@bit/scalez.savvy-ui.button';
import { FloatWrapper } from '@bit/scalez.savvy-ui.float-wrapper';
import { useLazyRequest, useRequest } from '@bit/scalez.savvy-ui.hooks';

/* Core */
import { isMobileApp } from 'core/utils';

/* Analytics */
import { EVENTS } from 'services/analyticsService';

/* Api */
import { GQLStartStepVars, startStepMutation } from 'App/api/journey/startStep';
import {
  GQLFinishStepVars,
  finishStepMutation
} from 'App/api/journey/finishStep';

/* Types */
import { UserProgress } from 'App/types';
import { FORM_ACTIONS } from 'App/api/serveForm';

/* Components */
import { RootContext, RootContextType } from 'App/components';
import { ChatPage } from './ChatPage';

export type Props = RouteComponentProps<{
  forms: string;
}>;

const ChatPageForm: React.FC<Props> = React.memo(
  ({ match: { params }, history, location }: Props) => {
    const { formsFromParams, stepName, isJourneyChat } = React.useMemo(() => {
      const searchParams = new URLSearchParams(location.search);
      return {
        formsFromParams: [params.forms.split(',')],
        stepName: searchParams.get('stepName'),
        isJourneyChat: !!searchParams.get('stepName')
      };
    }, []);

    const {
      state: { userData },
      actions: { trackPage, trackEvent }
    } = React.useContext<RootContextType>(RootContext);

    const [isNextButtonActive, toggleNextButton] = React.useState<boolean>(
      false
    );

    /* Api */
    const [startStep, { loading: startStepLoading }] = useLazyRequest<
      GQLStartStepVars,
      void
    >(startStepMutation);

    const [finishStep, { loading: finishStepLoading }] = useLazyRequest<
      GQLFinishStepVars,
      UserProgress
    >(finishStepMutation, {
      onCompleted: () => {
        toggleNextButton(true);
      }
    });

    /* Effects */
    React.useEffect(() => {
      trackPage({
        name: 'ChatPageForm'
      });
    }, []);

    const handleStartStep = React.useCallback(() => {
      const variables: GQLStartStepVars = {
        userId: userData.userId,
        stepName
      };

      startStep(variables);

      trackEvent({
        event: EVENTS.JOURNEY_START_STEP,
        properties: variables
      });

      trackEvent({
        event: `${EVENTS.JOURNEY_START_STEP}_${stepName}`,
        properties: variables
      });
    }, []);

    const handleFinishStep = React.useCallback(() => {
      const variables: GQLFinishStepVars = {
        userId: userData.userId,
        stepName
      };

      finishStep(variables);

      /* TODO: add "finish step" events */
    }, []);

    const handleOnNext = React.useCallback((formActions: FORM_ACTIONS[]) => {
      switch (formActions?.[0]) {
        case FORM_ACTIONS.DOWNLOAD:
          history.push({
            pathname: isMobileApp() ? '/homepage' : '/download',
            search: location.search
          });
          break;
        case FORM_ACTIONS.SUGGEST:
          history.push({
            pathname: '/task-await',
            search: location.search
          });
          break;
        /* Standalone chat page */
        default:
          history.push({
            pathname: '/homepage'
          });
      }
    }, []);

    return (
      <ChatPage
        startFormVariables={{
          userId: userData.userId,
          forms: formsFromParams,
          stepName
        }}
        loading={startStepLoading || finishStepLoading}
        showNextButton={isNextButtonActive}
        onFormStart={isJourneyChat ? handleStartStep : undefined}
        onFormEnd={isJourneyChat ? handleFinishStep : undefined}
        onFormSkip={() => {
          history.push({
            pathname: '/homepage'
          });
        }}
        onNext={handleOnNext}
      />
    );
  }
);

export default ChatPageForm;
