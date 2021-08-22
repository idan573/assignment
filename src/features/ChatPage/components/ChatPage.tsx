import * as React from 'react';
import { useHistory, useLocation } from 'react-router';
import TopBarProgress from 'react-topbar-progress-indicator';
import { Modal } from '@bit/scalez.savvy-ui.modal';
import { Button, ButtonProps } from '@bit/scalez.savvy-ui.button';
import { FloatWrapper } from '@bit/scalez.savvy-ui.float-wrapper';
import { useLazyRequest, useRequest } from '@bit/scalez.savvy-ui.hooks';
import { HEADER_ITEM_TYPES } from '@bit/scalez.savvy-ui.header';

/* Api */
import { GQLDiscardFormVars, discardFormMutation } from 'App/api/discardForm';

/* Types */
import { APP_HEADER_ITEM_TYPES } from 'App/components/AppHeader/AppHeader';
import { FORM_ACTIONS, GQLServeFormData } from 'App/api/serveForm';
import { GQLStartFormVars, GQLStartFormData } from 'App/api/startForm';

/* Components */
import { RootContext, RootContextType } from 'App/components';
import { ChatComponent } from './ChatComponent/ChatComponent';

export interface Props {
  startFormVariables: GQLStartFormVars;
  loading?: boolean;
  showNextButton?: boolean;
  onNext?: (formActions: FORM_ACTIONS[]) => void;
  onFormStart?: () => void;
  onFormEnd?: () => void;
  onFormSkip?: () => void;
}

const ChatPage: React.FC<Props> = React.memo(
  ({
    startFormVariables,
    loading,
    showNextButton,
    onNext,
    onFormStart,
    onFormEnd,
    onFormSkip
  }: Props) => {
    const history = useHistory();

    const {
      state: { activeStepData },
      actions: { setActiveStepData }
    } = React.useContext<RootContextType>(RootContext);

    const [isModalActive, toggleModal] = React.useState<boolean>(false);
    const [formData, setFormData] = React.useState<GQLStartFormData>(null);
    const [formActions, setFormActions] = React.useState<FORM_ACTIONS[]>([]);

    const [discardForm, { loading: discardFormLoading }] = useLazyRequest<
      GQLDiscardFormVars,
      void
    >(discardFormMutation);

    const disableBackButton = React.useCallback(() => {
      setActiveStepData(prevState => ({
        ...prevState,
        headerConfig: [
          {
            type: HEADER_ITEM_TYPES.BUTTON,
            props: {
              ['data-action']: 'back',
              disabled: true
            }
          },
          {
            type: APP_HEADER_ITEM_TYPES.CHAT
          }
        ]
      }));
    }, []);

    React.useEffect(() => {
      if (!activeStepData.headerConfig) {
        setActiveStepData(prevState => ({
          ...prevState,
          headerConfig: [
            {
              type: HEADER_ITEM_TYPES.BUTTON,
              props: {
                ['data-action']: 'back',
                onClick: () => toggleModal(true)
              }
            },
            {
              type: APP_HEADER_ITEM_TYPES.CHAT
            }
          ]
        }));
      }
    }, [activeStepData]);

    const modalButtons: ButtonProps[] = React.useMemo(
      () => [
        {
          children: 'Discard My Answers',
          ['data-type']: 'secondary' as const,
          onClick: () => {
            discardForm({ formId: formData?.formId });

            history.push({
              pathname: '/homepage'
            });
          }
        },
        {
          children: 'Back to Chat',
          onClick: () => toggleModal(false)
        }
      ],
      [formData]
    );

    return (
      <>
        {discardFormLoading && <TopBarProgress />}

        <Modal
          render={isModalActive}
          name="go-back-options-modal"
          title="What’s your next step?"
          actions={modalButtons}
          onClickOutside={() => toggleModal(false)}
        />

        <ChatComponent
          startFormVariables={startFormVariables}
          loading={loading}
          onFormStart={(startFormData: GQLStartFormData) => {
            setFormData(startFormData);
            onFormStart?.();
          }}
          onFormEnd={(lastServeFormData: GQLServeFormData) => {
            disableBackButton();
            setFormActions(lastServeFormData?.actions ?? []);
            onFormEnd?.();
          }}
        />

        <FloatWrapper
          position="bottom"
          transition="slide-bottom"
          render={showNextButton}
        >
          <Button
            onClick={() => {
              onNext(formActions);
            }}
          >
            Continue
          </Button>
        </FloatWrapper>
      </>
    );
  }
);

export { ChatPage };
