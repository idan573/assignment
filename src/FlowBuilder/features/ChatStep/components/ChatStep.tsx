import * as React from 'react';
import { FloatWrapper } from '@bit/scalez.savvy-ui.float-wrapper';
import { Button } from '@bit/scalez.savvy-ui.button';

/* Types */
import { FlowRouteProps } from 'FlowBuilder/types';

/* Components */
import { ChatComponent } from 'features/ChatPage/components/ChatComponent/ChatComponent';

interface Props extends FlowRouteProps {
  forms: string[][];
  isAnonymous?: boolean;
  taskName?: string;
}

const ChatStep: React.FC<Props> = React.memo(
  ({ userData, forms, isAnonymous, taskName, onNext }: Props) => {
    const [isNextButtonActive, toggleNextButton] = React.useState<boolean>(
      false
    );

    return (
      <>
        <ChatComponent
          startFormVariables={{
            userId: userData?.userId || (Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 15)),
            taskName: taskName ?? (Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 15)),
            forms,
            isAnonymous
          }}
          onFormStart={data => console.log('Form Started:', data)}
          onFormEnd={() => toggleNextButton(true)}
        />

        <FloatWrapper
          position="bottom"
          transition="slide-bottom"
          render={isNextButtonActive}
        >
          <Button onClick={() => onNext()}>Continue</Button>
        </FloatWrapper>
      </>
    );
  }
);

export default ChatStep;
