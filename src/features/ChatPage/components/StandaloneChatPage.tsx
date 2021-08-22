import * as React from 'react';
import { RouteComponentProps } from 'react-router';

/* Components */
import { RootContext, RootContextType } from 'App/components';
import { ChatComponent } from './ChatComponent/ChatComponent';

export type Props = RouteComponentProps;

/* TODO: use ChatPageForm instead  */
const StandaloneChatPage: React.FC<Props> = React.memo(
  ({ match: { params }, history, location }: Props) => {
    const { forms } = React.useMemo(() => {
      const searchParams = new URLSearchParams(location.search);
      return {
        forms: searchParams.get('forms')
          ? [searchParams.get('forms').split(',')]
          : null
      };
    }, []);

    const {
      state: { userData }
    } = React.useContext<RootContextType>(RootContext);

    return (
      <>
        {userData?.userId ? (
          <ChatComponent
            startFormVariables={{
              userId: userData.userId,
              forms,
              taskName: forms.join(',')
            }}
            onFormStart={() => console.log('ChatStarted')}
            onFormEnd={() => console.log('ChatDone')}
          />
        ) : (
          'waiting'
        )}
      </>
    );
  }
);

export default StandaloneChatPage;
